import { container, type ApplicationCommandRegistryRegisterOptions, type Command, type Piece } from '@sapphire/framework';
import type { Container } from '@sapphire/pieces';
import type { Ctor } from '@sapphire/utilities';
import {
	ApplicationCommandType,
	type ContextMenuCommandBuilder,
	type SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
	type SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import { createClassDecorator, createProxy } from './utils';

const applicationDecoratorsMap = new WeakMap<CommandTarget<any>, DecoratorMap<any>[]>();
const proxyApplicationCommandToOriginal = new WeakMap<CommandTarget<any>, CommandTarget<any>>();
const originalApplicationCommandToProxy = new WeakMap<CommandTarget<any>, CommandTarget<any>>();

/**
 * Decorator function that applies given options to any Sapphire piece
 * @param optionsOrFn The options or function that returns options to pass to the piece constructor
 * @example
 * ```typescript
 * import { ApplyOptions } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import type { Message } from 'discord.js';
 *
 * @ApplyOptions<Command.Options>({
 *   description: 'ping pong',
 *   enabled: true
 * })
 * export class UserCommand extends Command {
 *   public override async messageRun(message: Message) {
 *     const msg = await message.channel.send('Ping?');
 *
 *     return msg.edit(
 *       `Pong! Client Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`
 *     );
 *   }
 * }
 * ```
 * @example
 * ```typescript
 * import { ApplyOptions } from '@sapphire/decorators';
 * import { Listener } from '@sapphire/framework';
 * import { GatewayDispatchEvents, GatewayMessageDeleteDispatch } from 'discord.js';
 *
 * @ApplyOptions<Listener.Options>(({ container }) => ({
 *   description: 'Handle Raw Message Delete events',
 *   emitter: container.client.ws,
 *   event: GatewayDispatchEvents.MessageDelete
 * }))
 * export class UserListener extends Listener {
 *   public override run(data: GatewayMessageDeleteDispatch['d']): void {
 *     if (!data.guild_id) return;
 *
 *     const guild = this.container.client.guilds.cache.get(data.guild_id);
 *     if (!guild || !guild.channels.cache.has(data.channel_id)) return;
 *
 *     // Do something with the data
 *   }
 * }
 * ```
 */
export function ApplyOptions<T extends Piece.Options>(optionsOrFn: T | ((parameters: ApplyOptionsCallbackParameters) => T)): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Piece>, Piece>) =>
		createProxy(target, {
			construct: (ctor, [context, baseOptions = {}]: [Piece.LoaderContext, Piece.Options]) =>
				new ctor(context, {
					...baseOptions,
					...(typeof optionsOrFn === 'function' ? optionsOrFn({ container, context }) : optionsOrFn)
				})
		})
	);
}

/**
 * Decorator for registering chat input command.
 * @param optionsFn The function that returns options to pass to the registry.
 * @example
 * ```typescript
 * import { RegisterChatInputCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 *
 * (at)RegisterChatInputCommand((builder, command) => builder
 *   .setName(command.name)
 *   .setDescription(command.description)
 * )
 * export class UserCommand extends Command {
 * 	 public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
 * 	   	return interaction.reply({ content: 'HI!' });
 * 	 }
 * }
 * ```
 * @example
 * ```typescript
 * import { RegisterChatInputCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 *
 * (at)RegisterChatInputCommand((builder, command) => builder
 *		.setName(command.name)
 *		.setDescription(command.description),
 *	{
 *		idHints: ['737141877803057244'],
 *		guildIds: ['737141877803057244']
 *	}
 * )
 * export class UserCommand extends Command {
 * 	 public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
 * 	   	return interaction.reply({ content: 'HI!' });
 * 	 }
 * }
 * ```
 * @example
 * ```typescript
 * import { RegisterChatInputCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 *
 * (at)RegisterChatInputCommand((builder) => builder
 *   .setName('hi')
 *   .setDescription('Sends a hi message')
 * )
 * export class UserCommand extends Command {
 * 	 public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
 * 	   	return interaction.reply({ content: 'HI!' });
 * 	 }
 * }
 * ```
 * @example
 * ```typescript
 * import { ApplyOptions, RegisterChatInputCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import type { Message } from 'discord.js';
 *
 * (at)ApplyOptions<Command.Options>({
 *   description: 'ping pong',
 *   enabled: true
 * })
 * (at)RegisterChatInputCommand((builder, command) => builder
 *   .setName(command.name)
 *   .setDescription(command.description)
 * )
 * export class UserCommand extends Command { *
 * 	 public override chatInputRun(interaction: Command.ChatInputCommandInteraction) {
 * 	   	return interaction.reply({ content: 'HI!' });
 * 	 }
 * }
 * ```
 */
export function RegisterChatInputCommand<CMD extends Command = Command>(
	optionsFn: ChatInputCommandDecoratorsMap<CMD>['optionsFn'],
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): ClassDecorator {
	return createClassDecorator((target: CommandTarget<CMD>) =>
		collectApplicationCommandDecorators(target, { type: 'RegisterChatInputCommand', optionsFn, registryOptions })
	);
}

/**
 * Decorator for registering message context menu command.
 * @param optionsFn The function that returns options to pass to the registry.
 * @example
 * ```typescript
 * import { RegisterMessageContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterMessageContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 * @example
 * ```typescript
 * import { RegisterMessageContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterMessageContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
 *	{
 *		idHints: ['737141877803057244'],
 *		guildIds: ['737141877803057244']
 *	}
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 * @example
 * ```typescript
 * import { RegisterMessageContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterMessageContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 * @example
 * ```typescript
 * import { RegisterMessageContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterMessageContextMenuCommand((builder) => builder
 * 	 .setName('Send HI')
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 * @example
 * ```typescript
 * import { ApplyOptions, RegisterMessageContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)ApplyOptions<Command.Options>({
 *   enabled: true
 * })
 * (at)RegisterMessageContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 */
export function RegisterMessageContextMenuCommand<CMD extends Command = Command>(
	optionsFn: ContextMenuCommandDecoratorsMap<CMD>['optionsFn'],
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): ClassDecorator {
	return createClassDecorator((target: CommandTarget<CMD>) =>
		collectApplicationCommandDecorators(target, { type: 'RegisterMessageContextMenuCommand', optionsFn, registryOptions })
	);
}

/**
 * Decorator for registering user context menu command.
 * @param optionsFn The function that returns options to pass to the registry.
 * @example
 * ```typescript
 * import { RegisterUserContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type UserContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterUserContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: UserContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 * ```
 * @example
 * ```typescript
 * import { RegisterUserContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterUserContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
 *	{
 *		idHints: ['737141877803057244'],
 *		guildIds: ['737141877803057244']
 *	}
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 * @example
 * ```typescript
 * import { RegisterUserContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type UserContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterUserContextMenuCommand((builder, command) => builder
 * 	 .setName('Send HI')
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: UserContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: `HI ${interaction.targetUser}!` })
 * 	}
 * }
 * ```
 * @example
 * ```typescript
 * import { ApplyOptions, RegisterUserContextMenuCommand } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type UserContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)ApplyOptions<Command.Options>({
 *   enabled: true
 * })
 * (at)RegisterUserContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 * 	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 */
export function RegisterUserContextMenuCommand<CMD extends Command = Command>(
	optionsFn: ContextMenuCommandDecoratorsMap<CMD>['optionsFn'],
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): ClassDecorator {
	return createClassDecorator((target: CommandTarget<CMD>) =>
		collectApplicationCommandDecorators(target, { type: 'RegisterUserContextMenuCommand', optionsFn, registryOptions })
	);
}

function collectApplicationCommandDecorators<CMD extends Command>(target: CommandTarget<CMD>, decorator: DecoratorMap<CMD>): CommandTarget<CMD> {
	const original = proxyApplicationCommandToOriginal.get(target) ?? target;

	const exisiting = applicationDecoratorsMap.get(original) ?? [];
	exisiting.push(decorator);
	applicationDecoratorsMap.set(original, exisiting);

	if (originalApplicationCommandToProxy.has(original)) return originalApplicationCommandToProxy.get(original)!;

	const proxied = createProxy(target, {
		construct(originalTarget, argArray) {
			const command: CMD = Reflect.construct(originalTarget, argArray);
			const decorators = applicationDecoratorsMap.get(original) as DecoratorMap<CMD>[];

			const originalRegister = command.registerApplicationCommands?.bind(command);
			command.registerApplicationCommands = function registerApplicationCommands(registry: Command.Registry) {
				for (const deco of decorators) {
					switch (deco.type) {
						case 'RegisterChatInputCommand': {
							registry.registerChatInputCommand((builder) => deco.optionsFn(builder, command), deco.registryOptions);
							break;
						}

						case 'RegisterMessageContextMenuCommand': {
							registry.registerContextMenuCommand(
								(builder) => deco.optionsFn(builder, command).setType(ApplicationCommandType.Message),
								deco.registryOptions
							);
							break;
						}

						case 'RegisterUserContextMenuCommand': {
							registry.registerContextMenuCommand(
								(builder) => deco.optionsFn(builder, command).setType(ApplicationCommandType.User),
								deco.registryOptions
							);
							break;
						}
					}
				}

				if (originalRegister) return originalRegister.call(this, registry);
			};

			return command;
		}
	});

	proxyApplicationCommandToOriginal.set(proxied, original);
	originalApplicationCommandToProxy.set(original, proxied);

	return proxied;
}

export interface ApplyOptionsCallbackParameters {
	container: Container;
	context: Piece.LoaderContext;
}

interface ChatInputCommandDecoratorsMap<CMD extends Command> {
	type: 'RegisterChatInputCommand';
	optionsFn: (
		builder: SlashCommandBuilder,
		command: ThisType<CMD> & CMD
	) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
	registryOptions?: ApplicationCommandRegistryRegisterOptions;
}

interface ContextMenuCommandDecoratorsMap<CMD extends Command> {
	type: 'RegisterMessageContextMenuCommand' | 'RegisterUserContextMenuCommand';
	optionsFn: (
		builder: ContextMenuCommandBuilder, //
		command: ThisType<CMD> & CMD
	) => ContextMenuCommandBuilder;
	registryOptions?: ApplicationCommandRegistryRegisterOptions;
}

type CommandTarget<CMD extends Command> = Ctor<ConstructorParameters<typeof Command>, CMD>;
type DecoratorMap<CMD extends Command> = ChatInputCommandDecoratorsMap<CMD> | ContextMenuCommandDecoratorsMap<CMD>;

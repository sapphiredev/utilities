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

const applicationDecoratorsMap = new WeakMap<Ctor<ConstructorParameters<typeof Command>, Command>, DecoratorMap<any>[]>();

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
	optionsFn: (
		builder: SlashCommandBuilder,
		command: ThisType<CMD> & CMD
	) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder,
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Command>, CMD>) =>
		createProxy(target, {
			construct(target, argArray) {
				return constructApplicationCommandDecorator(target, argArray, 'RegisterChatInputCommand', optionsFn, registryOptions);
			}
		})
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
	optionsFn: (
		builder: ContextMenuCommandBuilder, //
		command: ThisType<CMD> & CMD
	) => ContextMenuCommandBuilder,
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Command>, CMD>) =>
		createProxy(target, {
			construct(target, argArray) {
				return constructApplicationCommandDecorator(target, argArray, 'RegisterMessageContextMenuCommand', optionsFn, registryOptions);
			}
		})
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
	optionsFn: (
		builder: ContextMenuCommandBuilder, //
		command: ThisType<CMD> & CMD
	) => ContextMenuCommandBuilder,
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Command>, CMD>) =>
		createProxy(target, {
			construct(target, argArray) {
				return constructApplicationCommandDecorator(target, argArray, 'RegisterUserContextMenuCommand', optionsFn, registryOptions);
			}
		})
	);
}

function constructApplicationCommandDecorator<CMD extends Command>(
	target: Ctor<ConstructorParameters<typeof Command>, CMD>,
	argArray: any[],
	type: 'RegisterChatInputCommand',
	optionsFn: ChatInputCommandDecoratorsMap<CMD>['optionsFn'],
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): CMD;
function constructApplicationCommandDecorator<CMD extends Command>(
	target: Ctor<ConstructorParameters<typeof Command>, CMD>,
	argArray: any[],
	type: 'RegisterMessageContextMenuCommand' | 'RegisterUserContextMenuCommand',
	optionsFn: ContextMenuCommandDecoratorsMap<CMD>['optionsFn'],
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): CMD;
function constructApplicationCommandDecorator<CMD extends Command>(
	target: Ctor<ConstructorParameters<typeof Command>, CMD>,
	argArray: any[],
	type: DecoratorMap<CMD>['type'],
	optionsFn: DecoratorMap<CMD>['optionsFn'],
	registryOptions?: ApplicationCommandRegistryRegisterOptions
): CMD {
	const applied = applicationDecoratorsMap.get(target) || [];
	if (type === 'RegisterChatInputCommand') {
		applied.push({
			type,
			optionsFn: optionsFn as ChatInputCommandDecoratorsMap<CMD>['optionsFn'],
			registryOptions
		});
	} else {
		applied.push({
			type,
			optionsFn: optionsFn as ContextMenuCommandDecoratorsMap<CMD>['optionsFn'],
			registryOptions
		});
	}

	applicationDecoratorsMap.set(target, applied);

	const command: CMD = Reflect.construct(target, argArray);

	if (applied.length === 1) {
		const originalRegister = command.registerApplicationCommands?.bind(command);
		command.registerApplicationCommands = function registerApplicationCommands(registry: Command.Registry) {
			for (const decorator of applicationDecoratorsMap.get(target)! as DecoratorMap<CMD>[]) {
				switch (decorator.type) {
					case 'RegisterChatInputCommand':
						registry.registerChatInputCommand((builder) => decorator.optionsFn(builder, command), registryOptions);
						break;
					case 'RegisterMessageContextMenuCommand':
						registry.registerContextMenuCommand(
							(builder) => decorator.optionsFn(builder, command).setType(ApplicationCommandType.Message),
							registryOptions
						);
						break;
					case 'RegisterUserContextMenuCommand':
						registry.registerContextMenuCommand(
							(builder) => decorator.optionsFn(builder, command).setType(ApplicationCommandType.User),
							registryOptions
						);
						break;
				}
			}

			if (originalRegister) return originalRegister.call(command, registry);
		};
	}

	return command;
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

type DecoratorMap<CMD extends Command> = ChatInputCommandDecoratorsMap<CMD> | ContextMenuCommandDecoratorsMap<CMD>;

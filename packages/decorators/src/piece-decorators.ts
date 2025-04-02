import { container, type Command as FrameworkCommand, type Piece } from '@sapphire/framework';
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
 * import { ApplyOptions } from '@sapphire/decorators';
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
export function RegisterChatInputCommand<Command extends FrameworkCommand = FrameworkCommand>(
	optionsFn: (
		builder: SlashCommandBuilder,
		command: ThisType<Command> & Command
	) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof FrameworkCommand>, Command>) =>
		createProxy(target, {
			construct(target, argArray) {
				const command: Command = Reflect.construct(target, argArray);

				const originalRegister = command.registerApplicationCommands?.bind(command);
				command.registerApplicationCommands = function registerApplicationCommands(registry: FrameworkCommand.Registry) {
					registry.registerChatInputCommand((builder) => optionsFn(builder, command));

					if (originalRegister) return originalRegister.call(this, registry);
				};

				return command;
			}
		})
	);
}

/**
 * Decorator for registering message context menu command.
 * @param optionsFn The function that returns options to pass to the registry.
 * @example
 * ```typescript
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)RegisterMessageContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 *	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 * @example
 * ```typescript
 * import { ApplyOptions } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type MessageContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)ApplyOptions<Command.Options>({
 *   enabled: true
 * })
 * (at)RegisterMessageContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 *	 .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 */
export function RegisterMessageContextMenuCommand<Command extends FrameworkCommand = FrameworkCommand>(
	optionsFn: (
		builder: ContextMenuCommandBuilder, //
		command: ThisType<Command> & Command
	) => ContextMenuCommandBuilder
): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof FrameworkCommand>, Command>) =>
		createProxy(target, {
			construct(target, argArray) {
				const command: Command = Reflect.construct(target, argArray);

				const originalRegister = command.registerApplicationCommands?.bind(command);
				command.registerApplicationCommands = function registerApplicationCommands(registry: FrameworkCommand.Registry) {
					registry.registerContextMenuCommand((builder) => optionsFn(builder, command).setType(ApplicationCommandType.Message));

					if (originalRegister) return originalRegister.call(this, registry);
				};

				return command;
			}
		})
	);
}

/**
 * Decorator for registering user context menu command.
 * @param optionsFn The function that returns options to pass to the registry.
 * @example
 * ```typescript
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
 * @example
 * ```typescript
 * import { ApplyOptions } from '@sapphire/decorators';
 * import { Command } from '@sapphire/framework';
 * import { ApplicationIntegrationType, InteractionContextType, type UserContextMenuCommandInteraction } from 'discord.js';
 *
 * (at)ApplyOptions<Command.Options>({
 *   enabled: true
 * })
 * (at)RegisterUserContextMenuCommand((builder, command) => builder
 * 	 .setName(command.name)
 * 	 .setContexts(InteractionContextType.Guild)
 *   .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
 * )
 * export class UserCommand extends Command {
 * 	public override contextMenuRun(interaction: MessageContextMenuCommandInteraction) {
 * 		return interaction.reply({ content: 'HI!' })
 * 	}
 * }
 * ```
 */
export function RegisterUserContextMenuCommand<Command extends FrameworkCommand = FrameworkCommand>(
	optionsFn: (
		builder: ContextMenuCommandBuilder, //
		command: ThisType<Command> & Command
	) => ContextMenuCommandBuilder
): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof FrameworkCommand>, Command>) =>
		createProxy(target, {
			construct(target, argArray) {
				const command: Command = Reflect.construct(target, argArray);

				const originalRegister = command.registerApplicationCommands?.bind(command);
				command.registerApplicationCommands = function registerApplicationCommands(registry: FrameworkCommand.Registry) {
					registry.registerContextMenuCommand((builder) => optionsFn(builder, command).setType(ApplicationCommandType.User));

					if (originalRegister) return originalRegister.call(this, registry);
				};

				return command;
			}
		})
	);
}

export interface ApplyOptionsCallbackParameters {
	container: Container;
	context: Piece.LoaderContext;
}

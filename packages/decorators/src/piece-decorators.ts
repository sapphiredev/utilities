import { container, type Piece } from '@sapphire/framework';
import type { Container } from '@sapphire/pieces';
import type { Ctor } from '@sapphire/utilities';
import { createClassDecorator, createProxy } from './utils';

/**
 * Decorator function that applies given options to any Sapphire piece
 * @param options The options to pass to the piece constructor
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
			construct: (ctor, [context, baseOptions = {}]: [Piece.Context, Piece.Options]) =>
				new ctor(context, {
					...baseOptions,
					...(typeof optionsOrFn === 'function' ? optionsOrFn({ container, context }) : optionsOrFn)
				})
		})
	);
}

export interface ApplyOptionsCallbackParameters {
	container: Container;
	context: Piece.Context;
}

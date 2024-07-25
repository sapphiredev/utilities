/* eslint-disable @typescript-eslint/unified-signatures */

import { container, type Container, type Piece, type StoreRegistryKey } from '@sapphire/framework';
import type { Ctor } from '@sapphire/utilities';
import { createProxy } from './utils';

/**
 * Allow for custom element classes with private constructors
 */
export type AppliedOptionsPiece = Omit<typeof Piece, 'new'>;

export interface ApplyOptionsDecorator {
	// Modern ECMAScript decorators
	(target: AppliedOptionsPiece, context: ClassDecoratorContext<Ctor<ConstructorParameters<typeof Piece>>>): void;

	// Legacy decorators
	(cls: AppliedOptionsPiece): void;
}

/**
 * Decorator function that applies given options to any Sapphire piece
 * @param optionsOrFn The options or function that returns options to pass to the piece constructor
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
 * (at)ApplyOptions<Listener.Options>(({ container }) => ({
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

export function ApplyOptions<T extends Piece.Options>(optionsOrFn: T | ((parameters: ApplyOptionsCallbackParameters) => T)): ApplyOptionsDecorator {
	return (
		classOrTarget: AppliedOptionsPiece | Ctor<ConstructorParameters<typeof Piece>>,
		context?: ClassDecoratorContext<Ctor<ConstructorParameters<typeof Piece>>>
	) => {
		// Modern ECMAScript decorators
		if (context !== undefined) {
			// TODO: This currently doesn't actually apply the settings
			return context.addInitializer(function decorate(this: any) {
				return createProxy(classOrTarget as CustomElementConstructor, {
					construct: (ctor, [context, baseOptions = {} as T]: [Piece.LoaderContext<StoreRegistryKey>, T]) =>
						new ctor(context, {
							...baseOptions,
							...(typeof optionsOrFn === 'function' ? optionsOrFn({ container, context }) : optionsOrFn)
						})
				});
			});
		}

		// Legacy decorators
		return createProxy(classOrTarget as Ctor<ConstructorParameters<typeof Piece>, Piece>, {
			construct: (ctor, [context, baseOptions = {} as T]: [Piece.LoaderContext<StoreRegistryKey>, T]) =>
				new ctor(context, {
					...baseOptions,
					...(typeof optionsOrFn === 'function' ? optionsOrFn({ container, context }) : optionsOrFn)
				})
		});
	};
}

export interface ApplyOptionsCallbackParameters {
	container: Container;
	context: Piece.LoaderContext;
}

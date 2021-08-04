import type { Piece, PieceContext, PieceOptions } from '@sapphire/framework';
import type { Ctor } from '@sapphire/utilities';
import { createClassDecorator, createProxy } from './utils';

/**
 * Decorator function that applies given options to any Sapphire piece
 * @param options The options to pass to the piece constructor
 * @example
 * ```typescript
 * import { ApplyOptions } from '@sapphire/decorators';
 * import { Command, CommandOptions } from '@sapphire/framework';
 * import type { Message } from 'discord.js';
 *
 * (at)ApplyOptions<CommandOptions>({
 * 	description: 'ping pong',
 * 	enabled: true
 * })
 * export class UserCommand extends Command {
 * 	public async run(message: Message) {
 * 		const msg = await message.channel.send('Ping?');
 *
 * 		return msg.edit(
 * 			`Pong! Client Latency ${Math.round(this.context.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`
 * 		);
 * 	}
 * }
 * ```
 */
export function ApplyOptions<T extends PieceOptions>(optionsOrFn: T | ((context: PieceContext) => T)): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Piece>, Piece>) =>
		createProxy(target, {
			construct: (ctor, [context, baseOptions = {}]) =>
				new ctor(context, {
					...baseOptions,
					...(typeof optionsOrFn === 'function' ? optionsOrFn(context) : optionsOrFn)
				})
		})
	);
}

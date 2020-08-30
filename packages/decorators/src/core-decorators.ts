import type { SapphireClient } from '@sapphire/framework';
import type { Piece, PieceOptions } from '@sapphire/pieces';
import type { Ctor } from '@sapphire/utilities';
import { createClassDecorator, createProxy } from './utils';

/**
 * Decorator function that applies given options to any Klasa piece
 *
 * ```ts
 *	ApplyOptions<CommandOptions>({
 *		name: 'test',
 *		cooldown: 10
 *	})
 *	export default class extends Command {}
 * ```
 * @since 1.0.0
 * @param options The options to pass to the piece constructor
 */
export function ApplyOptions<T extends PieceOptions>(optionsOrFn: T | ((client: SapphireClient) => T)): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Piece>, Piece>) =>
		createProxy(target, {
			construct: (ctor, [context, baseOptions = {}]) =>
				new ctor(context, {
					...baseOptions,
					...(typeof optionsOrFn === 'function' ? optionsOrFn(context.client) : optionsOrFn)
				})
		})
	);
}

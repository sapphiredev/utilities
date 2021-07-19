import { isDMChannel, isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { UserError } from '@sapphire/framework';
import { Message, PermissionResolvable, Permissions } from 'discord.js';
import { createFunctionPrecondition, FunctionFallback } from './utils';

export const enum DecoratorIdentifiers {
	RequiresPermissionsGuildOnly = 'requiresPermissionsGuildOnly',
	RequiresPermissionsMissingPermissions = 'requiresPermissionsMissingPermissions'
}

const DMAvailablePermissions = new Permissions(
	~new Permissions([
		//
		'ADD_REACTIONS',
		'ATTACH_FILES',
		'EMBED_LINKS',
		'READ_MESSAGE_HISTORY',
		'SEND_MESSAGES',
		'USE_EXTERNAL_EMOJIS',
		'VIEW_CHANNEL'
	]).bitfield & Permissions.ALL
);

/**
 * Allows you to set permissions required for individual methods. This is particularly useful for subcommands that require specific permissions.
 * @remark This decorator makes the decorated function asynchronous, so any result should be `await`ed.
 * @param permissionsResolvable Permissions that the method should have.
 * @example
 * ```typescript
 * import { ApplyOptions, RequiresPermissions } from '@sapphire/decorators';
 * import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
 * import type { Message } from 'discord.js';
 *
 * (at)ApplyOptions<SubCommandPluginCommandOptions>({
 * 	aliases: ['cws'],
 * 	description: 'A basic command with some subcommands',
 * 	subCommands: ['add', 'remove', 'reset', { input: 'show', default: true }]
 * })
 * export default class extends SubCommandPluginCommand {
 *     // Anyone should be able to view the result, but not modify
 * 	public async show(message: Message) {
 * 		return message.channel.send('Showing!');
 * 	}
 *
 * 	(at)RequiresPermissions('BAN_MEMBERS') // This subcommand should only be available to "staff".
 * 	public async add(message: Message) {
 * 		return message.channel.send('Adding!');
 * 	}
 *
 * 	(at)RequiresPermissions('BAN_MEMBERS') // This subcommand should only be available to "staff".
 * 	public async remove(message: Message) {
 * 		return message.channel.send('Removing!');
 * 	}
 *
 * 	(at)RequiresPermissions('BAN_MEMBERS') // This subcommand should only be available to "staff".
 * 	public async reset(message: Message) {
 * 		return message.channel.send('Resetting!');
 * 	}
 * }
 * ```
 */
export const RequiresPermissions = (...permissionsResolvable: PermissionResolvable[]): MethodDecorator => {
	const resolved = new Permissions(permissionsResolvable);
	const resolvedIncludesServerPermissions = Boolean(resolved.bitfield & DMAvailablePermissions.bitfield);

	return createFunctionPrecondition((message: Message) => {
		if (isDMChannel(message.channel) && resolvedIncludesServerPermissions) {
			throw new UserError({ identifier: DecoratorIdentifiers.RequiresPermissionsGuildOnly });
		}

		if (isGuildBasedChannel(message.channel)) {
			const missingPermissions = message.channel.permissionsFor(message.guild!.me!)!.missing(resolved);

			if (missingPermissions.length) {
				throw new UserError({
					identifier: DecoratorIdentifiers.RequiresPermissionsMissingPermissions,
					context: {
						missing: missingPermissions
					}
				});
			}
		}

		return true;
	});
};

/**
 * Requires the message to be run in a guild context, this decorator requires the first argument to be a `Message` instance
 * @since 1.0.0
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function RequiresGuildContext(fallback: FunctionFallback = (): void => undefined): MethodDecorator {
	return createFunctionPrecondition((message: Message) => message.guild !== null, fallback);
}

/**
 * Requires the message to be run in a dm context, this decorator requires the first argument to be a `Message` instance
 * @since 1.0.0
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function RequiresDMContext(fallback: FunctionFallback = (): void => undefined): MethodDecorator {
	return createFunctionPrecondition((message: Message) => message.guild === null, fallback);
}

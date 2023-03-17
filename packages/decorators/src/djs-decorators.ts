import { isDMChannel, isGuildBasedChannel } from '@sapphire/discord.js-utilities';
import { UserError } from '@sapphire/framework';
import { Message, PermissionFlagsBits, PermissionsBitField, type PermissionResolvable } from 'discord.js';
import { createFunctionPrecondition, type FunctionFallback } from './utils';

export enum DecoratorIdentifiers {
	RequiresClientPermissionsGuildOnly = 'requiresClientPermissionsGuildOnly',
	RequiresClientPermissionsMissingPermissions = 'requiresClientPermissionsMissingPermissions',
	RequiresUserPermissionsGuildOnly = 'requiresUserPermissionsGuildOnly',
	RequiresUserPermissionsMissingPermissions = 'requiresUserPermissionsMissingPermissions'
}

const DMAvailablePermissions = new PermissionsBitField(
	~new PermissionsBitField([
		//
		PermissionFlagsBits.AddReactions,
		PermissionFlagsBits.AttachFiles,
		PermissionFlagsBits.EmbedLinks,
		PermissionFlagsBits.ReadMessageHistory,
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.UseExternalEmojis,
		PermissionFlagsBits.ViewChannel
	]).bitfield & PermissionsBitField.All
);

const DMAvailableUserPermissions = new PermissionsBitField(
	~new PermissionsBitField([
		PermissionFlagsBits.AddReactions,
		PermissionFlagsBits.AttachFiles,
		PermissionFlagsBits.EmbedLinks,
		PermissionFlagsBits.ReadMessageHistory,
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.UseExternalEmojis,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.UseExternalStickers,
		PermissionFlagsBits.MentionEveryone
	]).bitfield & PermissionsBitField.All
);

/**
 * Allows you to set permissions required for individual methods. This is particularly useful for subcommands that require specific permissions.
 * @remark This decorator applies to the client that is to execute the command. For setting permissions required user of the command see {@link RequiresUserPermissions}
 * @remark This decorator makes the decorated function asynchronous, so any result should be `await`ed.
 * @param permissionsResolvable Permissions that the method should have.
 * @example
 * ```typescript
 * import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
 * import { Subcommand } from '@sapphire/plugin-subcommands';
 * import type { Message } from 'discord.js';
 *
 * (at)ApplyOptions<Subcommand.Options>({
 * 	aliases: ['cws'],
 * 	description: 'A basic command with some subcommands',
 * 	subCommands: ['add', 'remove', 'reset', { input: 'show', default: true }]
 * })
 * export default class extends Subcommand {
 *     // Anyone should be able to view the result, but not modify
 * 	public async show(message: Message) {
 * 		return message.channel.send('Showing!');
 * 	}
 *
 * 	(at)RequiresClientPermissions('BAN_MEMBERS') // This subcommand requires the client to be able to ban members.
 * 	public async add(message: Message) {
 * 		return message.channel.send('Adding!');
 * 	}
 *
 * 	(at)RequiresClientPermissions('BAN_MEMBERS') // This subcommand requires the client to be able to ban members.
 * 	public async remove(message: Message) {
 * 		return message.channel.send('Removing!');
 * 	}
 *
 * 	(at)RequiresClientPermissions('BAN_MEMBERS') // This subcommand requires the client to be able to ban members.
 * 	public async reset(message: Message) {
 * 		return message.channel.send('Resetting!');
 * 	}
 * }
 * ```
 */
export const RequiresClientPermissions = (...permissionsResolvable: PermissionResolvable[]): MethodDecorator => {
	const resolved = new PermissionsBitField(permissionsResolvable);
	const resolvedIncludesServerPermissions = Boolean(resolved.bitfield & DMAvailablePermissions.bitfield);

	return createFunctionPrecondition((message: Message) => {
		if (resolvedIncludesServerPermissions && isDMChannel(message.channel)) {
			throw new UserError({
				identifier: DecoratorIdentifiers.RequiresClientPermissionsGuildOnly,
				message: 'Sorry, but that command can only be used in a server because I do not have sufficient permissions in DMs'
			});
		}

		if (isGuildBasedChannel(message.channel)) {
			const missingPermissions = message.channel.permissionsFor(message.guild!.members.me!).missing(resolved);

			if (missingPermissions.length) {
				throw new UserError({
					identifier: DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions,
					message: `Sorry, but I am not allowed to do that. I am missing the permissions: ${missingPermissions}`,
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
 * Allows you to set permissions required for individual methods. This is particularly useful for subcommands that require specific permissions.
 * @remark This decorator applies to the user of the command. For setting permissions required for the client see {@link RequiresClientPermissions}
 * @remark This decorator makes the decorated function asynchronous, so any result should be `await`ed.
 * @param permissionsResolvable Permissions that the method should have.
 * @example
 * ```typescript
 * import { ApplyOptions, RequiresUserPermissions } from '@sapphire/decorators';
 * import { Subcommand } from '@sapphire/plugin-subcommands';
 * import type { Message } from 'discord.js';
 *
 * (at)ApplyOptions<Subcommand.Options>({
 * 	aliases: ['cws'],
 * 	description: 'A basic command with some subcommands',
 * 	subCommands: ['add', 'remove', 'reset', { input: 'show', default: true }]
 * })
 * export default class extends Subcommand {
 *     // Anyone should be able to view the result, but not modify
 * 	public async show(message: Message) {
 * 		return message.channel.send('Showing!');
 * 	}
 *
 * 	(at)RequiresUserPermissions('BAN_MEMBERS') // This subcommand requires the user of the command to be able to ban members.
 * 	public async add(message: Message) {
 * 		return message.channel.send('Adding!');
 * 	}
 *
 * 	(at)RequiresUserPermissions('BAN_MEMBERS') // This subcommand requires the user of the command to be able to ban members.
 * 	public async remove(message: Message) {
 * 		return message.channel.send('Removing!');
 * 	}
 *
 * 	(at)RequiresUserPermissions('BAN_MEMBERS') // This subcommand requires the user of the command to be able to ban members.
 * 	public async reset(message: Message) {
 * 		return message.channel.send('Resetting!');
 * 	}
 * }
 * ```
 */
export const RequiresUserPermissions = (...permissionsResolvable: PermissionResolvable[]): MethodDecorator => {
	const resolved = new PermissionsBitField(permissionsResolvable);
	const resolvedIncludesServerPermissions = Boolean(resolved.bitfield & DMAvailableUserPermissions.bitfield);

	return createFunctionPrecondition((message: Message) => {
		if (resolvedIncludesServerPermissions && isDMChannel(message.channel)) {
			throw new UserError({
				identifier: DecoratorIdentifiers.RequiresUserPermissionsGuildOnly,
				message: 'Sorry, but that command can only be used in a server because you do not have sufficient permissions in DMs'
			});
		}

		if (isGuildBasedChannel(message.channel)) {
			const missingPermissions = message.channel.permissionsFor(message.member!).missing(resolved);

			if (missingPermissions.length) {
				throw new UserError({
					identifier: DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions,
					message: `Sorry, but you are not allowed to do that. You are missing the permissions: ${missingPermissions}`,
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

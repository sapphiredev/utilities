import { UserError } from '@sapphire/framework';
import {
	ChannelType,
	Message as DJSMessage,
	PermissionFlagsBits,
	PermissionsBitField,
	type PermissionResolvable,
	type PermissionsString
} from 'discord.js';
import diff from 'lodash/difference';
import { DecoratorIdentifiers, RequiresClientPermissions } from '../../src';

interface BitField {
	missing(resolvedPermissions: PermissionsBitField): PermissionsString[];
}

interface Message {
	channel: {
		type: DJSMessage['channel']['type'];
		permissionsFor(): BitField;
	};
	guild: {
		members: any;
	};
}

function buildMissing(resolvedPermissions: PermissionsBitField, ...givenPermissions: PermissionResolvable[]) {
	return diff(resolvedPermissions.toArray(), new PermissionsBitField(givenPermissions).toArray());
}

function buildMessage(channelType: DJSMessage['channel']['type'], ...givenPermissions: PermissionResolvable[]): Message {
	return {
		channel: {
			type: channelType,
			permissionsFor: () => ({ missing: (resolvedPermissions: PermissionsBitField) => buildMissing(resolvedPermissions, givenPermissions) })
		},
		guild: {
			members: { me: '' }
		}
	};
}

describe('RequiresClientPermissions', () => {
	describe('WITH DM-compatible permissions', () => {
		class Test {
			@RequiresClientPermissions(['SendMessages', 'AttachFiles'])
			public getValue(_message: Message) {
				return Promise.resolve('Resolved');
			}
		}

		const instance = new Test();

		describe('WITH channel === GuildTest', () => {
			test('GIVEN has permission THEN returns resolved', async () => {
				const result = await instance.getValue(
					buildMessage(ChannelType.GuildText, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles)
				);

				expect(result).toBe('Resolved');
			});

			test('GIVEN lacking 1 permission THEN throws UserError', async () => {
				const result = instance.getValue(buildMessage(ChannelType.GuildText, PermissionFlagsBits.SendMessages));

				await expect(result).rejects.toThrowError(
					new UserError({
						identifier: DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions,
						message: `Sorry, but I am not allowed to do that. I am missing the permissions: AttachFiles`,
						context: {
							missing: ['AttachFiles']
						}
					})
				);
			});

			test('GIVEN lacking 2 permissions THEN throws UserError', async () => {
				const result = instance.getValue(buildMessage(ChannelType.GuildText));

				await expect(result).rejects.toThrowError(
					new UserError({
						identifier: DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions,
						message: `Sorry, but I am not allowed to do that. I am missing the permissions: SendMessages,AttachFiles`,
						context: {
							missing: ['SendMessages', 'AttachFiles']
						}
					})
				);
			});
		});

		describe('WITH channel === DM', () => {
			test('GIVEN no additional permissions THEN resolves', async () => {
				const result = await instance.getValue(buildMessage(ChannelType.DM));

				expect(result).toBe('Resolved');
			});
		});
	});

	describe('WITH DM-incompatible permissions', () => {
		class Test {
			@RequiresClientPermissions([PermissionFlagsBits.ManageMessages, PermissionFlagsBits.AddReactions, PermissionFlagsBits.EmbedLinks])
			public getValue(_message: Message) {
				return Promise.resolve('Resolved');
			}
		}

		const instance = new Test();

		describe('WITH channel === DM', () => {
			test('GIVEN no additional permissions THEN resolves', async () => {
				const result = instance.getValue(buildMessage(ChannelType.DM));

				await expect(result).rejects.toThrowError(
					new UserError({
						identifier: DecoratorIdentifiers.RequiresClientPermissionsGuildOnly,
						message: 'Sorry, but that command can only be used in a server because I do not have sufficient permissions in DMs'
					})
				);
			});
		});
	});
});

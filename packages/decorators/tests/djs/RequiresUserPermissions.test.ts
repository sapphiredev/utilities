import { UserError } from '@sapphire/framework';
import {
	ChannelType,
	Message as DJSMessage,
	PermissionFlagsBits,
	PermissionsBitField,
	type PermissionsString,
	type PermissionResolvable
} from 'discord.js';
import diff from 'lodash/difference';
import { DecoratorIdentifiers, RequiresUserPermissions } from '../../src';

interface BitField {
	missing(resolvedPermissions: PermissionsBitField): PermissionsString[];
}

interface Message {
	channel: {
		type: DJSMessage['channel']['type'];
		permissionsFor(): BitField;
	};
	guild: {
		me: any;
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
			me: ''
		}
	};
}

describe('RequiresUserPermissions', () => {
	describe('WITH DM-compatible permissions', () => {
		class Test {
			@RequiresUserPermissions([PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles])
			public getValue(_message: Message) {
				return Promise.resolve('Resolved');
			}
		}

		const instance = new Test();

		describe('WITH channel === GuildText', () => {
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
						identifier: DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions,
						message: 'Sorry, but you are not allowed to do that. You are missing the permissions: AttachFiles',
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
						identifier: DecoratorIdentifiers.RequiresUserPermissionsMissingPermissions,
						message: 'Sorry, but you are not allowed to do that. You are missing the permissions: SendMessages,AttachFiles',
						context: {
							missing: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles]
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
			@RequiresUserPermissions([PermissionFlagsBits.ManageMessages, PermissionFlagsBits.AddReactions, PermissionFlagsBits.AddReactions])
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
						identifier: DecoratorIdentifiers.RequiresUserPermissionsGuildOnly,
						message: 'Sorry, but that command can only be used in a server because you do not have sufficient permissions in DMs'
					})
				);
			});
		});
	});
});

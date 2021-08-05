import { UserError } from '@sapphire/framework';
import { Message as DJSMessage, PermissionResolvable, Permissions, PermissionString } from 'discord.js';
import diff from 'lodash/difference';
import { DecoratorIdentifiers, RequiresClientPermissions } from '../../src';

interface BitField {
	missing(resolvedPermissions: Permissions): PermissionString[];
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

function buildMissing(resolvedPermissions: Permissions, ...givenPermissions: PermissionResolvable[]) {
	return diff(resolvedPermissions.toArray(), new Permissions(givenPermissions).toArray());
}

function buildMessage(channelType: DJSMessage['channel']['type'], ...givenPermissions: PermissionResolvable[]): Message {
	return {
		channel: {
			type: channelType,
			permissionsFor: () => ({ missing: (resolvedPermissions: Permissions) => buildMissing(resolvedPermissions, givenPermissions) })
		},
		guild: {
			me: ''
		}
	};
}

describe('RequiresClientPermissions', () => {
	describe('WITH DM-compatible permissions', () => {
		class Test {
			@RequiresClientPermissions(['SEND_MESSAGES', 'ATTACH_FILES'])
			public getValue(_message: Message) {
				return Promise.resolve('Resolved');
			}
		}

		const instance = new Test();

		describe('WITH channel === GUILD_TEXT', () => {
			test('GIVEN has permission THEN returns resolved', async () => {
				const result = await instance.getValue(buildMessage('GUILD_TEXT', 'SEND_MESSAGES', 'ATTACH_FILES'));

				expect(result).toBe('Resolved');
			});

			test('GIVEN lacking 1 permission THEN throws UserError', async () => {
				const result = instance.getValue(buildMessage('GUILD_TEXT', 'SEND_MESSAGES'));

				await expect(result).rejects.toThrowError(
					new UserError({
						identifier: DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions,
						message: `Sorry, but I am not allowed to do that. I am missing the permissions: ATTACH_FILES`,
						context: {
							missing: ['ATTACH_FILES']
						}
					})
				);
			});

			test('GIVEN lacking 2 permissions THEN throws UserError', async () => {
				const result = instance.getValue(buildMessage('GUILD_TEXT'));

				await expect(result).rejects.toThrowError(
					new UserError({
						identifier: DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions,
						message: `Sorry, but I am not allowed to do that. I am missing the permissions: SEND_MESSAGES,ATTACH_FILES`,
						context: {
							missing: ['SEND_MESSAGES', 'ATTACH_FILES']
						}
					})
				);
			});
		});

		describe('WITH channel === DM', () => {
			test('GIVEN no additional permissions THEN resolves', async () => {
				const result = await instance.getValue(buildMessage('DM'));

				expect(result).toBe('Resolved');
			});
		});
	});

	describe('WITH DM-incompatible permissions', () => {
		class Test {
			@RequiresClientPermissions(['MANAGE_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'])
			public getValue(_message: Message) {
				return Promise.resolve('Resolved');
			}
		}

		const instance = new Test();

		describe('WITH channel === DM', () => {
			test('GIVEN no additional permissions THEN resolves', async () => {
				const result = instance.getValue(buildMessage('DM'));

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

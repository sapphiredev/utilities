import { isNullish, Nullish } from '@sapphire/utilities';
import { Permissions } from 'discord.js';
import { isGuildBasedChannel } from './type-guards';
import type { ChannelTypes } from './utility-types';

const canReadMessagesPermissions = new Permissions(['VIEW_CHANNEL']);

/**
 * Determines whether or not we can send messages in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send messages in the specified channel.
 */
export function canReadMessages(channel: ChannelTypes | Nullish): boolean {
	if (isNullish(channel)) return false;

	return canDoUtility(channel, canReadMessagesPermissions);
}

const canSendMessagesPermissions = new Permissions([canReadMessagesPermissions, 'SEND_MESSAGES']);

/**
 * Determines whether or not we can send messages in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send messages in the specified channel.
 */
export function canSendMessages(channel: ChannelTypes | Nullish): boolean {
	if (isNullish(channel)) return false;

	return canDoUtility(channel, canSendMessagesPermissions);
}

const canSendEmbedsPermissions = new Permissions([canSendMessagesPermissions, 'EMBED_LINKS']);

/**
 * Determines whether or not we can send embeds in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send embeds in the specified channel.
 */
export function canSendEmbeds(channel: ChannelTypes | Nullish): boolean {
	if (isNullish(channel)) return false;

	return canDoUtility(channel, canSendEmbedsPermissions);
}

const canSendAttachmentsPermissions = new Permissions([canSendMessagesPermissions, 'ATTACH_FILES']);

/**
 * Determines whether or not we can send attachments in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send attachments in the specified channel.
 */
export function canSendAttachments(channel: ChannelTypes | Nullish): boolean {
	if (isNullish(channel)) return false;

	return canDoUtility(channel, canSendAttachmentsPermissions);
}

function canDoUtility(channel: ChannelTypes, permissionsToPass: Permissions) {
	return isGuildBasedChannel(channel) ? channel.permissionsFor(channel.guild.me!)!.has(permissionsToPass) : true;
}

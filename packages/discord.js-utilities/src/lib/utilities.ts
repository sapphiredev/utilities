import { Permissions } from 'discord.js';
import { isGuildBasedChannel } from './type-guards';
import type { TextBasedChannelTypes } from './utility-types';

const canReadMessagesPermissions = new Permissions(['VIEW_CHANNEL']);

/**
 * Determines whether or not we can send messages in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send messages in the specified channel.
 */
export function canReadMessages(channel: TextBasedChannelTypes): boolean {
	return canDoUtility(channel, canReadMessagesPermissions);
}

const canSendMessagesPermissions = new Permissions([canReadMessagesPermissions, 'SEND_MESSAGES']);

/**
 * Determines whether or not we can send messages in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send messages in the specified channel.
 */
export function canSendMessages(channel: TextBasedChannelTypes): boolean {
	return canDoUtility(channel, canSendMessagesPermissions);
}

const canSendEmbedsPermissions = new Permissions([canSendMessagesPermissions, 'EMBED_LINKS']);

/**
 * Determines whether or not we can send embeds in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send embeds in the specified channel.
 */
export function canSendEmbeds(channel: TextBasedChannelTypes): boolean {
	return canDoUtility(channel, canSendEmbedsPermissions);
}

const canSendAttachmentsPermissions = new Permissions([canSendMessagesPermissions, 'ATTACH_FILES']);

/**
 * Determines whether or not we can send attachments in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can send attachments in the specified channel.
 */
export function canSendAttachments(channel: TextBasedChannelTypes): boolean {
	return canDoUtility(channel, canSendAttachmentsPermissions);
}

function canDoUtility(channel: TextBasedChannelTypes, permissionsToPass: Permissions) {
	return isGuildBasedChannel(channel) ? channel.permissionsFor(channel.guild.me!)!.has(permissionsToPass) : true;
}

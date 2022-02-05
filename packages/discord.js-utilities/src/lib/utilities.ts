import { isNullish, Nullish } from '@sapphire/utilities';
import { Permissions, type VoiceBasedChannel } from 'discord.js';
import { isDMChannel, isGuildBasedChannel, isVoiceBasedChannel } from './type-guards';
import type { ChannelTypes } from './utility-types';

const canReadMessagesPermissions = new Permissions(['VIEW_CHANNEL']);

/**
 * Determines whether or not we can read messages in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can read messages in the specified channel.
 */
export function canReadMessages(channel: ChannelTypes | Nullish): boolean {
	if (isNullish(channel)) return false;
	if (isDMChannel(channel)) return true;

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
	if (isDMChannel(channel)) return true;
	if (channel.isThread() && !channel.sendable) return false;

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
	if (isDMChannel(channel)) return true;
	if (channel.isThread() && !channel.sendable) return false;

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
	if (isDMChannel(channel)) return true;
	if (channel.isThread() && !channel.sendable) return false;

	return canDoUtility(channel, canSendAttachmentsPermissions);
}

const canReactPermissions = new Permissions([canSendMessagesPermissions, 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS']);

/**
 * Determines whether or not we can send react to messages in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can react to messages in the specified channel.
 */
export function canReact(channel: ChannelTypes | Nullish) {
	if (isNullish(channel)) return false;
	if (isDMChannel(channel)) return true;
	if (channel.isThread() && channel.archived) return false;

	return canDoUtility(channel, canReactPermissions);
}

const canRemoveAllReactionsPermissions = new Permissions([canReadMessagesPermissions, 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']);

/**
 * Determines whether or not we can remove reactions from messages in a given channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not we can remove reactions from messages in the specified channel.
 */
export function canRemoveAllReactions(channel: ChannelTypes | Nullish) {
	if (isNullish(channel)) return false;
	if (isDMChannel(channel)) return false;

	return canDoUtility(channel, canRemoveAllReactionsPermissions);
}

const canJoinVoiceChannelPermissions = new Permissions(['CONNECT']);

/**
 * Determines whether the client can join the given voice based channel.
 * @param channel The channel to test the permissions from.
 * @returns Whether or not the client can join the specified channel.
 */
export function canJoinVoiceChannel(channel: VoiceBasedChannel | Nullish): boolean {
	if (isNullish(channel)) return false;
	if (!isVoiceBasedChannel(channel)) return false;
	if (channel.userLimit >= channel.members.size) return false;

	return canDoUtility(channel, canJoinVoiceChannelPermissions);
}

function canDoUtility(channel: ChannelTypes, permissionsToPass: Permissions) {
	return isGuildBasedChannel(channel) ? channel.permissionsFor(channel.guild.me!)!.has(permissionsToPass) : true;
}

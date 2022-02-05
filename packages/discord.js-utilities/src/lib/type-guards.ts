import { isNullish, Nullish } from '@sapphire/utilities';
import type { APIMessage } from 'discord-api-types/v9';
import {
	Message,
	type BaseGuildVoiceChannel,
	type CategoryChannel,
	type Channel,
	type DMChannel,
	type NewsChannel,
	type PartialDMChannel,
	type PartialGroupDMChannel,
	type StageChannel,
	type StoreChannel,
	type TextChannel,
	type ThreadChannel,
	type VoiceChannel
} from 'discord.js';
import type { ChannelTypes, GuildTextBasedChannelTypes, NonThreadGuildTextBasedChannelTypes, TextBasedChannelTypes } from './utility-types';

/**
 * Checks whether a given channel is a {@link CategoryChannel}
 * @param channel The channel to check
 */
export function isCategoryChannel(channel: ChannelTypes | Nullish): channel is CategoryChannel {
	return channel?.type === 'GUILD_CATEGORY';
}

/**
 * Checks whether a given channel is a {@link DMChannel}
 * @param channel The channel to check
 */
export function isDMChannel(channel: ChannelTypes | Nullish): channel is DMChannel | PartialDMChannel {
	return channel?.type === 'DM';
}

/**
 * Checks whether a given channel is a {@link PartialGroupDMChannel}
 * @param channel The channel to check
 */
export function isGroupChannel(channel: Channel | PartialDMChannel | Nullish): channel is PartialGroupDMChannel {
	return channel?.type === 'GROUP_DM';
}

/**
 * Checks if a channel comes from a guild.
 * @param channel The channel to check
 * @returns Whether or not the channel is guild-based.
 */
export function isGuildBasedChannel(channel: ChannelTypes | Nullish): channel is GuildTextBasedChannelTypes {
	return channel?.type !== 'DM';
}

/**
 * Checks whether or not a channel comes from a guild.
 * @remark As opposed to {@link isGuildBasedChannel} this checks if there is `guild` property on the channel.
 * @param channel The channel to check.
 * @returns Whether or not the channel is guild-based.
 */
export function isGuildBasedChannelByGuildKey(channel: ChannelTypes | Nullish): channel is GuildTextBasedChannelTypes {
	return Reflect.has(channel ?? {}, 'guild');
}

/**
 * Checks whether a given channel is a {@link NewsChannel}.
 * @param channel The channel to check.
 */
export function isNewsChannel(channel: ChannelTypes | Nullish): channel is NewsChannel {
	return channel?.type === 'GUILD_NEWS';
}

/**
 * Checks whether a given channel is a {@link StoreChannel}
 * @param channel The channel to check
 */
export function isStoreChannel(channel: ChannelTypes | Nullish): channel is StoreChannel {
	return channel?.type === 'GUILD_STORE';
}

/**
 * Checks whether a given channel is a {@link TextChannel}.
 * @param channel The channel to check.
 */
export function isTextChannel(channel: ChannelTypes | Nullish): channel is TextChannel {
	return channel?.type === 'GUILD_TEXT';
}

/**
 * Checks whether a given channel is a {@link VoiceChannel}
 * @param channel The channel to check
 */
export function isVoiceChannel(channel: ChannelTypes | Nullish): channel is VoiceChannel {
	return channel?.type === 'GUILD_VOICE';
}

/**
 * Checks whether a given channel is a {@link StageChannel}
 * @param channel The channel to check
 */
export function isStageChannel(channel: ChannelTypes | Nullish): channel is StageChannel {
	return channel?.type === 'GUILD_STAGE_VOICE';
}

/**
 * Checks whether a given channel is a {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isThreadChannel(channel: ChannelTypes | Nullish): channel is ThreadChannel {
	return channel?.isThread() ?? false;
}

/**
 * Checks whether a given channel is a News {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isNewsThreadChannel(channel: ChannelTypes | Nullish): channel is ThreadChannel {
	return channel?.type === 'GUILD_NEWS_THREAD';
}

/**
 * Checks whether a given channel is a Public {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isPublicThreadChannel(channel: ChannelTypes | Nullish): channel is ThreadChannel {
	return channel?.type === 'GUILD_PUBLIC_THREAD';
}

/**
 * Checks whether a given channel is a Private {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isPrivateThreadChannel(channel: ChannelTypes | Nullish): channel is ThreadChannel {
	return channel?.type === 'GUILD_PRIVATE_THREAD';
}

/**
 * Checks whether a given channel is a {@link TextBasedChannelTypes}. This means it has a `send` method.
 * @param channel The channel to check.
 */
export function isTextBasedChannel(channel: ChannelTypes | Nullish): channel is TextBasedChannelTypes {
	if (isNullish(channel)) return false;

	return !isNullish((channel as TextBasedChannelTypes).send);
}

/**
 * Checks whether a given channel is a {@link BaseGuildVoiceChannel}.
 * @param channel: The channel to checl.
 */
export function isVoiceBasedChannel(channel: Channel | Nullish): channel is BaseGuildVoiceChannel {
	if (isNullish(channel)) return false;

	return channel.isVoice();
}

/**
 * Checks whether a given channel allows NSFW content or not
 * @param channel The channel to check.
 */
export function isNsfwChannel(channel: ChannelTypes | Nullish): boolean {
	if (isNullish(channel)) return false;

	switch (channel.type) {
		case 'DM':
		case 'GROUP_DM':
		case 'GUILD_CATEGORY':
		case 'GUILD_STAGE_VOICE':
		case 'GUILD_STORE':
		case 'GUILD_VOICE':
		case 'UNKNOWN':
			return false;
		case 'GUILD_NEWS':
		case 'GUILD_TEXT':
			return (channel as NonThreadGuildTextBasedChannelTypes).nsfw;
		case 'GUILD_NEWS_THREAD':
		case 'GUILD_PRIVATE_THREAD':
		case 'GUILD_PUBLIC_THREAD':
			return Boolean((channel as ThreadChannel).parent?.nsfw);
	}
}

/**
 * Checks whether a given message is an instance of {@link Message}, and not {@link APIMessage}
 * @param message The message to check
 * @returns `true` if the message is an instance of `Message`, false otherwise.
 */
export function isMessageInstance(message: APIMessage | Message): message is Message {
	return message instanceof Message;
}

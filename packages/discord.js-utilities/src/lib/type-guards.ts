import type {
	CategoryChannel,
	Channel,
	DMChannel,
	NewsChannel,
	PartialGroupDMChannel,
	StageChannel,
	StoreChannel,
	TextChannel,
	ThreadChannel,
	VoiceChannel
} from 'discord.js';
import type { GuildTextBasedChannelTypes, TextBasedChannelTypes } from './utility-types';

/**
 * Checks whether a given channel is a {@link CategoryChannel}
 * @param channel The channel to check
 */
export function isCategoryChannel(channel: Channel): channel is CategoryChannel {
	return channel.type === 'GUILD_CATEGORY';
}

/**
 * Checks whether a given channel is a {@link DMChannel}
 * @param channel The channel to check
 */
export function isDMChannel(channel: TextBasedChannelTypes): channel is DMChannel {
	return channel.type === 'DM';
}

/**
 * Checks whether a given channel is a {@link PartialGroupDMChannel}
 * @param channel The channel to check
 */
export function isGroupChannel(channel: Channel): channel is PartialGroupDMChannel {
	return channel.type === 'GROUP_DM';
}

/**
 * Checks whether or not a channel comes from a guild.
 * @param channel The channel to check
 * @returns Whether or not the channel is guild-based.
 */
export function isGuildBasedChannel(channel: TextBasedChannelTypes): channel is GuildTextBasedChannelTypes {
	return channel.type !== 'DM';
}

/**
 * Checks whether or not a channel comes from a guild.
 * @remark As opposed to {@link isGuildBasedChannel} this checks if there is `guild` property on the channel.
 * @param channel The channel to test.
 * @returns Whether or not the channel is guild-based.
 */
export function isGuildBasedChannelByGuildKey(channel: TextBasedChannelTypes): channel is GuildTextBasedChannelTypes {
	return Reflect.has(channel, 'guild');
}

/**
 * Checks whether a given channel is a {@link NewsChannel}
 * @param channel The channel to check
 */
export function isNewsChannel(channel: TextBasedChannelTypes): channel is NewsChannel {
	return channel.type === 'GUILD_NEWS';
}

/**
 * Checks whether a given channel is a {@link StoreChannel}
 * @param channel The channel to check
 */
export function isStoreChannel(channel: Channel): channel is StoreChannel {
	return channel.type === 'GUILD_STORE';
}

/**
 * Checks whether a given channel is a {@link TextChannel}
 * @param channel The channel to check
 */
export function isTextChannel(channel: TextBasedChannelTypes): channel is TextChannel {
	return channel.type === 'GUILD_TEXT';
}

/**
 * Checks whether a given channel is a {@link VoiceChannel}
 * @param channel The channel to check
 */
export function isVoiceChannel(channel: Channel): channel is VoiceChannel {
	return channel.type === 'GUILD_VOICE';
}

/**
 * Checks whether a given channel is a {@link StageChannel}
 * @param channel The channel to check
 */
export function isStageChannel(channel: Channel): channel is StageChannel {
	return channel.type === 'GUILD_STAGE_VOICE';
}

/**
 * Checks whether a given channel is a {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isThreadChannel(channel: Channel): channel is ThreadChannel {
	return channel.isThread();
}

/**
 * Checks whether a given channel allows NSFW content or not
 * @param channel The channel to check whether it allows NSFW or not
 */
export function isNsfwChannel(channel: TextBasedChannelTypes): boolean {
	switch (channel.type) {
		case 'DM':
			return false;
		case 'GUILD_TEXT':
		case 'GUILD_NEWS':
			return channel.nsfw;
		case 'GUILD_NEWS_THREAD':
		case 'GUILD_PUBLIC_THREAD':
		case 'GUILD_PRIVATE_THREAD':
			// `ThreadChannel#parent` returns `null` only when the cache is
			// incomplete, which is never the case in Skyra.
			return channel.parent!.nsfw;
	}
}

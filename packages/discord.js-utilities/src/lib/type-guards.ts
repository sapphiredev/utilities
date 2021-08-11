import type {
	CategoryChannel,
	Channel,
	DMChannel,
	NewsChannel,
	PartialDMChannel,
	PartialGroupDMChannel,
	StageChannel,
	StoreChannel,
	TextChannel,
	ThreadChannel,
	VoiceChannel
} from 'discord.js';
import type { ChannelTypes, GuildTextBasedChannelTypes, NonThreadGuildTextBasedChannelTypes } from './utility-types';

/**
 * Checks whether a given channel is a {@link CategoryChannel}
 * @param channel The channel to check
 */
export function isCategoryChannel(channel: ChannelTypes | undefined | null): channel is CategoryChannel {
	return channel?.type === 'GUILD_CATEGORY';
}

/**
 * Checks whether a given channel is a {@link DMChannel}
 * @param channel The channel to check
 */
export function isDMChannel(channel: ChannelTypes | undefined | null): channel is DMChannel {
	return channel?.type === 'DM';
}

/**
 * Checks whether a given channel is a {@link PartialGroupDMChannel}
 * @param channel The channel to check
 */
export function isGroupChannel(channel: Channel | PartialDMChannel | undefined | null): channel is PartialGroupDMChannel {
	return channel?.type === 'GROUP_DM';
}

/**
 * Checks if a channel comes from a guild.
 * @param channel The channel to check
 * @returns Whether or not the channel is guild-based.
 */
export function isGuildBasedChannel(channel: ChannelTypes | undefined | null): channel is GuildTextBasedChannelTypes {
	return channel?.type !== 'DM';
}

/**
 * Checks whether or not a channel comes from a guild.
 * @remark As opposed to {@link isGuildBasedChannel} this checks if there is `guild` property on the channel.
 * @param channel The channel to check.
 * @returns Whether or not the channel is guild-based.
 */
export function isGuildBasedChannelByGuildKey(channel: ChannelTypes | undefined | null): channel is GuildTextBasedChannelTypes {
	return Reflect.has(channel ?? {}, 'guild');
}

/**
 * Checks whether a given channel is a {@link NewsChannel}.
 * @param channel The channel to check.
 */
export function isNewsChannel(channel: ChannelTypes | undefined | null): channel is NewsChannel {
	return channel?.type === 'GUILD_NEWS';
}

/**
 * Checks whether a given channel is a {@link StoreChannel}
 * @param channel The channel to check
 */
export function isStoreChannel(channel: ChannelTypes | undefined | null): channel is StoreChannel {
	return channel?.type === 'GUILD_STORE';
}

/**
 * Checks whether a given channel is a {@link TextChannel}.
 * @param channel The channel to check.
 */
export function isTextChannel(channel: ChannelTypes | undefined | null): channel is TextChannel {
	return channel?.type === 'GUILD_TEXT';
}

/**
 * Checks whether a given channel is a {@link VoiceChannel}
 * @param channel The channel to check
 */
export function isVoiceChannel(channel: ChannelTypes | undefined | null): channel is VoiceChannel {
	return channel?.type === 'GUILD_VOICE';
}

/**
 * Checks whether a given channel is a {@link StageChannel}
 * @param channel The channel to check
 */
export function isStageChannel(channel: ChannelTypes | undefined | null): channel is StageChannel {
	return channel?.type === 'GUILD_STAGE_VOICE';
}

/**
 * Checks whether a given channel is a {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isThreadChannel(channel: ChannelTypes | undefined | null): channel is ThreadChannel {
	return channel?.isThread() ?? false;
}

/**
 * Checks whether a given channel allows NSFW content or not
 * @param channel The channel to check.
 */
export function isNsfwChannel(channel: ChannelTypes | undefined | null): boolean {
	if (channel) {
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

	return false;
}

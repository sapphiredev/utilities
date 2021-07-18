import type {
	CategoryChannel,
	Channel,
	DMChannel,
	GuildChannel,
	NewsChannel,
	PartialGroupDMChannel,
	StageChannel,
	StoreChannel,
	TextChannel,
	VoiceChannel
} from 'discord.js';

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
export function isDMChannel(channel: Channel): channel is DMChannel {
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
 * Checks whether a given channel is a {@link GuildChannel}
 * @param channel The channel to check
 */
export function isGuildBasedChannel(channel: Channel): channel is GuildChannel {
	return channel.type !== 'DM' && channel.type !== 'GROUP_DM' && channel.type !== 'UNKNOWN';
}

/**
 * Checks whether a given channel is a {@link NewsChannel}
 * @param channel The channel to check
 */
export function isNewsChannel(channel: Channel): channel is NewsChannel {
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
export function isTextChannel(channel: Channel): channel is TextChannel {
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

import type {
	CategoryChannel,
	Channel,
	DMChannel,
	GuildChannel,
	NewsChannel,
	PartialGroupDMChannel,
	StoreChannel,
	TextChannel,
	VoiceChannel
} from 'discord.js';

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/CategoryChannel CategoryChannel}
 * @param channel The channel to check
 */
export function isCategoryChannel(channel: Channel): channel is CategoryChannel {
	return channel.type === 'category';
}

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/DMChannel DMChannel}
 * @param channel The channel to check
 */
export function isDMChannel(channel: Channel): channel is DMChannel {
	return channel.type === 'dm';
}

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/PartialGroupDMChannel PartialGroupDMChannel}
 * @param channel The channel to check
 */
export function isGroupChannel(channel: Channel): channel is PartialGroupDMChannel {
	return channel.type === 'group';
}

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/GuildChannel GuildChannel}
 * @param channel The channel to check
 */
export function isGuildBasedChannel(channel: Channel): channel is GuildChannel {
	return channel.type !== 'dm' && channel.type !== 'group' && channel.type !== 'unknown';
}

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/NewsChannel NewsChannel}
 * @param channel The channel to check
 */
export function isNewsChannel(channel: Channel): channel is NewsChannel {
	return channel.type === 'news';
}

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/StoreChannel StoreChannel}
 * @param channel The channel to check
 */
export function isStoreChannel(channel: Channel): channel is StoreChannel {
	return channel.type === 'store';
}

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/TextChannel TextChannel}
 * @param channel The channel to check
 */
export function isTextChannel(channel: Channel): channel is TextChannel {
	return channel.type === 'text';
}

/**
 * Checks whether a given channel is a {@link https://discord.js.org/#/docs/main/stable/class/VoiceChannel VoiceChannel}
 * @param channel The channel to check
 */
export function isVoiceChannel(channel: Channel): channel is VoiceChannel {
	return channel.type === 'voice';
}

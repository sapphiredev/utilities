import type {
	CategoryChannel,
	DMChannel,
	GuildChannel,
	Message,
	NewsChannel,
	StageChannel,
	StoreChannel,
	TextChannel,
	ThreadChannel,
	VoiceChannel
} from 'discord.js';

/**
 * A union of all the various types of channels that Discord.js has
 */
export type ChannelTypes = CategoryChannel | DMChannel | NewsChannel | StageChannel | StoreChannel | TextChannel | ThreadChannel | VoiceChannel;

/**
 * A union of all the channel types that a message can come from
 */
export type TextBasedChannelTypes = Message['channel'];

/**
 * A union of all the voice-based channel types that Discord.js has
 */
export type VoiceBasedChannelTypes = VoiceChannel | StageChannel;

/**
 * A union of guild based message channels, not including {@link ThreadChannel}
 */
export type NonThreadGuildTextBasedChannelTypes = Extract<TextBasedChannelTypes, GuildChannel>;

/**
 * A union of guild based message channels, including {@link ThreadChannel}
 */
export type GuildTextBasedChannelTypes = NonThreadGuildTextBasedChannelTypes | ThreadChannel;

/**
 * The types of a channel, with the addition of `'UNKNOWN'`
 */
export type ChannelTypeString = ChannelTypes['type'] | 'UNKNOWN';

import type {
	AutocompleteInteraction,
	ButtonInteraction,
	CategoryChannel,
	Channel,
	ChatInputCommandInteraction,
	DMChannel,
	DirectoryChannel,
	GuildChannel,
	Interaction,
	Message,
	MessageContextMenuCommandInteraction,
	NewsChannel,
	PartialDMChannel,
	StageChannel,
	StringSelectMenuInteraction,
	TextChannel,
	ThreadChannel,
	UserContextMenuCommandInteraction,
	VoiceChannel
} from 'discord.js';

/**
 * A union of all the various types of channels that Discord.js has
 */
export type ChannelTypes =
	| CategoryChannel
	| Channel
	| DirectoryChannel
	| DMChannel
	| GuildChannel
	| NewsChannel
	| PartialDMChannel
	| StageChannel
	| TextChannel
	| ThreadChannel
	| VoiceChannel;

/**
 * A union of all the channel types that a message can come from
 */
export type TextBasedChannelTypes = Message['channel'];

/**
 * A union of all the voice-based channel types that Discord.js has
 */
export type VoiceBasedChannelTypes = StageChannel | VoiceChannel;

/**
 * A union of all the channel types that belong to a guild, not including {@link ThreadChannel}
 */
export type NonThreadGuildBasedChannelTypes = Extract<ChannelTypes, GuildChannel>;

/**
 * A union of all the channel types that belong to a guild, including {@link ThreadChannel}
 */
export type GuildBasedChannelTypes = NonThreadGuildBasedChannelTypes | ThreadChannel;

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

/**
 * A union of {@link ChatInputCommandInteraction}, {@link UserContextMenuCommandInteraction} and {@link MessageContextMenuCommandInteraction}. Similar to a `CommandInteraction` class but as a type union.
 */
export type ChatInputOrContextMenuCommandInteraction =
	ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction;

/**
 * A union of {@link ChatInputCommandInteraction}, {@link UserContextMenuCommandInteraction}, {@link MessageContextMenuCommandInteraction}, {@link AutocompleteInteraction}, {@link StringSelectMenuInteraction} and {@link ButtonInteraction}
 */
export type NonModalInteraction =
	AutocompleteInteraction | ButtonInteraction | ChatInputOrContextMenuCommandInteraction | StringSelectMenuInteraction;

/**
 * A union of {@link ChatInputCommandInteraction}, {@link UserContextMenuCommandInteraction}, {@link MessageContextMenuCommandInteraction}, {@link AutocompleteInteraction}, {@link StringSelectMenuInteraction}, {@link ButtonInteraction}, and modal submit interactions
 */
export type AnyInteraction = Interaction;

/**
 * A union of {@link ChatInputCommandInteraction}, {@link UserContextMenuCommandInteraction}, {@link MessageContextMenuCommandInteraction}, {@link StringSelectMenuInteraction}, {@link ButtonInteraction}, and modal submit interactions
 */
export type AnyInteractableInteraction = Exclude<AnyInteraction, AutocompleteInteraction>;

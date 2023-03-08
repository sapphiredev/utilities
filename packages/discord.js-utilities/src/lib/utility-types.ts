import type {
	AutocompleteInteraction,
	ButtonInteraction,
	CategoryChannel,
	Channel,
	ChatInputCommandInteraction,
	DMChannel,
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
	| DMChannel
	| PartialDMChannel
	| NewsChannel
	| StageChannel
	| TextChannel
	| ThreadChannel
	| VoiceChannel
	| GuildChannel
	| Channel;

/**
 * A union of all the channel types that a message can come from
 */
export type TextBasedChannelTypes = Message['channel'];

/**
 * A union of all the voice-based channel types that Discord.js has
 */
export type VoiceBasedChannelTypes = VoiceChannel | StageChannel;

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
 * A union of {@link ChatInputCommandInteraction}, {@link UserContextMenuCommandInteraction} and {@link MessageContextMenuCommandInteraction}. Similar to {@link CommandInteraction} class but as a type union.
 */
export type ChatInputOrContextMenuCommandInteraction =
	| ChatInputCommandInteraction
	| UserContextMenuCommandInteraction
	| MessageContextMenuCommandInteraction;

/**
 * A union of {@link ChatInputCommandInteraction}{@link UserContextMenuCommandInteraction}, {@link MessageContextMenuCommandInteraction}, {@link AutocompleteInteraction}, {@link StringSelectMenuInteraction} and {@link ButtonInteraction}
 */
export type NonModalInteraction =
	| ChatInputOrContextMenuCommandInteraction
	| AutocompleteInteraction
	| StringSelectMenuInteraction
	| ButtonInteraction;

/**
 * A union of {@link ChatInputCommandInteraction}{@link UserContextMenuCommandInteraction}, {@link MessageContextMenuCommandInteraction}, {@link AutocompleteInteraction}, {@link StringSelectMenuInteraction}, {@link ButtonInteraction}, and {@link ModalSubmitInteraction}
 */
export type AnyInteraction = Interaction;

/**
 * A union of {@link ChatInputCommandInteraction}, {@link UserContextMenuCommandInteraction}, {@link MessageContextMenuCommandInteraction}, {@link StringSelectMenuInteraction}, {@link ButtonInteraction}, and {@link ModalSubmitInteraction}
 */
export type AnyInteractableInteraction = Exclude<AnyInteraction, AutocompleteInteraction>;

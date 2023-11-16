import { isNullish, type Nullish } from '@sapphire/utilities';
import {
	BaseInteraction,
	ChannelType,
	GuildMember,
	Message,
	type APIGuildMember,
	type APIInteractionDataResolvedGuildMember,
	type APIInteractionGuildMember,
	type APIMessage,
	type CategoryChannel,
	type Channel,
	type DMChannel,
	type Interaction,
	type NewsChannel,
	type PartialDMChannel,
	type PartialGroupDMChannel,
	type PrivateThreadChannel,
	type PublicThreadChannel,
	type StageChannel,
	type TextChannel,
	type ThreadChannel,
	type VoiceBasedChannel,
	type VoiceChannel
} from 'discord.js';
import type {
	AnyInteractableInteraction,
	ChannelTypes,
	GuildTextBasedChannelTypes,
	NonThreadGuildTextBasedChannelTypes,
	TextBasedChannelTypes
} from './utility-types';

/**
 * Checks whether a given channel is a {@link CategoryChannel}
 * This checks for {@link ChannelType.GuildCategory}.
 * @param channel The channel to check
 */
export function isCategoryChannel(channel: ChannelTypes | Nullish): channel is CategoryChannel {
	return channel?.type === ChannelType.GuildCategory;
}

/**
 * Checks whether a given channel is a {@link DMChannel}
 * This checks for {@link ChannelType.DM}.
 * @param channel The channel to check
 */
export function isDMChannel(channel: ChannelTypes | Nullish): channel is DMChannel | PartialDMChannel {
	return channel?.type === ChannelType.DM;
}

/**
 * Checks whether a given channel is a {@link PartialGroupDMChannel}
 * This checks for {@link ChannelType.GroupDM}.
 * @param channel The channel to check
 */
export function isGroupChannel(channel: Channel | PartialDMChannel | Nullish): channel is PartialGroupDMChannel {
	return channel?.type === ChannelType.GroupDM;
}

/**
 * Checks if a channel comes from a guild.
 * This checks that the channel is **not** {@link ChannelType.DM}.
 * @param channel The channel to check
 * @returns Whether or not the channel is guild-based.
 */
export function isGuildBasedChannel(channel: ChannelTypes | Nullish): channel is GuildTextBasedChannelTypes {
	return channel?.type !== ChannelType.DM;
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
 * This checks for {@link ChannelType.GuildAnnouncement}.
 * @param channel The channel to check.
 */
export function isNewsChannel(channel: ChannelTypes | Nullish): channel is NewsChannel {
	return channel?.type === ChannelType.GuildAnnouncement;
}

/**
 * Checks whether a given channel is a {@link TextChannel}.
 * This checks for {@link ChannelType.GuildText}.
 * @param channel The channel to check.
 */
export function isTextChannel(channel: ChannelTypes | Nullish): channel is TextChannel {
	return channel?.type === ChannelType.GuildText;
}

/**
 * Checks whether a given channel is a {@link VoiceChannel}
 * This checks for {@link ChannelType.GuildVoice}.
 * @param channel The channel to check
 */
export function isVoiceChannel(channel: ChannelTypes | Nullish): channel is VoiceChannel {
	return channel?.type === ChannelType.GuildVoice;
}

/**
 * Checks whether a given channel is a {@link StageChannel}
 * This checks for {@link ChannelType.GuildStageVoice}.
 * @param channel The channel to check
 */
export function isStageChannel(channel: ChannelTypes | Nullish): channel is StageChannel {
	return channel?.type === ChannelType.GuildStageVoice;
}

/**
 * Checks whether a given channel is a {@link ThreadChannel}
 * This checks for {@link ChannelTypes.isThread()}.
 * @param channel The channel to check.
 */
export function isThreadChannel(channel: ChannelTypes | Nullish): channel is ThreadChannel {
	return channel?.isThread() ?? false;
}

/**
 * Checks whether a given channel is an Announcement {@link PublicThreadChannel}
 * This checks for {@link ChannelType.AnnouncementThread}.
 * @param channel The channel to check.
 */
export function isNewsThreadChannel(channel: ChannelTypes | Nullish): channel is PublicThreadChannel {
	return channel?.type === ChannelType.AnnouncementThread;
}

/**
 * Checks whether a given channel is a {@link PublicThreadChannel}
 * This checks for {@link ChannelType.PublicThread}.
 * @param channel The channel to check.
 */
export function isPublicThreadChannel(channel: ChannelTypes | Nullish): channel is PublicThreadChannel {
	return channel?.type === ChannelType.PublicThread;
}

/**
 * Checks whether a given channel is a {@link PrivateThreadChannel}
 * This checks for {@link ChannelType.PrivateThread}.
 * @param channel The channel to check.
 */
export function isPrivateThreadChannel(channel: ChannelTypes | Nullish): channel is PrivateThreadChannel {
	return channel?.type === ChannelType.PrivateThread;
}

/**
 * Checks whether a given channel is a {@link TextBasedChannelTypes}. This means it has a `send` method.
 * @param channel The channel to check.
 */
export function isTextBasedChannel(channel: ChannelTypes | Nullish): channel is TextBasedChannelTypes {
	if (isNullish(channel) || isStageChannel(channel)) return false;

	return !isNullish((channel as Exclude<TextBasedChannelTypes, StageChannel>).send);
}

/**
 * Checks whether a given channel is a {@link VoiceBasedChannel}.
 * This checks for {@link Channel.isVoiceBased()}.
 * @param channel: The channel to check.
 */
export function isVoiceBasedChannel(channel: Channel | Nullish): channel is VoiceBasedChannel {
	if (isNullish(channel)) return false;

	return channel.isVoiceBased();
}

/**
 * Checks whether a given channel allows NSFW content or not
 *
 * For the following channel types this is always false:
 * - {@link ChannelType.DM}
 * - {@link ChannelType.GroupDM}
 * - {@link ChannelType.GuildCategory}
 * - {@link ChannelType.GuildStageVoice}
 * - {@link ChannelType.GuildVoice}
 * - {@link ChannelType.GuildDirectory}
 *
 * For the following channel types the actual channel is checked:
 * - {@link ChannelType.GuildAnnouncement}
 * - {@link ChannelType.GuildText}
 * - {@link ChannelType.GuildForum}
 *
 * For the following channel types the parent of the channel is checked:
 * - {@link ChannelType.AnnouncementThread}
 * - {@link ChannelType.PrivateThread}
 * - {@link ChannelType.PublicThread}
 * - {@link ChannelType.MediaChannel}
 * @param channel The channel to check.
 */
export function isNsfwChannel(channel: ChannelTypes | Nullish): boolean {
	if (isNullish(channel)) return false;

	switch (channel.type) {
		case ChannelType.DM:
		case ChannelType.GroupDM:
		case ChannelType.GuildCategory:
		case ChannelType.GuildStageVoice:
		case ChannelType.GuildVoice:
		case ChannelType.GuildDirectory:
			return false;
		case ChannelType.GuildAnnouncement:
		case ChannelType.GuildText:
		case ChannelType.GuildForum:
		case ChannelType.GuildMedia:
			return (channel as Exclude<NonThreadGuildTextBasedChannelTypes, VoiceChannel | StageChannel>).nsfw;
		case ChannelType.AnnouncementThread:
		case ChannelType.PrivateThread:
		case ChannelType.PublicThread:
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

/**
 * Checks whether the input `messageOrInteraction` is one of {@link Message} or any class that
 * extends {@link BaseInteraction}. This generally boils down to being one of:
 * - {@link Interaction}
 * - {@link AutocompleteInteraction}
 * - {@link ButtonInteraction}
 * - {@link ChannelSelectMenuInteraction}
 * - {@link ChatInputCommandInteraction}
 * - {@link CommandInteraction}
 * - {@link ContextMenuInteraction}
 * - {@link MentionableSelectMenuInteraction}
 * - {@link MessageComponentInteraction}
 * - {@link MessageContextMenuCommandInteraction}
 * - {@link ModalSubmitInteraction}
 * - {@link RoleSelectMenuInteraction}
 * - {@link SelectMenuInteraction}
 * - {@link StringSelectMenuInteraction}
 * - {@link UserContextMenuCommandInteraction}
 * - {@link UserSelectMenuInteraction}
 *
 * @param messageOrInteraction The message or interaction that should be checked.
 * @returns `true` if the `messageOrInteraction` is an instanceof {@link BaseInteraction}, `false` if it is not.
 */
export function isAnyInteraction(messageOrInteraction: APIMessage | Message | BaseInteraction): messageOrInteraction is BaseInteraction {
	return messageOrInteraction instanceof BaseInteraction;
}

/**
 * Checks whether the input `messageOrInteraction` is one of {@link Message} or any class that extends {@link BaseInteraction}
 * As opposed to {@link isAnyInteraction} this also checks that the interaction can actually be interacted with by the user
 * which means that this **cannot** be an {@link AutocompleteInteraction}.
 * That said, this type guard filters the `messageOrInteraction` down to one of:
 * - {@link Interaction}
 * - {@link ButtonInteraction}
 * - {@link ChannelSelectMenuInteraction}
 * - {@link ChatInputCommandInteraction}
 * - {@link CommandInteraction}
 * - {@link ContextMenuInteraction}
 * - {@link MentionableSelectMenuInteraction}
 * - {@link MessageComponentInteraction}
 * - {@link MessageContextMenuCommandInteraction}
 * - {@link ModalSubmitInteraction}
 * - {@link RoleSelectMenuInteraction}
 * - {@link SelectMenuInteraction}
 * - {@link StringSelectMenuInteraction}
 * - {@link UserContextMenuCommandInteraction}
 * - {@link UserSelectMenuInteraction}
 *
 * @param messageOrInteraction The message or interaction that should be checked.
 * @returns `true` if the `messageOrInteraction` is an instanceof {@link BaseInteraction} and does **NOT** pass
 * {@link Interaction.isAutocomplete()}, `false` otherwise.
 */
export function isAnyInteractableInteraction(
	messageOrInteraction: APIMessage | Message | BaseInteraction
): messageOrInteraction is AnyInteractableInteraction {
	if (isAnyInteraction(messageOrInteraction)) {
		return !messageOrInteraction.isAutocomplete();
	}

	return false;
}

/**
 * Checks whether a given member is an instance of {@link GuildMember}, and not {@link APIInteractionGuildMember}, {@link APIGuildMember}, or {@link Nullish}
 * @param member The member to check
 * @returns `true` if the member is an instance of `GuildMember`, false otherwise.
 */
export function isGuildMember(
	member: GuildMember | APIGuildMember | APIInteractionGuildMember | APIInteractionDataResolvedGuildMember | Nullish
): member is GuildMember {
	return member instanceof GuildMember;
}

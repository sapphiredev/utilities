import { isNullish, Nullish } from '@sapphire/utilities';
import {
	APIGuildMember,
	APIInteractionDataResolvedGuildMember,
	APIInteractionGuildMember,
	APIMessage,
	BaseInteraction,
	ChannelType,
	GuildMember,
	Message,
	VoiceBasedChannel,
	type CategoryChannel,
	type Channel,
	type DMChannel,
	type Interaction,
	type NewsChannel,
	type PartialDMChannel,
	type PartialGroupDMChannel,
	type StageChannel,
	type TextChannel,
	type ThreadChannel,
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
 * @param channel The channel to check
 */
export function isCategoryChannel(channel: ChannelTypes | Nullish): channel is CategoryChannel {
	return channel?.type === ChannelType.GuildCategory;
}

/**
 * Checks whether a given channel is a {@link DMChannel}
 * @param channel The channel to check
 */
export function isDMChannel(channel: ChannelTypes | Nullish): channel is DMChannel | PartialDMChannel {
	return channel?.type === ChannelType.DM;
}

/**
 * Checks whether a given channel is a {@link PartialGroupDMChannel}
 * @param channel The channel to check
 */
export function isGroupChannel(channel: Channel | PartialDMChannel | Nullish): channel is PartialGroupDMChannel {
	return channel?.type === ChannelType.GroupDM;
}

/**
 * Checks if a channel comes from a guild.
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
 * @param channel The channel to check.
 */
export function isNewsChannel(channel: ChannelTypes | Nullish): channel is NewsChannel {
	return channel?.type === ChannelType.GuildNews;
}

/**
 * Checks whether a given channel is a {@link TextChannel}.
 * @param channel The channel to check.
 */
export function isTextChannel(channel: ChannelTypes | Nullish): channel is TextChannel {
	return channel?.type === ChannelType.GuildText;
}

/**
 * Checks whether a given channel is a {@link VoiceChannel}
 * @param channel The channel to check
 */
export function isVoiceChannel(channel: ChannelTypes | Nullish): channel is VoiceChannel {
	return channel?.type === ChannelType.GuildVoice;
}

/**
 * Checks whether a given channel is a {@link StageChannel}
 * @param channel The channel to check
 */
export function isStageChannel(channel: ChannelTypes | Nullish): channel is StageChannel {
	return channel?.type === ChannelType.GuildStageVoice;
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
	return channel?.type === ChannelType.GuildNewsThread;
}

/**
 * Checks whether a given channel is a Public {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isPublicThreadChannel(channel: ChannelTypes | Nullish): channel is ThreadChannel {
	return channel?.type === ChannelType.GuildPublicThread;
}

/**
 * Checks whether a given channel is a Private {@link ThreadChannel}
 * @param channel The channel to check.
 */
export function isPrivateThreadChannel(channel: ChannelTypes | Nullish): channel is ThreadChannel {
	return channel?.type === ChannelType.GuildPrivateThread;
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
 * Checks whether a given channel is a {@link VoiceBasedChannel}.
 * @param channel: The channel to check.
 */
export function isVoiceBasedChannel(channel: Channel | Nullish): channel is VoiceBasedChannel {
	if (isNullish(channel)) return false;

	return channel.isVoiceBased();
}

/**
 * Checks whether a given channel allows NSFW content or not
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
		case ChannelType.GuildNews:
		case ChannelType.GuildText:
		case ChannelType.GuildForum:
			return (channel as Exclude<NonThreadGuildTextBasedChannelTypes, VoiceChannel>).nsfw;
		case ChannelType.GuildNewsThread:
		case ChannelType.GuildPrivateThread:
		case ChannelType.GuildPublicThread:
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
 * Checks whether the input `messageOrInteraction` is one of {@link Message} or one of {@link Interaction}, {@link CommandInteraction}, {@link ContextMenuInteraction}, or {@link SelectMenuInteraction}
 * @param messageOrInteraction The message or interaction that should be checked.
 * @returns `true` if the `messageOrInteraction` is **NOT** an instanceof {@link Message}, `false` if it is.
 */
export function isAnyInteraction(messageOrInteraction: APIMessage | Message | Interaction): messageOrInteraction is Interaction {
	return messageOrInteraction instanceof BaseInteraction;
}

export function isAnyInteractableInteraction(
	messageOrInteraction: APIMessage | Message | Interaction
): messageOrInteraction is AnyInteractableInteraction {
	if (messageOrInteraction instanceof BaseInteraction) {
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

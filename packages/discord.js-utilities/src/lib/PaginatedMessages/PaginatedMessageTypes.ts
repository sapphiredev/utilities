import type { Awaitable } from '@sapphire/utilities';
import type {
	APIActionRowComponent,
	APIEmbed,
	APIMessage,
	APIComponentInMessageActionRow,
	ActionRowComponentOptions,
	ActionRowData,
	BaseMessageOptions,
	ButtonInteraction,
	ChannelSelectMenuComponentData,
	CollectedInteraction,
	CommandInteraction,
	EmbedBuilder,
	Guild,
	Interaction,
	InteractionButtonComponentData,
	InteractionCollector,
	InteractionReplyOptions,
	InteractionUpdateOptions,
	JSONEncodable,
	LinkButtonComponentData,
	MentionableSelectMenuComponentData,
	Message,
	MessageActionRowComponentBuilder,
	MessageComponentInteraction,
	MessageEditOptions,
	MessageReplyOptions,
	ModalSubmitInteraction,
	RoleSelectMenuComponentData,
	SelectMenuComponentOptionData,
	StageChannel,
	StringSelectMenuComponentData,
	User,
	UserSelectMenuComponentData,
	VoiceChannel,
	WebhookMessageEditOptions
} from 'discord.js';
import type { AnyInteractableInteraction } from '../utility-types';
import type { PaginatedMessage } from './PaginatedMessage';

/**
 * Represents an action that can be performed in a paginated message.
 */
export type PaginatedMessageAction =
	| PaginatedMessageActionButton
	| PaginatedMessageActionLink
	| PaginatedMessageActionStringMenu
	| PaginatedMessageActionUserMenu
	| PaginatedMessageActionRoleMenu
	| PaginatedMessageActionMentionableMenu
	| PaginatedMessageActionChannelMenu;

/**
 * Represents an action that can be run in a paginated message.
 */
export interface PaginatedMessageActionRun {
	/**
	 * Runs the action with the given context.
	 * @param context The context object containing information about the paginated message.
	 * @returns A promise that resolves when the action is complete.
	 */
	run?(context: PaginatedMessageActionContext): Awaitable<unknown>;
}

/**
 * To utilize buttons you can pass an object with the structure of {@link PaginatedMessageActionButton} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const StopAction: PaginatedMessageActionButton = {
 *   customId: 'CustomStopAction',
 *   emoji: '⏹️',
 *   run: ({ collector }) => {
 *     collector.stop();
 *   }
 * }
 * ```
 */
export type PaginatedMessageActionButton = InteractionButtonComponentData & PaginatedMessageActionRun;

/**
 * To utilize links you can pass an object with the structure of {@link PaginatedMessageActionLink} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 *  You can also give the object directly.
 *
 * const LinkSapphireJs: PaginatedMessageActionLink = {
 *   url: 'https://sapphirejs.dev',
 *   label: 'Sapphire Website',
 *   emoji: '🔗'
 * }
 * ```
 */
export type PaginatedMessageActionLink = LinkButtonComponentData;

/**
 * To utilize String Select Menus you can pass an object with the structure of {@link PaginatedMessageActionStringMenu} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const StringMenu: PaginatedMessageActionStringMenu = {
 *   customId: 'CustomStringSelectMenu',
 *   type: ComponentType.StringSelect,
 *   run: ({ handler, interaction }) => interaction.isStringSelectMenu() && (handler.index = parseInt(interaction.values[0], 10))
 * }
 * ```
 */
export type PaginatedMessageActionStringMenu = PaginatedMessageActionRun & StringSelectMenuComponentData;

/**
 * To utilize User Select Menus you can pass an object with the structure of {@link PaginatedMessageActionUserMenu} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const UserMenu: PaginatedMessageActionUserMenu = {
 *   customId: 'CustomUserSelectMenu',
 *   type: ComponentType.UserSelect,
 *   run: ({ interaction }) => {
 *     if (interaction.isChannelSelectMenu()) {
 *       console.log(interaction.values[0])
 *     }
 *   }
 * }
 * ```
 */
export type PaginatedMessageActionUserMenu = PaginatedMessageActionRun &
	UserSelectMenuComponentData & {
		options?: never;
	};

/**
 * To utilize Role Select Menus you can pass an object with the structure of {@link PaginatedMessageActionRoleMenu} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const RoleMenu: PaginatedMessageActionRoleMenu = {
 *   customId: 'CustomRoleSelectMenu',
 *   type: ComponentType.RoleSelect,
 *   run: ({ interaction }) => {
 *     if (interaction.isRoleSelectMenu()) {
 *       console.log(interaction.values[0])
 *     }
 *   }
 * }
 * ```
 */
export type PaginatedMessageActionRoleMenu = PaginatedMessageActionRun &
	RoleSelectMenuComponentData & {
		options?: never;
	};

/**
 * To utilize Mentionable Select Menus you can pass an object with the structure of {@link PaginatedMessageActionMentionableMenu} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const MentionableMenu: PaginatedMessageActionMentionableMenu = {
 *   customId: 'CustomMentionableSelectMenu',
 *   type: ComponentType.MentionableSelect,
 *   run: ({ interaction }) => {
 *     if (interaction.isMentionableSelectMenu()) {
 *       console.log(interaction.values[0])
 *     }
 *   }
 * }
 * ```
 */
export type PaginatedMessageActionMentionableMenu = PaginatedMessageActionRun &
	MentionableSelectMenuComponentData & {
		options?: never;
	};

/**
 * To utilize Channel Select Menus you can pass an object with the structure of {@link PaginatedMessageActionChannelMenu} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const ChannelMenu: PaginatedMessageActionChannelMenu = {
 *   customId: 'CustomChannelSelectMenu',
 *   type: ComponentType.ChannelSelect,
 *   channelTypes: [ChannelType.GuildText],
 *   run: ({ interaction }) => {
 *     if (interaction.isChannelSelectMenu()) {
 *       console.log(interaction.values[0])
 *     }
 *   }
 * }
 * ```
 */
export type PaginatedMessageActionChannelMenu = PaginatedMessageActionRun &
	ChannelSelectMenuComponentData & {
		options?: never;
	};

/**
 * The context to be used in {@link PaginatedMessageActionButton}.
 */
export interface PaginatedMessageActionContext {
	interaction: PaginatedMessageInteractionUnion;
	handler: PaginatedMessage;
	author: User;
	channel: Message['channel'];
	response: APIMessage | Message | CommandInteraction | ButtonInteraction | PaginatedMessageInteractionUnion;
	collector: InteractionCollector<PaginatedMessageInteractionUnion>;
}

/**
 * Options for configuring a paginated message.
 */
export interface PaginatedMessageOptions {
	/**
	 * The pages to display in this {@link PaginatedMessage}.
	 */
	pages?: PaginatedMessagePage[];

	/**
	 * Custom actions to provide when sending the paginated message.
	 */
	actions?: PaginatedMessageAction[];

	/**
	 * The {@link EmbedBuilder} or {@link MessageOptions} options to apply to the entire {@link PaginatedMessage}.
	 */
	template?: EmbedBuilder | BaseMessageOptions;

	/**
	 * The prefix to display before the page index.
	 * @seealso {@link PaginatedMessage.pageIndexPrefix}
	 */
	pageIndexPrefix?: string;

	/**
	 * The separator to display between the embed footer and the page index.
	 * @seealso {@link PaginatedMessage.embedFooterSeparator}
	 */
	embedFooterSeparator?: string;

	/**
	 * Additional options that are applied to each message when sending it to Discord.
	 * Be careful with using this, misusing it can cause issues, such as sending empty messages.
	 * @remark **This is for advanced usages only!**
	 *
	 * @default null
	 */
	paginatedMessageData?: Omit<PaginatedMessageMessageOptionsUnion, 'components'> | null;
}

/**
 * The pages that are used for {@link PaginatedMessage.pages}
 *
 * Pages can be either a {@link Message},
 * or an {@link Awaitable} function that returns a {@link Message}.
 *
 * Furthermore, {@link MessageOptions} can be used to
 * construct the pages without state. This library also provides {@link MessageBuilder}, which can be used as a chainable
 * alternative to raw objects, similar to how {@link MessageEmbed}
 * works.
 *
 * Ideally, however, you should use the utility functions
 * {@link PaginatedMessage.addPageBuilder `addPageBuilder`}, {@link PaginatedMessage.addPageContent `addPageContent`}, and {@link PaginatedMessage.addPageEmbed `addPageEmbed`}
 * as opposed to manually constructing {@link PaginatedMessagePage `MessagePages`}. This is because a {@link PaginatedMessage} does a lot of post-processing
 * on the provided pages and we can only guarantee this will work properly when using the utility methods.
 */
export type PaginatedMessagePage =
	| ((index: number, pages: PaginatedMessagePage[], handler: PaginatedMessage) => Awaitable<PaginatedMessageMessageOptionsUnion>)
	| PaginatedMessageMessageOptionsUnion;

/**
 * Represents a resolved page for a paginated message.
 * It can be either a `BaseMessageOptions` object with the `flags` property omitted,
 * or a `WebhookMessageEditOptions` object.
 */
export type PaginatedMessageResolvedPage = Omit<BaseMessageOptions, 'flags'> | Omit<WebhookMessageEditOptions, 'flags'>;

/**
 * The type of the custom function that can be set for the {@link PaginatedMessage.selectMenuOptions}
 */
export type PaginatedMessageSelectMenuOptionsFunction = (
	pageIndex: number,
	internationalizationContext: PaginatedMessageInternationalizationContext
) => Awaitable<Omit<SelectMenuComponentOptionData, 'value'>>;

/**
 * The type of the custom function that can be set for the {@link PaginatedMessage.wrongUserInteractionReply}
 */
export type PaginatedMessageWrongUserInteractionReplyFunction = (
	targetUser: User,
	interactionUser: User,
	internationalizationContext: PaginatedMessageInternationalizationContext
) => Awaitable<Parameters<MessageComponentInteraction['reply']>[0]>;

/**
 * Represents the resolvable type for the embeds property of a paginated message.
 */
export type PaginatedMessageEmbedResolvable = BaseMessageOptions['embeds'];

/**
 * A non nullable writeable variant of {@link PaginatedMessageEmbedResolvable}.
 * This removes:
 *
 * - The union with `| undefined`
 * - The `readonly` constraint
 */
export type PaginatedMessageWriteableEmbedResolvable = (APIEmbed | JSONEncodable<APIEmbed>)[];

/**
 * Represents the union of options for a paginated message.
 */
export type PaginatedMessageMessageOptionsUnion = Omit<PaginatedMessageResolvedPage, 'components'> & {
	actions?: PaginatedMessageAction[];
};

/**
 * Represents the union type of interactions for a paginated message, excluding the ModalSubmitInteraction.
 */
export type PaginatedMessageInteractionUnion = Exclude<CollectedInteraction, ModalSubmitInteraction>;

/**
 * Represents a union type for components in a paginated message.
 * It can be one of the following types:
 * - `JSONEncodable<APIActionRowComponent<APIComponentInMessageActionRow>>`
 * - `ActionRowData<ActionRowComponentOptions | MessageActionRowComponentBuilder>`
 * - `APIActionRowComponent<APIComponentInMessageActionRow>`
 */
export type PaginatedMessageComponentUnion =
	| JSONEncodable<APIActionRowComponent<APIComponentInMessageActionRow>>
	| ActionRowData<ActionRowComponentOptions | MessageActionRowComponentBuilder>
	| APIActionRowComponent<APIComponentInMessageActionRow>;

/**
 * @internal This is a duplicate of the same interface in `@sapphire/plugin-i18next`
 * Duplicated here for the type of the parameters in the functions
 *
 * Context for {@link InternationalizationHandler.fetchLanguage} functions.
 * This context enables implementation of per-guild, per-channel, and per-user localization.
 */
export interface PaginatedMessageInternationalizationContext {
	/** The {@link Guild} object to fetch the preferred language for, or `null` if the language is to be fetched in a DM. */
	guild: Guild | null;
	/** The {@link DiscordChannel} object to fetch the preferred language for. */
	channel: Message['channel'] | StageChannel | VoiceChannel | null;
	/** The user to fetch the preferred language for. */
	user: User | null;
	/** The {@link Interaction.guildLocale} provided by the Discord API */
	interactionGuildLocale?: Interaction['guildLocale'];
	/** The {@link Interaction.locale} provided by the Discord API */
	interactionLocale?: Interaction['locale'];
}

/**
 * Represents the parameters for safely replying to an interaction.
 * @template T - The type of message method ('edit', 'reply', or never).
 */
export interface SafeReplyToInteractionParameters<T extends 'edit' | 'reply' = never> {
	/**
	 * The message or interaction to reply to.
	 */
	messageOrInteraction: APIMessage | Message | AnyInteractableInteraction;

	/**
	 * The content to use when editing a reply to an interaction.
	 */
	interactionEditReplyContent: WebhookMessageEditOptions;

	/**
	 * The content to use when replying to an interaction.
	 */
	interactionReplyContent: InteractionReplyOptions;

	/**
	 * The content to use when updating a component interaction.
	 */
	componentUpdateContent: InteractionUpdateOptions;

	/**
	 * The method to use when sending a message.
	 */
	messageMethod?: T;

	/**
	 * The content to use when sending a message using the 'reply' method.
	 */
	messageMethodContent?: T extends 'reply' ? MessageReplyOptions : MessageEditOptions;
}

/**
 * Represents the possible reasons for stopping a paginated message.
 */
export type PaginatedMessageStopReasons =
	| 'time'
	| 'idle'
	| 'user'
	| 'messageDelete'
	| 'channelDelete'
	| 'threadDelete'
	| 'guildDelete'
	| 'limit'
	| 'componentLimit'
	| 'userLimit';

/**
 * Represents a resolvable object that can be used to create an embed in Discord.
 * It can be either a JSON-encodable object or an APIEmbed object.
 */
export type EmbedResolvable = JSONEncodable<APIEmbed> | APIEmbed;

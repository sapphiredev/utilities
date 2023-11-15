import type { Awaitable } from '@sapphire/utilities';
import type {
	APIActionRowComponent,
	APIEmbed,
	APIMessage,
	APIMessageActionRowComponent,
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

export type PaginatedMessageAction =
	| PaginatedMessageActionButton
	| PaginatedMessageActionLink
	| PaginatedMessageActionStringMenu
	| PaginatedMessageActionUserMenu
	| PaginatedMessageActionRoleMenu
	| PaginatedMessageActionMentionableMenu
	| PaginatedMessageActionChannelMenu;

export interface PaginatedMessageActionRun {
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

export interface PaginatedMessageOptions {
	/**
	 * The pages to display in this {@link PaginatedMessage}
	 */
	pages?: PaginatedMessagePage[];
	/**
	 * Custom actions to provide when sending the paginated message
	 */
	actions?: PaginatedMessageAction[];
	/**
	 * The {@link EmbedBuilder} or {@link MessageOptions} options to apply to the entire {@link PaginatedMessage}
	 */
	template?: EmbedBuilder | BaseMessageOptions;
	/**
	 * @seealso {@link PaginatedMessage.pageIndexPrefix}
	 */
	pageIndexPrefix?: string;
	/**
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

export type PaginatedMessageResolvedPage = Omit<BaseMessageOptions, 'flags'> | WebhookMessageEditOptions;

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

export type PaginatedMessageEmbedResolvable = BaseMessageOptions['embeds'];

export type PaginatedMessageMessageOptionsUnion = Omit<PaginatedMessageResolvedPage, 'components'> & {
	actions?: PaginatedMessageAction[];
};

export type PaginatedMessageInteractionUnion = Exclude<CollectedInteraction, ModalSubmitInteraction>;

export type PaginatedMessageComponentUnion =
	| JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
	| ActionRowData<ActionRowComponentOptions | MessageActionRowComponentBuilder>
	| APIActionRowComponent<APIMessageActionRowComponent>;

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

export interface SafeReplyToInteractionParameters<T extends 'edit' | 'reply' | never = never> {
	messageOrInteraction: APIMessage | Message | AnyInteractableInteraction;
	interactionEditReplyContent: WebhookMessageEditOptions;
	interactionReplyContent: InteractionReplyOptions;
	componentUpdateContent: InteractionUpdateOptions;
	messageMethod?: T;
	messageMethodContent?: T extends 'reply' ? MessageReplyOptions : MessageEditOptions;
}

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

export type EmbedResolvable = JSONEncodable<APIEmbed> | APIEmbed;

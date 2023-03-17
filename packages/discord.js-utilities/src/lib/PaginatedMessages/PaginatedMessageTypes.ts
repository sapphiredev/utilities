import type { Awaitable } from '@sapphire/utilities';
import type {
	APIMessage,
	BaseMessageOptions,
	ButtonInteraction,
	CommandInteraction,
	EmbedBuilder,
	Guild,
	Interaction,
	InteractionButtonComponentData,
	InteractionCollector,
	InteractionReplyOptions,
	InteractionUpdateOptions,
	LinkButtonComponentData,
	Message,
	MessageComponentInteraction,
	MessageEditOptions,
	MessageReplyOptions,
	SelectMenuComponentOptionData,
	StageChannel,
	StringSelectMenuComponentData,
	StringSelectMenuInteraction,
	User,
	VoiceChannel,
	WebhookMessageEditOptions
} from 'discord.js';
import type { AnyInteractableInteraction } from '../utility-types.js';
import type { PaginatedMessage } from './PaginatedMessage.js';

export type PaginatedMessageAction = PaginatedMessageActionButton | PaginatedMessageActionLink | PaginatedMessageActionMenu;

/**
 * To utilize buttons you can pass an object with the structure of {@link PaginatedMessageActionButton} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const StopAction: PaginatedMessageActionButton {
 *   customId: 'CustomStopAction',
 *   emoji: '⏹️',
 *   run: ({ collector }) => {
 *     collector.stop();
 *   }
 * }
 * ```
 */
export interface PaginatedMessageActionButton extends InteractionButtonComponentData {
	run(context: PaginatedMessageActionContext): Awaitable<unknown>;
}

/**
 * To utilize links you can pass an object with the structure of {@link PaginatedMessageActionLink} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 *  You can also give the object directly.
 *
 * const LinkSapphireJs: PaginatedMessageActionLink {
 *   url: 'https://sapphirejs.dev',
 *   label: 'Sapphire Website',
 *   emoji: '🔗'
 * }
 * ```
 */
export interface PaginatedMessageActionLink extends LinkButtonComponentData {}

/**
 * To utilize Select Menus you can pass an object with the structure of {@link PaginatedMessageActionMenu} to {@link PaginatedMessage} actions.
 * @example
 * ```typescript
 * const StopAction: PaginatedMessageActionMenu {
 *   customId: 'CustomSelectMenu',
 *   type: ComponentType.StringSelect,
 *   run: ({ handler, interaction }) => interaction.isSelectMenu() && (handler.index = parseInt(interaction.values[0], 10))
 * }
 * ```
 */
export interface PaginatedMessageActionMenu extends StringSelectMenuComponentData {
	run(context: PaginatedMessageActionContext): Awaitable<unknown>;
}

/**
 * The context to be used in {@link PaginatedMessageActionButton}.
 */
export interface PaginatedMessageActionContext {
	interaction: ButtonInteraction | StringSelectMenuInteraction;
	handler: PaginatedMessage;
	author: User;
	channel: Message['channel'];
	response: APIMessage | Message | CommandInteraction | StringSelectMenuInteraction | ButtonInteraction;
	collector: InteractionCollector<ButtonInteraction | StringSelectMenuInteraction>;
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

export type PaginatedMessageMessageOptionsUnion = Omit<BaseMessageOptions, 'flags'> | WebhookMessageEditOptions;

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

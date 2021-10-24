import type { Awaitable } from '@sapphire/utilities';
import type {
	ButtonInteraction,
	InteractionButtonOptions,
	InteractionCollector,
	Message,
	MessageComponentInteraction,
	MessageEmbed,
	MessageOptions,
	MessageSelectMenuOptions,
	MessageSelectOptionData,
	SelectMenuInteraction,
	User,
	WebhookEditMessageOptions
} from 'discord.js';
import type { MessageButtonStyles, MessageComponentTypes } from 'discord.js/typings/enums';
import type { PaginatedMessage } from './PaginatedMessage';

/**
 * To utilize actions you can use the {@link PaginatedMessageAction} by implementing it into a class.
 * @example
 * ```typescript
 * class ForwardAction implements IPaginatedMessageAction {
 *   public id = '▶️';
 *
 *   public run({ handler }) {
 *     if (handler.index !== handler.pages.length - 1) ++handler.index;
 *   }
 * }
 *
 * // You can also give the object directly.
 *
 * const StopAction: IPaginatedMessageAction {
 *   customId: 'CustomStopAction',
 *   emoji: '⏹️',
 *   run: ({ collector }) => {
 *     collector.stop();
 *   }
 * }
 * ```
 */
export interface PaginatedMessageAction extends Omit<InteractionButtonOptions, 'customId' | 'style'>, Omit<MessageSelectMenuOptions, 'customId'> {
	customId: string;
	type: MessageComponentTypes;
	style?: ExcludeEnum<typeof MessageButtonStyles, 'LINK'>;
	run(context: PaginatedMessageActionContext): Awaitable<unknown>;
}

/**
 * The context to be used in {@link PaginatedMessageAction}.
 */
export interface PaginatedMessageActionContext {
	interaction: ButtonInteraction | SelectMenuInteraction;
	handler: PaginatedMessage;
	author: User;
	channel: Message['channel'];
	response: Message;
	collector: InteractionCollector<MessageComponentInteraction>;
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
	 * The {@link MessageEmbed} or {@link MessageOptions} options to apply to the entire {@link PaginatedMessage}
	 */
	template?: MessageEmbed | MessageOptions;
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
export type PaginatedMessageSelectMenuOptionsFunction = (pageIndex: number) => Omit<MessageSelectOptionData, 'value'>;

/**
 * The type of the custom function that can be set for the {@link PaginatedMessage.wrongUserInteractionReply}
 */
export type PaginatedMessageWrongUserInteractionReplyFunction = (
	targetUser: User,
	interactionUser: User
) => Parameters<MessageComponentInteraction['reply']>[0];

export type PaginatedMessageEmbedResolvable = MessageOptions['embeds'];

export type PaginatedMessageMessageOptionsUnion = MessageOptions | WebhookEditMessageOptions;

// TODO: Remove after next DJS update when this type will be exported from their typings file
type ExcludeEnum<T, K extends keyof T> = Exclude<keyof T | T[keyof T], K | T[K]>;

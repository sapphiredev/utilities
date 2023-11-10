import type { Ctor } from '@sapphire/utilities';
import type { CollectorFilter, EmojiResolvable, Message, MessageReaction, User } from 'discord.js';
import type {
	IMessagePrompterExplicitConfirmReturn,
	IMessagePrompterExplicitMessageReturn,
	IMessagePrompterExplicitNumberReturn,
	IMessagePrompterExplicitReturnBase
} from './ExplicitReturnTypes';
import type { MessagePrompterChannelTypes, MessagePrompterMessage } from './constants';
import { MessagePrompterBaseStrategy } from './strategies/MessagePrompterBaseStrategy';
import { MessagePrompterConfirmStrategy } from './strategies/MessagePrompterConfirmStrategy';
import { MessagePrompterMessageStrategy } from './strategies/MessagePrompterMessageStrategy';
import { MessagePrompterNumberStrategy } from './strategies/MessagePrompterNumberStrategy';
import { MessagePrompterReactionStrategy } from './strategies/MessagePrompterReactionStrategy';
import type {
	IMessagePrompterConfirmStrategyOptions,
	IMessagePrompterNumberStrategyOptions,
	IMessagePrompterReactionStrategyOptions,
	IMessagePrompterStrategyOptions
} from './strategyOptions';

export interface StrategyReturns {
	confirm: IMessagePrompterExplicitConfirmReturn | boolean;
	message: IMessagePrompterExplicitMessageReturn | Message;
	number: IMessagePrompterExplicitNumberReturn | number;
	reaction: IMessagePrompterExplicitReturnBase | string | EmojiResolvable;
}

export interface StrategyOptions {
	confirm: IMessagePrompterConfirmStrategyOptions;
	message: IMessagePrompterStrategyOptions;
	number: IMessagePrompterNumberStrategyOptions;
	reaction: IMessagePrompterReactionStrategyOptions;
}

export interface StrategyFilters {
	confirm: [MessageReaction, User];
	message: [Message];
	number: [MessageReaction, User];
	reaction: [MessageReaction, User];
}

/**
 * This is a {@link MessagePrompter}, a utility that sends a message, prompting for user input. The prompt can resolve to any kind of input.
 * There are several specifiable types to prompt for user input, and they are as follows:
 * - Confirm
 *   This will send a simple Yes/No prompt, using reactions.
 * - Number
 *   This will prompt for an integer. By default it will be a number between 0 and 10 (inclusive), however you can also specify your own custom range (inclusive).
 * - Reactions
 *   This can be any kind of reaction emoji that Discord supports, and as many as you want. This type will return that reaction instead of a boolean.
 * - Message
 *   This will prompt the user and require a response in the form of a message. This can be helpful if you require a user to upload an image for example, or give text input.
 *
 * You must either use this class directly or extend it.
 *
 * {@link MessagePrompter} uses reactions to prompt for a yes/no answer and returns it.
 * You can modify the confirm and cancel reaction used for each message, or use the {@link MessagePrompter.defaultPrompts}.
 * {@link MessagePrompter.defaultPrompts} is also static so you can modify these directly.
 *
 * @example
 * ```typescript
 * const { MessagePrompter } = require('@sapphire/discord.js-utilities');
 *
 * const handler = new MessagePrompter('Are you sure you want to continue?');
 * const result = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const { MessagePrompter } = require('@sapphire/discord.js-utilities');
 *
 * const handler = new MessagePrompter('Choose a number between 5 and 10?', 'number', {
 * 		start: 5,
 * 		end: 10
 * });
 * const result = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const { MessagePrompter } = require('@sapphire/discord.js-utilities');
 *
 * const handler = new MessagePrompter('Are you happy or sad?', 'reaction', {
 * 		reactions: ['🙂', '🙁']
 * });
 * const result = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const { MessagePrompter } = require('@sapphire/discord.js-utilities');
 *
 * const handler = new MessagePrompter('Do you love me?', 'message');
 * const result = await handler.run(channel, author);
 * ```
 */
export class MessagePrompter<S extends keyof StrategyReturns = 'confirm'> {
	/**
	 * The strategy used in {@link MessagePrompter.run}
	 */
	public strategy: MessagePrompterBaseStrategy;

	/**
	 * Constructor for the {@link MessagePrompter} class
	 * @param message The message to send.
	 * @param strategy The strategy name or Instance to use
	 * @param strategyOptions The options that are passed to the strategy
	 */
	public constructor(
		message: MessagePrompterMessage | MessagePrompterBaseStrategy,
		strategy?: S,
		strategyOptions?: S extends keyof StrategyOptions ? StrategyOptions[S] : never
	) {
		let strategyToRun: MessagePrompterBaseStrategy;

		if (message instanceof MessagePrompterBaseStrategy) {
			strategyToRun = message;
		} else {
			const mapStrategy = MessagePrompter.strategies.get(strategy ?? MessagePrompter.defaultStrategy);

			if (!mapStrategy) {
				throw new Error('No strategy provided');
			}

			strategyToRun = new mapStrategy(message, strategyOptions);
		}

		this.strategy = strategyToRun;
	}

	/**
	 * This executes the {@link MessagePrompter} and sends the message.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@linkplain https://discord.js.org/docs/packages/discord.js/main/CollectorFilter:TypeAlias CollectorFilter} predicate callback.
	 */
	public run<Filter extends S extends keyof StrategyFilters ? StrategyFilters[S] : unknown[]>(
		channel: MessagePrompterChannelTypes,
		authorOrFilter: User | CollectorFilter<Filter>
	): S extends keyof StrategyReturns ? Promise<StrategyReturns[S]> : never {
		return this.strategy.run(channel, authorOrFilter as User | CollectorFilter<unknown[]>) as S extends keyof StrategyReturns
			? Promise<StrategyReturns[S]>
			: never;
	}

	/**
	 * The available strategies
	 */
	public static strategies: Map<
		keyof StrategyReturns,
		Ctor<
			| ConstructorParameters<typeof MessagePrompterConfirmStrategy>
			| ConstructorParameters<typeof MessagePrompterNumberStrategy>
			| ConstructorParameters<typeof MessagePrompterReactionStrategy>
			| ConstructorParameters<typeof MessagePrompterMessageStrategy>,
			MessagePrompterConfirmStrategy | MessagePrompterNumberStrategy | MessagePrompterReactionStrategy | MessagePrompterMessageStrategy
		>
		// @ts-expect-error 2322
	> = new Map([
		['confirm', MessagePrompterConfirmStrategy],
		['number', MessagePrompterNumberStrategy],
		['reaction', MessagePrompterReactionStrategy],
		['message', MessagePrompterMessageStrategy]
	]);

	/**
	 * The default strategy to use
	 */
	public static defaultStrategy: keyof StrategyReturns = 'confirm';
}

import type { CollectorFilter, DMChannel, NewsChannel, TextChannel, User } from 'discord.js';
import { Constructor, MessagePrompterMessage, MessagePrompterStrategies } from './constants';
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

/**
 * This is a [[MessagePrompter]], a utility that sends a message, prompting for user input. The prompt can resolve to any kind of input.
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
 * [[MessagePrompter]] uses reactions to prompt for a yes/no answer and returns it.
 * You can modify the confirm and cancel reaction used for each message, or use the [[MessagePrompter.defaultPrompts]].
 * [[MessagePrompter.defaultPrompts]] is also static so you can modify these directly.
 *
 * @example
 * ```typescript
 * const handler = new MessagePrompter('Are you sure you want to continue?');
 * const result = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const handler = new MessagePrompter('Choose a number between 5 and 10?', 'number', {
 * 		start: 5,
 * 		end: 10
 * });
 * const result = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const handler = new MessagePrompter('Are you happy or sad?', 'reaction', {
 * 		reactions: ['🙂', '🙁']
 * });
 * const result = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const handler = new MessagePrompter('Do you love me?', 'message');
 * const result = await handler.run(channel, author);
 * ```
 */
export class MessagePrompter {
	/**
	 * The strategy used in [[MessagePrompter.run]]
	 */
	public strategy: MessagePrompterBaseStrategy;

	/**
	 * Constructor for the [[MessagePrompter]] class
	 * @param message The message to send.
	 * @param strategy The strategy name or Instance to use
	 * @param strategyOptions The options that are passed to the strategy
	 */
	public constructor(
		message: MessagePrompterMessage | MessagePrompterBaseStrategy,
		strategy?: MessagePrompterStrategies,
		strategyOptions?:
			| IMessagePrompterStrategyOptions
			| IMessagePrompterConfirmStrategyOptions
			| IMessagePrompterNumberStrategyOptions
			| IMessagePrompterReactionStrategyOptions
	) {
		let strategyToRun: MessagePrompterBaseStrategy | undefined = undefined;

		if (message instanceof MessagePrompterBaseStrategy) {
			strategyToRun = message as MessagePrompterBaseStrategy;
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
	 * This executes the [[MessagePrompter]] and sends the message.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 */
	public run(channel: TextChannel | NewsChannel | DMChannel, authorOrFilter: User | CollectorFilter) {
		return this.strategy.run(channel, authorOrFilter);
	}

	/**
	 * The available strategies
	 */
	public static strategies: Map<
		MessagePrompterStrategies,
		Constructor<
			| ConstructorParameters<typeof MessagePrompterConfirmStrategy>
			| ConstructorParameters<typeof MessagePrompterNumberStrategy>
			| ConstructorParameters<typeof MessagePrompterReactionStrategy>
			| ConstructorParameters<typeof MessagePrompterMessageStrategy>,
			MessagePrompterConfirmStrategy | MessagePrompterNumberStrategy | MessagePrompterReactionStrategy | MessagePrompterMessageStrategy
		>
		// @ts-expect-error 2322
	> = new Map([
		[MessagePrompterStrategies.Confirm, MessagePrompterConfirmStrategy],
		[MessagePrompterStrategies.Number, MessagePrompterNumberStrategy],
		[MessagePrompterStrategies.Reaction, MessagePrompterReactionStrategy],
		[MessagePrompterStrategies.Message, MessagePrompterMessageStrategy]
	]);

	/**
	 * The default strategy to use
	 */
	public static defaultStrategy: MessagePrompterStrategies = MessagePrompterStrategies.Confirm;
}

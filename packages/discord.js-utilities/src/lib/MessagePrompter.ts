import type {
	Message,
	User,
	TextChannel,
	NewsChannel,
	APIMessageContentResolvable,
	MessageOptions,
	MessageAdditions,
	DMChannel,
	CollectorFilter,
	EmojiIdentifierResolvable,
	MessageReaction,
	EmojiResolvable,
	GuildEmoji,
	ReactionEmoji
} from 'discord.js';

type Constructor<T> = new (...args: any[]) => T;
type Awaited<T> = PromiseLike<T> | T;

export abstract class MessagePrompterBaseStrategy {
	/**
	 * The type of strategy that was used
	 */
	public type: string;

	/**
	 * The timeout that was used in the collector
	 */
	public timeout: number;

	/**
	 * Wether to return an explicit object with data, or the strategies' default
	 */
	public explicitReturn: boolean;

	/**
	 * The message that has been sent in [[MessagePrompter.run]]
	 */
	public appliedMessage: Message | null = null;

	/**
	 * The message that will be sent in [[MessagePrompter.run]]
	 */
	public message: MessagePrompterMessage;

	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(type: string, options: IMessagePrompterStrategyOptions, message: MessagePrompterMessage) {
		this.type = type;
		this.timeout = options?.timeout ?? MessagePrompter.defaultStrategyOptions.timeout;
		this.explicitReturn = options?.explicitReturn ?? MessagePrompter.defaultStrategyOptions.explicitReturn;
		this.message = message;
	}

	public abstract run(channel: TextChannel | NewsChannel | DMChannel, authorOrFilter: User | CollectorFilter): Awaited<unknown>;

	protected async collectReactions(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter,
		reactions: string[] | EmojiIdentifierResolvable[]
	): Promise<IMessagePrompterExplicitReturnBase> {
		this.appliedMessage = await channel.send(this.message);

		const collector = this.appliedMessage.createReactionCollector(this.createReactionPromptFilter(reactions, authorOrFilter), {
			max: 1,
			time: this.timeout
		});

		let resolved = false;
		const collected: Promise<MessageReaction> = new Promise<MessageReaction>((resolve, reject) => {
			collector.on('collect', (r) => {
				resolve(r);
				resolved = true;
				collector.stop();
			});

			collector.on('end', (collected) => {
				resolved = true;
				if (!collected.size) reject(new Error('Collector has ended'));
			});
		});

		for (const reaction of reactions) {
			if (resolved) break;

			await this.appliedMessage.react(reaction);
		}

		const firstReaction = await collected;
		const emoji = firstReaction?.emoji;

		const reaction = reactions.find((r) => (emoji?.id ?? emoji?.name) === r);

		return {
			emoji,
			reaction,
			strategy: this,
			appliedMessage: this.appliedMessage,
			message: this.message
		};
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitReactions function
	 */
	protected createReactionPromptFilter(reactions: string[] | EmojiIdentifierResolvable[], authorOrFilter: User | CollectorFilter): CollectorFilter {
		return async (reaction: MessageReaction, user: User) =>
			reactions.includes(reaction.emoji.id ?? reaction.emoji.name) &&
			(typeof authorOrFilter === 'function' ? await authorOrFilter(reaction, user) : user.id === authorOrFilter.id) &&
			!user.bot;
	}
}

export class MessagePrompterConfirmStrategy extends MessagePrompterBaseStrategy {
	/**
	 * The cancel emoji used
	 */
	public confirmEmoji: string | EmojiResolvable;

	/**
	 * The confirm emoji used
	 */
	public cancelEmoji: string | EmojiResolvable;

	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param message The message to be sent [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterConfirmStrategyOptions) {
		super('confirm', options, message);

		this.confirmEmoji = options?.confirmEmoji ?? MessagePrompterConfirmStrategy.confirmEmoji;
		this.cancelEmoji = options?.cancelEmoji ?? MessagePrompterConfirmStrategy.cancelEmoji;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals confirm.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to a boolean denoting the value of the input (`true` for yes, `false` for no).
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitConfirmReturn | boolean> {
		const response = await this.collectReactions(channel, authorOrFilter, [this.confirmEmoji, this.cancelEmoji]);

		const confirmed = (response?.emoji?.id ?? response?.emoji?.name) === MessagePrompterConfirmStrategy.confirmEmoji;

		// prettier-ignore
		return this.explicitReturn ? { ...response, confirmed } : confirmed;
	}

	/**
	 * The default confirm emoji used for [[MessagePrompterConfirmStrategy]]
	 */
	public static confirmEmoji: string | EmojiResolvable = '🇾';

	/**
	 * The default cancel emoji used for [[MessagePrompterConfirmStrategy]]
	 */
	public static cancelEmoji: string | EmojiResolvable = '🇳';
}

export class MessagePrompterNumberStrategy extends MessagePrompterBaseStrategy implements IMessagePrompterNumberStrategyOptions {
	/**
	 * The available number emojis
	 */
	public numberEmojis: string[] | EmojiResolvable[];
	/**
	 * The available number emojis
	 */
	public start: number;
	/**
	 * The available number emojis
	 */
	public end: number;

	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterNumberStrategyOptions) {
		super('number', options, message);

		this.numberEmojis = options?.numberEmojis ?? MessagePrompterNumberStrategy.numberEmojis;
		this.start = options?.start ?? 0;
		this.end = options?.end ?? 10;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals number.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the selected number within the range.
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitNumberReturn | number> {
		// 0 and 10 are the maximum available emojis as a number
		if (this.start < 0) throw new TypeError('Starting number cannot be less than 0.');
		if (this.end > 10) throw new TypeError('Ending number cannot be more than 10.');

		const numbers = Array.from({ length: this.end - this.start + 1 }, (_, n: number) => n + this.start);
		const emojis = this.numberEmojis.slice(this.start, this.end);
		const response = await this.collectReactions(channel, authorOrFilter, emojis);

		const emojiIndex = emojis.findIndex((emoji) => (response?.emoji?.id ?? response?.emoji?.name) === emoji);
		const number = numbers[emojiIndex];

		// prettier-ignore
		return this.explicitReturn ? { ...response, number } : number;
	}

	/**
	 * The default available number emojis
	 */
	public static numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
}

export class MessagePrompterReactionStrategy extends MessagePrompterBaseStrategy {
	/**
	 * The emojis used
	 */
	public reactions: string[] | EmojiResolvable[];

	/**
	 * Constructor for the [[MessagePrompterReactionStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterReactionStrategyOptions) {
		super('reactions', options, message);

		this.reactions = options?.reactions;
	}

	/**
	 * This executes the [[MessagePrompterReactionStrategy]] and sends the message.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the reaction object.
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitReturnBase | string | EmojiResolvable> {
		if (!this.reactions?.length) throw new TypeError('There are no reactions provided.');

		const response = await this.collectReactions(channel, authorOrFilter, this.reactions);

		return this.explicitReturn ? response : response.reaction ?? response;
	}
}

export class MessagePrompterMessageStrategy extends MessagePrompterBaseStrategy {
	/**
	 * The emojis used
	 */
	public reactions: string[] | EmojiResolvable[];

	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterReactionStrategyOptions) {
		super('message', options, message);

		this.reactions = options?.reactions;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals message.
	 * The handler will wait for one (1) message.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the message object received.
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitMessageReturn | Message> {
		this.appliedMessage = await channel.send(this.message);

		const collector = await channel.awaitMessages(this.createMessagePromptFilter(authorOrFilter), {
			max: 1,
			time: this.timeout,
			errors: ['time']
		});
		const response = collector.first();

		if (!response) {
			throw new Error('No messages received');
		}

		return this.explicitReturn
			? {
					response,
					strategy: this as MessagePrompterBaseStrategy,
					appliedMessage: this.appliedMessage,
					message: this.message
			  }
			: response;
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitMessages function
	 */
	private createMessagePromptFilter(authorOrFilter: User | CollectorFilter): CollectorFilter {
		return async (message: Message) =>
			(typeof authorOrFilter === 'function' ? await authorOrFilter(message) : message.author.id === authorOrFilter.id) && !message.author.bot;
	}
}

/**
 * This is a [[MessagePrompter]], a utility that sends a message, prompting for user input. The promot can resolve to any kind of input.
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
	public constructor(message: MessagePrompterMessage | MessagePrompterBaseStrategy, strategy?: string, strategyOptions?: Record<string, unknown>) {
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
	// @ts-expect-error 2322
	public static strategies: Map<string, Constructor<MessagePrompterBaseStrategy>> = new Map([
		['confirm', MessagePrompterConfirmStrategy],
		['number', MessagePrompterNumberStrategy],
		['reaction', MessagePrompterReactionStrategy],
		['message', MessagePrompterMessageStrategy]
	]);

	/**
	 * The default strategy to use
	 */
	public static defaultStrategy = 'confirm';

	/**
	 * The default strategy options
	 */
	public static defaultStrategyOptions: IMessagePrompterStrategyOptions = {
		timeout: 10 * 1000,
		explicitReturn: false
	};
}

/**
 * A type to extend multiple discord types and simplify usage in [[MessagePrompter]]
 */
export type MessagePrompterMessage = APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions;

// #region strategy options
export interface IMessagePrompterStrategyOptions {
	timeout: number;
	explicitReturn: boolean;
}

export interface IMessagePrompterConfirmStrategyOptions extends IMessagePrompterStrategyOptions {
	confirmEmoji?: string | EmojiIdentifierResolvable;
	cancelEmoji?: string | EmojiIdentifierResolvable;
}

export interface IMessagePrompterNumberStrategyOptions extends IMessagePrompterStrategyOptions {
	start?: number;
	end?: number;
	numberEmojis?: string[] | EmojiIdentifierResolvable[];
}

export interface IMessagePrompterReactionStrategyOptions extends IMessagePrompterStrategyOptions {
	reactions: string[] | EmojiIdentifierResolvable[];
}
// #endregion

// #region explicit returns
export interface IMessagePrompterExplicitReturnBase {
	emoji?: GuildEmoji | ReactionEmoji;
	reaction?: string | EmojiIdentifierResolvable;
	strategy: MessagePrompterBaseStrategy;
	appliedMessage: Message;
	message: MessagePrompterMessage;
}

export interface IMessagePrompterExplicitConfirmReturn extends IMessagePrompterExplicitReturnBase {
	confirmed: boolean;
}

export interface IMessagePrompterExplicitNumberReturn extends IMessagePrompterExplicitReturnBase {
	number: number;
}

export interface IMessagePrompterExplicitMessageReturn extends IMessagePrompterExplicitReturnBase {
	response?: Message;
}
// #endregion

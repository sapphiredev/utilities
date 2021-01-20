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

/**
 * This is a [[MessagePrompter]], a utility that sends a prompt message that can resolve any kind of input.
 * There are several specifiable types to prompt for user input, and they are as follows:
 * - Confirm
 *   This will send a simple Yes/No prompt, using reactions.
 * - Number
 *   This will prompt for an integer. You can specify a range, however by default it will use 0 - 10.
 * - Reactions
 *   This can be any kind of reaction emoji Discord supports and as many as you want. This type will return that reaction instead of a boolean.
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
 * const confirmed = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const handler = new MessagePrompter('Choose a number between 5 and 10?', {
 * 		type: 'number',
 * 		reactions: {
 * 			start: 5,
 * 			end: 10
 * 		}
 * });
 * const confirmed = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const handler = new MessagePrompter('Are you happy or sad?', {
 * 		type: 'reaction',
 * 		reactions: ['🙂', '🙁']
 * });
 * const confirmed = await handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const handler = new MessagePrompter('Do you love me?', 'message');
 * const confirmed = await handler.run(channel, author);
 * ```
 */
export class MessagePrompter {
	/**
	 * The message that will been sent in [[MessagePrompter.run]]
	 */
	public message: IMessagePrompterMessage;

	/**
	 * The message that has been sent in [[MessagePrompter.run]]
	 */
	public appliedMessage: Message | null = null;

	/**
	 * The used options for this instance of [[MessagePrompter]]
	 */
	public options: IMessagePrompterOptions;

	/**
	 * The default options used if there is no type supplied.
	 */
	private defaultOptions: IMessagePrompterOptions = {
		type: 'confirm',
		reactions: {
			confirm: '🇾',
			cancel: '🇳'
		},
		timeout: 20 * 1000,
		explicitReturn: false
	};

	/**
	 * Constructor for the [[MessagePrompter]] class
	 * @param message The message to send.
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: IMessagePrompterMessage, options?: Partial<IMessagePrompterOptions> | IMessagePrompterOptionsType) {
		this.message = message;
		const type: IMessagePrompterOptionsType = typeof options === 'string' ? options : options?.type ?? 'confirm';

		this.options = {
			...this.defaultOptions,
			...(MessagePrompter.defaultOptions.get(type) ?? {}),
			...((typeof options !== 'string' && options) ?? {})
		};
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message.
	 * @param channel The channel to use.
	 * @param authorOrFilter The author to validate.
	 */
	public run(channel: TextChannel | NewsChannel | DMChannel, authorOrFilter: User | CollectorFilter): Promise<IMessagePrompterReturn> {
		switch (this.options.type) {
			case 'confirm':
				return this.runConfirm(channel, authorOrFilter);
			case 'number':
				return this.runNumber(channel, authorOrFilter);
			case 'reaction':
				return this.runReaction(channel, authorOrFilter);
			case 'message':
				return this.runMessage(channel, authorOrFilter);
		}
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals confirm.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a [CollectorFilter](https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter) predicate callback.
	 * @returns A promise that resolves to a boolean denoting the truth value of the input (`true` for yes, `false` for no).
	 */
	public async runConfirm(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitReturn | boolean> {
		const { reactions, timeout, explicitReturn } = this.options;
		const { confirm, cancel } = reactions as IMessagePrompterOptionsConfirm;

		const confirmReactions: string[] | EmojiIdentifierResolvable[] = [confirm, cancel];
		const response = await this.collectReactions(channel, authorOrFilter, confirmReactions, timeout);

		const confirmed = (response?.emoji?.id ?? response?.emoji?.name) === confirm;

		// prettier-ignore
		return explicitReturn ? { ...response, confirmed } : confirmed;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals number.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter The author to validate.
	 * @returns A promise that resolves to the selected number within the range.
	 */
	public async runNumber(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitReturn | number> {
		const { reactions, timeout, explicitReturn } = this.options;
		const { start, end } = reactions as IMessagePrompterOptionsNumber;

		// 0 and 10 are the maximum available emojis as a number
		if (start < 0) throw new TypeError('Starting number cannot be less than 0.');
		if (end > 10) throw new TypeError('Ending number cannot be more than 10.');

		const numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

		const numbers = Array.from({ length: end - start + 1 }, (_, n: number) => n + start);
		const emojis = numbers.map((number) => numberEmojis[number]);
		const response = await this.collectReactions(channel, authorOrFilter, emojis, timeout);

		const emojiIndex = emojis.findIndex((emoji) => (response?.emoji?.id ?? response?.emoji?.name) === emoji);
		const number = numbers[emojiIndex];

		// prettier-ignore
		return explicitReturn ? { ...response, number } : number;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals reaction.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter The author to validate.
	 * @returns A promise that resolves to the reaction object.
	 */
	public async runReaction(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitReturn | string | EmojiResolvable> {
		const { timeout, explicitReturn } = this.options;
		const reactions = this.options.reactions as IMessagePrompterOptionsReaction;

		if (!reactions?.length) throw new TypeError('There are no reactions provided.');

		const response = await this.collectReactions(channel, authorOrFilter, reactions, timeout);

		return explicitReturn ? response : response.reaction ?? response;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals message.
	 * The handler will wait for one (1) message.
	 * @param channel The channel to use.
	 * @param authorOrFilter The author to validate.
	 * @returns A promise that resolves to the message object received.
	 */
	public async runMessage(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitReturn | Message> {
		const { timeout, explicitReturn } = this.options;
		this.appliedMessage = await channel.send(this.message);

		const collector = await channel.awaitMessages(this.createMessagePromptFilter(authorOrFilter), {
			max: 1,
			time: timeout,
			errors: ['time']
		});
		const response = collector.first();

		if (!response) {
			throw new Error('No messages received');
		}

		return explicitReturn
			? {
					response,
					options: this.options,
					appliedMessage: this.appliedMessage,
					message: this.message
			  }
			: response;
	}

	private async collectReactions(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter,
		reactions: string[] | EmojiIdentifierResolvable[],
		timeout: number
	): Promise<IMessagePrompterExplicitReturn> {
		this.appliedMessage = await channel.send(this.message);

		const collector = this.appliedMessage.createReactionCollector(this.createReactionPromptFilter(reactions, authorOrFilter), {
			max: 1,
			time: timeout
		});

		let resolved = false;
		const collected: Promise<MessageReaction> = new Promise((resolve) =>
			collector.on('collect', (r) => {
				resolve(r);
				resolved = true;
				collector.stop();
			})
		);

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
			options: this.options,
			appliedMessage: this.appliedMessage,
			message: this.message
		};
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitReactions function
	 */
	private createReactionPromptFilter(reactions: string[] | EmojiIdentifierResolvable[], authorOrFilter: User | CollectorFilter): CollectorFilter {
		return async (reaction: MessageReaction, user: User) =>
			reactions.includes(reaction.emoji.id ?? reaction.emoji.name) &&
			(typeof authorOrFilter === 'function' ? await authorOrFilter(reaction, user) : user.id === authorOrFilter.id) &&
			!user.bot;
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitMessages function
	 */
	private createMessagePromptFilter(authorOrFilter: User | CollectorFilter): CollectorFilter {
		return async (message: Message) =>
			(typeof authorOrFilter === 'function' ? await authorOrFilter(message) : message.author.id === authorOrFilter.id) && !message.author.bot;
	}

	/**
	 * The default options of this handler per type.
	 * Default is always used, and overriden later.
	 */
	public static defaultOptions: Map<IMessagePrompterOptionsType, Partial<IMessagePrompterOptions>> = new Map([
		[
			'confirm',
			{
				type: 'confirm',
				reactions: {
					confirm: '🇾',
					cancel: '🇳'
				}
			}
		],
		[
			'number',
			{
				type: 'number',
				reactions: {
					start: 0,
					end: 10
				}
			}
		],
		[
			'reaction',
			{
				type: 'reaction'
			}
		],
		[
			'message',
			{
				type: 'message'
			}
		]
	]);
}

/**
 * A type to extend multiple discord types and simplify usage in [[MessagePrompter]]
 */
export type IMessagePrompterMessage = APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions;

/**
 * A type to extend multiple types and simplify the return in [[MessagePrompter.run]]
 */
export type IMessagePrompterReturn = IMessagePrompterExplicitReturn | boolean | number | string | EmojiResolvable | Message;

/**
 * The return object of [[MessagePrompter.run]] if [[IMessagePrompterOptions.explicitReturn]] equals true
 */
export interface IMessagePrompterExplicitReturn {
	confirmed?: boolean;
	number?: number;
	reaction?: string | EmojiResolvable;
	response?: Message;
	emoji?: GuildEmoji | ReactionEmoji;
	options: IMessagePrompterOptions;
	appliedMessage: Message;
	message: IMessagePrompterMessage;
}

/**
 * The type options for [[IMessagePrompterOptions]]
 */
export type IMessagePrompterOptionsType = 'confirm' | 'number' | 'reaction' | 'message';

/**
 * The reaction options if [[IMessagePrompterOptions.type]] equals confirm
 */
export interface IMessagePrompterOptionsConfirm {
	confirm: string | EmojiIdentifierResolvable;
	cancel: string | EmojiIdentifierResolvable;
}

/**
 * The reaction options if [[IMessagePrompterOptions.type]] equals number
 */
export interface IMessagePrompterOptionsNumber {
	start: number;
	end: number;
}

/**
 * The reaction options if [[IMessagePrompterOptions.type]] equals reaction
 */
type IMessagePrompterOptionsReaction = string[] | EmojiIdentifierResolvable[];

/**
 * The options received by [[MessagePrompter.defaultOptions]] or [[MessagePrompter.constructor]]
 */
export interface IMessagePrompterOptions {
	type: IMessagePrompterOptionsType;
	reactions: IMessagePrompterOptionsConfirm | IMessagePrompterOptionsNumber | IMessagePrompterOptionsReaction;
	timeout: number;
	explicitReturn: boolean;
}

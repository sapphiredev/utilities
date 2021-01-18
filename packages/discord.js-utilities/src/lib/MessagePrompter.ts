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
 * This is a [[MessagePrompter]], a utility to send a message with Yes/No promt.
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
	public response: Message | null = null;

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
			...(MessagePrompter.defaultOptions[type] ?? {}),
			...((typeof options !== 'string' && options) ?? {})
		};
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message.
	 * @param channel The channel to use.
	 * @param author The author to validate.
	 */
	public run(channel: TextChannel | NewsChannel | DMChannel, author: User): Promise<IMessagePrompterReturn> {
		if (!channel) throw new TypeError('There is no channel provided.');
		if (!author) throw new TypeError('There is no author provided.');
		if (!this.message) throw new TypeError('There is no messages provided.');

		const { type } = this.options;
		switch (type) {
			case 'confirm':
				return this.runConfirm(channel, author);
			case 'number':
				return this.runNumber(channel, author);
			case 'reaction':
				return this.runReaction(channel, author);
			case 'message':
				return this.runMessage(channel, author);
		}
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals confirm.
	 * The handler will start collecting 1 reaction and return a boolean corresponding the prompt.
	 * @param channel The channel to use.
	 * @param author The author to validate.
	 */
	public async runConfirm(channel: TextChannel | NewsChannel | DMChannel, author: User): Promise<IMessagePrompterExplicitReturn | boolean> {
		const { reactions, timeout, explicitReturn } = this.options;
		const { confirm, cancel } = reactions as IMessagePrompterOptionsConfirm;

		const confirmReactions: string[] | EmojiIdentifierResolvable[] = [confirm, cancel];
		const response = await this.collecReactions(channel, author, confirmReactions, timeout);

		const confirmed = (response?.emoji?.id ?? response?.emoji?.name) === confirm;

		return explicitReturn
			? {
					...response,
					confirmed
			  }
			: confirmed;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals number.
	 * The handler will start collecting 1 reaction and return a number corresponding the prompt.
	 * @param channel The channel to use.
	 * @param author The author to validate.
	 */
	public async runNumber(channel: TextChannel | NewsChannel | DMChannel, author: User): Promise<IMessagePrompterExplicitReturn | number> {
		const { reactions, timeout, explicitReturn } = this.options;
		const { start, end } = reactions as IMessagePrompterOptionsNumber;

		// 0 and 10 are the maximum available emojis as a number
		if (start < 0) throw new TypeError('Starting number cannot be less than 0.');
		if (end > 10) throw new TypeError('Ending number cannot be more than 10.');

		const numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

		const numbers = Array.from({ length: end - start + 1 }, (_, n: number) => n + start);
		const emojis = numbers.map((number) => numberEmojis[number]);
		const response = await this.collecReactions(channel, author, emojis, timeout);

		const emojiIndex = emojis.findIndex((emoji) => (response?.emoji?.id ?? response?.emoji?.name) === emoji);
		const number = numbers[emojiIndex];

		return explicitReturn
			? {
					...response,
					number
			  }
			: number;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals number.
	 * The handler will start collecting 1 reaction and return a number corresponding the prompt.
	 * @param channel The channel to use.
	 * @param author The author to validate.
	 */
	public async runReaction(
		channel: TextChannel | NewsChannel | DMChannel,
		author: User
	): Promise<IMessagePrompterExplicitReturn | string | EmojiResolvable> {
		const { timeout, explicitReturn } = this.options;
		const reactions = this.options.reactions as IMessagePrompterOptionsReaction;

		if (!reactions?.length) throw new TypeError('There are no reactions provided.');

		const response = await this.collecReactions(channel, author, reactions, timeout);

		return explicitReturn ? response : response.reaction ?? response;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals message.
	 * The handler will start collecting 1 message and return that message.
	 * @param channel The channel to use.
	 * @param author The author to validate.
	 */
	public async runMessage(channel: TextChannel | NewsChannel | DMChannel, author: User): Promise<IMessagePrompterExplicitReturn | Message> {
		const { timeout, explicitReturn } = this.options;
		this.response = await channel.send(this.message);

		const collector = await channel.awaitMessages((message: Message) => message.author.id === author.id && !message.author.bot, {
			max: 1,
			time: timeout,
			errors: ['time']
		});
		const reply = collector.first();

		if (reply === undefined || reply === null) {
			throw new Error('No messages received');
		}

		return explicitReturn
			? {
					reply,
					options: this.options,
					response: this.response,
					message: this.message
			  }
			: reply;
	}

	private async collecReactions(
		channel: TextChannel | NewsChannel | DMChannel,
		author: User,
		reactions: string[] | EmojiIdentifierResolvable[],
		timeout: number
	): Promise<IMessagePrompterExplicitReturn> {
		this.response = await channel.send(this.message);

		const collector = this.response.createReactionCollector(this.createPromptFilter(reactions, author), {
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

			await this.response.react(reaction);
		}

		const firstReaction = await collected;
		const emoji = firstReaction?.emoji;

		const reaction = reactions.find((r) => (firstReaction?.emoji?.id ?? firstReaction?.emoji?.name) === r);

		return {
			emoji,
			reaction,
			options: this.options,
			response: this.response,
			message: this.message
		};
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitReactions function
	 */
	private createPromptFilter(reactions: string[] | EmojiIdentifierResolvable[], author: User): CollectorFilter {
		return (reaction: MessageReaction, user: User) =>
			reactions.includes(reaction.emoji.id ?? reaction.emoji.name) && user.id === author.id && !user.bot;
	}

	/**
	 * The default options of this handler per type.
	 * Default is always used, and overriden later.
	 */
	public static defaultOptions: {
		[type in IMessagePrompterOptionsType]: Partial<IMessagePrompterOptions>;
	} = {
		confirm: {
			type: 'confirm',
			reactions: {
				confirm: '🇾',
				cancel: '🇳'
			}
		},
		number: {
			type: 'number',
			reactions: {
				start: 0,
				end: 10
			}
		},
		reaction: {
			type: 'reaction'
		},
		message: {
			type: 'message'
		}
	};
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
	reply?: Message;
	emoji?: GuildEmoji | ReactionEmoji;
	options: IMessagePrompterOptions;
	response: Message;
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

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
	MessageReaction
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
 * const handler = new MessagePrompter('Are you happy or sad?', {
 * 		confirm: '🙂',
 *		cancel: '🙁'
 * });
 * const confirmed = await handler.run(channel, author);
 * ```
 */
export class MessagePrompter {
	/**
	 * The message that will been sent in [[MessagePrompter.run]]
	 */
	public message: IMessagePrompter | null = null;

	/**
	 * The message that has been sent in [[MessagePrompter.run]]
	 */
	public sentMessage: Message | null = null;

	/**
	 * The used options for this instance of [[MessagePrompter]]
	 */
	public options: IMessagePrompterOptions;

	/**
	 * Constructor for the [[MessagePrompter]] class
	 * @param message The message to send.
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: IMessagePrompter, options?: Partial<IMessagePrompterOptions>) {
		this.message = message;
		this.options = {
			...MessagePrompter.defaultOptions,
			...(options ?? {})
		};
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message.
	 * The handler will start collecting 1 reaction and return a boolean corresponding the prompt.
	 * @param channel The channel to use.
	 * @param author The author to validate.
	 */
	public async run(channel: TextChannel | NewsChannel | DMChannel, author: User): Promise<IMessagePrompterExplicitReturn | boolean> {
		const { confirm, cancel, timeout, explicitReturn } = this.options;

		if (!channel) throw new SyntaxError('There is no channel provided.');
		if (!author) throw new SyntaxError('There is no author provided.');
		if (!this.message) throw new SyntaxError('There is no messages provided.');

		this.sentMessage = await channel.send(this.message);
		await this.sentMessage.react(confirm);
		await this.sentMessage.react(cancel);

		const collector = await this.sentMessage.awaitReactions(this.createPromptFilter(confirm, cancel, author), {
			max: 1,
			time: timeout,
			errors: ['time']
		});

		const reaction = collector.first();
		const confirmed = (reaction?.emoji?.id ?? reaction?.emoji?.name) === confirm;

		return explicitReturn
			? {
					reaction,
					confirmed,
					options: this.options,
					sentMessage: this.sentMessage,
					message: this.message
			  }
			: confirmed;
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitReactions function
	 */
	private createPromptFilter(
		confirm: string | EmojiIdentifierResolvable,
		cancel: string | EmojiIdentifierResolvable,
		author: User
	): CollectorFilter {
		return (reaction: MessageReaction, user: User) =>
			[confirm, cancel].includes(reaction.emoji.id ?? reaction.emoji.name) && user.id === author.id && !user.bot;
	}

	/**
	 * The default options of this handler.
	 */
	public static defaultOptions: IMessagePrompterOptions = {
		confirm: '🇾',
		cancel: '🇳',
		timeout: 20 * 1000,
		explicitReturn: false
	};
}

/**
 * A type to extend multiple discord types and simplify usage in [[MessagePrompter]]
 */
export type IMessagePrompter = APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions;

export interface IMessagePrompterExplicitReturn {
	reaction?: MessageReaction;
	confirmed: boolean;
	options: IMessagePrompterOptions;
	sentMessage: Message;
	message: IMessagePrompter;
}

/**
 * The options received by [[MessagePrompter.defaultOptions]] or [[MessagePrompter.constructor]]
 */
export interface IMessagePrompterOptions {
	confirm: string | EmojiIdentifierResolvable;
	cancel: string | EmojiIdentifierResolvable;
	timeout: number;
	explicitReturn: boolean;
}

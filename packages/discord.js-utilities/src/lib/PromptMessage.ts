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
 * This is a [[PromptMessage]], a utility to send a message with Yes/No promt.
 * You must either use this class directly or extend it.
 *
 * [[PromptMessage]] uses actions, these are essentially reaction emojis, when triggered run the said action.
 * You can utilize your own actions, or you can use the [[PromptMessage.defaultPrompts]].
 * [[PromptMessage.defaultPrompts]] is also static so you can modify these directly.
 *
 * @example
 * ```typescript
 * const handler = new PromptMessage('Are you sure you want to continue?');
 * const confirmed = handler.run(channel, author);
 * ```
 *
 * @example
 * ```typescript
 * const handler = new PromptMessage('Are you happy or sad?', {
 * 		confirm: '🙂',
 *		cancel: '🙁'
 * });
 * const confirmed = handler.run(channel, author);
 * ```
 *
 */
export class PromptMessage {
	/**
	 * The message that has been sent in [[PromptMessage.run]]
	 */
	public message: IPromptMessage | null = null;

	/**
	 * The message that has been sent in [[PromptMessage.run]]
	 */
	public sentMessage: Message | null = null;

	/**
	 * The used options for this instance of [[PromptMessage]]
	 */
	public options: IPromptMessageOptions;

	/**
	 * Constructor for the [[PromptMessage]] class
	 * @param message The message to send.
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: IPromptMessage, options?: Partial<IPromptMessageOptions>) {
		this.message = message;
		this.options = {
			...PromptMessage.defaultOptions,
			...(options ?? {})
		};
	}

	/**
	 * This executes the [[PromptMessage]] and sends the message.
	 * The handler will start collecting 1 reaction and return a boolean corresponding the prompt.
	 * @param channel The channel to use.
	 * @param author The author to validate.
	 */
	public async run(channel: TextChannel | NewsChannel | DMChannel, author: User): Promise<IPromptMessageExplicitReturn | boolean> {
		const { confirm, cancel, timeout, explicitReturn } = this.options;

		if (!channel) throw new SyntaxError('There is no channel provided.');
		if (!author) throw new SyntaxError('There is no author provided.');
		if (!this.message) throw new SyntaxError('There is no messages.');

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
	public static defaultOptions: IPromptMessageOptions = {
		confirm: '🇾',
		cancel: '🇳',
		timeout: 20 * 1000,
		explicitReturn: false
	};
}

/**
 * A type to extend multiple discord types and simplify usage in [[PromptMessage]]
 */
export type IPromptMessage = APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions;

export interface IPromptMessageExplicitReturn {
	reaction: MessageReaction | undefined;
	confirmed: boolean;
	options: IPromptMessageOptions;
	sentMessage: Message;
	message: IPromptMessage;
}

/**
 * The options received by [[PromptMessage.defaultOptions]] or [[PromptMessage.constructor]]
 */
export interface IPromptMessageOptions {
	confirm: string | EmojiIdentifierResolvable;
	cancel: string | EmojiIdentifierResolvable;
	timeout: number;
	explicitReturn: boolean;
}

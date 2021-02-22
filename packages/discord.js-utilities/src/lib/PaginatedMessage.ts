import { APIMessage, Message, MessageOptions, MessageReaction, NewsChannel, ReactionCollector, TextChannel, User } from 'discord.js';

/**
 * This is a [[PaginatedMessage]], a utility to paginate messages (usually embeds).
 * You must either use this class directly or extend it.
 *
 * [[PaginatedMessage]] uses actions, these are essentially reaction emojis, when triggered run the said action.
 * You can utilize your own actions, or you can use the [[PaginatedMessage.defaultActions]].
 * [[PaginatedMessage.defaultActions]] is also static so you can modify these directly.
 *
 * [[PaginatedMessage]] also uses pages, these are simply {@link https://discord.js.org/#/docs/main/stable/class/APIMessage APIMessages}.
 *
 * @example
 * ```typescript
 * const handler = new PaginatedMessage();
 * ```
 *
 * @example
 * ```typescript
 * // To utilize actions you can use the IPaginatedMessageAction by implementing it into a class.
 * // [[PaginatedMessage]] requires you to have the class initialized using `new`.
 *
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
 * const StopAction: IPaginatedMessageAction = {
 *   id: '⏹️',
 *   disableResponseEdit: true,
 *   run: ({ response, collector }) => {
 *     await response.reactions.removeAll();
 *     collector!.stop();
 *   }
 * }```
 *
 */
export class PaginatedMessage {
	/**
	 * The pages to be converted to [[PaginatedMessage.messages]]
	 */
	public pages: MessagePage[];

	/**
	 * The response message used to edit on page changes.
	 */
	public response: Message | null = null;

	/**
	 * The collector used for handling reactions.
	 */
	public collector: ReactionCollector | null = null;

	/**
	 * The pages which were converted from [[PaginatedMessage.pages]]
	 */
	public messages: (APIMessage | null)[] = [];

	/**
	 * The actions which are to be used.
	 */
	public actions = new Map<string, IPaginatedMessageAction>();

	/**
	 * The handler's current page/message index.
	 */
	public index = 0;

	/**
	 * The amount of time to idle before the paginator is closed. Defaults to `20 * 1000`.
	 */
	public idle = 20 * 1000;

	/**
	 * Constructor for the [[PaginatedMessage]] class
	 * @param __namedParameters The [[PaginatedMessageOptions]] for this instance of the [[PaginatedMessage]] class
	 */
	public constructor({ pages, actions }: PaginatedMessageOptions = {}) {
		this.pages = pages ?? [];

		for (const page of this.pages) this.messages.push(page instanceof APIMessage ? page : null);
		for (const action of actions ?? this.constructor.defaultActions) this.actions.set(action.id, action);
	}

	/**
	 * Sets the handler's current page/message index.
	 * @param index The number to set the index to.
	 */
	public setIndex(index: number): this {
		this.index = index;
		return this;
	}

	/**
	 * Sets the amount of time to idle before the paginator is closed.
	 * @param idle The number to set the idle to.
	 */
	public setIdle(idle: number): this {
		this.idle = idle;
		return this;
	}

	/**
	 * Clears all current actions and sets them. The order given is the order they will be used.
	 * @param actions The actions to set.
	 */
	public setActions(actions: IPaginatedMessageAction[]): this {
		this.actions.clear();
		return this.addActions(actions);
	}

	/**
	 * Adds actions to the existing ones. The order given is the order they will be used.
	 * @param actions The actions to add.
	 */
	public addActions(actions: IPaginatedMessageAction[]): this {
		for (const action of actions) this.addAction(action);
		return this;
	}

	/**
	 * Adds an action to the existing ones. This will be added as the last action.
	 * @param action The action to add.
	 */
	public addAction(action: IPaginatedMessageAction): this {
		this.actions.set(action.id, action);
		return this;
	}

	/**
	 * Checks whether or not the handler has a specific page.
	 * @param index The index to check.
	 */
	public hasPage(index: number): boolean {
		return index >= 0 && index < this.pages.length;
	}

	/**
	 * Clears all current pages and messages and sets them. The order given is the order they will be used.
	 * @param pages The pages to set.
	 */
	public setPages(pages: MessagePage[]) {
		this.pages = [];
		this.messages = [];
		this.addPages(pages);
		return this;
	}

	/**
	 * Adds a page to the existing ones. This will be added as the last page.
	 * @param page The page to add.
	 */
	public addPage(page: MessagePage): this {
		this.pages.push(page);
		this.messages.push(page instanceof APIMessage ? page : null);
		return this;
	}

	/**
	 * Add pages to the existing ones. The order given is the order they will be used.
	 * @param pages The pages to add.
	 */
	public addPages(pages: MessagePage[]): this {
		for (const page of pages) this.addPage(page);
		return this;
	}

	/**
	 * Executes the [[PaginatedMessage]] and sends the pages corresponding with [[PaginatedMessage.index]].
	 * The handler will start collecting reactions and running actions once all actions have been reacted to the message.
	 * @param author The author to validate.
	 * @param channel The channel to use.
	 */
	public async run(author: User, channel: TextChannel | NewsChannel): Promise<this> {
		await this.resolvePagesOnRun(channel);

		// Sanity checks to handle
		if (!this.messages.length) throw new Error('There are no messages.');
		if (!this.actions.size) throw new Error('There are no messages.');

		await this.setUpMessage(channel, author);
		await this.setUpReactions(channel, author);
		return this;
	}

	/**
	 * Executed whenever [[PaginatedMessage.run]] is called.
	 */
	public async resolvePagesOnRun(channel: TextChannel | NewsChannel): Promise<void> {
		for (let i = 0; i < this.pages.length; i++) await this.resolvePage(channel, i);
	}

	/**
	 * Executed whenever an action is triggered and resolved.
	 * @param index The index to resolve.
	 */
	public async resolvePage(channel: TextChannel | NewsChannel, index: number): Promise<APIMessage> {
		// If the message was already processed, do not load it again:
		const message = this.messages[index];
		if (message !== null) return message;

		// Load the page and return it:
		const resolved = await this.handlePageLoad(this.pages[index], channel, index);
		this.messages[index] = resolved;

		return resolved;
	}

	/**
	 * Clones the current handler into a new instance.
	 */
	public clone(): PaginatedMessage {
		const clone = new this.constructor({ pages: this.pages, actions: [] }).setIndex(this.index).setIdle(this.idle);
		clone.actions = this.actions;
		clone.response = this.response;
		return clone;
	}

	/**
	 * Sets up the message.
	 * @param channel The channel the handler is running at.
	 * @param author The author the handler is for.
	 */
	protected async setUpMessage(channel: TextChannel | NewsChannel, author: User): Promise<void>;
	protected async setUpMessage(channel: TextChannel | NewsChannel): Promise<void> {
		const firstPage = this.messages[this.index]!;
		if (this.response) await this.response.edit(firstPage);
		else this.response = (await channel.send(firstPage)) as Message;
	}

	/**
	 * Sets up the message's reactions and the collector.
	 * @param channel The channel the handler is running at.
	 * @param author The author the handler is for.
	 */
	protected async setUpReactions(channel: TextChannel | NewsChannel, author: User): Promise<void> {
		this.collector = this.response!.createReactionCollector(
			(reaction: MessageReaction, user: User) =>
				user.id === author.id && (this.actions.has(reaction.emoji.identifier) || this.actions.has(reaction.emoji.name)),
			{ idle: this.idle }
		)
			.on('collect', this.handleCollect.bind(this, author, channel))
			.on('end', this.handleEnd.bind(this));

		for (const id of this.actions.keys()) {
			if (this.collector.ended) break;
			await this.response!.react(id);
		}
	}

	/**
	 * Handles the load of a page.
	 * @param page The page to be loaded.
	 * @param channel The channel the paginated message runs at.
	 * @param index The index of the current page.
	 */
	protected async handlePageLoad(page: MessagePage, channel: TextChannel | NewsChannel, index: number): Promise<APIMessage> {
		const options = typeof page === 'function' ? await page(index, this.pages, this) : page;
		return (options instanceof APIMessage ? options : new APIMessage(channel, options)).resolveData();
	}

	/**
	 * Handles the `collect` event from the collector.
	 * @param author The the handler is for.
	 * @param channel The channel the handler is running at.
	 * @param reaction The reaction that was received.
	 * @param user The user that reacted to the message.
	 */
	protected async handleCollect(author: User, channel: TextChannel | NewsChannel, reaction: MessageReaction, user: User): Promise<void> {
		await reaction.users.remove(user);

		const action = (this.actions.get(reaction.emoji.identifier) ?? this.actions.get(reaction.emoji.name))!;
		const previousIndex = this.index;

		await action.run({
			handler: this,
			author,
			channel,
			response: this.response!,
			collector: this.collector!
		});

		if (previousIndex !== this.index) {
			await this.response?.edit(await this.resolvePage(channel, this.index));
		}
	}

	/**
	 * Handles the `end` event from the collector.
	 * @param reason The reason for which the collector was ended.
	 */
	protected async handleEnd(reason: string): Promise<void> {
		// Remove all listeners from the collector:
		this.collector?.removeAllListeners();

		// Do not remove reactions if the message, channel, or guild, was deleted:
		if (this.response && !PaginatedMessage.deletionStopReasons.includes(reason)) {
			await this.response.reactions.removeAll();
		}
	}

	/**
	 * The default actions of this handler.
	 */
	public static defaultActions: IPaginatedMessageAction[] = [
		{
			id: '🔢',
			run: async ({ handler, author, channel }) => {
				const questionMessage = await channel.send('What page would you like to jump to?');
				const collected = await channel
					.awaitMessages((message: Message) => message.author.id === author.id, { max: 1, idle: 15 * 1000 })
					.catch(() => null);

				if (collected) {
					const responseMessage = collected.first();

					if (questionMessage.deletable) await questionMessage.delete();
					if (responseMessage) {
						if (responseMessage.deletable) await responseMessage.delete();

						const i = Number(responseMessage.content) - 1;

						if (!Number.isNaN(i) && handler.hasPage(i)) handler.index = i;
					}
				}
			}
		},
		{
			id: '⏪',
			run: ({ handler }) => (handler.index = 0)
		},
		{
			id: '◀️',
			run: ({ handler }) => {
				if (handler.index === 0) handler.index = handler.pages.length - 1;
				else --handler.index;
			}
		},
		{
			id: '▶️',
			run: ({ handler }) => {
				if (handler.index === handler.pages.length - 1) handler.index = 0;
				else ++handler.index;
			}
		},
		{
			id: '⏩',
			run: ({ handler }) => (handler.index = handler.pages.length - 1)
		},
		{
			id: '⏹️',
			run: async ({ response, collector }) => {
				await response.reactions.removeAll();
				collector.stop();
			}
		}
	];

	/**
	 * The reasons sent by {@link https://discord.js.org/#/docs/main/stable/class/ReactionCollector?scrollTo=e-end ReactionCollector#end}
	 * event when the message (or its owner) has been deleted.
	 */
	public static deletionStopReasons = ['messageDelete', 'channelDelete', 'guildDelete'];
}

export interface PaginatedMessage {
	constructor: typeof PaginatedMessage;
}

/**
 * @example
 * ```typescript
 * // To utilize actions you can use the [[IPaginatedMessageAction]] by implementing it into a class.
 *
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
 *   id: '⏹️',
 *   disableResponseEdit: true,
 *   run: ({ response, collector }) => {
 *     await response.reactions.removeAll();
 *     collector!.stop();
 *   }
 * }```
 */
export interface IPaginatedMessageAction {
	id: string;
	run(context: PaginatedMessageActionContext): Awaited<unknown>;
}

/**
 * The context to be used in [[IPaginatedMessageAction]].
 */
export interface PaginatedMessageActionContext {
	handler: PaginatedMessage;
	author: User;
	channel: TextChannel | NewsChannel;
	response: Message;
	collector: ReactionCollector;
}

export interface PaginatedMessageOptions {
	pages?: MessagePage[];
	actions?: IPaginatedMessageAction[];
}

/**
 * The pages that are used for [[PaginatedMessage.pages]]
 *
 * Pages can be either an {@link https://discord.js.org/#/docs/main/stable/class/APIMessage APIMessage} directly,
 * or an awaited function which returns an {@link https://discord.js.org/#/docs/main/stable/class/APIMessage APIMessage}.
 *
 * Furthermore, {@link https://discord.js.org/#/docs/main/stable/typedef/MessageOptions MessageOptions} can be used to
 * construct the pages without state, this library also provides [[MessageBuilder]], which can be used as a chainable
 * alternative to raw objects, similar to how {@link https://discord.js.org/#/docs/main/stable/class/MessageEmbed MessageEmbed}
 * works.
 *
 * @example
 * ```typescript
 * // Direct usage as a MessageBuilder
 * new MessageBuilder().setContent('Test content!');
 * ```
 *
 * @example
 * ```typescript
 * // An awaited function. This function also passes index, pages, and handler.
 * (index, pages) =>
 *   new MessageBuilder().setEmbed(
 *     new MessageEmbed().setFooter(`Page ${index + 1} / ${pages.length}`)
 *   );
 * ```
 *
 * @example
 * ```typescript
 * // Direct usage as an APIMessage
 * new APIMessage(message.channel, {
 *   content: 'Test content!',
 * });
 * ```
 *
 * @example
 * ```typescript
 * // An awaited function. This function also passes index, pages, and handler.
 * (index, pages) =>
 *   new APIMessage(message.channel, {
 *     embed: new MessageEmbed().setFooter(`Page ${index + 1} / ${pages.length}`)
 *   });
 * ```
 */
export type MessagePage =
	| ((index: number, pages: MessagePage[], handler: PaginatedMessage) => Awaited<APIMessage | MessageOptions>)
	| APIMessage
	| MessageOptions;

type Awaited<T> = PromiseLike<T> | T;

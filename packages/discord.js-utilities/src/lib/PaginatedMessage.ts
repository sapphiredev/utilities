import type { APIMessage, User, TextChannel, NewsChannel, Message, MessageReaction, ReactionCollector } from 'discord.js';

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
 *     await response!.reactions.removeAll();
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
	public constructor({ pages, actions = PaginatedMessage.defaultActions }: PaginatedMessageOptions = {}) {
		this.pages = pages ?? [];

		for (const page of this.pages) this.messages.push(typeof page === 'function' ? null : page);
		for (const action of actions) this.actions.set(action.id, action);
	}

	/**
	 * Sets the handler's current page/message index.
	 * @param index The number to set the index to.
	 */
	public setIndex(index: number) {
		this.index = index;
		return this;
	}

	/**
	 * Sets the amount of time to idle before the paginator is closed.
	 * @param idle The number to set the idle to.
	 */
	public setIdle(idle: number) {
		this.idle = idle;
		return this;
	}

	/**
	 * Clears all current actions and sets them. The order given is the order they will be used.
	 * @param actions The actions to set.
	 */
	public setActions(actions: IPaginatedMessageAction[]) {
		this.actions.clear();
		return this.addActions(actions);
	}

	/**
	 * Adds actions to the existing ones. The order given is the order they will be used.
	 * @param actions The actions to add.
	 */
	public addActions(actions: IPaginatedMessageAction[]) {
		for (const action of actions) this.addAction(action);
		return this;
	}

	/**
	 * Adds an action to the existing ones. This will be added as the last action.
	 * @param action The action to add.
	 */
	public addAction(action: IPaginatedMessageAction) {
		this.actions.set(action.id, action);
		return this;
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
	 * Add pages to the existing ones. The order given is the order they will be used.
	 * @param pages The pages to add.
	 */
	public addPages(pages: MessagePage[]) {
		for (const page of pages) this.addPage(page);
		return this;
	}

	/**
	 * Adds a page to the existing ones. This will be added as the last page.
	 * @param page The page to add.
	 */
	public addPage(page: MessagePage) {
		this.pages.push(page);
		this.messages.push(typeof page === 'function' ? null : page);
		return this;
	}

	/**
	 * This executes the [[PaginatedMessage]] and sends the pages corresponding with [[PaginatedMessage.index]].
	 * The handler will start collecting reactions and running actions once all actions have been reacted to the message.
	 * @param author The author to validate.
	 * @param channel The channel to use.
	 */
	public async run(author: User, channel: TextChannel | NewsChannel) {
		await this.resolvePagesOnRun();

		if (!this.messages.length) throw new Error('There are no messages.');
		if (!this.actions.size) throw new Error('There are no messages.');

		const firstPage = this.messages[this.index]!;

		const response = (await channel.send(firstPage)) as Message;

		for (const id of this.actions.keys()) await response.react(id);

		const collector = response
			.createReactionCollector(
				(reaction: MessageReaction, user: User) =>
					(this.actions.has(reaction.emoji.identifier) || this.actions.has(reaction.emoji.name)) && user.id === author.id,
				{ idle: this.idle }
			)
			.on('collect', async (reaction, user) => {
				await reaction.users.remove(user);

				const action = (this.actions.get(reaction.emoji.identifier) ?? this.actions.get(reaction.emoji.name))!;

				await action.run({
					handler: this,
					author,
					channel,
					response,
					collector
				});

				const page = await this.resolvePage();

				if (!action.disabledResponseEdit) await response.edit(page!);
			})
			.on('end', () => response.reactions.removeAll());

		return this;
	}

	/**
	 * This function is executed on [[PaginatedMessage.run]]. This is an extendable method.
	 */
	public async resolvePagesOnRun() {
		for (let i = 0; i < this.pages.length; i++) await this.resolvePage(i);
	}

	/**
	 * This function is executed whenever an action is triggered and resolved.
	 * @param index The index to resolve.
	 */
	public async resolvePage(index: number = this.index) {
		const page = this.pages[index];
		// @ts-expect-error 2349
		if (page) this.messages[index] ??= await this.pages[index](index, this.pages, this);
		return this.messages[index];
	}

	/**
	 * This clones the current handler into a new instance.
	 */
	public clone() {
		const clone = new PaginatedMessage({ pages: this.pages, actions: [] }).setIndex(this.index).setIdle(this.idle);
		clone.actions = this.actions;
		return clone;
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

						if (!isNaN(i) && handler.pages[i]) handler.index = i;
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
				if (handler.index !== 0) --handler.index;
			}
		},
		{
			id: '▶️',
			run: ({ handler }) => {
				if (handler.index !== handler.pages.length - 1) ++handler.index;
			}
		},
		{
			id: '⏩',
			run: ({ handler }) => (handler.index = handler.pages.length - 1)
		},
		{
			id: '⏹️',
			disabledResponseEdit: true,
			run: async ({ response, collector }) => {
				await response!.reactions.removeAll();
				collector!.stop();
			}
		}
	];
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
 *     await response!.reactions.removeAll();
 *     collector!.stop();
 *   }
 * }```
 */
export interface IPaginatedMessageAction {
	id: string;
	disabledResponseEdit?: boolean;
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
 * @example
 * ```typescript
 * // Direct usage as an APIMessage
 *
 * new APIMessage(message.channel, {
 *   context: 'Test content!',
 * });
 *
 * // An awaited function. This function also passes index, pages, and handler.
 *
 * (index, pages) =>
 *   new APIMessage(message.channel, {
 *     embed: new MessageEmbed().setFooter(`Page ${index + 1} / ${pages.length}`)
 *   });
 * ```
 */
export type MessagePage = ((index: number, pages: MessagePage[], handler: PaginatedMessage) => Awaited<APIMessage>) | APIMessage;

type Awaited<T> = PromiseLike<T> | T;

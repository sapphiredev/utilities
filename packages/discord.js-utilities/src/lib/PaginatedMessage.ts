import type { APIMessage, User, TextChannel, NewsChannel, Message, MessageReaction, ReactionCollector } from 'discord.js';

export class PaginatedMessage {
	public pages: MessagePage[];
	public messages: (APIMessage | null)[] = [];

	public actions = new Map<string, IPaginatedMessageAction>();

	public index = 0;

	public idle = 20 * 1000;

	public constructor({ pages, actions = PaginatedMessage.defaultActions }: PaginatedMessageOptions = {}) {
		this.pages = pages ?? [];

		for (const page of this.pages) this.messages.push(typeof page === 'function' ? null : page);
		for (const action of actions) this.actions.set(action.id, action);
	}

	public setIndex(index: number) {
		this.index = index;
		return this;
	}

	public setIdle(idle: number) {
		this.idle = idle;
		return this;
	}

	public setActions(actions: IPaginatedMessageAction[]) {
		this.actions.clear();
		return this.addActions(actions);
	}

	public addActions(actions: IPaginatedMessageAction[]) {
		for (const action of actions) this.addAction(action);
		return this;
	}

	public addAction(action: IPaginatedMessageAction) {
		this.actions.set(action.id, action);
		return this;
	}

	public setPages(pages: MessagePage[]) {
		this.pages = pages;
		return this;
	}

	public addPages(pages: MessagePage[]) {
		this.pages.push(...pages);
		return this;
	}

	public addPage(page: MessagePage) {
		this.pages.push(page);
		return this;
	}

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

				await response.edit(page!);
			})
			.on('end', () => response.reactions.removeAll());

		return this;
	}

	public async resolvePagesOnRun() {
		for (let i = 0; i < this.pages.length; i++) await this.resolvePage(i);
	}

	public async resolvePage(index: number = this.index) {
		const page = this.pages[index];
		// @ts-expect-error 2349
		if (page) this.messages[index] ??= await this.pages[index](index, this.pages, this);
		return this.messages[index];
	}

	public clone() {
		const clone = new PaginatedMessage({ pages: this.pages, actions: [] }).setIndex(this.index).setIdle(this.idle);
		clone.actions = this.actions;
		return clone;
	}

	public static defaultActions: IPaginatedMessageAction[] = [
		{
			id: '🔢',
			run: async ({ handler, author, channel }) => {
				const questionMessage = await channel.send('What would you like to jump to?');
				const collected = await channel
					.awaitMessages((message: Message) => message.author.id === author.id, { max: 1, idle: 15 * 1000 })
					.catch(() => null);

				if (collected) {
					const responseMessage = collected.first();

					if (questionMessage.deletable) await questionMessage.delete();
					if (responseMessage) {
						if (responseMessage.deletable) await responseMessage.delete();

						const i = Number(responseMessage.content) - 1;

						if (!Number.isNaN(i) && handler.pages[i]) handler.index = i;
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
			run: async ({ response, collector }) => {
				await response!.reactions.removeAll();
				collector!.stop();
			}
		}
	];
}

export interface IPaginatedMessageAction {
	id: string;
	run(context: PaginatedMessageActionContext): Awaited<unknown>;
}

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

export type MessagePage = ((index: number, pages: MessagePage[], handler: PaginatedMessage) => Awaited<APIMessage>) | APIMessage;

type Awaited<T> = PromiseLike<T> | T;

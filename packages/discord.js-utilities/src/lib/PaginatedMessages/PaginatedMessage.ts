import { Time } from '@sapphire/time-utilities';
import { Awaited, isFunction } from '@sapphire/utilities';
import type { RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v8';
import {
	APIMessage,
	Collection,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
	MessageOptions,
	MessageReaction,
	ReactionCollector,
	Snowflake,
	User
} from 'discord.js';
import { MessageBuilder } from '../builders/MessageBuilder';
import { isGuildBasedChannel } from '../type-guards';

/**
 * This is a {@link PaginatedMessage}, a utility to paginate messages (usually embeds).
 * You must either use this class directly or extend it.
 *
 * {@link PaginatedMessage} uses actions, these are essentially reaction emojis, when triggered run the said action.
 * You can utilize your own actions, or you can use the {@link PaginatedMessage.defaultActions}.
 * {@link PaginatedMessage.defaultActions} is also static so you can modify these directly.
 *
 * {@link PaginatedMessage} also uses pages, these are simply {@linkplain https://discord.js.org/#/docs/main/stable/class/APIMessage APIMessages}.
 *
 * @example
 * ```typescript
 * const handler = new PaginatedMessage();
 * ```
 *
 * @example
 * ```typescript
 * // To utilize actions you can use the IPaginatedMessageAction by implementing it into a class.
 * // PaginatedMessage requires you to have the class initialized using `new`.
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
 * }
 * ```
 */
export class PaginatedMessage {
	/**
	 * The pages to be converted to {@link PaginatedMessage.messages}
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
	 * The pages which were converted from {@link PaginatedMessage.pages}
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
	 * The amount of milliseconds to idle before the paginator is closed. Defaults to 20 minutes.
	 */
	public idle = Time.Minute * 20;

	/**
	 * The template for this {@link PaginatedMessage}.
	 * You can use templates to set defaults that will apply to each and every page in the {@link PaginatedMessage}
	 */
	public template: MessageOptions;

	/**
	 * Constructor for the {@link PaginatedMessage} class
	 * @param __namedParameters The {@link PaginatedMessageOptions} for this instance of the {@link PaginatedMessage} class
	 */
	public constructor({ pages, actions, template }: PaginatedMessageOptions = {}) {
		this.pages = pages ?? [];

		for (const page of this.pages) this.messages.push(page instanceof APIMessage ? page : null);
		for (const action of actions ?? this.constructor.defaultActions) this.actions.set(action.id, action);

		this.template = PaginatedMessage.resolveTemplate(template);
	}

	public setPromptMessage(message: string) {
		PaginatedMessage.promptMessage = message;
		return this;
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
	 * @remark While you can use this method you should first check out
	 * {@link PaginatedMessage.addPageBuilder},
	 * {@link PaginatedMessage.addPageContent} and
	 * {@link PaginatedMessage.addPageEmbed} as
	 * these are easier functional methods of adding pages and will likely already suffice for your needs.
	 *
	 * @param page The page to add.
	 */
	public addPage(page: MessagePage): this {
		this.pages.push(page);
		this.messages.push(page instanceof APIMessage ? page : null);
		return this;
	}

	/**
	 * Adds a page to the existing ones using a {@link MessageBuilder}. This will be added as the last page.
	 * @param builder Either a callback whose first parameter is `new MessageBuilder()`, or an already constructed {@link MessageBuilder}
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 * const { MessageEmbed } = require('discord.js');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addPageBuilder((builder) => {
	 * 		const embed = new MessageEmbed()
	 * 			.setColor('#FF0000')
	 * 			.setDescription('example description');
	 *
	 * 		return builder
	 * 			.setContent('example content')
	 * 			.setEmbed(embed);
	 * });
	 * ```
	 * @example
	 * ```typescript
	 * const { MessageEmbed } = require('discord.js');
	 * const { MessageBuilder, PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const embed = new MessageEmbed()
	 * 	.setColor('#FF0000')
	 * 	.setDescription('example description');
	 *
	 * const builder = new MessageBuilder()
	 * 	.setContent('example content')
	 * 	.setEmbed(embed);
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addPageBuilder(builder);
	 * ```
	 */
	public addPageBuilder(builder: MessageBuilder | ((builder: MessageBuilder) => MessageBuilder)): this {
		return this.addPage(isFunction(builder) ? builder(new MessageBuilder()) : builder);
	}

	/**
	 * Adds a page to the existing ones asynchronously using a {@link MessageBuilder}. This wil be added as the last page.
	 * @param builder Either a callback whose first parameter is `new MessageBuilder()`, or an already constructed {@link MessageBuilder}
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 * const { MessageEmbed } = require('discord.js');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addAsyncPageBuilder(async (builder) => {
	 * 		const someRemoteData = await fetch('https://contoso.com/api/users');
	 *
	 * 		const embed = new MessageEmbed()
	 * 			.setColor('#FF0000')
	 * 			.setDescription(someRemoteData.data);
	 *
	 * 		return builder
	 * 			.setContent('example content')
	 * 			.setEmbed(embed);
	 * });
	 * ```
	 */
	public addAsyncPageBuilder(builder: MessageBuilder | ((builder: MessageBuilder) => Promise<MessageBuilder>)): this {
		return this.addPage(async () => (isFunction(builder) ? builder(new MessageBuilder()) : builder));
	}

	/**
	 * Adds a page to the existing ones using simple message content. This will be added as the last page.
	 * @param content The content to set.
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addPageContent('example content');
	 * ```
	 */
	public addPageContent(content: string): this {
		return this.addPage({ content });
	}

	/**
	 * Adds a page to the existing ones using a {@link MessageEmbed}. This wil be added as the last page.
	 * @param embed Either a callback whose first paramter is `new MessageEmbed()`, or an already constructed {@link MessageEmbed}
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addPageEmbed((embed) => {
	 * 		embed
	 * 			.setColor('#FF0000')
	 * 			.setDescription('example description');
	 *
	 * 		return embed;
	 * });
	 * ```
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const embed = new MessageEmbed()
	 * 	.setColor('#FF0000')
	 * 	.setDescription('example description');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addPageEmbed(embed);
	 * ```
	 */
	public addPageEmbed(embed: MessageEmbed | ((embed: MessageEmbed) => MessageEmbed)): this {
		return this.addPage({ embed: isFunction(embed) ? embed(new MessageEmbed()) : embed });
	}

	/**
	 * Adds a page to the existing ones asynchronously using a {@link MessageEmbed}. This wil be added as the last page.
	 * @param embed Either a callback whose first paramter is `new MessageEmbed()`, or an already constructed {@link MessageEmbed}
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addAsyncPageEmbed(async (embed) => {
	 *		const someRemoteData = await fetch('https://contoso.com/api/users');
	 *
	 * 		embed
	 * 			.setColor('#FF0000')
	 * 			.setDescription(someRemoteData.data);
	 *
	 * 		return embed;
	 * });
	 * ```
	 */
	public addAsyncPageEmbed(embed: MessageEmbed | ((builder: MessageEmbed) => Promise<MessageEmbed>)): this {
		return this.addPage(async () => ({ embed: isFunction(embed) ? await embed(new MessageEmbed()) : embed }));
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
	 * Executes the {@link PaginatedMessage} and sends the pages corresponding with {@link PaginatedMessage.index}.
	 * The handler will start collecting reactions and running actions once all actions have been reacted to the message.
	 * @param message The message that triggered this {@link PaginatedMessage}.
	 * Generally this will be the command message, but it can also be another message from your bot, i.e. to indicate a loading state.
	 * @param target The user who will be able to interact with the reactions of this {@link PaginatedMessage}. Defaults to `message.author`.
	 */
	public async run(message: Message, target = message.author): Promise<this> {
		// Try to get the previous PaginatedMessage for this user
		const paginatedMessage = PaginatedMessage.handlers.get(message.author.id);

		// If a PaginatedMessage was found then stop it
		if (paginatedMessage) paginatedMessage.collector!.stop();

		// If the message was sent by a bot, then set the response as this one
		if (target.bot) this.response = message;

		await this.resolvePagesOnRun(message.channel);

		// Sanity checks to handle
		if (!this.messages.length) throw new Error('There are no messages.');
		if (!this.actions.size) throw new Error('There are no messages.');

		await this.setUpMessage(message.channel, target);
		await this.setUpReactions(message.channel, target);

		const messageId = this.response!.id;

		if (this.collector) {
			this.collector!.once('end', () => {
				PaginatedMessage.messages.delete(messageId);
				PaginatedMessage.handlers.delete(target.id);
			});

			PaginatedMessage.messages.set(messageId, this);
			PaginatedMessage.handlers.set(target.id, this);
		}

		return this;
	}

	/**
	 * Executed whenever {@link PaginatedMessage.run} is called.
	 */
	public async resolvePagesOnRun(channel: Message['channel']): Promise<void> {
		for (let i = 0; i < this.pages.length; i++) await this.resolvePage(channel, i);
	}

	/**
	 * Executed whenever an action is triggered and resolved.
	 * @param index The index to resolve.
	 */
	public async resolvePage(channel: Message['channel'], index: number): Promise<APIMessage> {
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
		clone.template = this.template;
		return clone;
	}

	/**
	 * Sets up the message.
	 * @param channel The channel the handler is running at.
	 * @param author The author the handler is for.
	 */
	protected async setUpMessage(channel: Message['channel'], author: User): Promise<void>;
	protected async setUpMessage(channel: Message['channel']): Promise<void> {
		const firstPage = this.messages[this.index]!;
		if (this.response) await this.response.edit(firstPage);
		else this.response = (await channel.send(firstPage)) as Message;
	}

	/**
	 * Sets up the message's reactions and the collector.
	 * @param channel The channel the handler is running at.
	 * @param author The author the handler is for.
	 */
	protected async setUpReactions(channel: Message['channel'], author: User): Promise<void> {
		if (this.pages.length > 1) {
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
	}

	/**
	 * Handles the load of a page.
	 * @param page The page to be loaded.
	 * @param channel The channel the paginated message runs at.
	 * @param index The index of the current page.
	 */
	protected async handlePageLoad(page: MessagePage, channel: Message['channel'], index: number): Promise<APIMessage> {
		const options = isFunction(page) ? await page(index, this.pages, this) : page;
		const resolved = options instanceof APIMessage ? options : new APIMessage(channel, this.applyTemplate(this.template, options));
		return this.applyFooter(resolved.resolveData(), index);
	}

	/**
	 * Handles the `collect` event from the collector.
	 * @param author The the handler is for.
	 * @param channel The channel the handler is running at.
	 * @param reaction The reaction that was received.
	 * @param user The user that reacted to the message.
	 */
	protected async handleCollect(author: User, channel: Message['channel'], reaction: MessageReaction, user: User): Promise<void> {
		if (isGuildBasedChannel(channel) && channel.client.user && channel.permissionsFor(channel.client.user.id)?.has('MANAGE_MESSAGES')) {
			await reaction.users.remove(user);
		}

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
	protected async handleEnd(_: Collection<Snowflake, MessageReaction>, reason: string): Promise<void> {
		// Remove all listeners from the collector:
		this.collector?.removeAllListeners();

		// Do not remove reactions if the message, channel, or guild, was deleted:
		if (this.response && !PaginatedMessage.deletionStopReasons.includes(reason)) {
			if (
				isGuildBasedChannel(this.response.channel) &&
				this.response.client.user &&
				this.response.channel.permissionsFor(this.response.client.user.id)?.has('MANAGE_MESSAGES')
			) {
				await this.response.reactions.removeAll();
			}
		}
	}

	protected applyFooter(message: APIMessage, index: number): APIMessage {
		const data = message.data as RESTPostAPIChannelMessageJSONBody;
		if (!data.embed) return message;

		data.embed.footer ??= { text: this.template.embed?.footer?.text ?? '' };
		data.embed.footer.text = `${index + 1} / ${this.pages.length}${data.embed.footer.text}`;
		return message;
	}

	private applyTemplate(template: MessageOptions, options: MessageOptions): MessageOptions {
		return { ...template, ...options, embed: this.applyTemplateEmbed(template.embed, options.embed) };
	}

	private applyTemplateEmbed(template: EmbedResolvable, embed: EmbedResolvable): MessageEmbed | MessageEmbedOptions | undefined {
		if (!embed) return template;
		if (!template) return embed;
		return this.mergeEmbeds(template, embed);
	}

	private mergeEmbeds(template: MessageEmbed | MessageEmbedOptions, embed: MessageEmbed | MessageEmbedOptions): MessageEmbedOptions {
		return {
			title: embed.title ?? template.title ?? undefined,
			description: embed.description ?? template.description ?? undefined,
			url: embed.url ?? template.url ?? undefined,
			timestamp: embed.timestamp ?? template.timestamp ?? undefined,
			color: embed.color ?? template.color ?? undefined,
			fields: this.mergeArrays(template.fields, embed.fields),
			files: this.mergeArrays(template.files, embed.files),
			author: embed.author ?? template.author ?? undefined,
			thumbnail: embed.thumbnail ?? template.thumbnail ?? undefined,
			image: embed.image ?? template.image ?? undefined,
			video: embed.video ?? template.video ?? undefined,
			footer: embed.footer ?? template.footer ?? undefined
		};
	}

	private mergeArrays<T>(template?: T[], array?: T[]): undefined | T[] {
		if (!array) return template;
		if (!template) return array;
		return [...template, ...array];
	}

	/**
	 * The default actions of this handler.
	 */
	public static defaultActions: IPaginatedMessageAction[] = [
		{
			id: '🔢',
			run: async ({ handler, author, channel }) => {
				const questionMessage = await channel.send(PaginatedMessage.promptMessage);
				const collected = await channel
					.awaitMessages((message: Message) => message.author.id === author.id, { max: 1, idle: Time.Minute * 20 })
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
				if (
					isGuildBasedChannel(response.channel) &&
					response.client.user &&
					response.channel.permissionsFor(response.client.user.id)?.has('MANAGE_MESSAGES')
				) {
					await response.reactions.removeAll();
				}

				collector.stop();
			}
		}
	];

	/**
	 * The reasons sent by {@linkplain https://discord.js.org/#/docs/main/stable/class/ReactionCollector?scrollTo=e-end ReactionCollector#end}
	 * event when the message (or its owner) has been deleted.
	 */
	public static deletionStopReasons = ['messageDelete', 'channelDelete', 'guildDelete'];

	/**
	 * Custom prompt message when a user wants to jump to a certain page number.
	 * @default "What page would you like to jump to?"
	 */
	public static promptMessage = 'What page would you like to jump to?';

	/**
	 * The messages that are currently being handled by a {@link PaginatedMessage}
	 * The key is the ID of the message that triggered this {@link PaginatedMessage}
	 *
	 * This is to ensure that only 1 {@link PaginatedMessage} can run on a specified message at once.
	 * This is important when having an editable commands solution.
	 */
	public static readonly messages = new Map<string, PaginatedMessage>();

	/**
	 * The current {@link ReactionCollector} handlers that are active.
	 * The key is the ID of of the author who sent the message that triggered this {@link PaginatedMessage}
	 *
	 * This is to ensure that any given author can only trigger 1 {@link PaginatedMessage}.
	 * This is important for performance reasons, and users should not have more than 1 {@link PaginatedMessage} open at once.
	 */
	public static readonly handlers = new Map<string, PaginatedMessage>();

	private static resolveTemplate(template?: MessageEmbed | MessageOptions): MessageOptions {
		if (template === undefined) return {};
		if (template instanceof MessageEmbed) return { embed: template };
		return template;
	}
}

export interface PaginatedMessage {
	constructor: typeof PaginatedMessage;
}

/**
 * To utilize actions you can use the {@link IPaginatedMessageAction} by implementing it into a class.
 * @example
 * ```typescript
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
 * }
 * ```
 */
export interface IPaginatedMessageAction {
	id: string;
	run(context: PaginatedMessageActionContext): Awaited<unknown>;
}

/**
 * The context to be used in {@link IPaginatedMessageAction}.
 */
export interface PaginatedMessageActionContext {
	handler: PaginatedMessage;
	author: User;
	channel: Message['channel'];
	response: Message;
	collector: ReactionCollector;
}

export interface PaginatedMessageOptions {
	/**
	 * The pages to display in this {@link PaginatedMessage}
	 */
	pages?: MessagePage[];
	/**
	 * Custom actions to provide when sending the paginated message
	 */
	actions?: IPaginatedMessageAction[];
	/**
	 * The {@link MessageEmbed} or {@link MessageOptions} options to apply to the entire {@link PaginatedMessage}
	 */
	template?: MessageEmbed | MessageOptions;
}

/**
 * The pages that are used for {@link PaginatedMessage.pages}
 *
 * Pages can be either an {@linkplain https://discord.js.org/#/docs/main/stable/class/APIMessage APIMessage} directly,
 * or an awaited function which returns an {@linkplain https://discord.js.org/#/docs/main/stable/class/APIMessage APIMessage}.
 *
 * Furthermore, {@linkplain https://discord.js.org/#/docs/main/stable/typedef/MessageOptions MessageOptions} can be used to
 * construct the pages without state, this library also provides {@link MessageBuilder}, which can be used as a chainable
 * alternative to raw objects, similar to how {@linkplain https://discord.js.org/#/docs/main/stable/class/MessageEmbed MessageEmbed}
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

type EmbedResolvable = MessageOptions['embed'];

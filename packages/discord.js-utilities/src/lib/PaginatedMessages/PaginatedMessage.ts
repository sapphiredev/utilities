import { Time } from '@sapphire/time-utilities';
import { Awaitable, isFunction } from '@sapphire/utilities';
import type { APIEmbed, RESTPatchAPIChannelMessageJSONBody, RESTPostAPIChannelMessageJSONBody } from 'discord-api-types/v9';
import {
	Collection,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
	MessageOptions,
	MessagePayload,
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
 * {@link PaginatedMessage} also uses pages, these are simply {@linkplain https://discord.js.org/#/docs/main/stable/class/APIMessage MessagePayloads}.
 *
 * @example
 * ```typescript
 * const myPaginatedMessage = new PaginatedMessage();
 * // Once you have an instance of PaginatedMessage you can call various methods on it to add pages to it.
 * // For more details see each method's documentation.
 *
 * myPaginatedMessage.addPageEmbed((embed) => {
 *		embed
 *			.setColor('#FF0000')
 *			.setDescription('example description');
 *
 *		return embed;
 * });
 *
 * myPaginatedMessage.addPageBuilder((builder) => {
 *		const embed = new MessageEmbed()
 *			.setColor('#FF0000')
 *			.setDescription('example description');
 *
 *		return builder
 *			.setContent('example content')
 *			.setEmbed(embed);
 * });
 *
 * myPaginatedMessage.addPageContent('Example');
 *
 * myPaginatedMessage.run(message)
 * ```
 *
 * @remark You can also provide a MessageEmbed template. This will be applied to every page.
 * If a page itself has an embed then the two will be merged, with the content of
 * the page's embed taking priority over the template.
 *
 * Furthermore, if the template has a footer then it will be applied _after_ the page index part of the footer
 * with a space preceding the template. For example, when setting `- Powered by Sapphire Framework`
 * the resulting footer will be `1/2 - Powered by Sapphire Framework`
 * @example
 * ```typescript
 * const myPaginatedMessage = new PaginatedMessage({
 * 	template: new MessageEmbed().setColor('#FF0000').setFooter('- Powered by Sapphire framework')
 * });
 * ```
 *
 * @remark To utilize actions you can implement IPaginatedMessageAction into a class.
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
	public messages: (MessagePayload | null)[] = [];

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
	 * Custom text to show in front of the page index in the embed footer.
	 * PaginatedMessage will automatically add a space (` `) after the given text. You do not have to add it yourself.
	 * @default ```PaginatedMessage.pageIndexPrefix``` (static property)
	 */
	public pageIndexPrefix = PaginatedMessage.pageIndexPrefix;

	/**
	 * Custom separator to show after the page index in the embed footer.
	 * PaginatedMessage will automatically add a space (` `) after the given text. You do not have to add it yourself.
	 * @default ```PaginatedMessage.pageIndexPrefix``` (static property)
	 */
	public embedFooterSeparator = PaginatedMessage.embedFooterSeparator;

	/**
	 * Additional options that are applied to each message when sending it to Discord.
	 * Be careful with using this, misusing it can cause issues, such as sending empty messages.
	 * @remark **This is for advanced usages only!**
	 *
	 * @default null
	 */
	private paginatedMessagePayloadData: RESTPostAPIChannelMessageJSONBody | RESTPatchAPIChannelMessageJSONBody | null = null;

	/**
	 * Constructor for the {@link PaginatedMessage} class
	 * @param __namedParameters The {@link PaginatedMessageOptions} for this instance of the {@link PaginatedMessage} class
	 */
	public constructor({
		pages,
		actions,
		template,
		pageIndexPrefix,
		embedFooterSeparator,
		paginatedMessagePayloadData = null
	}: PaginatedMessageOptions = {}) {
		this.pages = pages ?? [];

		for (const page of this.pages) this.messages.push(page instanceof MessagePayload ? page : null);
		for (const action of actions ?? this.constructor.defaultActions) this.actions.set(action.id, action);

		this.template = PaginatedMessage.resolveTemplate(template);
		this.pageIndexPrefix = pageIndexPrefix ?? PaginatedMessage.pageIndexPrefix;
		this.embedFooterSeparator = embedFooterSeparator ?? PaginatedMessage.embedFooterSeparator;
		this.paginatedMessagePayloadData = paginatedMessagePayloadData;
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
		this.messages.push(page instanceof MessagePayload ? page : null);
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
	 * @param embed Either a callback whose first parameter is `new MessageEmbed()`, or an already constructed {@link MessageEmbed}
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
		return this.addPage({ embeds: isFunction(embed) ? [embed(new MessageEmbed())] : [embed] });
	}

	/**
	 * Adds a page to the existing ones asynchronously using a {@link MessageEmbed}. This wil be added as the last page.
	 * @param embed Either a callback whose first parameter is `new MessageEmbed()`, or an already constructed {@link MessageEmbed}
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
		return this.addPage(async () => ({ embeds: isFunction(embed) ? [await embed(new MessageEmbed())] : [embed] }));
	}

	/**
	 * Adds a page to the existing ones asynchronously using multiple {@link MessageEmbed}'s. This wil be added as the last page.
	 * @remark When using this with a callback this will construct 10 {@link MessageEmbed}'s in the callback parameters, regardless of how many are actually used.
	 * If this a performance impact you do not want to cope with then it is recommended to use {@link PaginatedMessage.addPageBuilder} instead, which will let you add
	 * as many embeds as you want, albeit manually
	 * @param embeds Either a callback which receives 10 parameters of `new MessageEmbed()`, or an array of already constructed {@link MessageEmbed}'s
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addPageEmbeds((embed1, embed2, embed3) => { // You can add up to 10 embeds
	 * 		embed1
	 * 			.setColor('#FF0000')
	 * 			.setDescription('example description 1');
	 *
	 * 		embed2
	 * 			.setColor('#00FF00')
	 * 			.setDescription('example description 2');
	 *
	 * 		embed3
	 * 			.setColor('#0000FF')
	 * 			.setDescription('example description 3');
	 *
	 * 		return [embed1, embed2, embed3];
	 * });
	 * ```
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const embed1 = new MessageEmbed()
	 * 	.setColor('#FF0000')
	 * 	.setDescription('example description 1');
	 *
	 * const embed2 = new MessageEmbed()
	 * 	.setColor('#00FF00')
	 * 	.setDescription('example description 2');
	 *
	 * const embed3 = new MessageEmbed()
	 * 	.setColor('#0000FF')
	 * 	.setDescription('example description 3');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addPageEmbeds([embed1, embed2, embed3]); // You can add up to 10 embeds
	 * ```
	 */
	public addPageEmbeds(
		embeds:
			| MessageEmbed[]
			| ((
					embed1: MessageEmbed,
					embed2: MessageEmbed,
					embed3: MessageEmbed,
					embed4: MessageEmbed,
					embed5: MessageEmbed,
					embed6: MessageEmbed,
					embed7: MessageEmbed,
					embed8: MessageEmbed,
					embed9: MessageEmbed,
					embed10: MessageEmbed
			  ) => MessageEmbed[])
	): this {
		let processedEmbeds = isFunction(embeds)
			? embeds(
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed(),
					new MessageEmbed()
			  )
			: embeds;

		if (processedEmbeds.length > 10) {
			processedEmbeds = processedEmbeds.slice(0, 10);
		}

		return this.addPage({ embeds: processedEmbeds });
	}

	/**
	 * Adds a page to the existing ones using multiple {@link MessageEmbed}'s. This wil be added as the last page.
	 * @remark When using this with a callback this will construct 10 {@link MessageEmbed}'s in the callback parameters, regardless of how many are actually used.
	 * If this a performance impact you do not want to cope with then it is recommended to use {@link PaginatedMessage.addPageBuilder} instead, which will let you add
	 * as many embeds as you want, albeit manually
	 * @param embeds Either a callback which receives 10 parameters of `new MessageEmbed()`, or an array of already constructed {@link MessageEmbed}'s
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const paginatedMessage = new PaginatedMessage().addAsyncPageEmbeds(async (embed0, embed1, embed2) => {
	 * 	const someRemoteData = (await fetch('https://contoso.com/api/users')) as any;
	 *
	 * 	for (const [index, user] of Object.entries(someRemoteData.users.slice(0, 10)) as [`${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`, any][]) {
	 * 		switch (index) {
	 * 			case '0': {
	 * 				embed0.setColor('#FF0000').setDescription('example description 1').setAuthor(user.name);
	 * 				break;
	 * 			}
	 * 			case '1': {
	 * 				embed1.setColor('#00FF00').setDescription('example description 2').setAuthor(user.name);
	 * 				break;
	 * 			}
	 * 			case '2': {
	 * 				embed2.setColor('#0000FF').setDescription('example description 3').setAuthor(user.name);
	 * 				break;
	 * 			}
	 * 		}
	 * 	}
	 *
	 * 	return [embed0, embed1, embed2];
	 * });
	 * ```
	 * @example
	 * ```typescript
	 * const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
	 *
	 * const embed1 = new MessageEmbed()
	 * 	.setColor('#FF0000')
	 * 	.setDescription('example description 1');
	 *
	 * const embed2 = new MessageEmbed()
	 * 	.setColor('#00FF00')
	 * 	.setDescription('example description 2');
	 *
	 * const embed3 = new MessageEmbed()
	 * 	.setColor('#0000FF')
	 * 	.setDescription('example description 3');
	 *
	 * const paginatedMessage = new PaginatedMessage()
	 * 	.addAsyncPageEmbeds([embed1, embed2, embed3]); // You can add up to 10 embeds
	 * ```
	 */
	public addAsyncPageEmbeds(
		embeds:
			| MessageEmbed[]
			| ((
					embed1: MessageEmbed,
					embed2: MessageEmbed,
					embed3: MessageEmbed,
					embed4: MessageEmbed,
					embed5: MessageEmbed,
					embed6: MessageEmbed,
					embed7: MessageEmbed,
					embed8: MessageEmbed,
					embed9: MessageEmbed,
					embed10: MessageEmbed
			  ) => Promise<MessageEmbed[]>)
	): this {
		return this.addPage(async () => {
			let processedEmbeds = isFunction(embeds)
				? await embeds(
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed(),
						new MessageEmbed()
				  )
				: embeds;

			if (processedEmbeds.length > 10) {
				processedEmbeds = processedEmbeds.slice(0, 10);
			}

			return { embeds: processedEmbeds };
		});
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
	 * Generally this will be the command message, but it can also be another message from your client, i.e. to indicate a loading state.
	 * @param target The user who will be able to interact with the reactions of this {@link PaginatedMessage}. Defaults to `message.author`.
	 */
	public async run(message: Message, target = message.author): Promise<this> {
		// Try to get the previous PaginatedMessage for this user
		const paginatedMessage = PaginatedMessage.handlers.get(target.id);

		// If a PaginatedMessage was found then stop it
		if (paginatedMessage) paginatedMessage.collector!.stop();

		// If the message was sent by a bot, then set the response as this one
		if (message.author.bot) this.response = message;

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
	public async resolvePage(channel: Message['channel'], index: number): Promise<MessagePayload> {
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
		// Get the current page
		const page = this.messages[this.index]!;

		// Merge in the advanced options
		page.data = { ...page.data, ...(this.paginatedMessagePayloadData ?? {}) };

		if (this.response) await this.response.edit(page);
		else this.response = await channel.send(page);
	}

	/**
	 * Sets up the message's reactions and the collector.
	 * @param channel The channel the handler is running at.
	 * @param author The author the handler is for.
	 */
	protected async setUpReactions(channel: Message['channel'], author: User): Promise<void> {
		if (this.pages.length > 1) {
			this.collector = this.response!.createReactionCollector({
				filter: (reaction: MessageReaction, user: User) =>
					user.id === author.id && (this.actions.has(reaction.emoji.identifier) || this.actions.has(reaction.emoji.name ?? '')),
				idle: this.idle
			})
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
	protected async handlePageLoad(page: MessagePage, channel: Message['channel'], index: number): Promise<MessagePayload> {
		const options = isFunction(page) ? await page(index, this.pages, this) : page;
		const resolved = options instanceof MessagePayload ? options : new MessagePayload(channel, this.applyTemplate(this.template, options));
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

		const action = (this.actions.get(reaction.emoji.identifier) ?? this.actions.get(reaction.emoji.name ?? ''))!;
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

	protected applyFooter(message: MessagePayload, index: number): MessagePayload {
		const data = message.data as PatchedRESTPostAPIChannelMessageJSONBody;
		if (!data.embeds?.length) return message;

		for (const [idx, embed] of Object.entries(data.embeds)) {
			if (embed) {
				embed.footer ??= { text: this.template.embeds?.[Number(idx)]?.footer?.text ?? this.template.embeds?.[0]?.footer?.text ?? '' };
				embed.footer.text = `${this.pageIndexPrefix ? `${this.pageIndexPrefix} ` : ''}${index + 1} / ${this.pages.length}${
					embed.footer.text ? ` ${this.embedFooterSeparator} ${embed.footer.text}` : ''
				}`;
			}
		}

		return message;
	}

	private applyTemplate(template: MessageOptions, options: MessageOptions): MessageOptions {
		const embedData = this.applyTemplateEmbed(template.embeds, options.embeds);
		const embeds = embedData ? [embedData] : undefined;

		return { ...template, ...options, embeds };
	}

	private applyTemplateEmbed(template: EmbedResolvable, embed: EmbedResolvable): APIEmbed | MessageEmbed | MessageEmbedOptions | undefined {
		if (!embed) return template?.[0];
		if (!template) return embed?.[0];
		return this.mergeEmbeds(template?.[0], embed?.[0]);
	}

	private mergeEmbeds(
		template: APIEmbed | MessageEmbed | MessageEmbedOptions,
		embed: APIEmbed | MessageEmbed | MessageEmbedOptions
	): MessageEmbedOptions {
		return {
			title: embed.title ?? template.title ?? undefined,
			description: embed.description ?? template.description ?? undefined,
			url: embed.url ?? template.url ?? undefined,
			timestamp:
				(typeof embed.timestamp === 'string' ? new Date(embed.timestamp) : embed.timestamp) ??
				(typeof template.timestamp === 'string' ? new Date(template.timestamp) : template.timestamp) ??
				undefined,
			color: embed.color ?? template.color ?? undefined,
			fields: this.mergeArrays(template.fields, embed.fields),
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
					.awaitMessages({
						filter: (message: Message) => message.author.id === author.id,
						max: 1,
						idle: Time.Minute * 20
					})
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
	 * @remark To overwrite this property change it in a "setup" file prior to calling `client.login()` for your bot.
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 *
	 * PaginatedMessage.promptMessage = 'Please send the number of the page you would like to jump to.';
	 * ```
	 */
	public static promptMessage = 'What page would you like to jump to?';

	/**
	 * Custom text to show in front of the page index in the embed footer.
	 * PaginatedMessage will automatically add a space (` `) after the given text. You do not have to add it yourself.
	 * @default ""
	 * @remark To overwrite this property change it somewhere in a "setup" file, i.e. where you also call `client.login()` for your bot.
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 *
	 * PaginatedMessage.pageIndexPrefix = 'Page';
	 * // This will make the footer of the embed something like "Page 1/2"
	 * ```
	 */
	public static pageIndexPrefix = '';

	/**
	 * Custom separator for the page index in the embed footer.
	 * @default "•"
	 * @remark To overwrite this property change it somewhere in a "setup" file, i.e. where you also call `client.login()` for your bot.
	 * Alternatively, you can also customize it on a per-PaginatedMessage basis by passing `embedFooterSeparator` in the options of the constructor.
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 *
	 * PaginatedMessage.embedFooterSeparator = '|';
	 * // This will make the separator of the embed footer something like "Page 1/2 | Today at 4:20"
	 * ```
	 */
	public static embedFooterSeparator = '•';

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
		if (template instanceof MessageEmbed) return { embeds: [template] };
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
	run(context: PaginatedMessageActionContext): Awaitable<unknown>;
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
	/**
	 * @seealso {@link PaginatedMessage.pageIndexPrefix}
	 */
	pageIndexPrefix?: string;
	/**
	 * @seealso {@link PaginatedMessage.embedFooterSeparator}
	 */
	embedFooterSeparator?: string;
	/**
	 * Additional options that are applied to each message when sending it to Discord.
	 * Be careful with using this, misusing it can cause issues, such as sending empty messages.
	 * @remark **This is for advanced usages only!**
	 *
	 * @default null
	 */
	paginatedMessagePayloadData?: RESTPostAPIChannelMessageJSONBody | RESTPatchAPIChannelMessageJSONBody | null;
}

/**
 * The pages that are used for {@link PaginatedMessage.pages}
 *
 * Pages can be either a {@link MessagePayload},
 * or an {@link Awaitable} function that returns a {@link MessagePayload}.
 *
 * Furthermore, {@link MessageOptions} can be used to
 * construct the pages without state. This library also provides {@link MessageBuilder}, which can be used as a chainable
 * alternative to raw objects, similar to how {@link MessageEmbed}
 * works.
 *
 * Ideally, however, you should use the utility functions
 * {@link PaginatedMessage.addPageBuilder `addPageBuilder`}, {@link PaginatedMessage.addPageContent `addPageContent`}, and {@link PaginatedMessage.addPageEmbed `addPageEmbed`}
 * as opposed to manually constructing {@link MessagePage `MessagePages`}. This is because a {@link PaginatedMessage} does a lot of post-processing
 * on the provided pages and we can only guarantee this will work properly when using the utility methods.
 */
export type MessagePage =
	| ((index: number, pages: MessagePage[], handler: PaginatedMessage) => Awaitable<MessagePayload | MessageOptions>)
	| MessagePayload
	| MessageOptions;

type EmbedResolvable = MessageOptions['embeds'];

type PatchedRESTPostAPIChannelMessageJSONBody = Omit<RESTPostAPIChannelMessageJSONBody, 'embed'> & {
	embeds?: RESTPostAPIChannelMessageJSONBody['embed'][];
};

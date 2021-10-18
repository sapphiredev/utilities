import { Time } from '@sapphire/time-utilities';
import { Awaitable, chunk, isFunction, isObject } from '@sapphire/utilities';
import type { APIEmbed } from 'discord-api-types/v9';
import {
	ButtonInteraction,
	Collection,
	Formatters,
	InteractionButtonOptions,
	InteractionCollector,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	MessageEmbed,
	MessageEmbedOptions,
	MessageOptions,
	Snowflake,
	User,
	WebhookEditMessageOptions
} from 'discord.js';
import type { MessageComponentTypes } from 'discord.js/typings/enums';
import { MessageBuilder } from '../builders/MessageBuilder';

/**
 * This is a {@link PaginatedMessage}, a utility to paginate messages (usually embeds).
 * You must either use this class directly or extend it.
 *
 * {@link PaginatedMessage} uses {@linkplain https://discord.js.org/#/docs/main/stable/class/MessageButton MessageButtons} that perform the specified action when clicked.
 * You can either use your own actions or the {@link PaginatedMessage.defaultActions}.
 * {@link PaginatedMessage.defaultActions} is also static so you can modify these directly.
 *
 * {@link PaginatedMessage} also uses pages via {@linkplain https://discord.js.org/#/docs/main/stable/class/Message Messages}.
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
 *   customId: 'CustomStopAction',
 *   run: ({ collector }) => {
 *     collector.stop();
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
	 * The collector used for handling button clicks.
	 */
	public collector: InteractionCollector<ButtonInteraction> | null = null;

	/**
	 * The pages which were converted from {@link PaginatedMessage.pages}
	 */
	public messages: (MessagePage | null)[] = [];

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
	public template: MessageOptionsUnion;

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

	private paginatedMessageData: Omit<MessageOptionsUnion, 'components'> | null = null;

	private wrongUserInteractionReply: (targetUser: User, interactionUser: User) => Parameters<MessageComponentInteraction['reply']>[0] =
		PaginatedMessage.wrongUserInteractionReply;

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
		paginatedMessageData = null
	}: PaginatedMessageOptions = {}) {
		this.pages = pages ?? [];

		for (const page of this.pages) {
			if (isFunction(page) || isObject(page)) {
				this.messages.push(page);
			}
		}

		for (const action of actions ?? this.constructor.defaultActions) {
			this.actions.set(action.customId, action);
		}

		this.template = PaginatedMessage.resolveTemplate(template);
		this.pageIndexPrefix = pageIndexPrefix ?? PaginatedMessage.pageIndexPrefix;
		this.embedFooterSeparator = embedFooterSeparator ?? PaginatedMessage.embedFooterSeparator;
		this.paginatedMessageData = paginatedMessageData;
	}

	/**
	 * Sets the {@link PaginatedMessage.promptPageJumpToMessage}.
	 * This will apply to all instance of {@link PaginatedMessage}
	 * @param promptPageJumpToMessage The new `promptPageJumpToMessage` to set
	 * @returns The current instance of {@link PaginatedMessage}
	 */
	public setPromptPageJumpToMessage(promptPageJumpToMessage: promptPageJumpToMessageFunction) {
		PaginatedMessage.promptPageJumpToMessage = promptPageJumpToMessage;
		return this;
	}

	/**
	 * Sets the {@link PaginatedMessage.wrongUserInteractionReply} for this instance of {@link PaginatedMessage}.
	 * This will only apply to this one instance and no others.
	 * @param wrongUserInteractionReply The new `wrongUserInteractionReply` to set
	 * @returns The current instance of {@link PaginatedMessage}
	 */
	public setWrongUserInteractionReply(wrongUserInteractionReply: WrongUserInteractionReplyFunction) {
		this.wrongUserInteractionReply = wrongUserInteractionReply;
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
		this.actions.set(action.customId, action);
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

		if (isFunction(page) || isObject(page)) {
			this.messages.push(page);
		}

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
	 * The handler will start collecting message button interactions.
	 * @param message The message that triggered this {@link PaginatedMessage}.
	 * Generally this will be the command message, but it can also be another message from your client, i.e. to indicate a loading state.
	 * @param target The user who will be able to interact with the message buttons of this {@link PaginatedMessage}. Defaults to `message.author`.
	 */
	public async run(message: Message, target = message.author): Promise<this> {
		// Try to get the previous PaginatedMessage for this user
		const paginatedMessage = PaginatedMessage.handlers.get(target.id);

		// If a PaginatedMessage was found then stop it
		if (paginatedMessage) paginatedMessage.collector!.stop();

		// If the message was sent by a bot, then set the response as this one
		if (message.author.bot) this.response = message;

		await this.resolvePagesOnRun();

		// Sanity checks to handle
		if (!this.messages.length) throw new Error('There are no messages.');
		if (!this.actions.size) throw new Error('There are no messages.');

		await this.setUpMessage(message.channel);
		this.setUpCollector(message.channel, target);

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
	public async resolvePagesOnRun(): Promise<void> {
		for (let i = 0; i < this.pages.length; i++) await this.resolvePage(i);
	}

	/**
	 * Executed whenever an action is triggered and resolved.
	 * @param index The index to resolve.
	 */
	public async resolvePage(index: number): Promise<MessagePage> {
		// If the message was already processed, do not load it again:
		const message = this.messages[index];
		if (message !== null) return message;

		// Load the page and return it:
		const resolved = await this.handlePageLoad(this.pages[index], index);
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
	protected async setUpMessage(channel: Message['channel']): Promise<void> {
		// Get the current page
		let page = this.messages[this.index]!;

		// Merge in the advanced options
		page = { ...page, ...(this.paginatedMessageData ?? {}) };

		const messageComponents = [...this.actions.values()].map((button) => new MessageButton(button));

		const rowChunkedComponents = chunk(messageComponents, 5);
		const actionRows = rowChunkedComponents.map((components) => new MessageActionRow().setComponents(components));

		page.components = actionRows;

		if (this.response) await this.response.edit(page as WebhookEditMessageOptions);
		else this.response = await channel.send(page as MessageOptions);
	}

	/**
	 * Sets up the message's collector.
	 * @param channel The channel the handler is running at.
	 * @param targetUser The user the handler is for.
	 */
	protected setUpCollector(channel: Message['channel'], targetUser: User): void {
		if (this.pages.length > 1) {
			this.collector = this.response!.createMessageComponentCollector<MessageComponentTypes.BUTTON>({
				filter: (interaction) => this.actions.has(interaction.customId),
				idle: this.idle
			})
				.on('collect', this.handleCollect.bind(this, targetUser, channel))
				.on('end', this.handleEnd.bind(this));
		}
	}

	/**
	 * Handles the load of a page.
	 * @param page The page to be loaded.
	 * @param channel The channel the paginated message runs at.
	 * @param index The index of the current page.
	 */
	protected async handlePageLoad(page: MessagePage, index: number): Promise<MessageOptionsUnion> {
		const options = isFunction(page) ? await page(index, this.pages, this) : page;
		const resolved = isObject(options) ? options : this.applyTemplate(this.template, options);
		return this.applyFooter(resolved, index);
	}

	/**
	 * Handles the `collect` event from the collector.
	 * @param targetUser The user the handler is for.
	 * @param channel The channel the handler is running at.
	 * @param interaction The button interaction that was received.
	 */
	protected async handleCollect(targetUser: User, channel: Message['channel'], interaction: ButtonInteraction): Promise<void> {
		if (interaction.user.id === targetUser.id) {
			const action = this.actions.get(interaction.customId)!;
			const previousIndex = this.index;

			await action.run({
				interaction,
				handler: this,
				author: targetUser,
				channel,
				response: this.response!,
				collector: this.collector!
			});

			const newIndex = previousIndex === this.index ? previousIndex : this.index;
			const messagePage = await this.resolvePage(newIndex);
			const updateOptions = isFunction(messagePage) ? await messagePage(newIndex, this.pages, this) : messagePage;

			if (interaction.replied || interaction.deferred) {
				await interaction.editReply(updateOptions);
			} else {
				await interaction.update(updateOptions);
			}
		} else {
			const interactionReplyOptions = this.wrongUserInteractionReply(targetUser, interaction.user);

			await interaction.reply(
				isObject(interactionReplyOptions)
					? interactionReplyOptions
					: { content: interactionReplyOptions, ephemeral: true, allowedMentions: { users: [], roles: [] } }
			);
		}
	}

	/**
	 * Handles the `end` event from the collector.
	 * @param reason The reason for which the collector was ended.
	 */
	protected handleEnd(_: Collection<Snowflake, ButtonInteraction>, reason: string): void {
		// Remove all listeners from the collector:
		this.collector?.removeAllListeners();

		// Do not remove components if the message, channel, or guild, was deleted:
		if (this.response && !PaginatedMessage.deletionStopReasons.includes(reason)) {
			void this.response?.edit({ components: [] });
		}
	}

	protected applyFooter(message: MessageOptionsUnion, index: number): MessageOptionsUnion {
		if (!message.embeds?.length) return message;

		for (const [idx, embed] of Object.entries(message.embeds)) {
			if (embed) {
				embed.footer ??= { text: this.template.embeds?.[Number(idx)]?.footer?.text ?? this.template.embeds?.[0]?.footer?.text ?? '' };
				embed.footer.text = `${this.pageIndexPrefix ? `${this.pageIndexPrefix} ` : ''}${index + 1} / ${this.pages.length}${
					embed.footer.text ? ` ${this.embedFooterSeparator} ${embed.footer.text}` : ''
				}`;
			}
		}

		return message;
	}

	private applyTemplate(template: MessageOptionsUnion, options: MessageOptionsUnion): MessageOptionsUnion {
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
			customId: '@sapphire/paginated-messages.goToPage',
			style: 'PRIMARY',
			emoji: '🔢',
			run: async ({ handler, author, channel, interaction }) => {
				await interaction.deferUpdate();

				const promptPageJumpToMessage = PaginatedMessage.promptPageJumpToMessage(interaction.user);

				await interaction.followUp(
					isObject(promptPageJumpToMessage)
						? promptPageJumpToMessage
						: { content: promptPageJumpToMessage, ephemeral: true, allowedMentions: { users: [], roles: [] } }
				);

				const collected = await channel
					.awaitMessages({
						filter: (message: Message) => message.author.id === author.id,
						max: 1,
						idle: Time.Minute * 10
					})
					.catch(() => null);

				if (collected) {
					const responseMessage = collected.first();

					if (responseMessage) {
						if (responseMessage.deletable) {
							await responseMessage.delete();
						}

						const i = Number(responseMessage.content) - 1;

						if (!Number.isNaN(i) && handler.hasPage(i)) handler.index = i;
					}
				}
			}
		},
		{
			customId: '@sapphire/paginated-messages.firstPage',
			style: 'PRIMARY',
			emoji: '⏪',
			run: ({ handler }) => (handler.index = 0)
		},
		{
			customId: '@sapphire/paginated-messages.previousPage',
			style: 'PRIMARY',
			emoji: '◀️',
			run: ({ handler }) => {
				if (handler.index === 0) handler.index = handler.pages.length - 1;
				else --handler.index;
			}
		},
		{
			customId: '@sapphire/paginated-messages.nextPage',
			style: 'PRIMARY',
			emoji: '▶️',
			run: ({ handler }) => {
				if (handler.index === handler.pages.length - 1) handler.index = 0;
				else ++handler.index;
			}
		},
		{
			customId: '@sapphire/paginated-messages.goToLastPage',
			style: 'PRIMARY',
			emoji: '⏩',
			run: ({ handler }) => (handler.index = handler.pages.length - 1)
		},
		{
			customId: '@sapphire/paginated-messages.stop',
			style: 'DANGER',
			emoji: '⏹️',
			run: async ({ collector, response }) => {
				collector.stop();
				await response.edit({ components: [] });
			}
		}
	];

	/**
	 * The reasons sent by {@linkplain https://discord.js.org/#/docs/main/stable/class/InteractionCollector?scrollTo=e-end InteractionCollector#end}
	 * event when the message (or its owner) has been deleted.
	 */
	public static deletionStopReasons = ['messageDelete', 'channelDelete', 'guildDelete'];

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
	 * The current {@link InteractionCollector} handlers that are active.
	 * The key is the ID of of the author who sent the message that triggered this {@link PaginatedMessage}
	 *
	 * This is to ensure that any given author can only trigger 1 {@link PaginatedMessage}.
	 * This is important for performance reasons, and users should not have more than 1 {@link PaginatedMessage} open at once.
	 */
	public static readonly handlers = new Map<string, PaginatedMessage>();

	/**
	 * A generator for {@link MessageComponentInteraction#followUp} that will be called and sent whenever the user presses the 🔢 button, prompting them to sent their page of choice.
	 * When modifying this it is recommended that the message is set to be ephemeral so only the user that is pressing the buttons can see them.
	 * Furthermore, we also recommend setting `allowedMentions: { users: [], roles: [] }`, so you don't have to worry about accidentally pinging anyone.
	 *
	 * When setting just a string, we will add `{ ephemeral: true, allowedMentions: { users: [], roles: [] } }` for you.
	 *
	 * @param interactionUser The {@link User} that clicked the button.
	 * @default
	 * ```ts
	 * {
	 * 	content: `What page would you like to jump to?`,
	 * 	ephemeral: true,
	 * 	allowedMentions: { users: [], roles: [] }
	 * }
	 * ```
	 * @remark To overwrite this property change it in a "setup" file prior to calling `client.login()` for your bot.
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 *
	 * // We  will add ephemeral and no allowed mention for string only overwrites
	 * PaginatedMessage.promptPageJumpToMessage = (interactionUser) =>
	 *     `Please send the number of the page you would like to jump to.`;
	 * ```
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 * import { Formatters } from 'discord.js';
	 *
	 * PaginatedMessage.promptPageJumpToMessage = (interactionUser) => ({
	 * 	content: `${Formatters.userMention(interactionUser.id)}, please tell me which page you want to jump to.`,
	 * 	ephemeral: true,
	 * 	allowedMentions: { users: [], roles: [] }
	 * });
	 * ```
	 */
	public static promptPageJumpToMessage: promptPageJumpToMessageFunction = () => ({
		content: 'What page would you like to jump to?',
		ephemeral: true,
		allowedMentions: { users: [], roles: [] }
	});

	/**
	 * A generator for {@link MessageComponentInteraction#reply} that will be called and sent whenever an untargeted user interacts with one of the buttons.
	 * When modifying this it is recommended that the message is set to be ephemeral so only the user that is pressing the buttons can see them.
	 * Furthermore, we also recommend setting `allowedMentions: { users: [], roles: [] }`, so you don't have to worry about accidentally pinging anyone.
	 *
	 * When setting just a string, we will add `{ ephemeral: true, allowedMentions: { users: [], roles: [] } }` for you.
	 *
	 * @param targetUser The {@link User} this {@link PaginatedMessage} was intended for.
	 * @param interactionUser The {@link User} that actually clicked the button.
	 * @default
	 * ```ts
	 * {
	 * 	content: `Only ${Formatters.userMention(targetUser.id)} may interact with these buttons.`,
	 * 	ephemeral: true,
	 * 	allowedMentions: { users: [], roles: [] }
	 * }
	 * ```
	 * @remark To overwrite this property change it in a "setup" file prior to calling `client.login()` for your bot.
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 *
	 * // We  will add ephemeral and no allowed mention for string only overwrites
	 * PaginatedMessage.wrongUserInteractionReply = (targetUser) =>
	 *     `These buttons are only for ${Formatters.userMention(targetUser.id)}. Press them as much as you want, but I won't do anything with your clicks.`;
	 * ```
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 * import { Formatters } from 'discord.js';
	 *
	 * PaginatedMessage.wrongUserInteractionReply = (targetUser) => ({
	 * 	content: `These buttons are only for ${Formatters.userMention(
	 * 		targetUser.id
	 * 	)}. Press them as much as you want, but I won't do anything with your clicks.`,
	 * 	ephemeral: true,
	 * 	allowedMentions: { users: [], roles: [] }
	 * });
	 * ```
	 */
	public static wrongUserInteractionReply: WrongUserInteractionReplyFunction = (targetUser: User) => ({
		content: `Only ${Formatters.userMention(targetUser.id)} may interact with these buttons.`,
		ephemeral: true,
		allowedMentions: { users: [], roles: [] }
	});

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
 *   customId: 'CustomStopAction',
 *   emoji: '⏹️',
 *   run: ({ collector }) => {
 *     collector.stop();
 *   }
 * }
 * ```
 */
export interface IPaginatedMessageAction extends InteractionButtonOptions {
	run(context: PaginatedMessageActionContext): Awaitable<unknown>;
}

/**
 * The context to be used in {@link IPaginatedMessageAction}.
 */
export interface PaginatedMessageActionContext {
	interaction: ButtonInteraction;
	handler: PaginatedMessage;
	author: User;
	channel: Message['channel'];
	response: Message;
	collector: InteractionCollector<ButtonInteraction>;
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
	paginatedMessageData?: Omit<MessageOptionsUnion, 'components'> | null;
}

/**
 * The pages that are used for {@link PaginatedMessage.pages}
 *
 * Pages can be either a {@link Message},
 * or an {@link Awaitable} function that returns a {@link Message}.
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
export type MessagePage = ((index: number, pages: MessagePage[], handler: PaginatedMessage) => Awaitable<MessageOptionsUnion>) | MessageOptionsUnion;

/**
 * The type of the custom function that can be set for the {@link PaginatedMessage.promptPageJumpToMessage}
 */
export type promptPageJumpToMessageFunction = (interactionUser: User) => Parameters<MessageComponentInteraction['reply']>[0];

/**
 * The type of the custom function that can be set for the {@link PaginatedMessage.wrongUserInteractionReply}
 */
export type WrongUserInteractionReplyFunction = (targetUser: User, interactionUser: User) => Parameters<MessageComponentInteraction['reply']>[0];

type EmbedResolvable = MessageOptions['embeds'];

type MessageOptionsUnion = MessageOptions | WebhookEditMessageOptions;

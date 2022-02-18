import { Time } from '@sapphire/time-utilities';
import { deepClone, isFunction, isNullish, isObject } from '@sapphire/utilities';
import type { APIMessage } from 'discord-api-types/v9';
import {
	Constants,
	Formatters,
	Intents,
	InteractionCollector,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	type ButtonInteraction,
	type Collection,
	type CommandInteraction,
	type ContextMenuInteraction,
	type Message,
	type MessageComponentInteraction,
	type MessageOptions,
	type SelectMenuInteraction,
	type Snowflake,
	type TextBasedChannel,
	type User,
	type WebhookEditMessageOptions
} from 'discord.js';
import { MessageBuilder } from '../builders/MessageBuilder';
import { isGuildBasedChannel, isMessageInstance } from '../type-guards';
import type {
	PaginatedMessageAction,
	PaginatedMessageEmbedResolvable,
	PaginatedMessageMessageOptionsUnion,
	PaginatedMessageOptions,
	PaginatedMessagePage,
	PaginatedMessageSelectMenuOptionsFunction,
	PaginatedMessageWrongUserInteractionReplyFunction
} from './PaginatedMessageTypes';
import { actionIsButtonOrMenu, createPartitionedMessageRow, isMessageButtonInteraction, runsOnInteraction, safelyReplyToInteraction } from './utils';

/**
 * This is a {@link PaginatedMessage}, a utility to paginate messages (usually embeds).
 * You must either use this class directly or extend it.
 *
 * @remark Please note that for {@link PaginatedMessage} to work in DMs to your client, you need to add the `'CHANNEL'` partial to your `client.options.partials`.
 * Message based commands can always be used in DMs, whereas Chat Input interactions can only be used in DMs when they are registered globally.
 *
 * {@link PaginatedMessage} uses {@linkplain https://discord.js.org/#/docs/main/stable/typedef/MessageComponent MessageComponent} buttons that perform the specified action when clicked.
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
 *			.setEmbeds([embed]);
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
	/** The response we send when someone gets into an invalid flow */
	#thisMazeWasNotMeantForYouContent = { content: "This maze wasn't meant for you...what did you do." };

	// #region public class properties
	/**
	 * The pages to be converted to {@link PaginatedMessage.messages}
	 */
	public pages: PaginatedMessagePage[];

	/**
	 * The response message used to edit on page changes.
	 */
	public response: APIMessage | Message | CommandInteraction | ContextMenuInteraction | SelectMenuInteraction | ButtonInteraction | null = null;

	/**
	 * The collector used for handling component interactions.
	 */
	public collector: InteractionCollector<MessageComponentInteraction> | null = null;

	/**
	 * The pages which were converted from {@link PaginatedMessage.pages}
	 */
	public messages: (PaginatedMessagePage | null)[] = [];

	/**
	 * The actions which are to be used.
	 */
	public actions = new Map<string, PaginatedMessageAction>();

	/**
	 * The handler's current page/message index.
	 */
	public index = 0;

	/**
	 * The amount of milliseconds to idle before the paginator is closed.
	 * @default 14.5 minutes
	 * @remark This is to ensure it is a bit before interactions expire.
	 */
	public idle = Time.Minute * 14.5;

	/**
	 * The template for this {@link PaginatedMessage}.
	 * You can use templates to set defaults that will apply to each and every page in the {@link PaginatedMessage}
	 */
	public template: PaginatedMessageMessageOptionsUnion;

	/**
	 * Custom text to show in front of the page index in the embed footer.
	 * PaginatedMessage will automatically add a space (` `) after the given text. You do not have to add it yourself.
	 * @default ```PaginatedMessage.pageIndexPrefix``` (static property)
	 */
	public pageIndexPrefix = PaginatedMessage.pageIndexPrefix;

	/**
	 * Custom separator to show after the page index in the embed footer.
	 * PaginatedMessage will automatically add a space (` `) after the given text. You do not have to add it yourself.
	 * @default ```PaginatedMessage.embedFooterSeparator``` (static property)
	 */
	public embedFooterSeparator = PaginatedMessage.embedFooterSeparator;

	/**
	 * A list of `customId` that are bound to actions that will stop the {@link PaginatedMessage}
	 * @default ```PaginatedMessage.stopPaginatedMessageCustomIds``` (static property)
	 */
	public stopPaginatedMessageCustomIds = PaginatedMessage.stopPaginatedMessageCustomIds;

	/**
	 * Whether to emit the warning about running a {@link PaginatedMessage} in a DM channel without the client having the `'CHANNEL'` partial.
	 * @remark When using message based commands (as opposed to Application Commands) then you will also need to specify the `DIRECT_MESSAGE` intent for {@link PaginatedMessage} to work.
	 *
	 * @default ```PaginatedMessage.emitPartialDMChannelWarning``` (static property)
	 */
	public emitPartialDMChannelWarning = PaginatedMessage.emitPartialDMChannelWarning;

	// #endregion
	// #region protected class properties
	protected paginatedMessageData: Omit<PaginatedMessageMessageOptionsUnion, 'components'> | null = null;

	protected selectMenuOptions: PaginatedMessageSelectMenuOptionsFunction = PaginatedMessage.selectMenuOptions;

	protected wrongUserInteractionReply: PaginatedMessageWrongUserInteractionReplyFunction = PaginatedMessage.wrongUserInteractionReply;

	/**
	 * Tracks whether a warning was already emitted for this {@link PaginatedMessage}
	 * concerning the maximum amount of pages in the {@link SelectMenu}.
	 */
	protected hasEmittedMaxPageWarning = false;

	/**
	 * Tracks whether a warning was already emitted for this {@link PaginatedMessage}
	 * concerning the {@link PaginatedMessage} being called in a `DMChannel`
	 * without the client having the `'Channel'` partial.
	 *
	 * @remark When using message based commands (as opposed to Application Commands) then you will also need to specify the `DIRECT_MESSAGE` intent for {@link PaginatedMessage} to work.
	 */
	protected hasEmittedPartialDMChannelWarning = false;

	// #endregion

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
			if (actionIsButtonOrMenu(action)) {
				this.actions.set(action.customId, action);
			} else {
				this.actions.set(action.url, action);
			}
		}

		this.template = PaginatedMessage.resolveTemplate(template);
		this.pageIndexPrefix = pageIndexPrefix ?? PaginatedMessage.pageIndexPrefix;
		this.embedFooterSeparator = embedFooterSeparator ?? PaginatedMessage.embedFooterSeparator;
		this.paginatedMessageData = paginatedMessageData;
	}

	// #region property setters

	/**
	 * Sets the {@link PaginatedMessage.selectMenuOptions} for this instance of {@link PaginatedMessage}.
	 * This will only apply to this one instance and no others.
	 * @param newOptions The new options generator to set
	 * @returns The current instance of {@link PaginatedMessage}
	 */
	public setSelectMenuOptions(newOptions: PaginatedMessageSelectMenuOptionsFunction): this {
		this.selectMenuOptions = newOptions;
		return this;
	}

	/**
	 * Sets the {@link PaginatedMessage.wrongUserInteractionReply} for this instance of {@link PaginatedMessage}.
	 * This will only apply to this one instance and no others.
	 * @param wrongUserInteractionReply The new `wrongUserInteractionReply` to set
	 * @returns The current instance of {@link PaginatedMessage}
	 */
	public setWrongUserInteractionReply(wrongUserInteractionReply: PaginatedMessageWrongUserInteractionReplyFunction): this {
		this.wrongUserInteractionReply = wrongUserInteractionReply;
		return this;
	}

	/**
	 * Sets the {@link PaginatedMessage.stopPaginatedMessageCustomIds} for this instance of {@link PaginatedMessage}.
	 * This will only apply to this one instance and no others.
	 * @param stopPaginatedMessageCustomIds The new `stopPaginatedMessageCustomIds` to set
	 * @returns The current instance of {@link PaginatedMessage}
	 */
	public setStopPaginatedMessageCustomIds(stopPaginatedMessageCustomIds: string[]): this {
		this.stopPaginatedMessageCustomIds = stopPaginatedMessageCustomIds;
		return this;
	}

	/**
	 * Sets the {@link PaginatedMessage.emitPartialDMChannelWarning} for this instance of {@link PaginatedMessage}.
	 * This will only apply to this one instance and no others.
	 * @param emitPartialDMChannelWarning The new `emitPartialDMChannelWarning` to set
	 * @returns The current instance of {@link PaginatedMessage}
	 */
	public setEmitPartialDMChannelWarning(emitPartialDMChannelWarning: boolean): this {
		this.emitPartialDMChannelWarning = emitPartialDMChannelWarning;
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

	// #endregion
	// #region actions related methods

	/**
	 * Clears all current actions and sets them. The order given is the order they will be used.
	 * @param actions The actions to set. This can be either a Button, Link Button, or Select Menu.
	 * @param includeDefaultActions Whether to merge in the {@link PaginatedMessage.defaultActions} when setting the actions.
	 * If you set this to true then you do not need to manually add `...PaginatedMessage.defaultActions` as seen in the first example.
	 * The default value is `false` for backwards compatibility within the current major version.
	 *
	 * @remark You can retrieve the default actions for the regular pagination
	 * @example
	 * ```typescript
	 * const display = new PaginatedMessage();
	 *
	 * display.setActions([
	 *   ...PaginatedMessage.defaultActions,
	 * ])
	 * ```
	 *
	 * @remark You can add custom Message Buttons by providing `style`, `customId`, `type`, `run` and at least one of `label` or `emoji`.
	 * @example
	 * ```typescript
	 * const display = new PaginatedMessage();
	 *
	 * display.setActions([
	 *   {
	 *     style: 'PRIMARY',
	 *     label: 'My Button',
	 *     customId: 'custom_button',
	 *     type: Constants.MessageComponentTypes.BUTTON,
	 *     run: (context) => console.log(context)
	 *   }
	 * ], true);
	 * ```
	 *
	 * @remark You can add custom Message **Link** Buttons by providing `style`, `url`, `type`, and at least one of `label` or `emoji`.
	 * @example
	 * ```typescript
	 * const display = new PaginatedMessage();
	 *
	 * display.setActions([
	 *   {
	 *     style: 'LINK',
	 *     label: 'Sapphire Website',
	 *     emoji: '🔷',
	 *     url: 'https://sapphirejs.dev',
	 *     type: Constants.MessageComponentTypes.BUTTON
	 *   }
	 * ], true);
	 * ```
	 *
	 * @remark You can add custom Select Menus by providing `customId`, `type`, and `run`.
	 * @example
	 * ```typescript
	 * const display = new PaginatedMessage();
	 *
	 * display.setActions([
	 *   {
	 *     customId: 'custom_menu',
	 *     type: Constants.MessageComponentTypes.SELECT_MENU,
	 *     run: (context) => console.log(context) // Do something here
	 *   }
	 * ], true);
	 * ```
	 */
	public setActions(actions: PaginatedMessageAction[], includeDefaultActions = false): this {
		this.actions.clear();
		return this.addActions([...(includeDefaultActions ? PaginatedMessage.defaultActions : []), ...actions]);
	}

	/**
	 * Adds actions to the existing ones. The order given is the order they will be used.
	 * @param actions The actions to add.
	 * @see {@link PaginatedMessage.setActions} for examples on how to structure the actions.
	 */
	public addActions(actions: PaginatedMessageAction[]): this {
		for (const action of actions) this.addAction(action);
		return this;
	}

	/**
	 * Adds an action to the existing ones. This will be added as the last action.
	 * @param action The action to add.
	 * @see {@link PaginatedMessage.setActions} for examples on how to structure the action.
	 */
	public addAction(action: PaginatedMessageAction): this {
		if (actionIsButtonOrMenu(action)) {
			this.actions.set(action.customId, action);
		} else {
			this.actions.set(action.url, action);
		}

		return this;
	}

	// #endregion
	// #region page related methods

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
	public setPages(pages: PaginatedMessagePage[]) {
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
	public addPage(page: PaginatedMessagePage): this {
		// Do not allow more than 25 pages, and send a warning when people try to do so.
		if (this.pages.length === 25) {
			if (!this.hasEmittedMaxPageWarning) {
				process.emitWarning(
					'Maximum amount of pages exceeded for PaginatedMessage. Please check your instance of PaginatedMessage and ensure that you do not exceed 25 pages total.',
					{
						type: 'PaginatedMessageExceededMessagePageAmount',
						code: 'PAGINATED_MESSAGE_EXCEEDED_MAXIMUM_AMOUNT_OF_PAGES',
						detail: `If you do need more than 25 pages you can extend the class and overwrite the actions in the constructor.`
					}
				);
				this.hasEmittedMaxPageWarning = true;
			}

			return this;
		}

		this.pages.push(page);

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
	 * 			.setEmbeds([embed]);
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
	 * 	.setEmbeds([embed]);
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
	 * 			.setEmbeds([embed]);
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
	public addPages(pages: PaginatedMessagePage[]): this {
		for (const page of pages) this.addPage(page);
		return this;
	}

	// #endregion

	/**
	 * Executes the {@link PaginatedMessage} and sends the pages corresponding with {@link PaginatedMessage.index}.
	 * The handler will start collecting message component interactions.
	 *
	 * @remark Please note that for {@link PaginatedMessage} to work in DMs to your client, you need to add the `'CHANNEL'` partial to your `client.options.partials`.
	 * Message based commands can always be used in DMs, whereas Chat Input interactions can only be used in DMs when they are registered globally.
	 *
	 * @param messageOrInteraction The message or interaction that triggered this {@link PaginatedMessage}.
	 * Generally this will be the command message or an interaction
	 * (either a {@link CommandInteraction}, a {@link ContextMenuInteraction}, a {@link SelectMenuInteraction} or a {@link ButtonInteraction}),
	 * but it can also be another message from your client, i.e. to indicate a loading state.
	 *
	 * @param target The user who will be able to interact with the buttons of this {@link PaginatedMessage}.
	 * If `messageOrInteraction` is an instance of {@link Message} then this defaults to {@link Message.author messageOrInteraction.author},
	 * and if it is an instance of {@link CommandInteraction} then it defaults to {@link CommandInteraction.user messageOrInteraction.user}.
	 */
	public async run(
		messageOrInteraction: Message | CommandInteraction | ContextMenuInteraction | SelectMenuInteraction | ButtonInteraction,
		target?: User
	): Promise<this> {
		// If there is no channel then exit early and potentially emit a warning
		if (!messageOrInteraction.channel) {
			const isInteraction = runsOnInteraction(messageOrInteraction);
			let shouldEmitWarning = this.emitPartialDMChannelWarning;

			// If we are to emit a warning,
			//   then check if a warning was already emitted,
			//   in which case we don't want to emit a warning.
			if (shouldEmitWarning && this.hasEmittedPartialDMChannelWarning) {
				shouldEmitWarning = false;
			}

			// If we are to emit a warning,
			//   then check if the interaction is an interaction based command,
			//   and check if the client has the `'CHANNEL'` partial,
			//   in which case we don't want to emit a warning.
			if (shouldEmitWarning && isInteraction && messageOrInteraction.client.options.partials?.includes('CHANNEL')) {
				shouldEmitWarning = false;
			}

			// IF we are to emit a warning,
			//   then check if the interaction is a message based command,
			//   and check if the client has the 'CHANNEL' partial,
			//   and check if the client has the 'DIRECT_MESSAGE' intent',
			//   in which case we don't want to emit a warning.
			if (
				shouldEmitWarning &&
				!isInteraction &&
				messageOrInteraction.client.options.partials?.includes('CHANNEL') &&
				new Intents(messageOrInteraction.client.options.intents).has(Intents.FLAGS.DIRECT_MESSAGES)
			) {
				shouldEmitWarning = false;
			}

			// If we should emit a warning then do so.
			if (shouldEmitWarning) {
				process.emitWarning(
					[
						'PaginatedMessage was initiated in a DM channel without the client having the required partial configured.',
						'If you want PaginatedMessage to work in DM channels then make sure you start your client with "CHANNEL" added to "client.options.partials".',
						'Furthermore if you are using message based commands (as opposed to application commands) then you will also need to add the "DIRECT_MESSAGE" intent to "client.options.intents"',
						'If you do not want to be alerted about this in the future then you can disable this warning by setting "PaginatedMessage.emitPartialDMChannelWarning" to "false", or use "setEmitPartialDMChannelWarning(false)" before calling "run".'
					].join('\n'),
					{
						type: 'PaginatedMessageRunsInNonpartialDMChannel',
						code: 'PAGINATED_MESSAGE_RUNS_IN_NON_PARTIAL_DM_CHANNEL'
					}
				);
				this.hasEmittedPartialDMChannelWarning = true;
			}

			await safelyReplyToInteraction({
				messageOrInteraction,
				interactionEditReplyContent: this.#thisMazeWasNotMeantForYouContent,
				interactionReplyContent: { ...this.#thisMazeWasNotMeantForYouContent, ephemeral: true },
				componentUpdateContent: this.#thisMazeWasNotMeantForYouContent,
				messageMethod: 'reply',
				messageMethodContent: this.#thisMazeWasNotMeantForYouContent
			});

			return this;
		}

		// Assign the target based on whether a Message or CommandInteraction was passed in
		target ??= runsOnInteraction(messageOrInteraction) ? messageOrInteraction.user : messageOrInteraction.author;

		// Try to get the previous PaginatedMessage for this user
		const paginatedMessage = PaginatedMessage.handlers.get(target.id);

		// If a PaginatedMessage was found then stop it
		paginatedMessage?.collector?.stop();

		// If the message was sent by a bot, then set the response as this one
		if (runsOnInteraction(messageOrInteraction)) {
			if (messageOrInteraction.user.bot && messageOrInteraction.user.id === messageOrInteraction.client.user?.id) {
				this.response = messageOrInteraction;
			}
		} else if (messageOrInteraction.author.bot && messageOrInteraction.author.id === messageOrInteraction.client.user?.id) {
			this.response = messageOrInteraction;
		}

		await this.resolvePagesOnRun();

		// Sanity checks to handle
		if (!this.messages.length) throw new Error('There are no messages.');
		if (!this.actions.size) throw new Error('There are no actions.');

		await this.setUpMessage(messageOrInteraction, target);
		this.setUpCollector(messageOrInteraction.channel, target);

		const messageId = this.response!.id;

		if (this.collector) {
			this.collector.once('end', () => {
				PaginatedMessage.messages.delete(messageId);
				PaginatedMessage.handlers.delete(target!.id);
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
		for (let i = 0; i < this.pages.length; i++) {
			await this.resolvePage(i);
		}
	}

	/**
	 * Executed whenever an action is triggered and resolved.
	 * @param index The index to resolve.
	 */
	public async resolvePage(index: number): Promise<PaginatedMessagePage> {
		// If the message was already processed, do not load it again:
		const message = this.messages[index];
		if (!isNullish(message)) {
			return message;
		}

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
	 *
	 * @param messageOrInteraction The message or interaction that triggered this {@link PaginatedMessage}.
	 * Generally this will be the command message or an interaction
	 * (either a {@link CommandInteraction}, a {@link ContextMenuInteraction}, a {@link SelectMenuInteraction} or a {@link ButtonInteraction}),
	 * but it can also be another message from your client, i.e. to indicate a loading state.
	 *
	 * @param author The author the handler is for.
	 */
	protected async setUpMessage(
		messageOrInteraction: Message | CommandInteraction | ContextMenuInteraction | SelectMenuInteraction | ButtonInteraction,
		targetUser: User
	): Promise<void> {
		// Get the current page
		let page = this.messages[this.index]!;

		// If the page is a callback function such as with `addAsyncPageEmbed` then resolve it here
		page = isFunction(page) ? await page(this.index, this.pages, this) : page;

		// Merge in the advanced options
		page = { ...page, ...(this.paginatedMessageData ?? {}) };

		// If we do not have more than 1 page then there is no reason to add message components
		if (this.pages.length > 1) {
			const messageComponents = await Promise.all(
				[...this.actions.values()].map<Promise<MessageButton | MessageSelectMenu>>(async (interaction) => {
					return isMessageButtonInteraction(interaction)
						? new MessageButton(interaction)
						: new MessageSelectMenu({
								options: await Promise.all(
									this.pages.map(async (_, index) => ({
										...(await this.selectMenuOptions(index + 1, {
											author: targetUser,
											channel: messageOrInteraction.channel,
											guild: isGuildBasedChannel(messageOrInteraction.channel) ? messageOrInteraction.channel.guild : null
										})),
										value: index.toString()
									}))
								),
								...interaction
						  });
				})
			);

			page.components = createPartitionedMessageRow(messageComponents);
		}

		if (this.response) {
			if (runsOnInteraction(this.response)) {
				if (this.response.replied || this.response.deferred) {
					await this.response.editReply(page as WebhookEditMessageOptions);
				} else {
					await this.response.reply(page as WebhookEditMessageOptions);
				}
			} else if (isMessageInstance(this.response)) {
				await this.response.edit(page as WebhookEditMessageOptions);
			}
		} else if (runsOnInteraction(messageOrInteraction)) {
			if (messageOrInteraction.replied || messageOrInteraction.deferred) {
				this.response = await messageOrInteraction.editReply(page);
			} else {
				this.response = await messageOrInteraction.reply({ ...page, fetchReply: true, ephemeral: false });
			}
		} else {
			this.response = await messageOrInteraction.channel.send(page as MessageOptions);
		}
	}

	/**
	 * Sets up the message's collector.
	 * @param channel The channel the handler is running at.
	 * @param targetUser The user the handler is for.
	 */
	protected setUpCollector(channel: TextBasedChannel, targetUser: User): void {
		if (this.pages.length > 1) {
			this.collector = new InteractionCollector<MessageComponentInteraction>(targetUser.client, {
				filter: (interaction) =>
					!isNullish(this.response) && //
					interaction.isMessageComponent() &&
					this.actions.has(interaction.customId),

				time: this.idle,

				guild: isGuildBasedChannel(channel) ? channel.guild : undefined,

				channel,

				interactionType: Constants.InteractionTypes.MESSAGE_COMPONENT,

				...(!isNullish(this.response) && !runsOnInteraction(this.response)
					? {
							message: this.response
					  }
					: {})
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
	protected async handlePageLoad(page: PaginatedMessagePage, index: number): Promise<PaginatedMessageMessageOptionsUnion> {
		// Resolve the options from a function or an object
		const options = isFunction(page) ? await page(index, this.pages, this) : page;

		// Clone the template to leave the original intact
		const clonedTemplate = deepClone(this.template);

		// Apply the template to the page
		const optionsWithTemplate = this.applyTemplate(clonedTemplate, options);

		// Apply the footer to the embed, if any
		return this.applyFooter(optionsWithTemplate, index);
	}

	/**
	 * Handles the `collect` event from the collector.
	 * @param targetUser The user the handler is for.
	 * @param channel The channel the handler is running at.
	 * @param interaction The button interaction that was received.
	 */
	protected async handleCollect(
		targetUser: User,
		channel: Message['channel'],
		interaction: ButtonInteraction | SelectMenuInteraction
	): Promise<void> {
		if (interaction.user.id === targetUser.id) {
			// Update the response to the latest interaction
			this.response = interaction;

			const action = this.actions.get(interaction.customId)!;

			if (actionIsButtonOrMenu(action)) {
				const previousIndex = this.index;

				await action.run({
					interaction,
					handler: this,
					author: targetUser,
					channel,
					response: this.response!,
					collector: this.collector!
				});

				if (!this.stopPaginatedMessageCustomIds.includes(action.customId)) {
					const newIndex = previousIndex === this.index ? previousIndex : this.index;
					const messagePage = await this.resolvePage(newIndex);
					const updateOptions = isFunction(messagePage) ? await messagePage(newIndex, this.pages, this) : messagePage;

					await safelyReplyToInteraction({
						messageOrInteraction: interaction,
						interactionEditReplyContent: updateOptions,
						interactionReplyContent: { ...this.#thisMazeWasNotMeantForYouContent, ephemeral: true },
						componentUpdateContent: updateOptions
					});
				}
			}
		} else {
			const interactionReplyOptions = await this.wrongUserInteractionReply(targetUser, interaction.user, {
				author: interaction.user,
				channel: interaction.channel,
				guild: interaction.guild
			});

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
	protected handleEnd(_: Collection<Snowflake, ButtonInteraction | SelectMenuInteraction>, reason: string): void {
		// Remove all listeners from the collector:
		this.collector?.removeAllListeners();

		// Do not remove components if the message, channel, or guild, was deleted:
		if (this.response && !PaginatedMessage.deletionStopReasons.includes(reason)) {
			void safelyReplyToInteraction({
				messageOrInteraction: this.response,
				interactionEditReplyContent: { components: [] },
				interactionReplyContent: { ...this.#thisMazeWasNotMeantForYouContent, ephemeral: true },
				componentUpdateContent: { components: [] },
				messageMethod: 'edit',
				messageMethodContent: { components: [] }
			});
		}
	}

	protected applyFooter(message: PaginatedMessageMessageOptionsUnion, index: number): PaginatedMessageMessageOptionsUnion {
		if (!message.embeds?.length) {
			return message;
		}

		const embedsWithFooterApplied = deepClone(message.embeds);

		for (const [idx, embed] of Object.entries(embedsWithFooterApplied)) {
			if (embed) {
				embed.footer ??= { text: this.template.embeds?.[Number(idx)]?.footer?.text ?? this.template.embeds?.[0]?.footer?.text ?? '' };
				embed.footer.text = `${this.pageIndexPrefix ? `${this.pageIndexPrefix} ` : ''}${index + 1} / ${this.pages.length}${
					embed.footer.text ? ` ${this.embedFooterSeparator} ${embed.footer.text}` : ''
				}`;
			}
		}

		return { ...message, embeds: embedsWithFooterApplied };
	}

	private applyTemplate(
		template: PaginatedMessageMessageOptionsUnion,
		options: PaginatedMessageMessageOptionsUnion
	): PaginatedMessageMessageOptionsUnion {
		const embedData = this.applyTemplateEmbed(template.embeds, options.embeds);

		return { ...template, ...options, embeds: embedData };
	}

	private applyTemplateEmbed(
		templateEmbed: PaginatedMessageEmbedResolvable,
		pageEmbeds: PaginatedMessageEmbedResolvable
	): PaginatedMessageEmbedResolvable {
		if (isNullish(pageEmbeds)) {
			return templateEmbed ? [templateEmbed?.[0]] : undefined;
		}

		if (isNullish(templateEmbed)) {
			return pageEmbeds;
		}

		return this.mergeEmbeds(templateEmbed[0], pageEmbeds);
	}

	private mergeEmbeds(
		templateEmbed: Exclude<PaginatedMessageEmbedResolvable, undefined>[0],
		pageEmbeds: Exclude<PaginatedMessageEmbedResolvable, undefined>
	): Exclude<PaginatedMessageEmbedResolvable, undefined> {
		const mergedEmbeds: Exclude<PaginatedMessageEmbedResolvable, undefined> = [];

		for (const pageEmbed of pageEmbeds) {
			mergedEmbeds.push({
				title: pageEmbed.title ?? templateEmbed.title ?? undefined,
				description: pageEmbed.description ?? templateEmbed.description ?? undefined,
				url: pageEmbed.url ?? templateEmbed.url ?? undefined,
				timestamp:
					(typeof pageEmbed.timestamp === 'string' ? new Date(pageEmbed.timestamp) : pageEmbed.timestamp) ??
					(typeof templateEmbed.timestamp === 'string' ? new Date(templateEmbed.timestamp) : templateEmbed.timestamp) ??
					undefined,
				color: pageEmbed.color ?? templateEmbed.color ?? undefined,
				fields: this.mergeArrays(templateEmbed.fields, pageEmbed.fields),
				author: pageEmbed.author ?? templateEmbed.author ?? undefined,
				thumbnail: pageEmbed.thumbnail ?? templateEmbed.thumbnail ?? undefined,
				image: pageEmbed.image ?? templateEmbed.image ?? undefined,
				video: pageEmbed.video ?? templateEmbed.video ?? undefined,
				footer: pageEmbed.footer ?? templateEmbed.footer ?? undefined
			});
		}

		return mergedEmbeds;
	}

	private mergeArrays<T>(template?: T[], array?: T[]): undefined | T[] {
		if (isNullish(array)) {
			return template;
		}

		if (isNullish(template)) {
			return array;
		}

		return [...template, ...array];
	}

	/**
	 * The default actions of this handler.
	 */
	public static defaultActions: PaginatedMessageAction[] = [
		{
			customId: '@sapphire/paginated-messages.goToPage',
			type: Constants.MessageComponentTypes.SELECT_MENU,
			run: ({ handler, interaction }) => interaction.isSelectMenu() && (handler.index = parseInt(interaction.values[0], 10))
		},
		{
			customId: '@sapphire/paginated-messages.firstPage',
			style: 'PRIMARY',
			emoji: '⏪',
			type: Constants.MessageComponentTypes.BUTTON,
			run: ({ handler }) => (handler.index = 0)
		},
		{
			customId: '@sapphire/paginated-messages.previousPage',
			style: 'PRIMARY',
			emoji: '◀️',
			type: Constants.MessageComponentTypes.BUTTON,
			run: ({ handler }) => {
				if (handler.index === 0) {
					handler.index = handler.pages.length - 1;
				} else {
					--handler.index;
				}
			}
		},
		{
			customId: '@sapphire/paginated-messages.nextPage',
			style: 'PRIMARY',
			emoji: '▶️',
			type: Constants.MessageComponentTypes.BUTTON,
			run: ({ handler }) => {
				if (handler.index === handler.pages.length - 1) {
					handler.index = 0;
				} else {
					++handler.index;
				}
			}
		},
		{
			customId: '@sapphire/paginated-messages.goToLastPage',
			style: 'PRIMARY',
			emoji: '⏩',
			type: Constants.MessageComponentTypes.BUTTON,
			run: ({ handler }) => (handler.index = handler.pages.length - 1)
		},
		{
			customId: '@sapphire/paginated-messages.stop',
			style: 'DANGER',
			emoji: '⏹️',
			type: Constants.MessageComponentTypes.BUTTON,
			run: ({ collector }) => {
				collector.stop();
			}
		}
	];

	/**
	 * Whether to emit the warning about running a {@link PaginatedMessage} in a DM channel without the client the `'CHANNEL'` partial.
	 * @remark When using message based commands (as opposed to Application Commands) then you will also need to specify the `DIRECT_MESSAGE` intent for {@link PaginatedMessage} to work.
	 *
	 * @remark To overwrite this property change it somewhere in a "setup" file, i.e. where you also call `client.login()` for your client.
	 * Alternatively, you can also customize it on a per-PaginatedMessage basis by using `paginatedMessageInstance.setEmitPartialDMChannelWarning(newBoolean)`
	 * @default true
	 */
	public static emitPartialDMChannelWarning = true;

	/**
	 * A list of `customId` that are bound to actions that will stop the {@link PaginatedMessage}
	 * @default ['@sapphire/paginated-messages.stop']
	 * @remark To overwrite this property change it somewhere in a "setup" file, i.e. where you also call `client.login()` for your client.
	 * Alternatively, you can also customize it on a per-PaginatedMessage basis by using `paginatedMessageInstance.setStopPaginatedMessageCustomIds(customIds)`
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 *
	 * PaginatedMessage.stopPaginatedMessageCustomIds = ['my-custom-stop-custom-id'];
	 * ```
	 */
	public static stopPaginatedMessageCustomIds = ['@sapphire/paginated-messages.stop'];

	/**
	 * The reasons sent by {@linkplain https://discord.js.org/#/docs/main/stable/class/InteractionCollector?scrollTo=e-end InteractionCollector#end}
	 * event when the message (or its owner) has been deleted.
	 */
	public static deletionStopReasons = ['messageDelete', 'channelDelete', 'guildDelete'];

	/**
	 * Custom text to show in front of the page index in the embed footer.
	 * PaginatedMessage will automatically add a space (` `) after the given text. You do not have to add it yourself.
	 * @default ""
	 * @remark To overwrite this property change it somewhere in a "setup" file, i.e. where you also call `client.login()` for your client.
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
	 * @remark To overwrite this property change it somewhere in a "setup" file, i.e. where you also call `client.login()` for your client.
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
	 * A generator for {@link MessageSelectOption} that will be used to generate the options for the {@link MessageSelectMenu}.
	 * We do not allow overwriting the {@link MessageSelectOption#value} property with this, as it is vital to how we handle
	 * select menu interactions.
	 *
	 * @param pageIndex The index of the page to add to the {@link MessageSelectMenu}. We will add 1 to this number because our pages are 0 based,
	 * so this will represent the pages as seen by the user.
	 * @default
	 * ```ts
	 * {
	 * 	label: `Page ${pageIndex}`
	 * }
	 * ```
	 * @remark To overwrite this property change it in a "setup" file prior to calling `client.login()` for your client.
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessage } from '@sapphire/discord.js-utilities';
	 *
	 * PaginatedMessage.selectMenuOptions = (pageIndex) => ({
	 * 	 label: `Go to page: ${pageIndex}`,
	 * 	 description: 'This is a description'
	 * });
	 * ```
	 */
	public static selectMenuOptions: PaginatedMessageSelectMenuOptionsFunction = (pageIndex) => ({ label: `Page ${pageIndex}` });

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
	 * 	content: `Please stop interacting with the components on this message. They are only for ${Formatters.userMention(targetUser.id)}.`,
	 * 	ephemeral: true,
	 * 	allowedMentions: { users: [], roles: [] }
	 * }
	 * ```
	 * @remark To overwrite this property change it in a "setup" file prior to calling `client.login()` for your client.
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
	public static wrongUserInteractionReply: PaginatedMessageWrongUserInteractionReplyFunction = (targetUser: User) => ({
		content: `Please stop interacting with the components on this message. They are only for ${Formatters.userMention(targetUser.id)}.`,
		ephemeral: true,
		allowedMentions: { users: [], roles: [] }
	});

	private static resolveTemplate(template?: MessageEmbed | MessageOptions): MessageOptions {
		if (template === undefined) {
			return {};
		}

		if (template instanceof MessageEmbed) {
			return { embeds: [template] };
		}

		return template;
	}
}

export interface PaginatedMessage {
	constructor: typeof PaginatedMessage;
}

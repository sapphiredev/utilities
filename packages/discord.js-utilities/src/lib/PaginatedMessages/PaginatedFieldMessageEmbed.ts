import { isFunction, isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { EmbedBuilder, isJSONEncodable, type APIEmbed, type EmbedData } from 'discord.js';
import { PaginatedMessage } from './PaginatedMessage';
import type { EmbedResolvable } from './PaginatedMessageTypes';

/**
 * This is a utility of {@link PaginatedMessage}, except it exclusively adds pagination inside a field of an embed.
 * You must either use this class directly or extend it.
 *
 * It differs from PaginatedMessageEmbedFields as the items here are the shape you want, and are then concatenated
 * in a single field with a given formatter function, whereas PaginatedMessageEmbedFields takes fields as the items
 * and add them to the embed.
 *
 * @example
 * ```typescript
 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
 *
 * new PaginatedFieldMessageEmbed()
 *    .setTitleField('Test pager field')
 *    .setTemplate({ embed })
 *    .setItems([
 *       { title: 'Sapphire Framework', value: 'discord.js Framework' },
 *       { title: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
 *       { title: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
 *     ])
 *    .formatItems((item) => `${item.title}\n${item.value}`)
 *    .setItemsPerPage(2)
 *    .make()
 *    .run(message);
 * ```
 */
export class PaginatedFieldMessageEmbed<T> extends PaginatedMessage {
	/**
	 * The `embedTemplate` field represents the template for the embed message. It is of type `APIEmbed`.
	 * It is initialized with a new `EmbedBuilder` instance converted to JSON.
	 */
	private embedTemplate: APIEmbed = new EmbedBuilder().toJSON();

	/**
	 * The `totalPages` field represents the total number of pages in the paginated message. It is of type `number`.
	 * It is initialized to 0.
	 */
	private totalPages: number = 0;

	/**
	 * The `items` field represents the items to be displayed in the paginated message. It is an array of type `T`.
	 * It is initialized to an empty array.
	 */
	private items: T[] = [];

	/**
	 * The `itemsPerPage` field represents the number of items to be displayed per page. It is of type `number`.
	 * It is initialized to 10.
	 */
	private itemsPerPage: number = 10;

	/**
	 * The `fieldTitle` field represents the title of the field in the embed message. It is of type `string`.
	 * It is initialized to an empty string.
	 */
	private fieldTitle: string = '';

	/**
	 * Set the items to paginate.
	 * @param items The pages to set
	 */
	public setItems(items: T[]) {
		this.items = items;
		return this;
	}

	/**
	 * Set the title of the embed field that will be used to paginate the items.
	 * @param title The field title
	 */
	public setTitleField(title: string) {
		this.fieldTitle = title;
		return this;
	}

	/**
	 * Sets the amount of items that should be shown per page.
	 * @param itemsPerPage The number of items
	 */
	public setItemsPerPage(itemsPerPage: number) {
		this.itemsPerPage = itemsPerPage;
		return this;
	}

	/**
	 * Sets the template to be used to display the embed fields as pages. This template can either be set from a template {@link EmbedBuilder} instance or an object with embed options.
	 *
	 * @param template EmbedBuilder
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 * import { EmbedBuilder } from 'discord.js';
	 *
	 * new PaginatedFieldMessageEmbed().setTemplate(new EmbedBuilder().setTitle('Test pager embed')).make().run(message);
	 * ```
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginatedFieldMessageEmbed().setTemplate({ title: 'Test pager embed' }).make().run(message);
	 * ```
	 */
	public setTemplate(template: EmbedData | EmbedResolvable | ((embed: EmbedBuilder) => EmbedResolvable)) {
		this.embedTemplate = this.resolveTemplate(template);
		return this;
	}

	/**
	 * Sets a format callback that will be mapped to each embed field in the array of items when the embed is paginated. This should convert each item to a format that is either text itself or can be serialized as text.
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginatedFieldMessageEmbed()
	 *    .setTitleField('Test field')
	 *    .setTemplate({ embed })
	 *    .setItems([
	 *       { title: 'Sapphire Framework', value: 'discord.js Framework' },
	 *       { title: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
	 *       { title: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
	 *     ])
	 *    .formatItems((item) => `${item.title}\n${item.value}`)
	 *    .make()
	 *    .run(message);
	 * ```
	 * @param formatter The formatter callback to be applied to each embed item
	 */
	public formatItems(formatter: (item: T, index: number, array: T[]) => any) {
		this.items = this.items.map(formatter);
		return this;
	}

	/**
	 * Build the pages of the given array.
	 *
	 * You must call the {@link PaginatedFieldMessageEmbed.make} and {@link PaginatedFieldMessageEmbed.run} methods last, in that order, for the pagination to work.
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginatedFieldMessageEmbed()
	 *    .setTitleField('Test field')
	 *    .setTemplate({ embed })
	 *    .setItems([
	 *       { title: 'Sapphire Framework', value: 'discord.js Framework' },
	 *       { title: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
	 *       { title: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
	 *     ])
	 *    .formatItems((item) => `${item.title}\n${item.value}`)
	 *    .make()
	 *    .run(message);
	 * ```
	 */
	public make() {
		if (!this.fieldTitle.length) throw new Error('The title of the field to format must have a value.');
		if (!this.items.length) throw new Error('The items array is empty.');
		if (this.items.some((x) => !x)) throw new Error('The format of the array items is incorrect.');

		this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
		this.generatePages();
		return this;
	}

	/**
	 * Generates the pages for the paginated field message embed.
	 * Each page contains a cloned template with modified fields and data.
	 */
	private generatePages() {
		const template = this.embedTemplate;
		for (let i = 0; i < this.totalPages; i++) {
			const clonedTemplate = new EmbedBuilder(template);
			const fieldsClone = isNullishOrEmpty(template.fields) ? [] : [...template.fields];
			if (fieldsClone.length > 0) clonedTemplate.setFields();
			if (isNullish(template.color)) clonedTemplate.setColor('Random');

			const data = this.paginateArray(this.items, i, this.itemsPerPage);
			this.addPage({
				embeds: [clonedTemplate.addFields({ name: this.fieldTitle, value: data.join('\n'), inline: false }, ...fieldsClone)]
			});
		}
	}

	/**
	 * Paginates an array of items.
	 *
	 * @template T The type of items in the array.
	 * @param items The array of items to paginate.
	 * @param currentPage The current page number.
	 * @param perPageItems The number of items per page.
	 * @returns The paginated array of items.
	 */
	private paginateArray(items: T[], currentPage: number, perPageItems: number) {
		const offset = currentPage * perPageItems;
		return items.slice(offset, offset + perPageItems);
	}

	/**
	 * Resolves the template for the embed.
	 *
	 * @param template - The template for the embed. It can be an EmbedResolvable, EmbedData, or a function that takes an EmbedBuilder and returns an EmbedResolvable.
	 * @returns The resolved APIEmbed object.
	 */
	private resolveTemplate(template: EmbedResolvable | EmbedData | ((embed: EmbedBuilder) => EmbedResolvable)): APIEmbed {
		if (isFunction(template)) template = template(new EmbedBuilder());
		return (isJSONEncodable(template) ? template : new EmbedBuilder(template)).toJSON();
	}
}

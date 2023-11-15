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
	private embedTemplate: APIEmbed = new EmbedBuilder().toJSON();
	private totalPages = 0;
	private items: T[] = [];
	private itemsPerPage = 10;
	private fieldTitle = '';

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

	private paginateArray(items: T[], currentPage: number, perPageItems: number) {
		const offset = currentPage * perPageItems;
		return items.slice(offset, offset + perPageItems);
	}

	private resolveTemplate(template: EmbedResolvable | EmbedData | ((embed: EmbedBuilder) => EmbedResolvable)): APIEmbed {
		if (isFunction(template)) template = template(new EmbedBuilder());
		return (isJSONEncodable(template) ? template : new EmbedBuilder(template)).toJSON();
	}
}

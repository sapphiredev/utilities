import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

import { PaginatedMessage } from './PaginatedMessage';

/**
 * This is a utility of {@link PaginatedMessage}, but paginating only the field of an embed.
 * You must either use this class directly or extend it.
 *
 * @example
 * ```typescript
 * const { PaginationFieldMessageEmbed } = require('@sapphire/discord.js-utilities');
 *
 * new PaginationFieldManager()
 *    .setTitleField('')
 *    .setTemplate({ ...options })
 *    .setItems([{ field: 'value' }, { field: 'value' }, { field: 'value' }, { field: 'value' }])
 *    .setItemsPerPage(2)
 *    .make()
 *    .run(message.author, message.channel);
 * ```
 */
export class PaginationFieldMessageEmbed<Element> extends PaginatedMessage {
	private embedTemplate: MessageEmbed = new MessageEmbed();
	private totalPages = 0;
	private items: Element[] = [];
	private itemsPerPage = 10;
	private fieldTitle!: string;

	/**
	 * Items
	 *
	 * Array of items for pagination.
	 * @param items The pages to set
	 */
	public setItems(items: Element[]) {
		this.items = items;
		return this;
	}

	/**
	 * Title
	 *
	 * Title of the embed field that will be used to paginate the items.
	 * @param title Field title
	 */
	public setTitleField(title: string) {
		this.fieldTitle = title;
		return this;
	}

	/**
	 * items per page
	 * Number of items to show per page.
	 * @param itemsPerPage Number o items
	 */
	public setItemsPerPage(itemsPerPage: number) {
		this.itemsPerPage = itemsPerPage;
		return this;
	}

	/**
	 * Embed template
	 *
	 * Template to be used to display the pagination of the articles. This template can be configured by the `new MessageEmbed()` class or directly by means of an object with embed options.
	 *
	 * @example
	 * ```typescript
	 * const { PaginationFieldMessageEmbed } = require('@sapphire/discord.js-utilities');
	 * const { MessageEmbed } = require('discord.js');
	 *
	 * // Option 1:
	 * new PaginationFieldManager().setTemplate(new MessageEmbed().setTitle('Test pager embed')).make().run(message.author, message.channel);
	 * // Option 2:
	 * new PaginationFieldManager().setTemplate({ title: 'Test pager embed' }).make().run(message.author, message.channel);
	 * ```
	 * @param template MessageEmbed
	 */
	public setTemplate(template: MessageEmbedOptions | MessageEmbed) {
		this.embedTemplate = new MessageEmbed(template);
		return this;
	}

	/**
	 * Format field
	 *
	 * The way in which the items of the object array will be represented in the embed field to be paginated.
	 *
	 * @example
	 * ```typescript
	 * const { PaginationFieldMessageEmbed } = require('@sapphire/discord.js-utilities');
	 *
	 * new PaginationFieldManager()
	 *    .setTitleField('Test field')
	 *    .setTemplate({ ...options })
	 *    .setItems([{ field: 'value' }, { field: 'value' }, { field: 'value' }, { field: 'value' }])
	 *    .formatField((item) => `${item.field}\n${item.value}`)
	 *    .make()
	 *    .run(message.author, message.channel);
	 * ```
	 * @param item Item information
	 */
	public formatField(value: (value: Element, index: number, array: Element[]) => any) {
		this.items = this.items.map(value);
		return this;
	}

	/**
	 * Make
	 *
	 * Build the item pagination of the configured array.
	 * It is required to enter the `.make()` method at the end in order to start.
	 */
	public make() {
		if (!this.fieldTitle) throw new Error('The title of the field to format must have a value.');
		if (!this.items.length) throw new Error('The array introduced has no items.');
		if (!this.items[0]) throw new Error('The format of the array items is incorrect.');

		this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
		this.makePages();
		return this;
	}

	private makePages() {
		new Array(this.totalPages).forEach((_, index) => {
			const clonedTemplate = new MessageEmbed(this.embedTemplate);
			const fieldsClone = this.embedTemplate.fields;
			clonedTemplate.fields = [];

			if (!clonedTemplate.footer) clonedTemplate.setFooter(`${index + 1}/${this.totalPages}`);
			if (!clonedTemplate.color) clonedTemplate.setColor('RANDOM');

			const data = this.paginateArray(this.items, index + 1, this.itemsPerPage);
			this.addPage({
				embeds: [clonedTemplate.addField(this.fieldTitle, data.join('\n'), false).addFields(fieldsClone)]
			});
		});
	}

	private paginateArray(items: Element[], currentPage: number, perPageItems: number) {
		const page = currentPage;
		const perPage = perPageItems;
		const offset = (page - 1) * perPage;

		return items.slice(offset).slice(0, perPageItems);
	}
}

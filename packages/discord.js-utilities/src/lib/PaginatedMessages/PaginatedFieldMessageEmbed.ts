import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { PaginatedMessage } from './PaginatedMessage';

/**
 * This is a utility of {@link PaginatedMessage}, but paginating only the field of an embed.
 * You must either use this class directly or extend it.
 *
 * @example
 * ```typescript
 * import { PaginationFieldMessageEmbed } from '@sapphire/discord.js-utilities';
 *
 * new PaginationFieldMessageEmbed()
 *    .setTitleField('Test pager field')
 *    .setTemplate({ embed })
 *    .setItems([
 *       { title: 'Sapphire Framework', value: 'discord.js Framework' },
 *       { title: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
 *       { title: 'Sapphire Framework 3', value: 'Discord.js Framework 3' }
 *     ])
 *    .formatField((item) => `${item.title}\n${item.value}`)
 *    .setItemsPerPage(2)
 *    .make()
 *    .run(message);
 * ```
 */
export class PaginationFieldMessageEmbed<T> extends PaginatedMessage {
	private embedTemplate: MessageEmbed = new MessageEmbed();
	private totalPages = 0;
	private items: T[] = [];
	private itemsPerPage = 10;
	private fieldTitle!: string;

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
	 * @param title Field title
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
	 * Template to be used to display the pagination of the articles. This template can be configured by the `new MessageEmbed()` class or directly by means of an object with embed options.
	 *
	 * @param template MessageEmbed
	 *
	 * @example
	 * ```typescript
	 * import { PaginationFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 * import { MessageEmbed } from 'discord.js';
	 *
	 * new PaginationFieldMessageEmbed().setTemplate(new MessageEmbed().setTitle('Test pager embed')).make().run(message.author, message.channel);
	 * ```
	 *
	 * @example
	 * ```typescript
	 * import { PaginationFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 * import { MessageEmbed } from 'discord.js';
	 *
	 * new PaginationFieldMessageEmbed().setTemplate({ title: 'Test pager embed' }).make().run(message.author, message.channel);
	 * ```
	 */
	public setTemplate(template: MessageEmbedOptions | MessageEmbed) {
		this.embedTemplate = new MessageEmbed(template);
		return this;
	}

	/**
	 * The way in which the items of the object array will be represented in the embed field to be paginated.
	 *
	 * @example
	 * ```typescript
	 * import { PaginationFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginationFieldMessageEmbed()
	 *    .setTitleField('Test field')
	 *    .setTemplate({ embed })
	 *    .setItems([
	 *       { title: 'Sapphire Framework', value: 'discord.js Framework' },
	 *       { title: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
	 *       { title: 'Sapphire Framework 3', value: 'Discord.js Framework 3' }
	 *     ])
	 *    .formatField((item) => `${item.title}\n${item.value}`)
	 *    .make()
	 *    .run(message);
	 * ```
	 * @param value Item information
	 */
	public formatField(value: (value: T, index: number, array: T[]) => any) {
		this.items = this.items.map(value);
		return this;
	}

	/**
	 * Build the item pagination of the configured array.
	 * It is required to put the `.make()` and `.run()` method at the end in order to start.
	 *
	 * @example
	 * ```typescript
	 * import { PaginationFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginationFieldMessageEmbed()
	 *    .setTitleField('Test field')
	 *    .setTemplate({ embed })
	 *    .setItems([
	 *       { title: 'Sapphire Framework', value: 'discord.js Framework' },
	 *       { title: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
	 *       { title: 'Sapphire Framework 3', value: 'Discord.js Framework 3' }
	 *     ])
	 *    .formatField((item) => `${item.title}\n${item.value}`)
	 *    .make()
	 *    .run(message);
	 * ```
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
			const clonedTemplate = this.embedTemplate instanceof MessageEmbed ? this.embedTemplate : new MessageEmbed(this.embedTemplate);
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

	private paginateArray(items: T[], currentPage: number, perPageItems: number) {
		const page = currentPage;
		const perPage = perPageItems;
		const offset = (page - 1) * perPage;

		return items.slice(offset).slice(0, perPageItems);
	}
}

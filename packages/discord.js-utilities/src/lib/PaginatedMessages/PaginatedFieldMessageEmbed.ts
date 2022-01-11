import { EmbedField, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { PaginatedMessage } from './PaginatedMessage';

/**
 * This is a utility of {@link PaginatedMessage}, except it exclusively paginates the fields of an embed.
 * You must either use this class directly or extend it.
 *
 * @example
 * @example
 * // Embeds mode
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
 *
 * // Fields mode
 * ```typescript
 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
 *
 * new PaginatedFieldMessageEmbed()
 *    .setTemplate({ embed })
 *    .setItems([
 *       { name: 'Sapphire Framework', value: 'discord.js Framework' },
 *       { name: 'Sapphire Framework 2', value: 'discord.js Framework 2', inline: true },
 *       { name: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
 *     ])
 *    .make()
 *    .run(message);
 * ```
 */
export class PaginatedFieldMessageEmbed<T = EmbedField> extends PaginatedMessage {
	private embedTemplate: MessageEmbed = new MessageEmbed();
	private totalPages = 0;
	private items: T[] = [];
	private itemsPerPage = 10;
	private fieldTitle = '';
	private mode: 'embeds' | 'fields' = 'fields';

	/**
	 * Embed mode will paginate articles in one field per embed, for example it will display 5 articles in a field with the name assigned in the setTitleField method, and another 5 in a field of another embed and so on. The Fields mode will paginate articles by creating multiple fields in an embed, i.e. it will display 5 fields for each embed to be paginated.
	 * @param mode Select the way to paginate the items.
	 * @default fields
	 */
	public setMode(mode: 'embeds' | 'fields') {
		this.mode = mode;
		return this;
	}

	/**
	 * Set the items to paginate.
	 * @param items The pages to set
	 *
	 * @example
	 * // Embeds mode
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
	 *
	 * // Fields mode
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginatedFieldMessageEmbed()
	 *    .setTemplate({ embed })
	 *    .setItems([
	 *       { name: 'Sapphire Framework', value: 'discord.js Framework' },
	 *       { name: 'Sapphire Framework 2', value: 'discord.js Framework 2', inline: true },
	 *       { name: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
	 *     ])
	 *    .make()
	 *    .run(message);
	 * ```
	 */
	public setItems(items: T[]) {
		this.items = items;
		return this;
	}

	/**
	 * Set the title of the embed field that will be used to paginate the items. This method requires the "embeds" mode.
	 * @param title The field title
	 */
	public setTitleField(title: string) {
		if (this.mode === 'fields') throw new Error('This method can only be used when using "embeds" mode.');
		this.fieldTitle = title;
		return this;
	}

	/**
	 * Sets the amount of items that should be shown per page.
	 * @param itemsPerPage The number of items
	 * @default 10
	 */
	public setItemsPerPage(itemsPerPage: number) {
		if (this.itemsPerPage > 25 && this.mode === 'fields') {
			throw new Error('When using the "fields" mode, the limit of items per page must be less than 25.');
		}

		this.itemsPerPage = itemsPerPage;
		return this;
	}

	/**
	 * Sets the template to be used to display the embed fields as pages. This template can either be set from a template {@link MessageEmbed} instance or an object with embed options.
	 *
	 * @param template MessageEmbed
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 * import { MessageEmbed } from 'discord.js';
	 *
	 * new PaginatedFieldMessageEmbed().setTemplate(new MessageEmbed().setTitle('Test pager embed')).make().run(message.author, message.channel);
	 * ```
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 * import { MessageEmbed } from 'discord.js';
	 *
	 * new PaginatedFieldMessageEmbed().setTemplate({ title: 'Test pager embed' }).make().run(message.author, message.channel);
	 * ```
	 */
	public setTemplate(template: MessageEmbedOptions | MessageEmbed) {
		this.embedTemplate = template instanceof MessageEmbed ? template : new MessageEmbed(template);
		return this;
	}

	/**
	 * Sets a format callback that will be mapped to each embed field in the array of items when the embed is paginated. This should convert each item to a format that is either text itself or can be serialized as text. This method requires the "embeds" mode.
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
	 * @param value The formatter callback to be applied to each embed item
	 */
	public formatItems(formatter: (item: T, index: number, array: T[]) => any) {
		if (this.mode === 'fields') {
			throw new Error(
				'This method can only be used in "embeds" mode. The items of the "fields" mode must be an object with at least the "name" and "value" fields.'
			);
		}

		this.items = this.items.map(formatter);
		return this;
	}

	/**
	 * Build the pages of the given array.
	 *
	 * You must call the [[PaginatedFieldMessageEmbed.make]] and [[PaginatedFieldMessageEmbed.run]] methods last, in that order, for the pagination to work.
	 *
	 * @example
	 * // Embeds mode
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
	 *
	 * // Fields mode
	 * ```typescript
	 * import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginatedFieldMessageEmbed()
	 *    .setTemplate({ embed })
	 *    .setItems([
	 *       { name: 'Sapphire Framework', value: 'discord.js Framework' },
	 *       { name: 'Sapphire Framework 2', value: 'discord.js Framework 2', inline: true },
	 *       { name: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
	 *     ])
	 *    .make()
	 *    .run(message);
	 * ```
	 */
	public make() {
		if (!this.fieldTitle.length && this.mode === 'embeds') throw new Error('The title of the field to format must have a value.');
		if (!this.items.length) throw new Error('The items array is empty.');

		if (this.items.some((x) => !x && this.mode === 'embeds')) throw new Error('The format of the array items is incorrect.');
		if (!this.items.some((x: any) => !x.name || !x.value) && this.mode === 'fields') {
			throw new Error(
				'The format of the items is incorrect. The items of the "fields" mode must be an object with at least the "name" and "value" fields.'
			);
		}

		this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
		this.generatePages();
		return this;
	}

	private generatePages() {
		const template = this.embedTemplate instanceof MessageEmbed ? (this.embedTemplate.toJSON() as MessageEmbedOptions) : this.embedTemplate;
		for (let i = 0; i < this.totalPages; i++) {
			const clonedTemplate = new MessageEmbed(template);
			const fieldsClone = this.embedTemplate.fields;
			clonedTemplate.fields = [];

			if (!clonedTemplate.color) clonedTemplate.setColor('RANDOM');

			const data = this.paginateArray(this.items, i, this.itemsPerPage);
			if (this.mode === 'embeds') {
				this.addPage({
					embeds: [clonedTemplate.addField(this.fieldTitle, data.join('\n'), false).addFields(fieldsClone)]
				});
			} else {
				this.addPage({
					embeds: [clonedTemplate.addFields(...(data as unknown as EmbedField[])).addFields(fieldsClone)]
				});
			}
		}
	}

	private paginateArray(items: T[], currentPage: number, perPageItems: number) {
		const offset = currentPage * perPageItems;
		return items.slice(offset, offset + perPageItems);
	}
}

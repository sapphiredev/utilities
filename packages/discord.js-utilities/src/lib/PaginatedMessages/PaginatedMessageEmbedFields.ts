import { EmbedLimits } from '@sapphire/discord-utilities';
import { isFunction, isNullishOrEmpty } from '@sapphire/utilities';
import { EmbedBuilder, isJSONEncodable, type APIEmbed, type EmbedData, type EmbedField } from 'discord.js';
import { PaginatedMessage } from './PaginatedMessage';
import type { EmbedResolvable } from './PaginatedMessageTypes';

/**
 * This is a utility of {@link PaginatedMessage}, except it exclusively paginates the fields of an embed.
 * You must either use this class directly or extend it.
 *
 * It differs from PaginatedFieldMessageEmbed as the items here are whole fields, that are added to the embed,
 * whereas PaginatedFieldMessageEmbed concatenates the items in a single field with a given formatter function.
 *
 * @example
 * ```typescript
 * import { PaginatedMessageEmbedFields } from '@sapphire/discord.js-utilities';
 *
 * new PaginatedMessageEmbedFields()
 * 	.setTemplate({ title: 'Test pager embed', color: '#006080' })
 * 	.setItems([
 * 		{ name: 'Sapphire Framework', value: 'discord.js Framework' },
 * 		{ name: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
 * 		{ name: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
 * 	])
 * 	.setItemsPerPage(2)
 * 	.make()
 * 	.run(message);
 * ```
 */
export class PaginatedMessageEmbedFields extends PaginatedMessage {
	private embedTemplate: APIEmbed = new EmbedBuilder().toJSON();
	private totalPages = 0;
	private items: EmbedField[] = [];
	private itemsPerPage = 10;

	/**
	 * Set the items to paginate.
	 * @param items The pages to set
	 */
	public setItems(items: EmbedField[]): this {
		this.items = items;
		return this;
	}

	/**
	 * Sets the amount of items that should be shown per page.
	 * @param itemsPerPage The number of items
	 */
	public setItemsPerPage(itemsPerPage: number): this {
		this.itemsPerPage = itemsPerPage;
		return this;
	}

	/**
	 * Sets the template to be used to display the embed fields as pages. This template can either be set from a template {@link MessageEmbed} instance or an object with embed options.
	 * All fields in the given template will be overwritten when calling {@link PaginatedMessageEmbedFields.make}.
	 *
	 * @param template MessageEmbed
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessageEmbedFields } from '@sapphire/discord.js-utilities';
	 * import { EmbedBuilder } from 'discord.js';
	 *
	 * new PaginatedMessageEmbedFields()
	 * 	.setTemplate(new EmbedBuilder().setColor('#006080').setTitle('Test pager embed'))
	 * 	.setItems([{ name: 'My field', value: 'The field\'s value' }])
	 * 	.make()
	 * 	.run(message);
	 * ```
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessageEmbedFields } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginatedMessageEmbedFields()
	 * 	.setTemplate({ title: 'Test pager embed', color: '#006080' })
	 * 	.setItems([{ name: 'My field', value: 'The field\'s value' }])
	 * 	.make()
	 * 	.run(message);
	 * ```
	 */
	public setTemplate(template: EmbedResolvable | ((embed: EmbedBuilder) => EmbedResolvable)): this {
		this.embedTemplate = this.resolveTemplate(template);
		return this;
	}

	/**
	 * Build the pages of the given array.
	 *
	 * You must call the [[PaginatedMessageEmbedFields.make]] and [[PaginatedMessageEmbedFields.run]] methods last, in that order, for the pagination to work.
	 *
	 * @example
	 * ```typescript
	 * import { PaginatedMessageEmbedFields } from '@sapphire/discord.js-utilities';
	 *
	 * new PaginatedMessageEmbedFields()
	 * 	.setItems([
	 * 		{ name: 'Sapphire Framework', value: 'discord.js Framework' },
	 * 		{ name: 'Sapphire Framework 2', value: 'discord.js Framework 2' },
	 * 		{ name: 'Sapphire Framework 3', value: 'discord.js Framework 3' }
	 * 	])
	 * 	.setItemsPerPage(3)
	 * 	.make()
	 * 	.run(message);
	 * ```
	 */
	public make(): this {
		if (!this.items.length) throw new Error('The items array is empty.');
		if (this.itemsPerPage > EmbedLimits.MaximumFields) throw new Error(`Pages cannot contain more than ${EmbedLimits.MaximumFields} fields.`);

		this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
		this.generatePages();
		return this;
	}

	private generatePages(): void {
		const template = this.embedTemplate;
		for (let i = 0; i < this.totalPages; i++) {
			const clonedTemplate = new EmbedBuilder(template);
			const fieldsClone = isNullishOrEmpty(template.fields) ? [] : [...template.fields];
			if (fieldsClone.length > 0) clonedTemplate.setFields();

			if (!clonedTemplate.data.color) clonedTemplate.setColor('Random');

			const data = this.paginateArray(this.items, i, this.itemsPerPage - fieldsClone.length);
			this.addPage({
				embeds: [clonedTemplate.addFields(...data, ...fieldsClone)]
			});
		}
	}

	private paginateArray(items: EmbedField[], currentPage: number, perPageItems: number): EmbedField[] {
		const offset = currentPage * perPageItems;
		return items.slice(offset, offset + perPageItems);
	}

	private resolveTemplate(template: EmbedResolvable | EmbedData | ((embed: EmbedBuilder) => EmbedResolvable)): APIEmbed {
		if (isFunction(template)) template = template(new EmbedBuilder());
		return (isJSONEncodable(template) ? template : new EmbedBuilder(template)).toJSON();
	}
}

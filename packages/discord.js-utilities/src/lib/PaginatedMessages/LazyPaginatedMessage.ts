import { isFunction } from '@sapphire/utilities';
import { MessageEmbed } from 'discord.js';
import { MessageBuilder } from '../builders/MessageBuilder';
import { PaginatedMessage } from './PaginatedMessage';
import type { PaginatedMessagePage } from './PaginatedMessageTypes';

/**
 * This is a LazyPaginatedMessage. Instead of resolving all pages that are functions on {@link PaginatedMessage.run} will resolve when requested.
 */
export class LazyPaginatedMessage extends PaginatedMessage {
	/**
	 * Only resolves the page corresponding with the handler's current index.
	 */
	public override async resolvePagesOnRun(): Promise<void> {
		await this.resolvePage(this.index);
	}

	/**
	 * Resolves the page corresponding with the given index. This also resolves the index's before and after the given index.
	 * @param index The index to resolve. Defaults to handler's current index.
	 */
	public override async resolvePage(index: number): Promise<PaginatedMessagePage> {
		const promises = [super.resolvePage(index)];
		if (this.hasPage(index - 1)) promises.push(super.resolvePage(index - 1));
		if (this.hasPage(index + 1)) promises.push(super.resolvePage(index + 1));

		const [result] = await Promise.all(promises);
		return result;
	}

	public override addPageBuilder(builder: MessageBuilder | ((builder: MessageBuilder) => MessageBuilder)): this {
		return this.addPage(() => (isFunction(builder) ? builder(new MessageBuilder()) : builder));
	}

	public override addPageContent(content: string): this {
		return this.addPage(() => ({ content }));
	}

	public override addPageEmbed(embed: MessageEmbed | ((builder: MessageEmbed) => MessageEmbed)): this {
		return this.addPage(() => ({ embeds: typeof embed === 'function' ? [embed(new MessageEmbed())] : [embed] }));
	}

	public override addPageEmbeds(
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
		return this.addPage(() => {
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

			return { embeds: processedEmbeds };
		});
	}
}

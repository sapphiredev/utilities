import { isFunction } from '@sapphire/utilities';
import { EmbedBuilder } from 'discord.js';
import { MessageBuilder } from '../builders/MessageBuilder.js';
import { PaginatedMessage } from './PaginatedMessage.js';
import type { PaginatedMessagePage } from './PaginatedMessageTypes.js';

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

	public override addPageEmbed(embed: EmbedBuilder | ((builder: EmbedBuilder) => EmbedBuilder)): this {
		return this.addPage(() => ({ embeds: typeof embed === 'function' ? [embed(new EmbedBuilder())] : [embed] }));
	}

	public override addPageEmbeds(
		embeds:
			| EmbedBuilder[]
			| ((
					embed1: EmbedBuilder,
					embed2: EmbedBuilder,
					embed3: EmbedBuilder,
					embed4: EmbedBuilder,
					embed5: EmbedBuilder,
					embed6: EmbedBuilder,
					embed7: EmbedBuilder,
					embed8: EmbedBuilder,
					embed9: EmbedBuilder,
					embed10: EmbedBuilder
			  ) => EmbedBuilder[])
	): this {
		return this.addPage(() => {
			let processedEmbeds = isFunction(embeds)
				? embeds(
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder(),
						new EmbedBuilder()
				  )
				: embeds;

			if (processedEmbeds.length > 10) {
				processedEmbeds = processedEmbeds.slice(0, 10);
			}

			return { embeds: processedEmbeds };
		});
	}
}

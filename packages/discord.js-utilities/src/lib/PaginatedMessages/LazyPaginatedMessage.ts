import { isFunction } from '@sapphire/utilities';
import { EmbedBuilder, Message, User } from 'discord.js';
import { MessageBuilder } from '../builders/MessageBuilder';
import type { AnyInteractableInteraction } from '../utility-types';
import { PaginatedMessage } from './PaginatedMessage';
import type { EmbedResolvable, PaginatedMessageResolvedPage } from './PaginatedMessageTypes';

/**
 * This is a LazyPaginatedMessage. Instead of resolving all pages that are functions on {@link PaginatedMessage.run} will resolve when requested.
 */
export class LazyPaginatedMessage extends PaginatedMessage {
	/**
	 * Only resolves the page corresponding with the handler's current index.
	 */
	public override async resolvePagesOnRun(messageOrInteraction: Message | AnyInteractableInteraction, target: User): Promise<void> {
		await this.resolvePage(messageOrInteraction, target, this.index);
	}

	/**
	 * Resolves the page corresponding with the given index. This also resolves the index's before and after the given index.
	 * @param messageOrInteraction The message or interaction that triggered this {@link LazyPaginatedMessage}.
	 * @param target The user who will be able to interact with the buttons of this {@link LazyPaginatedMessage}.
	 * @param index The index to resolve. Defaults to handler's current index.
	 */
	public override async resolvePage(
		messageOrInteraction: Message | AnyInteractableInteraction,
		target: User,
		index: number
	): Promise<PaginatedMessageResolvedPage> {
		const promises = [super.resolvePage(messageOrInteraction, target, index)];
		if (this.hasPage(index - 1)) promises.push(super.resolvePage(messageOrInteraction, target, index - 1));
		if (this.hasPage(index + 1)) promises.push(super.resolvePage(messageOrInteraction, target, index + 1));

		const [result] = await Promise.all(promises);
		return result;
	}

	public override addPageBuilder(builder: MessageBuilder | ((builder: MessageBuilder) => MessageBuilder)): this {
		return this.addPage(() => (isFunction(builder) ? builder(new MessageBuilder()) : builder));
	}

	public override addPageContent(content: string): this {
		return this.addPage(() => ({ content }));
	}

	public override addPageEmbed(embed: EmbedResolvable | ((builder: EmbedBuilder) => EmbedResolvable)): this {
		return this.addPage(() => ({ embeds: typeof embed === 'function' ? [embed(new EmbedBuilder())] : [embed] }));
	}

	public override addPageEmbeds(
		embeds:
			| EmbedResolvable[]
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
			  ) => EmbedResolvable[])
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

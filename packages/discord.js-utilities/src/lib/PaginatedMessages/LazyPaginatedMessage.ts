import { isFunction } from '@sapphire/utilities';
import { APIMessage, Message, MessageEmbed } from 'discord.js';
import { MessageBuilder } from '../builders/MessageBuilder';
import { PaginatedMessage } from './PaginatedMessage';

/**
 * This is a LazyPaginatedMessage. Instead of resolving all pages that are functions on {@link PaginatedMessage.run} will resolve when requested.
 */
export class LazyPaginatedMessage extends PaginatedMessage {
	/**
	 * Only resolves the page corresponding with the handler's current index.
	 */
	public override async resolvePagesOnRun(channel: Message['channel']): Promise<void> {
		await this.resolvePage(channel, this.index);
	}

	/**
	 * Resolves the page corresponding with the given index. This also resolves the index's before and after the given index.
	 * @param index The index to resolve. Defaults to handler's current index.
	 */
	public override async resolvePage(channel: Message['channel'], index: number): Promise<APIMessage> {
		const promises = [super.resolvePage(channel, index)];
		if (this.hasPage(index - 1)) promises.push(super.resolvePage(channel, index - 1));
		if (this.hasPage(index + 1)) promises.push(super.resolvePage(channel, index + 1));

		const [result] = await Promise.all(promises);
		return result;
	}

	public override addPageBuilder(builder: MessageBuilder | ((builder: MessageBuilder) => MessageBuilder)): this {
		return this.addPage(() => (isFunction(builder) ? builder(new MessageBuilder()) : builder));
	}

	public override addPageContent(content: string): this {
		return this.addPage(() => ({ content }));
	}

	public override addPageEmbed(cb: MessageEmbed | ((builder: MessageEmbed) => MessageEmbed)): this {
		return this.addPage(() => ({ embed: typeof cb === 'function' ? cb(new MessageEmbed()) : cb }));
	}
}

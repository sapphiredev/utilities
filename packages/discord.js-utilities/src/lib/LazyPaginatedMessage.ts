import type { NewsChannel, TextChannel } from 'discord.js';
import { PaginatedMessage } from './PaginatedMessage';

/**
 * This is a LazyPaginatedMessage. Instead of resolving all pages that are functions on [[PaginatedMessage.run]] will resolve when requested.
 */
export class LazyPaginatedMessage extends PaginatedMessage {
	/**
	 * Only resolves the page corresponding with the handler's current index.
	 */
	public async resolvePagesOnStart(channel: TextChannel | NewsChannel) {
		await this.resolvePage(channel, this.index);
	}

	/**
	 * Resolves the page corresponding with the given index. This also resolves the index's before and after the given index.
	 * @param index The index to resolve. Defaults to handler's current index.
	 */
	public async resolvePage(channel: TextChannel | NewsChannel, index: number) {
		const [, , page] = await Promise.all([
			super.resolvePage(channel, index - 1),
			super.resolvePage(channel, index + 1),
			super.resolvePage(channel, index)
		]);
		return page;
	}
}

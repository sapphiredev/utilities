import { PaginatedMessage } from './PaginatedMessage.js';

/**
 * This is a LazyPaginatedMessage. Instead of resolving all pages that are functions on [[PaginatedMessage.run]] will resolve when requested.
 */
export class LazyPaginatedMessage extends PaginatedMessage {
	/**
	 * Only resolves the page corresponding with the handler's current index.
	 */
	public async resolvePagesOnStart() {
		await this.resolvePage(this.index);
	}

	/**
	 * Resolves the page corresponding with the given index. This also resolves the index's before and after the given index.
	 * @param index The index to resolve. Defaults to handler's current index.
	 */
	public async resolvePage(index: number = this.index) {
		await super.resolvePage(index - 1);
		await super.resolvePage(index + 1);

		return super.resolvePage(index);
	}
}

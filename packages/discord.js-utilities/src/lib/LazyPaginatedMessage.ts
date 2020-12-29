import { PaginatedMessage } from './PaginatedMessage';

export class LazyPaginatedMessage extends PaginatedMessage {
	public async resolvePagesOnStart() {
		await this.resolvePage(this.index);
	}

	public async resolvePage(index: number = this.index) {
		await super.resolvePage(index - 1);
		await super.resolvePage(index + 1);

		return super.resolvePage(index);
	}
}

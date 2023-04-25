import type { EmbedBuilder, BaseMessageOptions } from 'discord.js';
import type { PaginatedMessageAction, PaginatedMessagePage } from './PaginatedMessageTypes';

export interface JITPaginatedMessagePage {
	options: PaginatedMessagePage;
	actions?: PaginatedMessageAction[];
}

export interface JITPaginatedMessageOptions {
	/**
	 * The pages to display in this {@link JITPaginatedMessage}
	 */
	pages?: JITPaginatedMessagePage[];
	/**
	 * Custom actions to provide when sending the paginated message
	 */
	sharedActions?: PaginatedMessageAction[];
	/**
	 * The {@link EmbedBuilder} or {@link MessageOptions} options to apply to the entire {@link JITPaginatedMessage}
	 */
	template?: EmbedBuilder | BaseMessageOptions;
	/**
	 * @seealso {@link PaginatedMessage.pageIndexPrefix}
	 */
	pageIndexPrefix?: string;
	/**
	 * @seealso {@link PaginatedMessage.embedFooterSeparator}
	 */
	embedFooterSeparator?: string;
}

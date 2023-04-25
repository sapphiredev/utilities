import { PaginatedMessage } from './PaginatedMessage';
import { Message, User } from 'discord.js';
import { isNullish } from '@sapphire/utilities';
import { actionIsButtonOrMenu, createPartitionedMessageRow } from './utils';
import type { PaginatedMessageAction, PaginatedMessageComponentUnion } from './PaginatedMessageTypes';
import type { JITPaginatedMessageOptions } from './JITPaginatedMessageTypes';
import type { AnyInteractableInteraction } from '../utility-types';

export class JITPaginatedMessage extends PaginatedMessage {
	public pageActions: (Map<string, PaginatedMessageAction> | null)[] = [];

	public constructor({ pages, sharedActions, template, pageIndexPrefix, embedFooterSeparator }: JITPaginatedMessageOptions = {}) {
		super({
			actions: sharedActions, //
			template,
			pageIndexPrefix,
			embedFooterSeparator
		});

		if (pages) {
			this.setPages(pages.map(({ options }) => options));

			for (let i = 0; i < pages.length; i++) {
				const page = pages[i];
				if (page.actions) {
					this.addPageActions(page.actions, i);
				}
			}
		}
	}

	public override hasCustomId(customId: string): boolean {
		if (this.actions.has(customId)) return true;
		return this.pageActions.some((actions) => actions && actions.has(customId));
	}

	/**
	 * Clear all actions for a page and set the new ones.
	 * @param actions The actions to set.
	 * @param index The index of the page to set the actions to.
	 */
	public setPageActions(actions: PaginatedMessageAction[], index: number) {
		if (index < 0 || index > this.pages.length - 1) throw new Error('Provided index is out of bounds');

		this.pageActions[index]?.clear();
		this.components[index] = [];
		this.addPageActions(actions, index);
		return this;
	}

	/**
	 * Add the provided actions to a page.
	 * @param actions The actions to add.
	 * @param index The index of the page to add the actions to.
	 */
	public addPageActions(actions: PaginatedMessageAction[], index: number) {
		if (index < 0 || index > this.pages.length - 1) throw new Error('Provided index is out of bounds');

		for (const action of actions) this.addPageAction(action, index);
		return this;
	}

	/**
	 * Add the provided action to a page.
	 * @param action The action to add.
	 * @param index The index of the page to add the action to.
	 */
	public addPageAction(action: PaginatedMessageAction, index: number) {
		if (index < 0 || index > this.pages.length - 1) throw new Error('Provided index is out of bounds');

		if (!this.pageActions[index]) {
			this.pageActions[index] = new Map<string, PaginatedMessageAction>();
		}

		if (actionIsButtonOrMenu(action)) {
			this.pageActions[index]!.set(action.customId, action);
		} else {
			this.pageActions[index]!.set(action.url, action);
		}

		return this;
	}

	public override async resolveActions(
		messageOrInteraction: Message | AnyInteractableInteraction,
		targetUser: User,
		index: number
	): Promise<PaginatedMessageComponentUnion[]> {
		const components = this.components[index];
		if (!isNullish(components)) {
			return components;
		}

		const actions = this.pageActions[index];

		const sharedResolved = await this.handleActionLoad([...this.actions.values()], messageOrInteraction, targetUser);
		const result: PaginatedMessageComponentUnion[] = createPartitionedMessageRow(sharedResolved);

		if (!isNullish(actions)) {
			const pageResolved = await this.handleActionLoad([...actions.values()], messageOrInteraction, targetUser);
			const pageComponents = createPartitionedMessageRow(pageResolved);

			result.push(...pageComponents);
		}

		this.components[index] = result;
		return result;
	}

	protected override getAction(customId: string): PaginatedMessageAction {
		let action = this.actions.get(customId);
		if (isNullish(action)) {
			action = this.pageActions[this.index]!.get(customId)!;
		}

		return action;
	}
}

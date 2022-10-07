import { chunk, partition } from '@sapphire/utilities';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ComponentType,
	SelectMenuBuilder,
	type ActionRowComponentOptions,
	type ButtonComponentData
} from 'discord.js';
import { isAnyInteractableInteraction, isMessageInstance } from '../type-guards';
import type {
	PaginatedMessageAction,
	PaginatedMessageActionButton,
	PaginatedMessageActionMenu,
	SafeReplyToInteractionParameters
} from './PaginatedMessageTypes';

export function actionIsButtonOrMenu(action: PaginatedMessageAction): action is PaginatedMessageActionButton | PaginatedMessageActionMenu {
	return action.type === ComponentType.SelectMenu || action.type === ComponentType.Button;
}

export function isMessageButtonInteractionData(interaction: ActionRowComponentOptions): interaction is ButtonComponentData {
	return interaction.type === ComponentType.Button;
}

export function isButtonComponentBuilder(component: ButtonBuilder | SelectMenuBuilder): component is ButtonBuilder {
	return component.data.type === ComponentType.Button;
}

export function createPartitionedMessageRow(components: (ButtonBuilder | SelectMenuBuilder)[]): ActionRowBuilder[] {
	// Partition the components into two groups: buttons and select menus
	const [messageButtons, selectMenus] = partition(components, isButtonComponentBuilder);

	// Chunk the button components in sets of 5, the maximum of 1 ActionRowBuilder
	const chunkedButtonComponents = chunk(messageButtons, 5);

	// Map all the button components to ActionRowBuilders
	const messageButtonActionRows = chunkedButtonComponents.map((componentsChunk) =>
		new ActionRowBuilder() //
			.setComponents(componentsChunk)
	);

	// Map all the select menu components to ActionRowBuilders
	const selectMenuActionRows = selectMenus.map((component) =>
		new ActionRowBuilder() //
			.setComponents(component)
	);

	return [...messageButtonActionRows, ...selectMenuActionRows];
}

/**
 * Safely replies to a message or interaction. This is primarily to save duplicated code in the main `PaginatedMessage` class
 * @param parameters The parameters to create a safe reply to interaction parameters
 */
export async function safelyReplyToInteraction<T extends 'edit' | 'reply'>(parameters: SafeReplyToInteractionParameters<T>) {
	if (isAnyInteractableInteraction(parameters.messageOrInteraction)) {
		if (parameters.messageOrInteraction.replied || parameters.messageOrInteraction.deferred) {
			await parameters.messageOrInteraction.editReply(parameters.interactionEditReplyContent);
		} else if (parameters.messageOrInteraction.isMessageComponent()) {
			await parameters.messageOrInteraction.update(parameters.componentUpdateContent);
		} else {
			await parameters.messageOrInteraction.reply(parameters.interactionReplyContent);
		}
	} else if (parameters.messageMethodContent && parameters.messageMethod && isMessageInstance(parameters.messageOrInteraction)) {
		await parameters.messageOrInteraction[parameters.messageMethod](parameters.messageMethodContent as any);
	}
}

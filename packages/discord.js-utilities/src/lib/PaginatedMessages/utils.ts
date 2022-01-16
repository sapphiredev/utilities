import { chunk, partition } from '@sapphire/utilities';
import { Constants, InteractionButtonOptions, MessageActionRow, MessageButton, MessageSelectMenu, MessageSelectMenuOptions } from 'discord.js';
import type { PaginatedMessageAction, PaginatedMessageActionButton, PaginatedMessageActionLink, PaginatedMessageActionMenu } from '.';

export function actionIsButtonOrMenu(action: PaginatedMessageAction): action is PaginatedMessageActionButton | PaginatedMessageActionMenu {
	return (
		action.type === Constants.MessageComponentTypes.SELECT_MENU ||
		((action as PaginatedMessageActionButton | PaginatedMessageActionLink).style !== 'LINK' &&
			(action as PaginatedMessageActionButton | PaginatedMessageActionLink).style !== Constants.MessageButtonStyles.LINK)
	);
}

export function isMessageButtonInteraction(
	interaction: InteractionButtonOptions | MessageSelectMenuOptions
): interaction is InteractionButtonOptions {
	return interaction.type === Constants.MessageComponentTypes.BUTTON;
}

export function isMessageButtonComponent(component: MessageButton | MessageSelectMenu): component is MessageButton {
	return component.type === 'BUTTON';
}

export function createPartitionedMessageRow(components: (MessageButton | MessageSelectMenu)[]): MessageActionRow[] {
	// Partition the components into two groups: buttons and select menus
	const [messageButtons, selectMenus] = partition(components, isMessageButtonComponent);

	// Chunk the button components in sets of 5, the maximum of 1 MessageActionRow
	const chunkedButtonComponents = chunk(messageButtons, 5);

	// Map all the button components to MessageActionRows
	const messageButtonActionRows = chunkedButtonComponents.map((componentsChunk) =>
		new MessageActionRow() //
			.setComponents(componentsChunk)
	);

	// Map all the select menu components to MessageActionRows
	const selectMenuActionRows = selectMenus.map((component) =>
		new MessageActionRow() //
			.setComponents(component)
	);

	return [...messageButtonActionRows, ...selectMenuActionRows];
}

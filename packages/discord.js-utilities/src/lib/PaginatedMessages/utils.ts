import { chunk, partition } from '@sapphire/utilities';
import type { APIMessage } from 'discord-api-types/v9';
import {
	Constants,
	Message,
	MessageActionRow,
	type ButtonInteraction,
	type CommandInteraction,
	type ContextMenuInteraction,
	type InteractionButtonOptions,
	type MessageButton,
	type MessageSelectMenu,
	type MessageSelectMenuOptions,
	type SelectMenuInteraction
} from 'discord.js';
import type {
	PaginatedMessageAction,
	PaginatedMessageActionButton,
	PaginatedMessageActionLink,
	PaginatedMessageActionMenu
} from './PaginatedMessageTypes';

/**
 * Checks whether the PaginatedMessage runs on an {@link CommandInteraction}, {@link ContextMenuInteraction}, {@link SelectMenuInteraction} or {@link Message}
 * @param messageOrInteraction The message or interaction that the PaginatedMessage runs on
 * @returns `true` if the PaginatedMessage runs on an an {@link CommandInteraction}, {@link ContextMenuInteraction} or {@link SelectMenuInteraction}, `false` if it runs on a {@link Message}
 */
export function runsOnInteraction(
	messageOrInteraction: APIMessage | Message | CommandInteraction | ContextMenuInteraction | SelectMenuInteraction | ButtonInteraction
): messageOrInteraction is CommandInteraction | ContextMenuInteraction | SelectMenuInteraction | ButtonInteraction {
	return !(messageOrInteraction instanceof Message);
}

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

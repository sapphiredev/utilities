import { chunk } from '@sapphire/utilities';
import { Constants, InteractionButtonOptions, MessageActionRow, MessageButton, MessageSelectMenu, MessageSelectMenuOptions } from 'discord.js';

export function isMessageButtonInteraction(
	interaction: InteractionButtonOptions | MessageSelectMenuOptions
): interaction is InteractionButtonOptions {
	return interaction.type === Constants.MessageComponentTypes.BUTTON;
}

export function createPartitionedMessageRow(components: (MessageButton | MessageSelectMenu)[]): MessageActionRow[] {
	// Sort all buttons above select menus
	components = components.sort((a, b) => (a.type === 'BUTTON' && b.type === 'SELECT_MENU' ? -1 : 0));

	// Chunk the components in sets of 5, the maximum of 1 MessageActionRow
	const chunkedComponents = chunk(components, 5);

	// Map all the components to MessageActionRows
	return chunkedComponents.map((componentsChunk) =>
		new MessageActionRow() //
			.setComponents(componentsChunk)
	);
}

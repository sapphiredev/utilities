import { chunk, partition } from '@sapphire/utilities';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	type APIActionRowComponent,
	type APIMessageActionRowComponent,
	type ActionRowComponentOptions,
	type ButtonComponentData,
	type ChannelSelectMenuComponentData,
	type MentionableSelectMenuComponentData,
	type MessageActionRowComponentBuilder,
	type RoleSelectMenuComponentData,
	type StringSelectMenuComponentData,
	type UserSelectMenuComponentData
} from 'discord.js';
import { isAnyInteractableInteraction, isMessageInstance } from '../type-guards';
import type {
	PaginatedMessageAction,
	PaginatedMessageActionButton,
	PaginatedMessageActionChannelMenu,
	PaginatedMessageActionLink,
	PaginatedMessageActionMentionableMenu,
	PaginatedMessageActionRoleMenu,
	PaginatedMessageActionStringMenu,
	PaginatedMessageActionUserMenu,
	PaginatedMessageComponentUnion,
	SafeReplyToInteractionParameters
} from './PaginatedMessageTypes';

export function actionIsButtonOrMenu(action: PaginatedMessageAction): action is Exclude<PaginatedMessageAction, PaginatedMessageActionLink> {
	return (
		action.type === ComponentType.Button ||
		action.type === ComponentType.StringSelect ||
		action.type === ComponentType.UserSelect ||
		action.type === ComponentType.RoleSelect ||
		action.type === ComponentType.MentionableSelect ||
		action.type === ComponentType.ChannelSelect
	);
}

export function isMessageButtonInteractionData(interaction: ActionRowComponentOptions): interaction is ButtonComponentData {
	return interaction.type === ComponentType.Button;
}

export function isMessageStringSelectInteractionData(interaction: ActionRowComponentOptions): interaction is StringSelectMenuComponentData {
	return interaction.type === ComponentType.StringSelect;
}

export function isMessageUserSelectInteractionData(interaction: ActionRowComponentOptions): interaction is UserSelectMenuComponentData {
	return interaction.type === ComponentType.UserSelect;
}

export function isMessageRoleSelectInteractionData(interaction: ActionRowComponentOptions): interaction is RoleSelectMenuComponentData {
	return interaction.type === ComponentType.RoleSelect;
}

export function isMessageMentionableSelectInteractionData(interaction: ActionRowComponentOptions): interaction is MentionableSelectMenuComponentData {
	return interaction.type === ComponentType.MentionableSelect;
}

export function isMessageChannelSelectInteractionData(interaction: ActionRowComponentOptions): interaction is ChannelSelectMenuComponentData {
	return interaction.type === ComponentType.ChannelSelect;
}

export function isButtonComponentBuilder(component: MessageActionRowComponentBuilder): component is ButtonBuilder {
	return component.data.type === ComponentType.Button;
}

export function isActionButton(action: PaginatedMessageAction): action is PaginatedMessageActionButton {
	return action.type === ComponentType.Button && action.style !== ButtonStyle.Link;
}

export function isActionLink(action: PaginatedMessageAction): action is PaginatedMessageActionLink {
	return action.type === ComponentType.Button && action.style === ButtonStyle.Link;
}

export function isActionStringMenu(action: PaginatedMessageAction): action is PaginatedMessageActionStringMenu {
	return action.type === ComponentType.StringSelect;
}

export function isActionUserMenu(action: PaginatedMessageAction): action is PaginatedMessageActionUserMenu {
	return action.type === ComponentType.UserSelect;
}

export function isActionRoleMenu(action: PaginatedMessageAction): action is PaginatedMessageActionRoleMenu {
	return action.type === ComponentType.RoleSelect;
}

export function isActionMentionableMenu(action: PaginatedMessageAction): action is PaginatedMessageActionMentionableMenu {
	return action.type === ComponentType.MentionableSelect;
}

export function isActionChannelMenu(action: PaginatedMessageAction): action is PaginatedMessageActionChannelMenu {
	return action.type === ComponentType.ChannelSelect;
}

export function createPartitionedMessageRow(components: MessageActionRowComponentBuilder[]): PaginatedMessageComponentUnion[] {
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

	return [...messageButtonActionRows, ...selectMenuActionRows].map((actionRow) =>
		actionRow.toJSON()
	) as APIActionRowComponent<APIMessageActionRowComponent>[];
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

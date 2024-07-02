import { ButtonStyle, ComponentType } from 'discord.js';
import type { PaginatedMessageAction } from './PaginatedMessageTypes';

export const defaultActions: PaginatedMessageAction[] = [
	{
		customId: '@sapphire/paginated-messages.goToPage',
		type: ComponentType.StringSelect,
		options: [],
		run: ({ handler, interaction }) => interaction.isStringSelectMenu() && (handler.index = parseInt(interaction.values[0], 10))
	},
	{
		customId: '@sapphire/paginated-messages.firstPage',
		style: ButtonStyle.Primary,
		emoji: '⏪',
		type: ComponentType.Button,
		run: ({ handler }) => (handler.index = 0)
	},
	{
		customId: '@sapphire/paginated-messages.previousPage',
		style: ButtonStyle.Primary,
		emoji: '◀️',
		type: ComponentType.Button,
		run: ({ handler }) => {
			if (handler.index === 0) {
				handler.index = handler.pages.length - 1;
			} else {
				--handler.index;
			}
		}
	},
	{
		customId: '@sapphire/paginated-messages.nextPage',
		style: ButtonStyle.Primary,
		emoji: '▶️',
		type: ComponentType.Button,
		run: ({ handler }) => {
			if (handler.index === handler.pages.length - 1) {
				handler.index = 0;
			} else {
				++handler.index;
			}
		}
	},
	{
		customId: '@sapphire/paginated-messages.goToLastPage',
		style: ButtonStyle.Primary,
		emoji: '⏩',
		type: ComponentType.Button,
		run: ({ handler }) => (handler.index = handler.pages.length - 1)
	},
	{
		customId: '@sapphire/paginated-messages.stop',
		style: ButtonStyle.Danger,
		emoji: '⏹️',
		type: ComponentType.Button,
		run: ({ collector }) => {
			collector.stop();
		}
	}
];

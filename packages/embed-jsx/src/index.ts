import type { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export { EmbedJsx } from './lib/EmbedJsx';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			embed: MessageEmbedOptions;
			title: { url?: string };
			description: Record<string, never>;
			field: { name?: string; inline?: boolean };
			timestamp: Record<string, never>;
			footer: { iconURL?: string };
			image: { url: string };
			thumbnail: { url: string };
			author: { url?: string; iconURL?: string };
		}

		type Element = MessageEmbed;
	}
}

import type { EmojiIdentifierResolvable } from 'discord.js';

export interface IMessagePrompterStrategyOptions {
	timeout?: number;
	explicitReturn?: boolean;
}

export interface IMessagePrompterConfirmStrategyOptions extends IMessagePrompterStrategyOptions {
	confirmEmoji?: string | EmojiIdentifierResolvable;
	cancelEmoji?: string | EmojiIdentifierResolvable;
}

export interface IMessagePrompterNumberStrategyOptions extends IMessagePrompterStrategyOptions {
	start?: number;
	end?: number;
	numberEmojis?: string[] | EmojiIdentifierResolvable[];
}

export interface IMessagePrompterReactionStrategyOptions extends IMessagePrompterStrategyOptions {
	reactions: string[] | EmojiIdentifierResolvable[];
}

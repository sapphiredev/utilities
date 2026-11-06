import type { EmojiIdentifierResolvable, Message } from 'discord.js';

export interface IMessagePrompterStrategyOptions {
	editMessage?: Message;
	explicitReturn?: boolean;
	timeout?: number;
}

export interface IMessagePrompterConfirmStrategyOptions extends IMessagePrompterStrategyOptions {
	cancelEmoji?: EmojiIdentifierResolvable | string;
	confirmEmoji?: EmojiIdentifierResolvable | string;
}

export interface IMessagePrompterNumberStrategyOptions extends IMessagePrompterStrategyOptions {
	end?: number;
	numberEmojis?: EmojiIdentifierResolvable[] | string[];
	start?: number;
}

export interface IMessagePrompterReactionStrategyOptions extends IMessagePrompterStrategyOptions {
	reactions: EmojiIdentifierResolvable[] | string[];
}

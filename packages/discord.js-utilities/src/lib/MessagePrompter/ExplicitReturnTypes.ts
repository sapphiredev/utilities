import type { EmojiIdentifierResolvable, GuildEmoji, Message, ReactionEmoji } from 'discord.js';
import type { MessagePrompterMessage } from './constants';
import type { MessagePrompterBaseStrategy } from './strategies/MessagePrompterBaseStrategy';

export interface IMessagePrompterExplicitReturnBase {
	emoji?: GuildEmoji | ReactionEmoji;
	reaction?: string | EmojiIdentifierResolvable;
	strategy: MessagePrompterBaseStrategy;
	appliedMessage: Message;
	message: MessagePrompterMessage;
}

export interface IMessagePrompterExplicitConfirmReturn extends IMessagePrompterExplicitReturnBase {
	confirmed: boolean;
}

export interface IMessagePrompterExplicitNumberReturn extends IMessagePrompterExplicitReturnBase {
	number: number;
}

export interface IMessagePrompterExplicitMessageReturn extends IMessagePrompterExplicitReturnBase {
	response?: Message;
}

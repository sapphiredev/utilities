import type { ApplicationEmoji, EmojiIdentifierResolvable, GuildEmoji, Message, ReactionEmoji } from 'discord.js';
import type { MessagePrompterMessage } from './constants';
import type { MessagePrompterBaseStrategy } from './strategies/MessagePrompterBaseStrategy';

export interface IMessagePrompterExplicitReturnBase {
	appliedMessage: Message;
	emoji?: ApplicationEmoji | GuildEmoji | ReactionEmoji;
	message: MessagePrompterMessage;
	reaction?: EmojiIdentifierResolvable | string;
	strategy: MessagePrompterBaseStrategy;
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

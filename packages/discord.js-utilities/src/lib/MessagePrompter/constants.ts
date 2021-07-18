import type { APIMessageContentResolvable, MessageAdditions, MessageOptions } from 'discord.js';

/**
 * A type to extend multiple discord types and simplify usage in {@link MessagePrompter}
 */
export type MessagePrompterMessage = APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions;

export const enum MessagePrompterStrategies {
	Confirm = 'confirm',
	Number = 'number',
	Message = 'message',
	Reaction = 'reaction'
}

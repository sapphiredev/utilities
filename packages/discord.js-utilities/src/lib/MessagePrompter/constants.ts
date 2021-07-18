import type { ArgumentTypes } from '@sapphire/utilities';
import type { PartialTextBasedChannelFields } from 'discord.js';

/**
 * A type to extend multiple discord types and simplify usage in {@link MessagePrompter}
 */
export type MessagePrompterMessage = ArgumentTypes<PartialTextBasedChannelFields['send']>[0];

export const enum MessagePrompterStrategies {
	Confirm = 'confirm',
	Number = 'number',
	Message = 'message',
	Reaction = 'reaction'
}

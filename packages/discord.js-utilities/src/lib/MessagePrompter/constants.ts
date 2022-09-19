import type { ArgumentTypes } from '@sapphire/utilities/utilityTypes';
import type { CategoryChannel, PartialTextBasedChannelFields, StoreChannel } from 'discord.js';
import type { ChannelTypes, VoiceBasedChannelTypes } from '../utility-types';

/**
 * A type to extend multiple discord types and simplify usage in {@link MessagePrompter}
 */
export type MessagePrompterMessage = Omit<ArgumentTypes<PartialTextBasedChannelFields['send']>[0], 'flags'>;

export type MessagePrompterChannelTypes = Exclude<ChannelTypes, VoiceBasedChannelTypes | StoreChannel | CategoryChannel>;

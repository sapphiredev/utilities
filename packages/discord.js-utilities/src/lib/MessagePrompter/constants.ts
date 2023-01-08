import type { ArgumentTypes } from '@sapphire/utilities';
import type { CategoryChannel, PartialTextBasedChannelFields } from 'discord.js';
import type { ChannelTypes, VoiceBasedChannelTypes } from '../utility-types';

/**
 * A type to extend multiple discord types and simplify usage in {@link MessagePrompter}
 */
export type MessagePrompterMessage = ArgumentTypes<PartialTextBasedChannelFields['send']>[0];

export type MessagePrompterChannelTypes = Exclude<ChannelTypes, VoiceBasedChannelTypes | CategoryChannel>;

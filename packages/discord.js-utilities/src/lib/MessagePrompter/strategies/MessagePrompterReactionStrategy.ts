import type { CollectorFilter, EmojiIdentifierResolvable, EmojiResolvable, MessageReaction, User } from 'discord.js';
import type { IMessagePrompterExplicitReturnBase } from '../ExplicitReturnTypes';
import type { MessagePrompterChannelTypes, MessagePrompterMessage } from '../constants';
import type { IMessagePrompterReactionStrategyOptions } from '../strategyOptions';
import { MessagePrompterBaseStrategy } from './MessagePrompterBaseStrategy';

export class MessagePrompterReactionStrategy extends MessagePrompterBaseStrategy implements MessagePrompterReactionStrategy {
	/**
	 * The emojis used
	 */
	public reactions: EmojiIdentifierResolvable[];

	/**
	 * Constructor for the {@link MessagePrompterReactionStrategy} class
	 * @param messagePrompter The used instance of {@link MessagePrompter}
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterReactionStrategyOptions) {
		super('reactions', message, options);

		this.reactions = options?.reactions;
	}

	/**
	 * This executes the {@link MessagePrompterReactionStrategy} and sends the message.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@linkplain https://discord.js.org/docs/packages/discord.js/main/CollectorFilter:TypeAlias CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the reaction object.
	 */
	public async run(
		channel: MessagePrompterChannelTypes,
		authorOrFilter: User | CollectorFilter<[MessageReaction, User]>
	): Promise<IMessagePrompterExplicitReturnBase | string | EmojiResolvable> {
		if (!this.reactions?.length) throw new TypeError('There are no reactions provided.');

		const response = await this.collectReactions(channel, authorOrFilter, this.reactions);

		return this.explicitReturn ? response : response.reaction ?? response;
	}
}

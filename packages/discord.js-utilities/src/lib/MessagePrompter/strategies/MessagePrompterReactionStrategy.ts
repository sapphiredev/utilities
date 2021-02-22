import type { CollectorFilter, DMChannel, EmojiResolvable, NewsChannel, TextChannel, User } from 'discord.js';
import type { MessagePrompterMessage } from '../constants';
import type { IMessagePrompterExplicitReturnBase } from '../ExplicitReturnTypes';
import type { IMessagePrompterReactionStrategyOptions } from '../strategyOptions';
import { MessagePrompterBaseStrategy } from './MessagePrompterBaseStrategy';

export class MessagePrompterReactionStrategy extends MessagePrompterBaseStrategy implements MessagePrompterReactionStrategy {
	/**
	 * The emojis used
	 */
	public reactions: string[] | EmojiResolvable[];

	/**
	 * Constructor for the [[MessagePrompterReactionStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterReactionStrategyOptions) {
		super('reactions', message, options);

		this.reactions = options?.reactions;
	}

	/**
	 * This executes the [[MessagePrompterReactionStrategy]] and sends the message.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the reaction object.
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitReturnBase | string | EmojiResolvable> {
		if (!this.reactions?.length) throw new TypeError('There are no reactions provided.');

		const response = await this.collectReactions(channel, authorOrFilter, this.reactions);

		return this.explicitReturn ? response : response.reaction ?? response;
	}
}

import type { CollectorFilter, EmojiResolvable, MessageReaction, User } from 'discord.js';
import type { IMessagePrompterExplicitConfirmReturn } from '../ExplicitReturnTypes';
import type { MessagePrompterChannelTypes, MessagePrompterMessage } from '../constants';
import type { IMessagePrompterConfirmStrategyOptions } from '../strategyOptions';
import { MessagePrompterBaseStrategy } from './MessagePrompterBaseStrategy';

export class MessagePrompterConfirmStrategy extends MessagePrompterBaseStrategy implements IMessagePrompterConfirmStrategyOptions {
	/**
	 * The confirm emoji used
	 */
	public confirmEmoji: string | EmojiResolvable;

	/**
	 * The cancel emoji used
	 */
	public cancelEmoji: string | EmojiResolvable;

	/**
	 * Constructor for the {@link MessagePrompterBaseStrategy} class
	 * @param message The message to be sent {@link MessagePrompter}
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options?: IMessagePrompterConfirmStrategyOptions) {
		super('confirm', message, options);

		this.confirmEmoji = options?.confirmEmoji ?? MessagePrompterConfirmStrategy.confirmEmoji;
		this.cancelEmoji = options?.cancelEmoji ?? MessagePrompterConfirmStrategy.cancelEmoji;
	}

	/**
	 * This executes the {@link MessagePrompter} and sends the message if {@link IMessagePrompterOptions.type} equals confirm.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@linkplain https://discord.js.org/docs/packages/discord.js/main/CollectorFilter:TypeAlias CollectorFilter} predicate callback.
	 * @returns A promise that resolves to a boolean denoting the value of the input (`true` for yes, `false` for no).
	 */
	public override async run(
		channel: MessagePrompterChannelTypes,
		authorOrFilter: User | CollectorFilter<[MessageReaction, User]>
	): Promise<IMessagePrompterExplicitConfirmReturn | boolean> {
		const response = await this.collectReactions(channel, authorOrFilter, [this.confirmEmoji, this.cancelEmoji]);

		const confirmed = (response?.emoji?.id ?? response?.emoji?.name) === this.confirmEmoji;

		// prettier-ignore
		return this.explicitReturn ? { ...response, confirmed } : confirmed;
	}

	/**
	 * The default confirm emoji used for {@link MessagePrompterConfirmStrategy}
	 */
	public static confirmEmoji: string | EmojiResolvable = '🇾';

	/**
	 * The default cancel emoji used for {@link MessagePrompterConfirmStrategy}
	 */
	public static cancelEmoji: string | EmojiResolvable = '🇳';
}

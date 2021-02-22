import type { CollectorFilter, DMChannel, EmojiResolvable, NewsChannel, TextChannel, User } from 'discord.js';
import type { MessagePrompterMessage } from '../constants';
import type { IMessagePrompterExplicitConfirmReturn } from '../ExplicitReturnTypes';
import type { IMessagePrompterConfirmStrategyOptions } from '../strategyOptions';
import { MessagePrompterBaseStrategy } from './MessagePrompterBaseStrategy';

export class MessagePrompterConfirmStrategy extends MessagePrompterBaseStrategy implements IMessagePrompterConfirmStrategyOptions {
	/**
	 * The cancel emoji used
	 */
	public confirmEmoji: string | EmojiResolvable;

	/**
	 * The confirm emoji used
	 */
	public cancelEmoji: string | EmojiResolvable;

	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param message The message to be sent [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options?: IMessagePrompterConfirmStrategyOptions) {
		super('confirm', message, options);

		this.confirmEmoji = options?.confirmEmoji ?? MessagePrompterConfirmStrategy.confirmEmoji;
		this.cancelEmoji = options?.cancelEmoji ?? MessagePrompterConfirmStrategy.cancelEmoji;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals confirm.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to a boolean denoting the value of the input (`true` for yes, `false` for no).
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitConfirmReturn | boolean> {
		const response = await this.collectReactions(channel, authorOrFilter, [this.confirmEmoji, this.cancelEmoji]);

		const confirmed = (response?.emoji?.id ?? response?.emoji?.name) === MessagePrompterConfirmStrategy.confirmEmoji;

		// prettier-ignore
		return this.explicitReturn ? { ...response, confirmed } : confirmed;
	}

	/**
	 * The default confirm emoji used for [[MessagePrompterConfirmStrategy]]
	 */
	public static confirmEmoji: string | EmojiResolvable = '🇾';

	/**
	 * The default cancel emoji used for [[MessagePrompterConfirmStrategy]]
	 */
	public static cancelEmoji: string | EmojiResolvable = '🇳';
}

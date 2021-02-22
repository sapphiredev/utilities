import type { CollectorFilter, DMChannel, EmojiResolvable, NewsChannel, TextChannel, User } from 'discord.js';
import type { MessagePrompterMessage } from '../constants';
import type { IMessagePrompterExplicitNumberReturn } from '../ExplicitReturnTypes';
import type { IMessagePrompterNumberStrategyOptions } from '../strategyOptions';
import { MessagePrompterBaseStrategy } from './MessagePrompterBaseStrategy';

export class MessagePrompterNumberStrategy extends MessagePrompterBaseStrategy implements IMessagePrompterNumberStrategyOptions {
	/**
	 * The available number emojis
	 */
	public numberEmojis: string[] | EmojiResolvable[];
	/**
	 * The available number emojis
	 */
	public start: number;
	/**
	 * The available number emojis
	 */
	public end: number;

	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterNumberStrategyOptions) {
		super('number', message, options);

		this.numberEmojis = options?.numberEmojis ?? MessagePrompterNumberStrategy.numberEmojis;
		this.start = options?.start ?? 0;
		this.end = options?.end ?? 10;
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals number.
	 * The handler will wait for one (1) reaction.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the selected number within the range.
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitNumberReturn | number> {
		// 0 and 10 are the maximum available emojis as a number
		if (this.start < 0) throw new TypeError('Starting number cannot be less than 0.');
		if (this.end > 10) throw new TypeError('Ending number cannot be more than 10.');

		const numbers = Array.from({ length: this.end - this.start + 1 }, (_, n: number) => n + this.start);
		const emojis = this.numberEmojis.slice(this.start, this.end);
		const response = await this.collectReactions(channel, authorOrFilter, emojis);

		const emojiIndex = emojis.findIndex((emoji) => (response?.emoji?.id ?? response?.emoji?.name) === emoji);
		const number = numbers[emojiIndex];

		// prettier-ignore
		return this.explicitReturn ? { ...response, number } : number;
	}

	/**
	 * The default available number emojis
	 */
	public static numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
}

import type { CollectorFilter, DMChannel, Message, NewsChannel, TextChannel, User } from 'discord.js';
import type { MessagePrompterMessage } from '../constants';
import type { IMessagePrompterExplicitMessageReturn } from '../ExplicitReturnTypes';
import type { IMessagePrompterStrategyOptions } from '../strategyOptions';
import { MessagePrompterBaseStrategy } from './MessagePrompterBaseStrategy';

export class MessagePrompterMessageStrategy extends MessagePrompterBaseStrategy implements IMessagePrompterStrategyOptions {
	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterStrategyOptions) {
		super('message', message, options);
	}

	/**
	 * This executes the [[MessagePrompter]] and sends the message if [[IMessagePrompterOptions.type]] equals message.
	 * The handler will wait for one (1) message.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@link https://discord.js.org/#/docs/main/stable/typedef/CollectorFilter CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the message object received.
	 */
	public async run(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter
	): Promise<IMessagePrompterExplicitMessageReturn | Message> {
		this.appliedMessage = await channel.send(this.message);

		const collector = await channel.awaitMessages(this.createMessagePromptFilter(authorOrFilter), {
			max: 1,
			time: this.timeout,
			errors: ['time']
		});
		const response = collector.first();

		if (!response) {
			throw new Error('No messages received');
		}

		return this.explicitReturn
			? {
					response,
					strategy: this as MessagePrompterBaseStrategy,
					appliedMessage: this.appliedMessage,
					message: this.message
			  }
			: response;
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitMessages function
	 */
	private createMessagePromptFilter(authorOrFilter: User | CollectorFilter): CollectorFilter {
		return async (message: Message) =>
			(typeof authorOrFilter === 'function' ? await authorOrFilter(message) : message.author.id === authorOrFilter.id) && !message.author.bot;
	}
}

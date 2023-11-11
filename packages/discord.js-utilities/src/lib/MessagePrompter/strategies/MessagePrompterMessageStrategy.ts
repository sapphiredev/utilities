import { isNullish, type ArgumentTypes } from '@sapphire/utilities';
import type { CollectorFilter, CollectorOptions, Message, User } from 'discord.js';
import { isStageChannel, isTextBasedChannel } from '../../type-guards';
import type { IMessagePrompterExplicitMessageReturn } from '../ExplicitReturnTypes';
import type { MessagePrompterChannelTypes, MessagePrompterMessage } from '../constants';
import type { IMessagePrompterStrategyOptions } from '../strategyOptions';
import { MessagePrompterBaseStrategy } from './MessagePrompterBaseStrategy';

export class MessagePrompterMessageStrategy extends MessagePrompterBaseStrategy implements IMessagePrompterStrategyOptions {
	/**
	 * Constructor for the {@link MessagePrompterBaseStrategy} class
	 * @param messagePrompter The used instance of {@link MessagePrompter}
	 * @param options Overrideable options if needed.
	 */
	public constructor(message: MessagePrompterMessage, options: IMessagePrompterStrategyOptions) {
		super('message', message, options);
	}

	/**
	 * This executes the {@link MessagePrompter} and sends the message if {@link IMessagePrompterOptions.type} equals message.
	 * The handler will wait for one (1) message.
	 * @param channel The channel to use.
	 * @param authorOrFilter An author object to validate or a {@linkplain https://discord.js.org/docs/packages/discord.js/main/CollectorFilter:TypeAlias CollectorFilter} predicate callback.
	 * @returns A promise that resolves to the message object received.
	 */
	public override async run(
		channel: MessagePrompterChannelTypes,
		authorOrFilter: User | CollectorFilter<[Message]>
	): Promise<IMessagePrompterExplicitMessageReturn | Message> {
		if (isTextBasedChannel(channel) && !isStageChannel(channel)) {
			if (!isNullish(this.editMessage) && this.editMessage.editable) {
				this.appliedMessage = await this.editMessage.edit(this.message as ArgumentTypes<Message['edit']>[0]);
			} else {
				this.appliedMessage = await channel.send(this.message);
			}

			const collector = await channel.awaitMessages({
				...this.createMessagePromptFilter(authorOrFilter),
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
						strategy: this,
						appliedMessage: this.appliedMessage,
						message: this.message
				  }
				: response;
		}

		throw new Error('A channel was provided to which I am not able to send messages');
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitMessages function
	 */
	private createMessagePromptFilter(authorOrFilter: User | CollectorFilter<[Message]>): CollectorOptions<[Message]> {
		return {
			filter: async (message: Message) =>
				(typeof authorOrFilter === 'function' ? await authorOrFilter(message) : message.author.id === authorOrFilter.id) &&
				!message.author.bot
		};
	}
}

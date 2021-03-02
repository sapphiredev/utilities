import type { CollectorFilter, DMChannel, EmojiIdentifierResolvable, Message, MessageReaction, NewsChannel, TextChannel, User } from 'discord.js';
import type { Awaited, MessagePrompterMessage } from '../constants';
import type { IMessagePrompterExplicitReturnBase } from '../ExplicitReturnTypes';
import type { IMessagePrompterStrategyOptions } from '../strategyOptions';

export abstract class MessagePrompterBaseStrategy {
	/**
	 * The type of strategy that was used
	 */
	public type: string;

	/**
	 * The timeout that was used in the collector
	 */
	public timeout: number;

	/**
	 * Wether to return an explicit object with data, or the strategies' default
	 */
	public explicitReturn: boolean;

	/**
	 * The message that has been sent in [[MessagePrompter.run]]
	 */
	public appliedMessage: Message | null = null;

	/**
	 * The message that will be sent in [[MessagePrompter.run]]
	 */
	public message: MessagePrompterMessage;

	/**
	 * Constructor for the [[MessagePrompterBaseStrategy]] class
	 * @param messagePrompter The used instance of [[MessagePrompter]]
	 * @param options Overrideable options if needed.
	 */
	public constructor(type: string, message: MessagePrompterMessage, options?: IMessagePrompterStrategyOptions) {
		this.type = type;
		this.timeout = options?.timeout ?? MessagePrompterBaseStrategy.defaultStrategyOptions.timeout;
		this.explicitReturn = options?.explicitReturn ?? MessagePrompterBaseStrategy.defaultStrategyOptions.explicitReturn;
		this.message = message;
	}

	public abstract run(channel: TextChannel | NewsChannel | DMChannel, authorOrFilter: User | CollectorFilter): Awaited<unknown>;

	protected async collectReactions(
		channel: TextChannel | NewsChannel | DMChannel,
		authorOrFilter: User | CollectorFilter,
		reactions: string[] | EmojiIdentifierResolvable[]
	): Promise<IMessagePrompterExplicitReturnBase> {
		this.appliedMessage = await channel.send(this.message);

		const collector = this.appliedMessage.createReactionCollector(this.createReactionPromptFilter(reactions, authorOrFilter), {
			max: 1,
			time: this.timeout
		});

		let resolved = false;
		const collected: Promise<MessageReaction> = new Promise<MessageReaction>((resolve, reject) => {
			collector.on('collect', (r) => {
				resolve(r);
				resolved = true;
				collector.stop();
			});

			collector.on('end', (collected) => {
				resolved = true;
				if (!collected.size) reject(new Error('Collector has ended'));
			});
		});

		for (const reaction of reactions) {
			if (resolved) break;

			await this.appliedMessage.react(reaction);
		}

		const firstReaction = await collected;
		const emoji = firstReaction?.emoji;

		const reaction = reactions.find((r) => (emoji?.id ?? emoji?.name) === r);

		return {
			emoji,
			reaction,
			strategy: this,
			appliedMessage: this.appliedMessage,
			message: this.message
		};
	}

	/**
	 * Creates a filter for the collector to filter on
	 * @return The filter for awaitReactions function
	 */
	protected createReactionPromptFilter(reactions: string[] | EmojiIdentifierResolvable[], authorOrFilter: User | CollectorFilter): CollectorFilter {
		return async (reaction: MessageReaction, user: User) =>
			reactions.includes(reaction.emoji.id ?? reaction.emoji.name) &&
			(typeof authorOrFilter === 'function' ? await authorOrFilter(reaction, user) : user.id === authorOrFilter.id) &&
			!user.bot;
	}

	/**
	 * The default strategy options
	 */
	public static defaultStrategyOptions: Required<IMessagePrompterStrategyOptions> = {
		timeout: 10 * 1000,
		explicitReturn: false
	};
}

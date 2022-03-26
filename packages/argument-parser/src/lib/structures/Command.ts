import type { Message } from 'discord.js';
import * as Lexure from 'lexure';
import { Args } from '../parsers/Args';
import { FlagStrategyOptions, FlagUnorderedStrategy } from '../utils/strategies/FlagUnorderedStrategy';

export namespace Command {
	export type RunContext = Record<PropertyKey, unknown>;
}

export abstract class Command {
	/**
	 * The strategy to use for the lexer.
	 */
	public strategy: Lexure.UnorderedStrategy;

	/**
	 * The lexer to be used for command parsing
	 * @private
	 */
	protected lexer = new Lexure.Lexer();

	/**
	 * @param options Optional Command settings.
	 */
	protected constructor(options: CommandOptions = {}) {
		this.strategy = new FlagUnorderedStrategy(options);
		this.lexer.setQuotes(
			options.quotes ?? [
				['"', '"'], // Double quotes
				['“', '”'], // Fancy quotes (on iOS)
				['「', '」'], // Corner brackets (CJK)
				['«', '»'] // French quotes (guillemets)
			]
		);
	}

	/**
	 * The message pre-parse method. This method can be overridden by plugins to define their own argument parser.
	 * @param message The message that triggered the command.
	 * @param parameters The raw parameters as a single string.
	 * @param context The command-context used in this execution.
	 */
	public messagePreParse(message: Message, parameters: string, context: Command.RunContext): Args {
		const parser = new Lexure.Parser(this.lexer.setInput(parameters).lex()).setUnorderedStrategy(this.strategy);
		const args = new Lexure.Args(parser.parse());
		return new Args(message, this, args, context);
	}
}

/**
 * The {@link Command} options.
 * @since 1.0.0
 */
export interface CommandOptions extends FlagStrategyOptions {
	/**
	 * The quotes accepted by this command, pass `[]` to disable them.
	 * @since 1.0.0
	 * @default
	 * [
	 *   ['"', '"'], // Double quotes
	 *   ['“', '”'], // Fancy quotes (on iOS)
	 *   ['「', '」'] // Corner brackets (CJK)
	 * ]
	 */
	quotes?: [string, string][];
}

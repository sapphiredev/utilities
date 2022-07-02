import { QuotedParameter } from './parameters/QuotedParameter';
import { WordParameter } from './parameters/WordParameter';
import { TokenType, type Token } from './raw/TokenStream';

export class ParameterStream {
	private readonly stream: Iterable<Token>;
	private separators: string[] = [];

	public constructor(stream: Iterable<Token>) {
		this.stream = stream;
	}

	public *[Symbol.iterator](): Iterator<Parameter, string[]> {
		for (const part of this.stream) {
			if (part.type === TokenType.Separator) {
				this.separators.push(part.value);
				continue;
			}

			yield part.type === TokenType.Quoted ? new QuotedParameter(this.separators, part) : new WordParameter(this.separators, part);
			this.separators = [];
		}

		return this.separators;
	}
}

export type Parameter = QuotedParameter | WordParameter;

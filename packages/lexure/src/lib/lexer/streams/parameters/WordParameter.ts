import type { WordToken } from '../raw/TokenStream';
import { BaseParameter } from './BaseParameter';

export class WordParameter extends BaseParameter {
	public readonly value: string;

	public constructor(separators: readonly string[], part: Omit<WordToken, 'type'>) {
		super(separators);
		this.value = part.value;
	}

	public get raw() {
		return this.value;
	}
}

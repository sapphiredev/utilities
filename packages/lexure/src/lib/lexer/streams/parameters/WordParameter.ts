import type { WordToken } from '../raw/TokenStream.js';
import { BaseParameter } from './BaseParameter.js';

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

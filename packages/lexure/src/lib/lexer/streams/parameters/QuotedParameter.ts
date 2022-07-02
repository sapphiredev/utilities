import type { QuotedToken } from '../raw/TokenStream';
import { BaseParameter } from './BaseParameter';

export class QuotedParameter extends BaseParameter {
	public readonly value: string;
	public readonly open: string;
	public readonly close: string;

	public constructor(separators: readonly string[], part: QuotedToken) {
		super(separators);
		this.value = part.value;
		this.open = part.open;
		this.close = part.close;
	}

	public get raw() {
		return `${this.open}${this.value}${this.close}`;
	}
}

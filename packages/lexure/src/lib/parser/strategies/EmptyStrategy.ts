import { Option } from '@sapphire/result';
import type { IUnorderedStrategy } from './IUnorderedStrategy';

export class EmptyStrategy implements IUnorderedStrategy {
	public matchFlag(): Option<string> {
		return Option.none;
	}

	public matchOption(): Option<readonly [key: string, value: string]> {
		return Option.none;
	}
}

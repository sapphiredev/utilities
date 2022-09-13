import type { U4 } from '../data/common';
import type { IType } from './IType';

export const Bit4: IType<Bit4.Input | Bit4.Output, Bit4.Output> = {
	size: 4,
	deserialize(buffer) {
		return buffer.readU4();
	},
	serialize(buffer, value) {
		buffer.writeU4(value);
	}
};

export namespace Bit4 {
	export type Output = U4;
	export type Input = U4;
}

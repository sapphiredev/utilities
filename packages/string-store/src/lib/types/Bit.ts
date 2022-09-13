import type { U1 } from '../data/common';
import type { IType } from './IType';

export const Bit: IType<Bit.Input | Bit.Output, Bit.Output> = {
	size: 1,
	deserialize(buffer) {
		return buffer.readU1();
	},
	serialize(buffer, value) {
		buffer.writeU1(value);
	}
};

export namespace Bit {
	export type Output = U1;
	export type Input = U1;
}

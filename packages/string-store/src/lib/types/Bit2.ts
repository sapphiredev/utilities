import type { U2 } from '../data/common';
import type { IType } from './IType';

export const Bit2: IType<Bit2.Input | Bit2.Output, Bit2.Output> = {
	size: 2,
	deserialize(buffer) {
		return buffer.readU2();
	},
	serialize(buffer, value) {
		buffer.writeU2(value);
	}
};

export namespace Bit2 {
	export type Output = U2;
	export type Input = U2;
}

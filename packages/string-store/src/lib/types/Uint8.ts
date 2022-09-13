import type { IType } from './IType';

export const Uint8: IType<Uint8.Input | Uint8.Output, Uint8.Output> = {
	size: 8,
	deserialize(buffer) {
		return buffer.readU8();
	},
	serialize(buffer, value) {
		buffer.writeU8(value);
	}
};

export namespace Uint8 {
	export type Output = number;
	export type Input = number | bigint;
}

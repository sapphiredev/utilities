import type { IType } from './IType';

export const Uint32: IType<Uint32.Input | Uint32.Output, Uint32.Output> = {
	size: 32,
	deserialize(buffer) {
		return buffer.readU32();
	},
	serialize(buffer, value) {
		buffer.writeU32(value);
	}
};

export namespace Uint32 {
	export type Output = number;
	export type Input = bigint;
}

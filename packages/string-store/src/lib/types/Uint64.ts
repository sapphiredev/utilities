import type { IType } from './IType';

export const Uint64: IType<Uint64.Input, Uint64.Output> = {
	size: 64,
	deserialize(buffer) {
		return buffer.readB64();
	},
	serialize(buffer, value) {
		buffer.writeB64(value);
	}
};

export namespace Uint64 {
	export type Output = bigint;
	export type Input = bigint | number;
}

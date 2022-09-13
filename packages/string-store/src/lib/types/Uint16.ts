import type { IType } from './IType';

export const Uint16: IType<Uint16.Input | Uint16.Output, Uint16.Output> = {
	size: 16,
	deserialize(buffer) {
		return buffer.readU16();
	},
	serialize(buffer, value) {
		buffer.writeU16(value);
	}
};

export namespace Uint16 {
	export type Output = number;
	export type Input = number | bigint;
}

import type { IType } from './IType';

export const Float32: IType<Float32.Input | Float32.Output, Float32.Output> = {
	size: 32,
	deserialize(buffer) {
		return buffer.readF32();
	},
	serialize(buffer, value) {
		buffer.writeF32(value);
	}
};

export namespace Float32 {
	export type Output = number;
	export type Input = number;
}

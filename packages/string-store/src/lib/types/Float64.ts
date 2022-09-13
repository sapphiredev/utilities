import type { IType } from './IType';

export const Float64: IType<Float64.Input | Float64.Output, Float64.Output> = {
	size: 64,
	deserialize(buffer) {
		return buffer.readF64();
	},
	serialize(buffer, value) {
		buffer.writeF64(value);
	}
};

export namespace Float64 {
	export type Output = number;
	export type Input = number;
}

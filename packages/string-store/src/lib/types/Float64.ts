import type { IType } from './base/IType';

export const Float64Type: IType<number, 64> = {
	serialize(buffer, value) {
		buffer.writeFloat64(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readFloat64(pointer);
	},
	BIT_SIZE: 64
};

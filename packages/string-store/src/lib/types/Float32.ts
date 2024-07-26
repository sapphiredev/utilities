import type { IType } from './base/IType';

export const Float32Type: IType<number, 32> = {
	serialize(buffer, value) {
		buffer.writeFloat32(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readFloat32(pointer);
	},
	BIT_SIZE: 32
};

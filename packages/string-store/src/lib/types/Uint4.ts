import type { IType } from './base/IType';

export const Uint4Type: IType<number, 4> = {
	serialize(buffer, value) {
		buffer.writeInt4(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readUint4(pointer);
	},
	BIT_SIZE: 4
};

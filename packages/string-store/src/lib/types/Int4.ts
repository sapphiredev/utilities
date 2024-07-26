import type { IType } from './base/IType';

export const Int4Type: IType<number, 4> = {
	serialize(buffer, value) {
		buffer.writeInt4(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readInt4(pointer);
	},
	BIT_SIZE: 4
};

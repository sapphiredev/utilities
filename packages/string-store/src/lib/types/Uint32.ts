import type { IType } from './base/IType';

export const Uint32Type: IType<number, 32> = {
	serialize(buffer, value) {
		buffer.writeInt32(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readUint32(pointer);
	},
	BIT_SIZE: 32
};

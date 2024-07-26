import type { IType } from './base/IType';

export const Uint16Type: IType<number, 16> = {
	serialize(buffer, value) {
		buffer.writeInt16(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readUint16(pointer);
	},
	BIT_SIZE: 16
};

import type { IType } from './base/IType';

export const Uint2Type: IType<number, 2> = {
	serialize(buffer, value) {
		buffer.writeInt2(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readUint2(pointer);
	},
	BIT_SIZE: 2
};

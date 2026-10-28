import { TextDecoder, TextEncoder } from 'node:util';
import type { IType } from './base/IType';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
export const StringType: IType<string, null> = {
	serialize(buffer, value) {
		const encoded = encoder.encode(value);
		buffer.writeInt16(encoded.length);
		for (const byte of encoded) {
			buffer.writeInt8(byte);
		}
	},
	deserialize(buffer, pointer) {
		const length = buffer.readInt16(pointer);
		const bytes = new Uint8Array(length);
		for (let idx = 0; idx < length; idx++) {
			bytes[idx] = buffer.readInt8(pointer);
		}

		return decoder.decode(bytes);
	},
	BIT_SIZE: null
};

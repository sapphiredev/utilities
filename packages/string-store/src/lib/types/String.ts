import { TextDecoder, TextEncoder } from 'util';
import type { IType } from './IType';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function String(length: number | null = null) {
	if (length === null) {
		const DynamicString: IType<string> = {
			size: -1,
			deserialize(buffer) {
				const length = buffer.readU8();
				const encoded = new Uint8Array(length);
				for (let i = 0; i < length; ++i) encoded[i] = buffer.readU8();
				return decoder.decode(encoded);
			},
			serialize(buffer, value) {
				const encoded = encoder.encode(value);
				buffer.writeU8(encoded.byteLength);
				for (const char of encoded) {
					buffer.writeU8(char);
				}
			}
		};

		return DynamicString;
	}

	const FixedString: IType<string> = {
		size: length * 8,
		deserialize(buffer) {
			const encoded = new Uint8Array(length);
			for (let i = 0; i < length; ++i) encoded[i] = buffer.readU8();
			return decoder.decode(encoded);
		},
		serialize(buffer, value) {
			const encoded = encoder.encode(value);
			for (const char of encoded) buffer.writeU8(char);
			buffer.writeEmpty((length - encoded.byteLength) * 8);
		}
	};

	return FixedString;
}

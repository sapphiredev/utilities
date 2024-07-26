import { isArrayLike } from '../shared/_common';
import type { IType } from './base/IType';

export function ArrayType<ValueType, ValueBitSize extends number | null>(type: IType<ValueType, ValueBitSize>): IType<ValueType[], null> {
	return {
		serialize(buffer, values: readonly ValueType[]) {
			if (!isArrayLike(values)) {
				throw new TypeError(`Expected an array, got ${values}`);
			}

			buffer.writeInt16(values.length);
			for (const value of values) {
				type.serialize(buffer, value);
			}
		},
		deserialize(buffer, pointer) {
			const length = buffer.readUint16(pointer);
			const value = [];
			for (let i = 0; i < length; i++) {
				value.push(type.deserialize(buffer, pointer));
			}
			return value;
		},
		BIT_SIZE: null
	};
}

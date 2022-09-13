import type { IType } from './IType';

export function Array<SType, DType>(type: IType<SType, DType>, length: number | null = null) {
	if (length === null) {
		const DynamicArray: IType<SType[], DType[]> = {
			size: -1,
			deserialize(buffer) {
				const length = buffer.readU8();
				const values: DType[] = [];
				for (let i = 0; i < length; ++i) values.push(type.deserialize(buffer));
				return values;
			},
			serialize(buffer, values) {
				buffer.writeU8(values.length);
				for (const value of values) type.serialize(buffer, value);
			}
		};

		return DynamicArray;
	}

	const FixedArray: IType<SType[], DType[]> = {
		size: type.size * length,
		deserialize(buffer) {
			const values: DType[] = [];
			for (let i = 0; i < length; ++i) values.push(type.deserialize(buffer));
			return values;
		},
		serialize(buffer, values) {
			for (const value of values) type.serialize(buffer, value);
			buffer.writeEmpty((length - values.length) * type.size);
		}
	};

	return FixedArray;
}

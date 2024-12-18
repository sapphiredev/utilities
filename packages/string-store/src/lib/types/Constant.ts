import type { IType } from './base/IType';

export function ConstantType<const ValueType>(constantValue: ValueType): IType<ValueType, 0, never> {
	return {
		serialize(_buffer, _value: Readonly<ValueType>) {},
		deserialize(_buffer, _pointer) {
			return constantValue;
		},
		BIT_SIZE: 0
	};
}

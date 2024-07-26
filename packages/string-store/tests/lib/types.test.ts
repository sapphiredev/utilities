import {
	ArrayType,
	BigInt32Type,
	BigInt64Type,
	BitType,
	BooleanType,
	FixedLengthArrayType,
	Float32Type,
	Float64Type,
	Int16Type,
	Int2Type,
	Int32Type,
	Int4Type,
	Int64Type,
	Int8Type,
	Pointer,
	SnowflakeType,
	StringType,
	UnalignedUint16Array
} from '../../src';

describe('types', () => {
	describe('Boolean', () => {
		const type = BooleanType;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(1);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, true);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(true);
		});
	});

	describe('Bit', () => {
		const type = BitType;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(1);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 1);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(1);
		});
	});

	describe('Int2', () => {
		const type = Int2Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(2);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 3);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(3);
		});
	});

	describe('Int4', () => {
		const type = Int4Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(4);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 5);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(5);
		});
	});

	describe('Int8', () => {
		const type = Int8Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(8);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 255);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(255);
		});
	});

	describe('Int16', () => {
		const type = Int16Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(16);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 65535);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(65535);
		});
	});

	describe('Int32', () => {
		const type = Int32Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 4294967295);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(4294967295);
		});
	});

	describe('Int64', () => {
		const type = Int64Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 3058204829589);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(3058204829589);
		});
	});

	describe('BigInt32', () => {
		const type = BigInt32Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 4294967295n);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(4294967295n);
		});
	});

	describe('BigInt64', () => {
		const type = BigInt64Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 18446744073709551615n);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(18446744073709551615n);
		});
	});

	describe('Float32', () => {
		const type = Float32Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 1.1);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toBeCloseTo(1.1);
		});
	});

	describe('Float64', () => {
		const type = Float64Type;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 1.1);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toBeCloseTo(1.1);
		});
	});

	describe('Array(Bit)', () => {
		const type = ArrayType(BitType);

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBeNull();
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, [1, 0, 1, 0, 1]);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual([1, 0, 1, 0, 1]);
		});

		test.each(['Foo', () => {}, true, 42, 100n, Symbol('foo'), {}, { length: '0' }, { length: 1 }])(
			'GIVEN an invalid value THEN it throws an error',
			(value) => {
				const buffer = new UnalignedUint16Array(10);
				// @ts-expect-error Testing invalid input
				expect(() => type.serialize(buffer, value)).toThrowError();
			}
		);
	});

	describe('FixedLengthArray(Bit)', () => {
		const type = FixedLengthArrayType(BitType, 2);

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(2);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, [1, 0]);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual([1, 0]);
		});

		test.each(['Foo', () => {}, true, 42, 100n, Symbol('foo'), {}, { length: '0' }, { length: 1 }, { length: 1.5 }, [], [1, 2, 3]])(
			'GIVEN an invalid value THEN it throws an error',
			(value) => {
				const buffer = new UnalignedUint16Array(10);
				// @ts-expect-error Testing invalid input
				expect(() => type.serialize(buffer, value)).toThrowError();
			}
		);
	});

	describe('String', () => {
		const type = StringType;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBeNull();
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, 'Hello, World!');

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual('Hello, World!');
		});
	});

	describe('Snowflake', () => {
		const type = SnowflakeType;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test.each([737141877803057244n, '737141877803057244'])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(737141877803057244n);
		});
	});
});

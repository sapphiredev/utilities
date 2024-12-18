import { Pointer, SnowflakeType, StringType, t, UnalignedUint16Array } from '../../src';

describe('types', () => {
	describe('Boolean', () => {
		const type = t.boolean;

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
		const type = t.bit;

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
		const type = t.int2;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(2);
		});

		test.each([-2, -1, 0, -1])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Uint2', () => {
		const type = t.uint2;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(2);
		});

		test.each([0, 1, 2, 3])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Int4', () => {
		const type = t.int4;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(4);
		});

		test.each([-8, -6, 0, 7])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Uint4', () => {
		const type = t.uint4;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(4);
		});

		test.each([0, 1, 14, 15])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Int8', () => {
		const type = t.int8;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(8);
		});

		test.each([-128, -100, 0, 127])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Uint8', () => {
		const type = t.uint8;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(8);
		});

		test.each([0, 100, 200, 255])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Int16', () => {
		const type = t.int16;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(16);
		});

		test.each([-32768, -100, 10, 32767])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Uint16', () => {
		const type = t.uint16;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(16);
		});

		test.each([0, 2500, 30000, 65535])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Int32', () => {
		const type = t.int32;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		test.each([-2_147_483_648, -52100, 420, 2_147_483_647])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Uint32', () => {
		const type = t.uint32;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		test.each([0, 420, 4_294_967_295])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Int64', () => {
		const type = t.int64;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test.each([-9_007_199_254_740_991, 420_000, 9_007_199_254_740_991])(
			'GIVEN a buffer THEN it serializes and deserializes correctly',
			(value) => {
				const buffer = new UnalignedUint16Array(10);

				type.serialize(buffer, value);

				const deserialized = type.deserialize(buffer, new Pointer());
				expect(deserialized).toEqual(value);
			}
		);
	});

	describe('Uint64', () => {
		const type = t.uint64;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test.each([0, 640_000_420, 9_007_199_254_740_991])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('BigInt32', () => {
		const type = t.bigInt32;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		test.each([-2_147_483_648n, -52100n, 420n, 2_147_483_647n])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('BigUint32', () => {
		const type = t.bigUint32;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(32);
		});

		test.each([0n, 420n, 4_294_967_295n])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('BigInt64', () => {
		const type = t.bigInt64;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test.each([-9_223_372_036_854_775_808n, -420n, 420n, 9_223_372_036_854_775_807n])(
			'GIVEN a buffer THEN it serializes and deserializes correctly',
			(value) => {
				const buffer = new UnalignedUint16Array(10);

				type.serialize(buffer, value);

				const deserialized = type.deserialize(buffer, new Pointer());
				expect(deserialized).toEqual(value);
			}
		);
	});

	describe('BigUint64', () => {
		const type = t.bigUint64;

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(64);
		});

		test.each([0n, 18_446_744_073_709_551_615n])('GIVEN a buffer THEN it serializes and deserializes correctly', (value) => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, value);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual(value);
		});
	});

	describe('Float32', () => {
		const type = t.float32;

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
		const type = t.float64;

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

	describe('Nullable', () => {
		const type = t.nullable(t.int16);

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(null);
		});

		test.each([null, undefined])('GIVEN a null value THEN it serializes and deserializes correctly', (input) => {
			const buffer = new UnalignedUint16Array(2);

			type.serialize(buffer, input);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toBe(null);
		});

		test('GIVEN a non-null value THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(2);

			type.serialize(buffer, 42);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toBe(42);
		});
	});

	describe('Array(Bit)', () => {
		const type = t.array(t.bit);

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
		const type = t.fixedLengthArray(t.bit, 2);

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

	describe('Constant', () => {
		const type = t.constant('Hello World!');

		test('GIVEN type THEN it has the correct properties', () => {
			expect(type.BIT_SIZE).toBe(0);
		});

		test('GIVEN a buffer THEN it serializes and deserializes correctly', () => {
			const buffer = new UnalignedUint16Array(10);

			type.serialize(buffer, undefined as never);
			expect(buffer.bitLength).toEqual(0);

			const deserialized = type.deserialize(buffer, new Pointer());
			expect(deserialized).toEqual('Hello World!');
		});
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

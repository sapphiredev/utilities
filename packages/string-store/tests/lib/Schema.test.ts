import {
	BigInt32Type,
	BigInt64Type,
	BitType,
	BooleanType,
	Float32Type,
	Float64Type,
	Int16Type,
	Int2Type,
	Int32Type,
	Int4Type,
	Int64Type,
	Int8Type,
	Pointer,
	Schema,
	SnowflakeType,
	StringType,
	UnalignedUint16Array,
	type IType
} from '../../src';

describe('Schema', () => {
	test('GIVEN a new instance THEN it has the correct properties', () => {
		const schema = new Schema(1);
		expectTypeOf<Schema<1, object>>(schema);
		expect<1>(schema.id).toBe(1);
		expect(schema.bitSize).toBe(0);

		type Key = string;
		type Value = never;
		type Entry = readonly [Key, Value];

		expect<Key[]>([...schema.keys()]).toEqual([]);
		expect<Value[]>([...schema.values()]).toEqual([]);
		expect<Entry[]>([...schema.entries()]).toEqual([]);
		expect<Entry[]>([...schema]).toEqual([]);
	});

	describe('types', () => {
		test('GIVEN a schema with a boolean property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof BooleanType;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).boolean('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(1);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([BooleanType]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', BooleanType]]);
		});

		test('GIVEN a schema with a bit property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof BitType;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bit('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(1);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([BitType]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', BitType]]);
		});

		test('GIVEN a schema with an int2 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Int2Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int2('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(2);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Int2Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Int2Type]]);
		});

		test('GIVEN a schema with an int4 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Int4Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int4('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(4);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Int4Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Int4Type]]);
		});

		test('GIVEN a schema with an int8 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Int8Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int8('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(8);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Int8Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Int8Type]]);
		});

		test('GIVEN a schema with an int16 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Int16Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int16('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(16);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Int16Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Int16Type]]);
		});

		test('GIVEN a schema with an int32 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Int32Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Int32Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Int32Type]]);
		});

		test('GIVEN a schema with an int64 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Int64Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).int64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Int64Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Int64Type]]);
		});

		test('GIVEN a schema with a bigInt32 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof BigInt32Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bigInt32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([BigInt32Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', BigInt32Type]]);
		});

		test('GIVEN a schema with a bigInt64 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof BigInt64Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).bigInt64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([BigInt64Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', BigInt64Type]]);
		});

		test('GIVEN a schema with a float32 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Float32Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).float32('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(32);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Float32Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Float32Type]]);
		});

		test('GIVEN a schema with a float64 property THEN it has the correct properties and types', () => {
			type Key = 'a';
			type Value = typeof Float64Type;
			type Entry = readonly [Key, Value];

			const schema = new Schema(1).float64('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([Float64Type]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', Float64Type]]);
		});

		test('GIVEN a schema with a string property THEN it has the correct properties and types', () => {
			const schema = new Schema(1).string('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBeNull();

			type Key = 'a';
			type Value = typeof StringType;
			type Entry = readonly [Key, Value];

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([StringType]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', StringType]]);
		});

		test('GIVEN a schema with a snowflake property THEN it has the correct properties and types', () => {
			const schema = new Schema(1).snowflake('a');
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(64);

			type Key = 'a';
			type Value = typeof SnowflakeType;
			type Entry = readonly [Key, Value];

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([SnowflakeType]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', SnowflakeType]]);
		});

		test('GIVEN a schema with an array THEN it has the correct properties and types', () => {
			const schema = new Schema(1).array('a', BitType);
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBeNull();

			type Key = 'a';
			type Value = IType<number[], null>;
			type Entry = readonly [Key, Value];

			const value = schema.get('a');

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});

		test('GIVEN a schema with a fixed-length array THEN it has the correct properties and types', () => {
			const schema = new Schema(1).fixedLengthArray('a', BitType, 2);
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBe(2);

			type Key = 'a';
			type Value = IType<number[], number>;
			type Entry = readonly [Key, Value];

			const value = schema.get('a');

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});

		test('GIVEN a schema with a fixed-length array of an element with no length THEN it has the correct properties and types', () => {
			const schema = new Schema(1).fixedLengthArray('a', StringType, 2);
			expectTypeOf<Schema<1, { a: Value }>>(schema);
			expect(schema.bitSize).toBeNull();

			type Key = 'a';
			type Value = IType<string[], null>;
			type Entry = readonly [Key, Value];

			const value = schema.get('a');

			expect<Key[]>([...schema.keys()]).toEqual(['a']);
			expect<Value[]>([...schema.values()]).toEqual([value]);
			expect<Entry[]>([...schema.entries()]).toEqual([['a', value]]);
		});
	});

	describe('serialization', () => {
		test('GIVEN a schema with a boolean property THEN it serializes correctly', () => {
			const buffer = new UnalignedUint16Array(2);
			const schema = new Schema(4).boolean('a');

			schema.serialize(buffer, { a: true });
			expect(buffer.toArray()).toEqual(new Uint16Array([4, 1]));

			const value = schema.deserialize(buffer, 16);
			expect<{ a: boolean }>(value).toEqual({ a: true });
		});
	});

	describe('exceptions', () => {
		test('GIVEN a schema with a duplicate property THEN it throws', () => {
			const schema = new Schema(1).boolean('a');
			expect(() => schema.boolean('a')).toThrowError('Schema with id 1 already has a property with name "a"');
		});

		test('GIVEN a schema with a non-existent property name THEN it throws', () => {
			const schema = new Schema(1).boolean('a');
			// @ts-expect-error Testing invalid input
			expect(() => schema.get('b')).toThrowError('Schema with id 1 does not have a property with name "b"');
		});
	});
});

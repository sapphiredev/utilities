import { BitField } from '../../src';

describe('BitField', () => {
	const NumberFlags = {
		Read: 1,
		Write: 2,
		Edit: 4,
		Delete: 8
	} as const;

	const BigIntFlags = {
		Read: 1n,
		Write: 2n,
		Edit: 4n,
		Delete: 8n
	} as const;

	describe('constructor', () => {
		test('GIVEN a valid mapped number flag set THEN returns a number BitField', () => {
			const bitfield = new BitField(NumberFlags);
			expect<BitField<typeof NumberFlags>>(bitfield);
			expect<'number'>(bitfield.type).toBe('number');
			expect<0>(bitfield.zero).toBe(0);
			expect<number>(bitfield.mask).toBe(15);
			expect<typeof NumberFlags>(bitfield.flags).toBe(NumberFlags);
		});

		test('GIVEN a valid mapped bigint flag set THEN returns a bigint BitField', () => {
			const bitfield = new BitField(BigIntFlags);
			expect<BitField<typeof BigIntFlags>>(bitfield);
			expect<'bigint'>(bitfield.type).toBe('bigint');
			expect<0n>(bitfield.zero).toBe(0n);
			expect<bigint>(bitfield.mask).toBe(15n);
			expect<typeof BigIntFlags>(bitfield.flags).toBe(BigIntFlags);
		});

		test.each([true, 42, 10n, 'foo', undefined])('GIVEN a non-object THEN throws TypeError', (value) => {
			const given = () => new BitField(value as any);
			const expected = 'flags must be a non-null object';

			expect(given).toThrowError(expected);
		});

		test('GIVEN a null object THEN throws TypeError', () => {
			const given = () => new BitField(null as any);
			const expected = 'flags must be a non-null object';

			expect(given).toThrowError(expected);
		});

		test('GIVEN an empty object THEN throws TypeError', () => {
			const given = () => new BitField({});
			const expected = 'flags must be a non-empty object';

			expect(given).toThrowError(expected);
		});

		test.each([true, {}, undefined, null, 'foo'])('GIVEN a null object THEN throws TypeError', (value) => {
			const given = () => new BitField({ Read: value } as any);
			const expected = 'A bitfield can only use numbers or bigints for its values';

			expect(given).toThrowError(expected);
		});

		describe('number', () => {
			test.each([true, {}, 42n, undefined, null, 'foo'])('GIVEN a null object THEN throws TypeError', (value) => {
				const given = () => new BitField({ Read: 1, Write: value } as any);
				const expected = 'The property "Write" does not resolve to a number';

				expect(given).toThrowError(expected);
			});

			test.each([1.2, 4294967296])('GIVEN an empty object THEN throws TypeError', (value) => {
				const given = () => new BitField({ Read: value });
				const expected = 'The property "Read" does not resolve to a safe bitfield value';

				expect(given).toThrowError(expected);
			});

			test.each([0, -8])('GIVEN an empty object THEN throws TypeError', (value) => {
				const given = () => new BitField({ Read: value });
				const expected = 'The property "Read" resolves to a non-positive value';

				expect(given).toThrowError(expected);
			});
		});

		describe('bigint', () => {
			test.each([true, {}, 42, undefined, null, 'foo'])('GIVEN a null object THEN throws TypeError', (value) => {
				const given = () => new BitField({ Read: 1n, Write: value } as any);
				const expected = 'The property "Write" does not resolve to a bigint';

				expect(given).toThrowError(expected);
			});

			test.each([0n, -8n])('GIVEN an empty object THEN throws TypeError', (value) => {
				const given = () => new BitField({ Read: value });
				const expected = 'The property "Read" resolves to a non-positive value';

				expect(given).toThrowError(expected);
			});
		});
	});

	describe('prototype', () => {
		const bitfield = new BitField(NumberFlags);

		describe('resolve', () => {
			test('GIVEN a number THEN returns the same number', () => {
				const given = bitfield.resolve(NumberFlags.Write);
				const expected = NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});

			test('GIVEN a string THEN returns the same number', () => {
				const given = bitfield.resolve('Write');
				const expected = NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});

			test('GIVEN an empty array THEN returns ∅', () => {
				const given = bitfield.resolve([]);
				const expected = bitfield.zero;

				expect<number>(given).toBe(expected);
			});

			test('GIVEN a number and a string in array THEN returns the combined number', () => {
				const given = bitfield.resolve([NumberFlags.Write, 'Edit']);
				const expected = NumberFlags.Write | NumberFlags.Edit;

				expect<number>(given).toBe(expected);
			});

			test('GIVEN an out-of-bounds number THEN returns ∅', () => {
				const given = bitfield.resolve(16);
				const expected = 0;

				expect<number>(given).toBe(expected);
			});

			test.each([4n, undefined, true])('GIVEN %o THEN throws TypeError', (value) => {
				const given = () => bitfield.resolve(value as any);
				const expected = 'Received a value that is not either type "string", type "number", or an Array';

				expect(given).toThrowError(expected);
			});

			test.each(['Execute', 'Foo'])('GIVEN %s THEN throws RangeError', (value) => {
				const given = () => bitfield.resolve(value as any);
				const expected = 'Received a name that could not be resolved to a property of flags';

				expect(given).toThrowError(expected);
			});

			test.each([null, {}])('GIVEN non-Array object THEN throws TypeError', (value) => {
				const given = () => bitfield.resolve(value as any);
				const expected = 'Received an object value that is not an Array';

				expect(given).toThrowError(expected);
			});
		});

		describe('any', () => {
			test('GIVEN A ⊇ B THEN returns true', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Write', 'Delete']);
				const expected = true;

				expect(given).toBe(expected);
			});

			test('GIVEN A ⊃ B THEN returns false', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Write']);
				const expected = true;

				expect(given).toBe(expected);
			});

			test('GIVEN A ∩ B ≠ ∅ THEN returns true', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Write', 'Read']);
				const expected = true;

				expect(given).toBe(expected);
			});

			test('GIVEN A ⊅ B THEN returns false', () => {
				const given = bitfield.any(['Write', 'Delete'], ['Read']);
				const expected = false;

				expect(given).toBe(expected);
			});
		});

		describe('has', () => {
			test('GIVEN A ⊇ B THEN returns true', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Write', 'Delete']);
				const expected = true;

				expect(given).toBe(expected);
			});

			test('GIVEN A ⊃ B THEN returns false', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Write']);
				const expected = true;

				expect(given).toBe(expected);
			});

			test('GIVEN A ∩ B ≠ ∅ THEN returns false', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Write', 'Read']);
				const expected = false;

				expect(given).toBe(expected);
			});

			test('GIVEN A ⊅ B THEN returns false', () => {
				const given = bitfield.has(['Write', 'Delete'], ['Read']);
				const expected = false;

				expect(given).toBe(expected);
			});
		});

		describe('complement', () => {
			test('GIVEN Write | Delete THEN returns Read | Edit', () => {
				const given = bitfield.complement(['Write', 'Delete']);
				const expected = NumberFlags.Read | NumberFlags.Edit;

				expect<number>(given).toBe(expected);
			});

			test('GIVEN Read | Write | Edit | Delete THEN returns ∅', () => {
				const given = bitfield.complement(['Read', 'Write', 'Edit', 'Delete']);
				const expected = bitfield.zero;

				expect<number>(given).toBe(expected);
			});
		});

		describe('union', () => {
			test('GIVEN no arguments THEN returns ∅', () => {
				expect<number>(bitfield.union()).toBe(0);
			});

			test('GIVEN Read, Write, Delete THEN returns Read | Write | Delete', () => {
				expect<number>(bitfield.union('Read', 'Write', 'Delete')).toBe(NumberFlags.Read | NumberFlags.Write | NumberFlags.Delete);
			});
		});

		describe('intersection', () => {
			test('GIVEN A ⋂ B = ∅ THEN returns ∅', () => {
				const given = bitfield.intersection('Read', 'Write');
				const expected = bitfield.zero;

				expect<number>(given).toBe(expected);
			});

			test('GIVEN A ⋂ B ≠ ∅ THEN returns a non-empty field', () => {
				const given = bitfield.intersection('Read', ['Read', 'Write']);
				const expected = NumberFlags.Read;

				expect<number>(given).toBe(expected);
			});
		});

		describe('difference', () => {
			test('GIVEN A ∖ B = ∅ THEN returns A', () => {
				const given = bitfield.difference(['Read', 'Write'], 'Edit');
				const expected = NumberFlags.Read | NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});

			test("GIVEN A ∖ B ≠ ∅ THEN returns A without B's bits", () => {
				const given = bitfield.difference(['Read', 'Write', 'Edit'], 'Edit');
				const expected = NumberFlags.Read | NumberFlags.Write;

				expect<number>(given).toBe(expected);
			});
		});

		describe('symmetricDifference', () => {
			test('GIVEN A ⋂ B = ∅ THEN returns A ∪ B', () => {
				const given = bitfield.symmetricDifference(['Read', 'Write'], ['Edit', 'Delete']);
				const expected = NumberFlags.Read | NumberFlags.Write | NumberFlags.Edit | NumberFlags.Delete;

				expect<number>(given).toBe(expected);
			});

			test('GIVEN A ⋂ B ≠ ∅ THEN returns (A ∖ B) ∪ (B ∖ A)', () => {
				const given = bitfield.symmetricDifference(['Read', 'Write', 'Delete'], ['Read', 'Edit', 'Delete']);
				const expected = NumberFlags.Write | NumberFlags.Edit;

				expect<number>(given).toBe(expected);
			});
		});

		describe('toArray', () => {
			test('GIVEN ∅ THEN returns empty array', () => {
				const given = bitfield.toArray(bitfield.zero);
				const expected = [] as const;

				expect<string[]>(given).toEqual(expected);
			});

			test('GIVEN multiple values THEN returns array with given values', () => {
				const given = bitfield.toArray(['Read', 'Delete']);
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			test('GIVEN duplicated values THEN returns array with deduplicated values', () => {
				const given = bitfield.toArray(['Read', 'Delete', 'Read']);
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			test('GIVEN out-of-range values THEN returns array with correct values', () => {
				const given = bitfield.toArray(['Read', 'Delete', 16]);
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});
		});

		describe('toKeys', () => {
			test('GIVEN ∅ THEN returns empty iterator', () => {
				const given = [...bitfield.toKeys(bitfield.zero)];
				const expected = [] as const;

				expect<string[]>(given).toEqual(expected);
			});

			test('GIVEN multiple values THEN returns iterator with given values', () => {
				const given = [...bitfield.toKeys(['Read', 'Delete'])];
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			test('GIVEN duplicated values THEN returns iterator with deduplicated values', () => {
				const given = [...bitfield.toKeys(['Read', 'Delete', 'Read'])];
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});

			test('GIVEN out-of-range values THEN returns iterator with correct values', () => {
				const given = [...bitfield.toKeys(['Read', 'Delete', 16])];
				const expected = ['Read', 'Delete'] as const;

				expect<string[]>(given).toEqual(expected);
			});
		});

		describe('toValues', () => {
			test('GIVEN ∅ THEN returns empty iterator', () => {
				const given = [...bitfield.toValues(bitfield.zero)];
				const expected = [] as const;

				expect<number[]>(given).toEqual(expected);
			});

			test('GIVEN multiple values THEN returns iterator with given values', () => {
				const given = [...bitfield.toValues(['Read', 'Delete'])];
				const expected = [1, 8] as const;

				expect<number[]>(given).toEqual(expected);
			});

			test('GIVEN duplicated values THEN returns iterator with deduplicated values', () => {
				const given = [...bitfield.toValues(['Read', 'Delete', 'Read'])];
				const expected = [1, 8] as const;

				expect<number[]>(given).toEqual(expected);
			});

			test('GIVEN out-of-range values THEN returns iterator with correct values', () => {
				const given = [...bitfield.toValues(['Read', 'Delete', 16])];
				const expected = [1, 8] as const;

				expect<number[]>(given).toEqual(expected);
			});
		});

		describe('toEntries', () => {
			test('GIVEN ∅ THEN returns empty iterator', () => {
				const given = [...bitfield.toEntries(bitfield.zero)];
				const expected = [] as const;

				expect<[string, number][]>(given).toEqual(expected);
			});

			test('GIVEN multiple values THEN returns iterator with given values', () => {
				const given = [...bitfield.toEntries(['Read', 'Delete'])];
				const expected = [
					['Read', 1],
					['Delete', 8]
				] as const;

				expect<[string, number][]>(given).toEqual(expected);
			});

			test('GIVEN duplicated values THEN returns iterator with deduplicated values', () => {
				const given = [...bitfield.toEntries(['Read', 'Delete', 'Read'])];
				const expected = [
					['Read', 1],
					['Delete', 8]
				] as const;

				expect<[string, number][]>(given).toEqual(expected);
			});

			test('GIVEN out-of-range values THEN returns iterator with correct values', () => {
				const given = [...bitfield.toEntries(['Read', 'Delete', 16])];
				const expected = [
					['Read', 1],
					['Delete', 8]
				] as const;

				expect<[string, number][]>(given).toEqual(expected);
			});
		});

		describe('toObject', () => {
			type Expected = { [K in keyof typeof NumberFlags]: boolean };

			test('GIVEN ∅ THEN returns object with false values', () => {
				const given = bitfield.toObject(bitfield.zero);
				const expected: Expected = { Read: false, Write: false, Edit: false, Delete: false };

				expect<Expected>(given).toEqual(expected);
			});

			test('GIVEN multiple values THEN returns array with given values', () => {
				const given = bitfield.toObject(['Read', 'Delete']);
				const expected: Expected = { Read: true, Write: false, Edit: false, Delete: true };

				expect<Expected>(given).toEqual(expected);
			});

			test('GIVEN out-of-range values THEN returns array with correct values', () => {
				const given = bitfield.toObject(['Read', 'Delete', 16]);
				const expected: Expected = { Read: true, Write: false, Edit: false, Delete: true };

				expect<Expected>(given).toEqual(expected);
			});
		});
	});
});

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
			expect(() => new BitField(value as any)).toThrowError('flags must be a non-null object');
		});

		test('GIVEN a null object THEN throws TypeError', () => {
			expect(() => new BitField(null as any)).toThrowError('flags must be a non-null object');
		});

		test('GIVEN an empty object THEN throws TypeError', () => {
			expect(() => new BitField({})).toThrowError('flags must be a non-empty object');
		});

		test.each([true, {}, undefined, null, 'foo'])('GIVEN a null object THEN throws TypeError', (value) => {
			expect(() => new BitField({ Read: value } as any)).toThrowError('type must be either "number" or "bigint"');
		});

		describe('number', () => {
			test.each([true, {}, 42n, undefined, null, 'foo'])('GIVEN a null object THEN throws TypeError', (value) => {
				expect(() => new BitField({ Read: 1, Write: value } as any)).toThrowError('The property "Write" does not resolve to a number');
			});

			test.each([1.2, 4294967296])('GIVEN an empty object THEN throws TypeError', (value) => {
				expect(() => new BitField({ Read: value })).toThrowError('The property "Read" does not resolve to a safe bitfield value');
			});

			test.each([0, -8])('GIVEN an empty object THEN throws TypeError', (value) => {
				expect(() => new BitField({ Read: value })).toThrowError('The property "Read" resolves to a non-positive value');
			});
		});

		describe('number', () => {
			test.each([true, {}, 42, undefined, null, 'foo'])('GIVEN a null object THEN throws TypeError', (value) => {
				expect(() => new BitField({ Read: 1n, Write: value } as any)).toThrowError('The property "Write" does not resolve to a bigint');
			});

			test.each([0n, -8n])('GIVEN an empty object THEN throws TypeError', (value) => {
				expect(() => new BitField({ Read: value })).toThrowError('The property "Read" resolves to a non-positive value');
			});
		});
	});

	describe('prototype', () => {
		describe('resolve', () => {
			// TODO: Write tests
		});

		describe('any', () => {
			// TODO: Write tests
		});

		describe('has', () => {
			// TODO: Write tests
		});

		describe('complement', () => {
			// TODO: Write tests
		});

		describe('union', () => {
			// TODO: Write tests
		});

		describe('intersection', () => {
			// TODO: Write tests
		});

		describe('difference', () => {
			// TODO: Write tests
		});

		describe('symmetricDifference', () => {
			// TODO: Write tests
		});

		describe('toArray', () => {
			// TODO: Write tests
		});

		describe('toObject', () => {
			// TODO: Write tests
		});
	});
});

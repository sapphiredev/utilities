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

		// TODO: Invalid constructor types
	});

	// TODO: Test methods
});

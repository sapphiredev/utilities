import { mergeDefault } from '../src';

describe('mergeDefault', () => {
	test('GIVEN empty overwrites THEN returns base', () => {
		const base = { a: 0, b: 1 };
		const overwrites = {};
		expect(mergeDefault(base, overwrites)).toStrictEqual(base);
	});

	test('GIVEN empty overwrites THEN returns mutates overwrites', () => {
		const base = { a: 0, b: 1 };
		const overwrites = {};

		mergeDefault(base, overwrites);

		expect(base).toStrictEqual({ a: 0, b: 1 });
		expect(overwrites).toStrictEqual({ a: 0, b: 1 });
	});

	test('GIVEN undefined overwrites THEN returns clones base', () => {
		const base = { a: 0, b: 1 };
		expect(mergeDefault(base)).toStrictEqual({ a: 0, b: 1 });
	});

	test('GIVEN partial overwrites THEN returns merged object', () => {
		const base = { a: 0, b: 1 };
		const overwrites = { a: 2 };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: 2, b: 1 });
	});

	test('GIVEN extended overwrites THEN returns merged object', () => {
		const base = { a: 0, b: 1 };
		const overwrites = { a: 2, i: 3 };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: 2, i: 3, b: 1 });
	});

	test('GIVEN partial-null overwrites THEN returns null plus base keys', () => {
		interface Sample {
			a: null | number;
			b: number;
		}

		const base: Sample = { a: 0, b: 1 };
		const overwrites: Partial<Sample> = { a: null };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: null, b: 1 });
	});

	test('GIVEN partial-undefined overwrites THEN returns base value plus base keys', () => {
		const base = { a: 0, b: 1 };
		const overwrites = { a: undefined };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: 0, b: 1 });
	});

	test('GIVEN deep object THEN returns all keys', () => {
		const base = { a: { b: 1 } };
		const overwrites = { a: { b: 2 } };
		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: { b: 2 } });
	});

	test('GIVEN partial-null base and provided overwrites THEN returns overwrites values', () => {
		interface Sample {
			a: null | { b: number };
		}

		const base: Sample = { a: null };
		const overwrites: Sample = { a: { b: 5 } };

		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: { b: 5 } });
	});

	test('GIVEN defined base and provided overwrites THEN returns overwrites values', () => {
		interface Sample {
			a: number | { b: boolean };
		}

		const base: Sample = { a: 1 };
		const overwrites: Sample = { a: { b: true } };

		expect(mergeDefault(base, overwrites)).toStrictEqual({ a: { b: true } });
	});
});

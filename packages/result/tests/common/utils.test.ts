import { toString } from '../../src/lib/common/utils';

describe('utils', () => {
	describe('isFunction', () => {
		// TODO: Write tests
	});

	describe('isPromise', () => {
		// TODO: Write tests
	});

	describe('toString', () => {
		test('GIVEN a string THEN returns it', () => {
			const given = 'hi' as const;
			const expected = 'hi' as const;

			expect<typeof expected>(toString(given)).toBe(expected);
		});

		test('GIVEN a number THEN returns its stringified version', () => {
			const given = 42 as const;
			const expected = '42' as const;

			expect<typeof expected>(toString(given)).toBe(expected);
		});

		test('GIVEN a bigint THEN returns its stringified version', () => {
			const given = 42n as const;
			const expected = '42' as const;

			expect<typeof expected>(toString(given)).toBe(expected);
		});

		test('GIVEN a boolean THEN returns its stringified version', () => {
			const given = true as const;
			const expected = 'true' as const;

			expect<typeof expected>(toString(given)).toBe(expected);
		});

		test('GIVEN an undefined THEN returns its stringified version', () => {
			const given = undefined;
			const expected = 'undefined' as const;

			expect<typeof expected>(toString(given)).toBe(expected);
		});

		test('GIVEN a symbol THEN returns its stringified version', () => {
			const given = Symbol.iterator;
			const expected = given.toString();

			expect<string>(toString(given)).toBe(expected);
		});

		test('GIVEN a function THEN returns its stringified version', () => {
			const given = () => {
				// nop
			};
			const expected = given.toString();

			expect<string>(toString(given)).toBe(expected);
		});

		test('GIVEN a null THEN returns its stringified version', () => {
			const given = null;
			const expected = 'null' as const;

			expect<typeof expected>(toString(given)).toBe(expected);
		});

		test('GIVEN an object with toString override THEN calls it', () => {
			const expected = '42' as const;
			const fn = vi.fn(() => expected);

			const given = { toString: fn };

			expect<typeof expected>(toString(given)).toBe(expected);
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith();
			expect(fn).toHaveReturnedWith(expected);
		});
	});

	describe('valueOf', () => {
		// TODO: Write tests
	});

	describe('toJSON', () => {
		// TODO: Write tests
	});

	describe('toPrimitive', () => {
		// TODO: Write tests
	});
});

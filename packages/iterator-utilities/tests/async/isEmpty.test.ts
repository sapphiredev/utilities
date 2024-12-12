import { isEmpty } from '../../src';

describe('isEmpty', () => {
	test('GIVEN empty iterable THEN returns true', () => {
		const iterable: number[] = [];
		const result = isEmpty(iterable);
		expect(result).toBe(true);
	});

	test('GIVEN non-empty iterable THEN returns false', () => {
		const iterable = [1, 2, 3];
		const result = isEmpty(iterable);
		expect(result).toBe(false);
	});

	test('GIVEN iterable with one element THEN returns false', () => {
		const iterable = [1];
		const result = isEmpty(iterable);
		expect(result).toBe(false);
	});

	test('GIVEN iterator with one value and partial result THEN returns false', () => {
		const obj = {
			next() {
				return { value: 1 };
			}
		};
		const result = isEmpty(obj);
		expect(result).toBe(false);
	});
});

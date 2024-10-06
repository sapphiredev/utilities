import { equalBy } from '../src';

describe('equalBy', () => {
	test('GIVEN two equal iterables AND x === y THEN returns true', () => {
		const x = [1, 2, 3, 4];
		const y = [1, 2, 3, 4];
		const result = equalBy(x, y, (x, y) => x === y);
		expect<boolean>(result).toBe(true);
	});

	test('GIVEN two distinct iterables AND x === y THEN returns false', () => {
		const x = [1, 2, 3, 4];
		const y = [1, 4, 9, 16];
		const result = equalBy(x, y, (x, y) => x === y);
		expect<boolean>(result).toBe(false);
	});

	test('GIVEN [1, 2, 3, 4], its square AND x * x === y THEN returns true', () => {
		const x = [1, 2, 3, 4];
		const y = [1, 4, 9, 16];
		const result = equalBy(x, y, (x, y) => x * x === y);
		expect<boolean>(result).toBe(true);
	});
});

import { pickRandom } from '../src';

describe('pickRandom', () => {
	test('GIVEN array THEN picks one random element', () => {
		const array = ['a', 'b', 'c'];
		expect(array).toContain(pickRandom(array));
	});

	test('GIVEN count of one THEN picks one random element', () => {
		const array = ['a', 'b', 'c'];
		expect(array).toContain(pickRandom(array, 1));
	});

	test('GIVEN count of two THEN picks two random elements', () => {
		const array = ['a', 'b', 'c'];
		const picked = pickRandom(array, 2);

		expect(picked).toHaveLength(2);
		expect(array).toEqual(expect.arrayContaining(picked));
	});

	test('GIVEN empty array THEN returns an empty array', () => {
		const array: never[] = [];
		const picked = pickRandom(array, 2);

		expect(picked).toHaveLength(0);
		expect(array).toEqual(expect.arrayContaining(picked));
	});
});

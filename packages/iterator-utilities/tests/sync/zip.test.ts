import { zip } from '../../src';

describe('zip', () => {
	test('GIVEN multiple iterables with same length THEN returns zipped iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = ['a', 'b', 'c'];
		const iterable3 = [true, false, true];
		const result = [...zip(iterable1, iterable2, iterable3)];
		expect<[number, string, boolean][]>(result).toEqual([
			[1, 'a', true],
			[2, 'b', false],
			[3, 'c', true]
		]);
	});

	test('GIVEN multiple iterables with different lengths THEN returns zipped iterable up to shortest length', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = ['a', 'b'];
		const iterable3 = [true, false, true, false];
		const result = [...zip(iterable1, iterable2, iterable3)];
		expect<[number, string, boolean][]>(result).toEqual([
			[1, 'a', true],
			[2, 'b', false]
		]);
	});

	test('GIVEN empty iterables THEN returns empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: string[] = [];
		const iterable3: boolean[] = [];
		const result = [...zip(iterable1, iterable2, iterable3)];
		expect<[number, string, boolean][]>(result).toEqual([]);
	});
});

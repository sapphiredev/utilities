import { partition } from '../src';

describe('partition', () => {
	test('GIVEN input not an array THEN throws TypeError', () => {
		// @ts-expect-error fail case
		const thrownCall = () => partition({});
		expect(thrownCall).toThrow(TypeError);
		expect(thrownCall).toThrow('entries must be an array');
	});

	test('GIVEN predicate is not a function THEN throws TypeError', () => {
		// @ts-expect-error fail case
		const thrownCall = () => partition(['one', 'two', 'three'], 'not-a-function');
		expect(thrownCall).toThrow(TypeError);
		expect(thrownCall).toThrow('predicate must be an function that returns a boolean value.');
	});

	test('GIVEN valid input THEN partitions array', () => {
		expect(partition([1, 2, 3, 4, 5, 6], (value) => value > 3)).toStrictEqual([
			[4, 5, 6],
			[1, 2, 3]
		]);
	});
});

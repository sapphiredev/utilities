import { toIterableIterator } from '../../src';

describe('toIterableIterator', () => {
	test('GIVEN an array THEN returns an iterable iterator', () => {
		const iterable = [1, 2, 3];
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([1, 2, 3]);
	});

	test('GIVEN a string THEN returns an iterable iterator', () => {
		const iterable = 'hello';
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual(['h', 'e', 'l', 'l', 'o']);
	});

	test('GIVEN a Set THEN returns an iterable iterator', () => {
		const iterable = new Set([1, 2, 3]);
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([1, 2, 3]);
	});

	test('GIVEN a Map THEN returns an iterable iterator', () => {
		const iterable = new Map([
			['key1', 'value1'],
			['key2', 'value2']
		]);
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([
			['key1', 'value1'],
			['key2', 'value2']
		]);
	});

	test('GIVEN an empty iterable THEN returns an empty iterable iterator', () => {
		const iterable: number[] = [];
		const iterator = toIterableIterator(iterable);
		expect([...iterator]).toEqual([]);
	});

	test('GIVEN an iterator THEN returns an iterable iterator', () => {
		const obj = {
			counter: 0,
			next() {
				return this.counter >= 3 ? { value: undefined, done: true } : { value: this.counter++, done: false };
			}
		};
		const iterator = toIterableIterator(obj);
		expect([...iterator]).toEqual([0, 1, 2]);
	});
});

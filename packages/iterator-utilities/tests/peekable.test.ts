import { peekable } from '../src';

describe('peekable', () => {
	test('GIVEN iterable with elements THEN returns peekable iterator', () => {
		const iterable = [1, 2, 3];
		const peekableIterator = peekable(iterable);

		expect(peekableIterator.next()).toEqual({ value: 1, done: false });
		expect(peekableIterator.peek()).toEqual({ value: 2, done: false });
		expect(peekableIterator.peek()).toEqual({ value: 2, done: false });
		expect(peekableIterator.next()).toEqual({ value: 2, done: false });
		expect(peekableIterator.next()).toEqual({ value: 3, done: false });
		expect(peekableIterator.peek()).toEqual({ value: undefined, done: true });
		expect(peekableIterator.next()).toEqual({ value: undefined, done: true });
	});

	test('GIVEN empty iterable THEN returns peekable iterator with done as true', () => {
		const iterable: number[] = [];
		const peekableIterator = peekable(iterable);

		expect(peekableIterator.peek()).toEqual({ value: undefined, done: true });
		expect(peekableIterator.next()).toEqual({ value: undefined, done: true });
	});

	test('GIVEN peekable iterator THEN returns iterable', () => {
		const iterable = [1, 2, 3];
		const peekableIterator = peekable(iterable);

		expect([...peekableIterator]).toEqual([1, 2, 3]);
	});
});

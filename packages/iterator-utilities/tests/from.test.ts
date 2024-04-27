import { from } from '../src';

describe('from', () => {
	test('GIVEN an array THEN returns an iterable with the same elements', () => {
		const array = [1, 2, 3];
		const result = from(array);
		expect(result.next()).toStrictEqual({ value: 1, done: false });
		expect(result.next()).toStrictEqual({ value: 2, done: false });
		expect(result.next()).toStrictEqual({ value: 3, done: false });
		expect(result.next()).toStrictEqual({ value: undefined, done: true });
	});

	test('GIVEN a string THEN returns an iterable with each character as an element', () => {
		const str = 'hello';
		const result = from(str);
		expect(result.next()).toStrictEqual({ value: 'h', done: false });
		expect(result.next()).toStrictEqual({ value: 'e', done: false });
		expect(result.next()).toStrictEqual({ value: 'l', done: false });
		expect(result.next()).toStrictEqual({ value: 'l', done: false });
		expect(result.next()).toStrictEqual({ value: 'o', done: false });
		expect(result.next()).toStrictEqual({ value: undefined, done: true });
	});

	test('GIVEN a Set THEN returns an iterable with the same elements', () => {
		const set = new Set([1, 2, 3]);
		const result = from(set);
		expect(result.next()).toStrictEqual({ value: 1, done: false });
		expect(result.next()).toStrictEqual({ value: 2, done: false });
		expect(result.next()).toStrictEqual({ value: 3, done: false });
		expect(result.next()).toStrictEqual({ value: undefined, done: true });
	});

	test('GIVEN a Map THEN returns an iterable with the same elements', () => {
		const map = new Map([
			['a', 1],
			['b', 2],
			['c', 3]
		]);
		const result = from(map);
		expect(result.next()).toStrictEqual({ value: ['a', 1], done: false });
		expect(result.next()).toStrictEqual({ value: ['b', 2], done: false });
		expect(result.next()).toStrictEqual({ value: ['c', 3], done: false });
		expect(result.next()).toStrictEqual({ value: undefined, done: true });
	});

	test('GIVEN an empty iterable THEN returns an empty iterable', () => {
		const result = from([]);
		expect(result.next()).toStrictEqual({ value: undefined, done: true });
	});

	test('GIVEN an object with iterable values THEN returns an iterable with the same elements', () => {
		const obj = {
			*[Symbol.iterator]() {
				yield 1;
				yield 2;
				yield 3;
			}
		};
		const result = from(obj);
		expect(result.next()).toStrictEqual({ value: 1, done: false });
		expect(result.next()).toStrictEqual({ value: 2, done: false });
		expect(result.next()).toStrictEqual({ value: 3, done: false });
		expect(result.next()).toStrictEqual({ value: undefined, done: true });
	});

	test('GIVEN an iterator object THEN returns an iterable with the same elements', () => {
		const obj = {
			counter: 0,
			next() {
				return this.counter >= 3 ? { value: undefined, done: true } : { value: this.counter++, done: false };
			}
		};
		const result = from(obj);
		expect(result).toBe(obj);
		expect(result.next()).toStrictEqual({ value: 0, done: false });
		expect(result.next()).toStrictEqual({ value: 1, done: false });
		expect(result.next()).toStrictEqual({ value: 2, done: false });
		expect(result.next()).toStrictEqual({ value: undefined, done: true });
	});

	test('GIVEN an object with non-iterable values THEN throws TypeError', () => {
		const obj = { a: 1, b: 2, c: 3 };
		// @ts-expect-error Testing invalid input
		expect(() => from(obj)).toThrow(new TypeError('[object Object] cannot be converted to an iterable'));
	});

	test('GIVEN a null object THEN throws TypeError', () => {
		const obj = null;
		// @ts-expect-error Testing invalid input
		expect(() => from(obj)).toThrow(new TypeError('null cannot be converted to an iterable'));
	});

	test('GIVEN an invalid input THEN throws TypeError', () => {
		// @ts-expect-error Testing invalid input
		expect(() => from(1)).toThrow(new TypeError('1 cannot be converted to an iterable'));
	});
});

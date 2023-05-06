import { deepClone } from '../src';

describe('deepClone', () => {
	test('GIVEN null THEN returns same', () => {
		const source = null;
		expect(deepClone(source)).toEqual(source);
	});

	test('GIVEN string then returns same', () => {
		const source = 'Hello';
		expect(deepClone(source)).toEqual(source);
	});

	test('GIVEN number THEN returns same', () => {
		const source = 420;
		expect(deepClone(source)).toEqual(source);
	});

	test('GIVEN BigInt THEN returns same', () => {
		const source = BigInt(420);
		expect(deepClone(source)).toEqual(source);
	});

	test('GIVEN boolean THEN returns same', () => {
		const source = true;
		expect(deepClone(source)).toEqual(source);
	});

	test('GIVEN Symbol THEN returns same', () => {
		const source = Symbol('sapphire');
		expect(deepClone(source)).toBe(source);
	});

	test('GIVEN function THEN returns same', () => {
		const source = function () {
			/* noop */
		};
		expect(deepClone(source)).toBe(source);
	});

	test.each([
		['Buffer', Buffer],
		['Uint8Array', Uint8Array],
		['Uint8ClampedArray', Uint8ClampedArray],
		['Uint16Array', Uint16Array],
		['Uint32Array', Uint32Array],
		['Int8Array', Int8Array],
		['Int16Array', Int16Array],
		['Int32Array', Int32Array],
		['Float32Array', Float32Array],
		['Float64Array', Float64Array]
	])('Given %s THEN returns same', (_, TypedArray) => {
		const source = TypedArray.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
		const result = deepClone(source);

		expect(result).toEqual(source);
		expect(result).toBeInstanceOf(TypedArray);
	});

	test.each([
		['BigUint64Array', BigUint64Array],
		['BigInt64Array', BigInt64Array]
	])('Given %s THEN returns same', (_, TypedArray) => {
		const source = TypedArray.from([0x62n, 0x75n, 0x66n, 0x66n, 0x65n, 0x72n]);
		const result = deepClone(source);

		expect(result).toEqual(source);
		expect(result).toBeInstanceOf(TypedArray);
	});

	test('GIVEN Array THEN returns same', () => {
		expect.assertions(2);
		const source = [1, 2, 3];
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});

	test('GIVEN nested array THEN returns new clone', () => {
		expect.assertions(4);
		const source: [number, number, number, (number | number[])[]] = [1, 2, 3, [4, 5, [6, 7, 8]]];
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(source[3]).not.toBe(clone[3]);
		expect(source[3][2]).not.toBe(clone[3][2]);
		expect(clone).toEqual(source);
	});

	test('GIVEN object THEN returns new clone', () => {
		expect.assertions(2);
		const source = { a: 1, b: 2 };
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});

	test('GIVEN nested object THEN returns new object', () => {
		expect.assertions(4);
		const source = { ab: 1, cd: 2, ef: { gh: 3, ij: 4, kl: [1] } };
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(source.ef).not.toBe(clone.ef);
		expect(source.ef.kl).not.toBe(clone.ef.kl);
		expect(clone).toEqual(source);
	});

	test('GIVEN map THEN returns new map', () => {
		expect.assertions(5);
		const source = new Map().set('Hello', 420).set('World', 'Yay!');
		const cloned = deepClone(source);

		expect(cloned instanceof Map).toBe(true);
		expect(source).not.toBe(cloned);
		expect(cloned.size).toBe(2);
		expect(cloned.get('Hello')).toBe(420);
		expect(cloned.get('World')).toBe('Yay!');
	});

	test('GIVEN set THEN returns new set', () => {
		expect.assertions(5);
		const source = new Set().add('Hello').add('World');
		const cloned = deepClone(source);

		expect(cloned instanceof Set).toBe(true);
		expect(source).not.toBe(cloned);
		expect(cloned.size).toBe(2);
		expect(cloned.has('Hello')).toBe(true);
		expect(cloned.has('World')).toBe(true);
	});

	test('GIVEN date THEN returns same date', () => {
		expect.assertions(2);
		const source = new Date('1995-02-21T12:45:00.000Z');
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});

	test('GIVEN date in object THEN returns same date', () => {
		expect.assertions(2);
		const source = { dateTime: new Date('1995-02-21T12:45:00.000Z') };
		const clone = deepClone(source);

		expect(source).not.toBe(clone);
		expect(clone).toEqual(source);
	});
});

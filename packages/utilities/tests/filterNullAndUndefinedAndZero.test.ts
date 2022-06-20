import { filterNullAndUndefinedAndZero } from '../src';

describe('filterNullAndUndefinedAndZero', () => {
	test('GIVEN empty array THEN returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	test('GIVEN array of strings THEN returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	test('GIVEN array of numbers THEN returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual([1, 2]);
	});

	test('GIVEN array of booleans THEN returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	test('GIVEN array of objects THEN returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual(inputArray);
	});

	test('GIVEN array with undefined THEN returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual([true, false]);
	});

	test('GIVEN array with null THEN returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toStrictEqual([1, 2]);
	});

	test('GIVEN string THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero('')).toBe(true);
	});

	test('GIVEN number as 0 THEN returns false', () => {
		expect(filterNullAndUndefinedAndZero(0)).toBe(false);
	});

	test('GIVEN number THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero(5)).toBe(true);
	});

	test('GIVEN boolean THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero(true)).toBe(true);
	});

	test('GIVEN undefined THEN returns false', () => {
		expect(filterNullAndUndefinedAndZero(undefined)).toBe(false);
	});

	test('GIVEN null THEN returns false', () => {
		expect(filterNullAndUndefinedAndZero(null)).toBe(false);
	});

	test('GIVEN object THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero({})).toBe(true);
	});

	test('GIVEN array THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero([])).toBe(true);
	});

	test('GIVEN function THEN returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefinedAndZero(value)).toBe(true);
	});

	test('GIVEN array function THEN returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefinedAndZero(value)).toBe(true);
	});

	test('GIVEN class THEN returns true', () => {
		const value = class A {};
		expect(filterNullAndUndefinedAndZero(value)).toBe(true);
	});
});

import { filterNullAndUndefinedAndEmpty } from '../src';

describe('filterNullAndUndefinedAndEmpty', () => {
	test('GIVEN empty array THEN returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	test('GIVEN array of strings THEN returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(['one', 'two']);
	});

	test('GIVEN array of numbers THEN returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	test('GIVEN array of booleans THEN returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	test('GIVEN array of objects THEN returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual(inputArray);
	});

	test('GIVEN array with undefined THEN returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual([true, false]);
	});

	test('GIVEN array with null THEN returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toStrictEqual([1, 2]);
	});

	test('GIVEN empty string THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty('')).toBe(false);
	});

	test('GIVEN string THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty('test')).toBe(true);
	});

	test('GIVEN number as 0 THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(0)).toBe(true);
	});

	test('GIVEN number THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(5)).toBe(true);
	});

	test('GIVEN boolean THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(true)).toBe(true);
	});

	test('GIVEN undefined THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty(undefined)).toBe(false);
	});

	test('GIVEN null THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty(null)).toBe(false);
	});

	test('GIVEN object THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty({})).toBe(true);
	});

	test('GIVEN array THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty([])).toBe(false);
	});

	test('GIVEN non-empty array THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(['non-empty array'])).toBe(true);
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefinedAndEmpty(value)).toBe(false);
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefinedAndEmpty(value)).toBe(false);
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(filterNullAndUndefinedAndEmpty(value)).toBe(false);
	});
});

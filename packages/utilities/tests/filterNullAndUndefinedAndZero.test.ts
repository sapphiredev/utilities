import { filterNullAndUndefinedAndZero } from '../src';

describe('filterNullAndUndefinedAndZero', () => {
	test('GIVEN empty array THEN returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of strings THEN returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of numbers THEN returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toIncludeSameMembers([1, 2]);
	});

	test('GIVEN array of booleans THEN returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of objects THEN returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array with undefined THEN returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toIncludeSameMembers([true, false]);
	});

	test('GIVEN array with null THEN returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndZero)).toIncludeSameMembers([1, 2]);
	});

	test('GIVEN string THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero('')).toBeTrue();
	});

	test('GIVEN number as 0 THEN returns false', () => {
		expect(filterNullAndUndefinedAndZero(0)).toBeFalse();
	});

	test('GIVEN number THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero(5)).toBeTrue();
	});

	test('GIVEN boolean THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero(true)).toBeTrue();
	});

	test('GIVEN undefined THEN returns false', () => {
		expect(filterNullAndUndefinedAndZero(undefined)).toBeFalse();
	});

	test('GIVEN null THEN returns false', () => {
		expect(filterNullAndUndefinedAndZero(null)).toBeFalse();
	});

	test('GIVEN object THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero({})).toBeTrue();
	});

	test('GIVEN array THEN returns true', () => {
		expect(filterNullAndUndefinedAndZero([])).toBeTrue();
	});

	test('GIVEN function THEN returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefinedAndZero(value)).toBeTrue();
	});

	test('GIVEN array function THEN returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefinedAndZero(value)).toBeTrue();
	});

	test('GIVEN class THEN returns true', () => {
		const value = class A {};
		expect(filterNullAndUndefinedAndZero(value)).toBeTrue();
	});
});

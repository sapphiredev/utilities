import { filterNullAndUndefinedAndEmpty } from '../src';

describe('filterNullAndUndefinedAndEmpty', () => {
	test('GIVEN empty array THEN returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of strings THEN returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toIncludeSameMembers(['one', 'two']);
	});

	test('GIVEN array of numbers THEN returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of booleans THEN returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of objects THEN returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array with undefined THEN returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toIncludeSameMembers([true, false]);
	});

	test('GIVEN array with null THEN returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefinedAndEmpty)).toIncludeSameMembers([1, 2]);
	});

	test('GIVEN empty string THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty('')).toBeFalse();
	});

	test('GIVEN string THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty('test')).toBeTrue();
	});

	test('GIVEN number as 0 THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(0)).toBeTrue();
	});

	test('GIVEN number THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(5)).toBeTrue();
	});

	test('GIVEN boolean THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(true)).toBeTrue();
	});

	test('GIVEN undefined THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty(undefined)).toBeFalse();
	});

	test('GIVEN null THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty(null)).toBeFalse();
	});

	test('GIVEN object THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty({})).toBeTrue();
	});

	test('GIVEN array THEN returns false', () => {
		expect(filterNullAndUndefinedAndEmpty([])).toBeFalse();
	});

	test('GIVEN non-empty array THEN returns true', () => {
		expect(filterNullAndUndefinedAndEmpty(['non-empty array'])).toBeTrue();
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefinedAndEmpty(value)).toBeFalse();
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefinedAndEmpty(value)).toBeFalse();
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(filterNullAndUndefinedAndEmpty(value)).toBeFalse();
	});
});

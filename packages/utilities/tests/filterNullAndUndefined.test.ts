import { filterNullAndUndefined } from '../src';

describe('filterNullAndUndefined', () => {
	test('GIVEN empty array THEN returns same array', () => {
		const inputArray: unknown[] = [];
		expect(inputArray.filter(filterNullAndUndefined)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of strings THEN returns same array', () => {
		const inputArray = ['', 'one', 'two'];
		expect(inputArray.filter(filterNullAndUndefined)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of numbers THEN returns same array', () => {
		const inputArray = [0, 1, 2];
		expect(inputArray.filter(filterNullAndUndefined)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of booleans THEN returns same array', () => {
		const inputArray = [false, true];
		expect(inputArray.filter(filterNullAndUndefined)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array of objects THEN returns same array', () => {
		const inputArray = [{ key: 'value' }, { key: 'value2' }];
		expect(inputArray.filter(filterNullAndUndefined)).toIncludeSameMembers(inputArray);
	});

	test('GIVEN array with undefined THEN returns array without undefined', () => {
		const inputArray = [undefined, true, false];
		expect(inputArray.filter(filterNullAndUndefined)).toIncludeSameMembers([true, false]);
	});

	test('GIVEN array with null THEN returns array without null', () => {
		const inputArray = [null, 1, 2];
		expect(inputArray.filter(filterNullAndUndefined)).toIncludeSameMembers([1, 2]);
	});

	test('GIVEN string THEN returns true', () => {
		expect(filterNullAndUndefined('string')).toBeTrue();
	});

	test('GIVEN number THEN returns true', () => {
		expect(filterNullAndUndefined(5)).toBeTrue();
	});

	test('GIVEN boolean THEN returns true', () => {
		expect(filterNullAndUndefined(true)).toBeTrue();
	});

	test('GIVEN undefined THEN returns false', () => {
		expect(filterNullAndUndefined(undefined)).toBeFalse();
	});

	test('GIVEN null THEN returns false', () => {
		expect(filterNullAndUndefined(null)).toBeFalse();
	});

	test('GIVEN empty object THEN returns true', () => {
		expect(filterNullAndUndefined({})).toBeTrue();
	});

	test('GIVEN empty array THEN returns true', () => {
		expect(filterNullAndUndefined([])).toBeTrue();
	});

	test('GIVEN empty function THEN returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(filterNullAndUndefined(value)).toBeTrue();
	});

	test('GIVEN empty array function THEN returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(filterNullAndUndefined(value)).toBeTrue();
	});

	test('GIVEN empty class THEN returns true', () => {
		const value = class A {};
		expect(filterNullAndUndefined(value)).toBeTrue();
	});
});

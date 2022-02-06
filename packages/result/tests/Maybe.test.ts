import { isMaybe, isNone, isSome, maybe, none, some } from '../src/index';

describe('Maybe', () => {
	test('GIVEN some THEN returns { isMaybe->truthy, isSome->truthy, isNone->falsy }', () => {
		const returnValue = some(42);

		expect(isMaybe(returnValue)).toBeTruthy();
		expect(isSome(returnValue)).toBeTruthy();
		expect(isNone(returnValue)).toBeFalsy();
	});

	test('GIVEN none THEN returns { isMaybe->truthy, isSome->falsy, isNone->truthy }', () => {
		const returnValue = none();

		expect(isMaybe(returnValue)).toBeTruthy();
		expect(isSome(returnValue)).toBeFalsy();
		expect(isNone(returnValue)).toBeTruthy();
	});

	test('GIVEN maybe THEN returns { isMaybe->truthy, isSome->truthy, isNone->falsy }', () => {
		const returnValue = maybe(42);

		expect(isMaybe(returnValue)).toBeTruthy();
		expect(isSome(returnValue)).toBeTruthy();
		expect(isNone(returnValue)).toBeFalsy();
	});

	test('GIVEN maybe WITH value as null THEN returns { isMaybe->truthy, isSome->truthy, isNone->falsy }', () => {
		const returnValue = maybe(null);

		expect(returnValue).toEqual({ exists: false });
		expect(isMaybe(returnValue)).toBeTruthy();
		expect(isSome(returnValue)).toBeFalsy();
		expect(isNone(returnValue)).toBeTruthy();
	});

	test('GIVEN maybe WITH value as isMaybe result THEN returns { isMaybe->truthy, isSome->truthy, isNone->falsy }', () => {
		const returnValue = maybe({ exists: false });

		expect(returnValue).toEqual({ exists: false });
		expect(isMaybe(returnValue)).toBeTruthy();
		expect(isSome(returnValue)).toBeFalsy();
		expect(isNone(returnValue)).toBeTruthy();
	});
});

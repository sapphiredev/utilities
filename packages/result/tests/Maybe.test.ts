import { isMaybe, isNone, isSome, maybe, none, some } from '../src/index';

describe('Maybe', () => {
	test('some', () => {
		const returnValue = some(42);

		expect(isSome(returnValue)).toBeTruthy();
		expect(isNone(returnValue)).toBeFalsy();
	});

	test('none', () => {
		const returnValue = none();

		expect(isSome(returnValue)).toBeFalsy();
		expect(isNone(returnValue)).toBeTruthy();
	});

	test('maybe', () => {
		const returnValue = maybe(42);

		expect(isMaybe(returnValue)).toBeTruthy();
	});

	test('maybe - null', () => {
		const returnValue = maybe(null);

		expect(returnValue).toEqual({ exists: false });
	});

	test('maybe - isMaybe', () => {
		const returnValue = maybe({ exists: false });

		expect(returnValue).toEqual({ exists: false });
	});
});

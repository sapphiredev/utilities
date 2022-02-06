import { err, isErr, isOk, ok } from '../src/index';

describe('Result', () => {
	test('GIVEN ok THEN returns { isOk->truthy, isErr->falsy }', () => {
		const returnValue = ok(42);

		expect(isOk(returnValue)).toBeTruthy();
		expect(isErr(returnValue)).toBeFalsy();
	});

	test('GIVEN err THEN returns { isOk->falsy, isErr->truthy }', () => {
		const returnValue = err(new Error());

		expect(isOk(returnValue)).toBeFalsy();
		expect(isErr(returnValue)).toBeTruthy();
	});
});

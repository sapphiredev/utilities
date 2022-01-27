import { err, isErr, isOk, ok } from '../src/index';

describe('Result', () => {
	test('ok', () => {
		const returnValue = ok(42);

		expect(isOk(returnValue)).toBeTruthy();
		expect(isErr(returnValue)).toBeFalsy();
	});

	test('err', () => {
		const returnValue = err(new Error());

		expect(isOk(returnValue)).toBeFalsy();
		expect(isErr(returnValue)).toBeTruthy();
	});
});

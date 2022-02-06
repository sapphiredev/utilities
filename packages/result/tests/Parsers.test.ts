import { from, fromAsync, isErr, isOk } from '../src/index';

describe('Parsers', () => {
	test('from - ok', () => {
		const returnValue = from(() => 42);

		expect(isOk(returnValue)).toBeTruthy();
		expect(isErr(returnValue)).toBeFalsy();
	});

	test('from - error', () => {
		const returnValue = from(() => {
			throw new Error();
		});

		expect(isOk(returnValue)).toBeFalsy();
		expect(isErr(returnValue)).toBeTruthy();
	});

	test('fromAsync - ok', async () => {
		const returnValue = await fromAsync(() => Promise.resolve(42));

		expect(isOk(returnValue)).toBeTruthy();
		expect(isErr(returnValue)).toBeFalsy();
	});

	test('fromAsync - error', async () => {
		const returnValue = await fromAsync(() => Promise.reject(new Error()));

		expect(isOk(returnValue)).toBeFalsy();
		expect(isErr(returnValue)).toBeTruthy();
	});
});

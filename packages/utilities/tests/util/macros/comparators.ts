type _Error = Error & { code?: string };

export function assertIdenticalError(expected: _Error, actual: _Error) {
	expect(actual).toBeDefined();
	expect(actual).toBeInstanceOf(expected.constructor);
	expect(actual.message).toBe(expected.message);
	if (expected.code) expect(actual.code).toBe(expected.code);
	if (expected.cause) {
		if (expected.cause instanceof Error) assertIdenticalError(expected.cause, actual.cause as _Error);
		else expect(actual.cause).toBe(expected.cause);
	}
}

export async function expectError<T = any>(cb: () => T, expected: Error & { code?: string }) {
	try {
		// eslint-disable-next-line promise/prefer-await-to-callbacks, n/callback-return
		await cb();
	} catch (error) {
		assertIdenticalError(expected, error as _Error);
		return;
	}

	throw new Error('Expected to throw, but failed to do so');
}

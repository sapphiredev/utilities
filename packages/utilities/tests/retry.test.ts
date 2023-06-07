import { retry } from '../src/lib/retry';

describe('retry', () => {
	test('GIVEN a simple string return THEN returns the same on first attempt', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		const result = await retry(mockFunction, 3);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	test('GIVEN a twice failing function THEN returns the third result', async () => {
		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				throw new Error('💣💥');
			}

			return 'success!';
		};
		const mockFunction = vi.fn().mockImplementation(cb);

		const result = await retry(mockFunction, 3);

		expect(result).toBe('success!');
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(3);
	});

	test('GIVEN a thrice failing function WHEN retries is lower THEN returns throws the last error', async () => {
		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				throw new Error('💣💥');
			}

			return 'success!';
		};
		const mockFunction = vi.fn().mockImplementation(cb);

		await expect(retry(mockFunction, 2)).rejects.toThrowError(Error('💣💥'));
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(2);
	});

	test('GIVEN retries below 1 THEN throws', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		await expect(retry(mockFunction, 0)).rejects.toThrowError(RangeError('Expected retries to be a number >= 1'));
		expect(mockFunction).toBeCalledTimes(0);
	});
});

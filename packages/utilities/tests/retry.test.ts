import { retry } from '../src';

describe('retry', () => {
	test('GIVEN a simple string return THEN returns the same on first attempt', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		const result = await retry(mockFunction, 3);

		expect(result).toBe('test');
		expect(mockFunction).toHaveBeenCalledTimes(1);
	});

	test('GIVEN a twice failing function THEN returns the third result', async () => {
		const mockFunction = vi
			.fn<() => string>() //
			.mockRejectedValueOnce('💣💥')
			.mockRejectedValueOnce('💣💥')
			.mockReturnValueOnce('success!');

		const result = await retry(mockFunction, 3);

		expect(result).toBe('success!');
		expect(mockFunction).toHaveBeenCalledTimes(3);
	});

	test('GIVEN a thrice failing function WHEN retries is lower THEN returns throws the last error', async () => {
		const mockFunction = vi
			.fn<() => string>() //
			.mockRejectedValueOnce('💣💥')
			.mockRejectedValueOnce('💣💥')
			.mockRejectedValueOnce('💣💥');

		await expect(retry(mockFunction, 2)).rejects.toThrow('💣💥');
		expect(mockFunction).toHaveBeenCalledTimes(2);
	});

	test('GIVEN 0 retries THEN returns result', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		const result = await retry(mockFunction, 0);

		expect(result).toBe('test');
		expect(mockFunction).toHaveBeenCalledTimes(1);
	});

	test('GIVEN retries below 1 THEN throws', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		await expect(retry(mockFunction, -1)).rejects.toThrow(new RangeError('Expected retries to be a number >= 0'));
		expect(mockFunction).toHaveBeenCalledTimes(0);
	});
});

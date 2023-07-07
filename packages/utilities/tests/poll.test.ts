import { poll } from '../src';

const oneMillisecond = 1;
const oneMinute = 60 * 1000;

describe('poll', () => {
	test('GIVEN a simple string return THEN returns the same on first attempt', async () => {
		const mockFunction = vi.fn<never, string>().mockImplementation(() => 'test');
		const result = await poll(mockFunction, (result) => result === 'test', oneMillisecond, oneMinute);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	test('GIVEN a function that fails twice then succeeds THEN calls that function thrice', async () => {
		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				return 'fail!';
			}

			return 'success!';
		};

		const mockFunction = vi.fn<never, string>().mockImplementation(cb);
		const result = await poll(mockFunction, (result) => result === 'success!', oneMillisecond, oneMinute);

		expect(result).toBe('success!');
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(3);
	});

	test('GIVEN a function that fails before timeout is reached THEN throws', async () => {
		let counter = 0;
		const cb = () => {
			if (counter < 5) {
				++counter;
				return 'fail!';
			}

			return 'success!';
		};

		const mockFunction = vi.fn<never, string>().mockImplementation(cb);

		await expect(poll(mockFunction, (result) => result === 'success!', oneMillisecond, oneMillisecond * 2)).rejects.toThrowError(
			new Error('Polling task timed out after 2 milliseconds')
		);

		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(2);
	});

	test('GIVEN 0 milliseconds to timeout THEN returns result', async () => {
		const mockFunction = vi.fn<never, string>().mockImplementation(() => 'test');
		const result = await poll(mockFunction, (result) => result === 'test', oneMillisecond, 0);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	test('GIVEN retries below 1 THEN throws', async () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		await expect(poll(mockFunction, (result) => result === 'success!', oneMillisecond, -1)).rejects.toThrowError(
			new Error('Expected timeoutMilliseconds to be a number >= 0')
		);
		expect(mockFunction).toBeCalledTimes(0);
	});

	test('GIVEN verbose logging THEN sees logs in console', async () => {
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				return 'fail!';
			}

			return 'success!';
		};

		const mockFunction = vi.fn<never, string>().mockImplementation(cb);
		const result = await poll(mockFunction, (result) => result === 'success!', oneMillisecond, oneMinute, true);

		expect(result).toBe('success!');
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(3);
		expect(consoleSpy).toBeCalledTimes(2);
	});
});

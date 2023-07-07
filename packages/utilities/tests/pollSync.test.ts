import { pollSync } from '../src/lib/pollSync';

const oneMillisecond = 1;
const oneMinute = 60 * 1000;

describe('pollSync', () => {
	test('GIVEN a simple string return THEN returns the same on first attempt', () => {
		const mockFunction = vi.fn<never, string>().mockImplementation(() => 'test');
		const result = pollSync(mockFunction, (result) => result === 'test', oneMillisecond, oneMinute);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	test('GIVEN a function that fails twice then succeeds THEN calls that function thrice', () => {
		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				return 'fail!';
			}

			return 'success!';
		};

		const mockFunction = vi.fn<never, string>().mockImplementation(cb);
		const result = pollSync(mockFunction, (result) => result === 'success!', oneMillisecond, oneMinute);

		expect(result).toBe('success!');
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(3);
	});

	test('GIVEN a function that fails before timeout is reached THEN throws', () => {
		let counter = 0;
		const cb = () => {
			if (counter < 5) {
				++counter;
				return 'fail!';
			}

			return 'success!';
		};

		const mockFunction = vi.fn<never, string>().mockImplementation(cb);

		expect(() => pollSync(mockFunction, (result) => result === 'success!', oneMillisecond, oneMillisecond * 2)).toThrowError(
			new Error('Polling task timed out after 2 milliseconds')
		);

		expect(counter).toBeGreaterThanOrEqual(3);
		expect(mockFunction).toBeCalled();
	});

	test('GIVEN 0 milliseconds to timeout THEN returns result', () => {
		const mockFunction = vi.fn<never, string>().mockImplementation(() => 'test');
		const result = pollSync(mockFunction, (result) => result === 'test', oneMillisecond, 0);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	test('GIVEN retries below 1 THEN throws', () => {
		const mockFunction = vi.fn().mockReturnValue('test');
		expect(() => pollSync(mockFunction, (result) => result === 'success!', oneMillisecond, -1)).toThrowError(
			new Error('Expected timeoutMilliseconds to be a number >= 0')
		);
		expect(mockFunction).toBeCalledTimes(0);
	});

	test('GIVEN verbose logging THEN sees logs in console', () => {
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
		const result = pollSync(mockFunction, (result) => result === 'success!', oneMillisecond, oneMinute, true);

		expect(result).toBe('success!');
		expect(counter).toBe(2);
		expect(mockFunction).toBeCalledTimes(3);
		expect(consoleSpy).toBeCalledTimes(2);
	});
});

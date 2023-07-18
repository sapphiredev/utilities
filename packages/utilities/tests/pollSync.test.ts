import { pollSync } from '../src';

const oneMillisecond = 1;
const oneMinute = 60 * 1000;

describe('pollSync', () => {
	test('GIVEN a simple string return THEN returns the same on first attempt', () => {
		const mockFunction = vi.fn(() => 'test');
		const result = pollSync(mockFunction, (result) => result === 'test', oneMillisecond, oneMinute);

		expect(result).toBe('test');
		expect(mockFunction).toBeCalledTimes(1);
	});

	test('GIVEN a function that fails twice then succeeds THEN calls that function thrice', () => {
		const mockFunction = vi
			.fn<[], string>() //
			.mockReturnValueOnce('fail!')
			.mockReturnValueOnce('fail!')
			.mockReturnValueOnce('success!');

		const result = pollSync(mockFunction, (result) => result === 'success!', oneMillisecond, oneMinute);

		expect(result).toBe('success!');
		expect(mockFunction).toBeCalledTimes(3);
	});

	test('GIVEN a function that fails before timeout is reached THEN throws', () => {
		const mockFunction = vi
			.fn<[], string>() //
			.mockReturnValueOnce('fail!')
			.mockReturnValueOnce('fail!')
			.mockReturnValueOnce('fail!')
			.mockReturnValueOnce('success!');

		expect(() => pollSync(mockFunction, (result) => result === 'success!', oneMillisecond, oneMillisecond * 2)).toThrowError(
			new Error('Polling task timed out after 2 milliseconds')
		);

		expect(mockFunction).toBeCalled();
	});

	test('GIVEN 0 milliseconds to timeout THEN returns result', () => {
		const mockFunction = vi.fn(() => 'test');
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

		const mockFunction = vi
			.fn<[], string>() //
			.mockReturnValueOnce('fail!')
			.mockReturnValueOnce('fail!')
			.mockReturnValueOnce('success!');

		const result = pollSync(mockFunction, (result) => result === 'success!', oneMillisecond, oneMinute, { verbose: true });

		expect(result).toBe('success!');
		expect(mockFunction).toBeCalledTimes(3);
		expect(consoleSpy).toBeCalledTimes(2);
	});
});

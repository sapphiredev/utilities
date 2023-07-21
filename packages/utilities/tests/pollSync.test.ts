import { pollSync } from '../src';

const DOMException: typeof globalThis.DOMException =
	globalThis.DOMException ??
	// DOMException was only made a global in Node v17.0.0, but this library supports Node v16.0.0 and up
	AbortSignal.abort().reason.constructor;

describe('pollSync', () => {
	const pass = 'success!';
	const fail = 'fail!';
	const cbRaw = () => pass;
	const cbConditionRaw = (result: string) => result === pass;

	test('GIVEN a poll with no retries THEN returns first attempt', () => {
		const cb = vi.fn(() => pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = pollSync(cb, cbCondition, { maximumRetries: 0 });

		expect(result).toBe(pass);
		expect(cb).toBeCalledTimes(1);
		expect(cbCondition).toBeCalledTimes(0);
	});

	test('GIVEN a function that fails twice then succeeds THEN calls that function thrice', () => {
		const cb = vi
			.fn<[], string>() //
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = pollSync(cb, cbCondition);

		expect(result).toBe(pass);
		expect(cb).toBeCalledTimes(3);
		expect(cbCondition).toBeCalledTimes(3);
	});

	describe('maximumRetries', () => {
		const cb = () => pass;

		test.each([undefined, null, 0, 5, Infinity])('GIVEN %j THEN passes validation', (maximumRetries) => {
			const result = pollSync(cb, cbConditionRaw, { maximumRetries });
			expect(result).toBe(pass);
		});

		test.each(['foo', true])('GIVEN %j THEN throws TypeError', (maximumRetries) => {
			// @ts-expect-error invalid type
			const callback = () => pollSync(cb, cbConditionRaw, { maximumRetries });
			expect(callback).toThrowError(new TypeError('Expected maximumRetries to be a number'));
		});

		test.each([NaN, -NaN, -Infinity, -5])('GIVEN %j THEN throws RangeError', (maximumRetries) => {
			const callback = () => pollSync(cb, cbConditionRaw, { maximumRetries });
			expect(callback).toThrowError(new RangeError('Expected maximumRetries to be a non-negative number'));
		});

		test('GIVEN a poll with only one retry and fails both THEN calls that function twice, but condition only once', () => {
			const cb = vi
				.fn<[], string>() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(fail);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = pollSync(cb, cbCondition, { maximumRetries: 1 });

			expect(result).toBe(fail);
			expect(cb).toBeCalledTimes(2);
			expect(cbCondition).toBeCalledTimes(1);
		});

		test('GIVEN a poll with two retries and succeeds first THEN calls that function and condition once', () => {
			const cb = vi.fn(() => pass);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = pollSync(cb, cbCondition, { maximumRetries: 2 });

			expect(result).toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});
	});

	describe('waitBetweenRetries', () => {
		test.each([undefined, null, 0, 5])('GIVEN %j THEN passes validation', (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = pollSync(cb, cbCondition, { waitBetweenRetries });

			expect(result).toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});

		test.each(['foo', true])('GIVEN %j THEN throws TypeError', (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const callback = () => pollSync(cb, cbCondition, { waitBetweenRetries: waitBetweenRetries as any });

			expect(callback).toThrowError(new TypeError('Expected waitBetweenRetries to be a number'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		test.each([NaN, -NaN, -Infinity, -5, Infinity, 5.5])('GIVEN %j THEN throws RangeError', (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const callback = () => pollSync(cb, cbCondition, { waitBetweenRetries });

			expect(callback).toThrowError(new RangeError('Expected waitBetweenRetries to be a positive safe integer'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		test('GIVEN a poll with a wait of 5ms THEN waits 5ms between retries', () => {
			const cb = vi
				.fn<[], string>() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(pass);
			const cbCondition = vi.fn(cbConditionRaw);
			const dateNow = vi
				.spyOn(Date, 'now')
				.mockReturnValueOnce(0) // start
				.mockReturnValueOnce(0) // sleepSync start
				.mockReturnValueOnce(5) // sleepSync end
				.mockReturnValueOnce(5) // sleepSync start
				.mockReturnValueOnce(10); // sleepSync end
			const result = pollSync(cb, cbCondition, { waitBetweenRetries: 5 });

			expect(result).toBe(pass);
			expect(dateNow).toBeCalledTimes(5);
		});
	});

	describe('timeout', () => {
		const cb = () => pass;

		test.each([undefined, null, 0, 5, Infinity])('GIVEN %j THEN passes validation', (timeout) => {
			const result = pollSync(cb, cbConditionRaw, { timeout });
			expect(result).toBe(pass);
		});

		test.each(['foo', true])('GIVEN %j THEN throws TypeError', (timeout) => {
			// @ts-expect-error invalid type
			const callback = () => pollSync(cb, cbConditionRaw, { timeout });
			expect(callback).toThrowError(new TypeError('Expected timeout to be a number'));
		});

		test.each([NaN, -NaN, -Infinity, -5])('GIVEN %j THEN throws RangeError', (timeout) => {
			const callback = () => pollSync(cb, cbConditionRaw, { timeout });
			expect(callback).toThrowError(new RangeError('Expected timeout to be a non-negative number'));
		});

		test('GIVEN a poll with 5ms timeout but takes longer THEN throws an error', () => {
			const cb = vi
				.fn<[], string>() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(fail);
			const cbCondition = vi.fn((result: string) => result === pass);
			const dateNow = vi
				.spyOn(Date, 'now')
				.mockReturnValueOnce(0) // start
				.mockReturnValueOnce(0) // sleepSync start
				.mockReturnValueOnce(5) // sleepSync end
				.mockReturnValueOnce(5) // sleepSync start
				.mockReturnValueOnce(10) // sleepSync end
				.mockReturnValueOnce(10);
			const callback = () => pollSync(cb, cbCondition, { timeout: 5, waitBetweenRetries: 5 });

			expect(callback).toThrowError(new DOMException('This operation was aborted', 'AbortError'));
			expect(cb).toBeCalledTimes(2);
			expect(cbCondition).toBeCalledTimes(2);
			expect(dateNow).toBeCalledTimes(6);
		});
	});

	describe('verbose', () => {
		test('GIVEN verbose but no waitBetweenRetries THEN does not call console.log', () => {
			const cb = vi.fn<[], string>().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = pollSync(cb, cbConditionRaw, { verbose: true });

			expect(result).toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(0);
		});

		test('GIVEN verbose and waitBetweenRetries THEN calls console.log on retry', () => {
			const cb = vi.fn<[], string>().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = pollSync(cb, cbConditionRaw, { verbose: true, waitBetweenRetries: 5 });

			expect(result).toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(1);
			expect(consoleLog).toHaveBeenCalledWith('Waiting 5ms before polling again...');
		});
	});
});

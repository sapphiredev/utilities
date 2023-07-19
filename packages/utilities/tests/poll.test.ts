import { poll } from '../src';

const DOMException: typeof globalThis.DOMException =
	globalThis.DOMException ??
	// DOMException was only made a global in Node v17.0.0, but this library supports Node v16.0.0 and up
	AbortSignal.abort().reason.constructor;

describe('poll', () => {
	const pass = 'success!';
	const fail = 'fail!';
	const cbRaw = () => pass;
	const cbConditionRaw = (result: string) => result === pass;

	test('GIVEN a poll with no retries THEN returns first attempt', async () => {
		const cb = vi.fn(() => pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = poll(cb, cbCondition, { maximumRetries: 0 });

		await expect(result).resolves.toBe(pass);
		expect(cb).toBeCalledTimes(1);
		expect(cb).toHaveBeenCalledWith(undefined);
		expect(cbCondition).toBeCalledTimes(0);
	});

	test('GIVEN a function that fails twice then succeeds THEN calls that function thrice', async () => {
		const cb = vi
			.fn<[], string>() //
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(fail)
			.mockReturnValueOnce(pass);
		const cbCondition = vi.fn(cbConditionRaw);
		const result = poll(cb, cbCondition);

		await expect(result).resolves.toBe(pass);
		expect(cb).toBeCalledTimes(3);
		expect(cbCondition).toBeCalledTimes(3);
	});

	describe('signal', () => {
		test('GIVEN an AbortSignal that is aborted before the first call THEN throws', async () => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { signal: AbortSignal.abort() });

			await expect(result).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		test('GIVEN an AbortSignal that is aborted in the condition THEN throws without retry', async () => {
			const controller = new AbortController();
			const cb = vi.fn(() => fail);
			const cbCondition = vi.fn((result: string) => {
				controller.abort();
				return result === pass;
			});
			const result = poll(cb, cbCondition, { signal: controller.signal });

			await expect(result).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});
	});

	describe('maximumRetries', () => {
		const cb = () => pass;

		test.each([undefined, null, 0, 5, Infinity])('GIVEN %j THEN passes validation', async (maximumRetries) => {
			const result = poll(cb, cbConditionRaw, { maximumRetries });
			await expect(result).resolves.toBe(pass);
		});

		test.each(['foo', true])('GIVEN %j THEN throws TypeError', async (maximumRetries) => {
			// @ts-expect-error invalid type
			const result = poll(cb, cbConditionRaw, { maximumRetries });
			await expect(result).rejects.toStrictEqual(new TypeError('Expected maximumRetries to be a number'));
		});

		test.each([NaN, -NaN, -Infinity, -5])('GIVEN %j THEN throws RangeError', async (maximumRetries) => {
			const result = poll(cb, cbConditionRaw, { maximumRetries });
			await expect(result).rejects.toStrictEqual(new RangeError('Expected maximumRetries to be a non-negative number'));
		});

		test('GIVEN a poll with only one retry and fails both THEN calls that function twice, but condition only once', async () => {
			const cb = vi
				.fn<[], string>() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(fail);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = poll(cb, cbCondition, { maximumRetries: 1 });

			await expect(result).resolves.toBe(fail);
			expect(cb).toBeCalledTimes(2);
			expect(cbCondition).toBeCalledTimes(1);
		});

		test('GIVEN a poll with two retries and succeeds first THEN calls that function and condition once', async () => {
			const cb = vi.fn(() => pass);
			const cbCondition = vi.fn((result: string) => result === pass);
			const result = poll(cb, cbCondition, { maximumRetries: 2 });

			await expect(result).resolves.toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});
	});

	describe('waitBetweenRetries', () => {
		test.each([undefined, null, 0, 5])('GIVEN %j THEN passes validation', async (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { waitBetweenRetries });

			await expect(result).resolves.toBe(pass);
			expect(cb).toBeCalledTimes(1);
			expect(cbCondition).toBeCalledTimes(1);
		});

		test.each(['foo', true])('GIVEN %j THEN throws TypeError', async (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { waitBetweenRetries: waitBetweenRetries as any });

			await expect(result).rejects.toStrictEqual(new TypeError('Expected waitBetweenRetries to be a number'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		test.each([NaN, -NaN, -Infinity, -5, Infinity, 5.5])('GIVEN %j THEN throws RangeError', async (waitBetweenRetries) => {
			const cb = vi.fn(cbRaw);
			const cbCondition = vi.fn(cbConditionRaw);
			const result = poll(cb, cbCondition, { waitBetweenRetries });

			await expect(result).rejects.toStrictEqual(new RangeError('Expected waitBetweenRetries to be a positive safe integer'));
			expect(cb).toBeCalledTimes(0);
			expect(cbCondition).toBeCalledTimes(0);
		});

		test('GIVEN a poll with a wait of 5ms THEN waits 5ms between retries', async () => {
			const cb = vi
				.fn<[], string>() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(pass);
			const cbCondition = vi.fn(cbConditionRaw);

			const timeout = vi.spyOn(global, 'setTimeout').mockImplementationOnce((cb) => {
				cb();
				return 0 as any;
			});
			const result = poll(cb, cbCondition, { waitBetweenRetries: 5 });
			await expect(result).resolves.toBe(pass);
			expect(timeout).toBeCalledTimes(1);
			expect(timeout.mock.calls[0][1]).toBe(5);
		});

		test('GIVEN a poll with a wait of 5ms THEN waits 5ms between retries', async () => {
			const cb = vi
				.fn<[], string>() //
				.mockReturnValueOnce(fail)
				.mockReturnValueOnce(pass);
			const cbCondition = vi.fn(cbConditionRaw);

			vi.useFakeTimers({ shouldAdvanceTime: true, advanceTimeDelta: 5 });
			const signal = AbortSignal.timeout(5);
			const result = poll(cb, cbCondition, { signal, waitBetweenRetries: 10 });
			vi.useRealTimers();

			await expect(result).rejects.toStrictEqual(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
			expect(cb).toBeCalledTimes(1);
			expect(cb).toHaveBeenCalledWith(signal);
			expect(cbCondition).toBeCalledTimes(1);
			expect(cbCondition).toHaveBeenCalledWith(fail, signal);
		});
	});

	describe('verbose', () => {
		test('GIVEN verbose but no waitBetweenRetries THEN does not call console.log', async () => {
			const cb = vi.fn<[], string>().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = poll(cb, cbConditionRaw, { verbose: true });

			await expect(result).resolves.toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(0);
		});

		test('GIVEN verbose and waitBetweenRetries THEN calls console.log on retry', async () => {
			const cb = vi.fn<[], string>().mockReturnValueOnce(fail).mockReturnValueOnce(pass);
			const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);
			const result = poll(cb, cbConditionRaw, { verbose: true, waitBetweenRetries: 5 });

			await expect(result).resolves.toBe(pass);
			expect(consoleLog).toHaveBeenCalledTimes(1);
			expect(consoleLog).toHaveBeenCalledWith('Waiting 5ms before polling again...');
		});
	});
});

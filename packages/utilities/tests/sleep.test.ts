import { sleep } from '../src';

const DOMException: typeof globalThis.DOMException =
	globalThis.DOMException ??
	// DOMException was only made a global in Node v17.0.0,
	// but our CI runs on Node v16.6.0 too
	AbortSignal.abort().reason.constructor;

describe('sleep', () => {
	test('GIVEN a number of ms THEN resolve the promise after that time', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true, advanceTimeDelta: 50 });
		const start = Date.now();
		const result = sleep(50);

		await expect<Promise<undefined>>(result).resolves.toBe(undefined);
		expect(Date.now() - start).toBe(50);
		vi.useRealTimers();
	});

	test('GIVEN a number of ms and a value THEN resolve the promise after that time with the value', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true, advanceTimeDelta: 50 });
		const start = Date.now();
		const result = sleep(50, 'test');

		await expect<Promise<string>>(result).resolves.toBe('test');
		expect(Date.now() - start).toBe(50);
		vi.useRealTimers();
	});

	test('GIVEN an aborted signal THEN the promise rejects without a timeout', async () => {
		const signal = AbortSignal.abort();
		const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
		const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
		const promise = sleep(50, undefined, { signal });

		await expect(promise).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
		expect(setTimeoutSpy).toHaveBeenCalledTimes(0);
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
	});

	test('GIVEN an immediately aborted signal THEN the promise rejects', async () => {
		const controller = new AbortController();
		const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
		const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
		const promise = sleep(50, undefined, { signal: controller.signal });
		controller.abort();

		await expect(promise).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
		expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
	});

	test('GIVEN an immediately aborted signal with a reason THEN reject the promise with the reason as cause', async () => {
		const controller = new AbortController();
		const promise = sleep(50, undefined, { signal: controller.signal });
		controller.abort('Too late!');
		await expect(promise).rejects.toStrictEqual('Too late!');
	});
});

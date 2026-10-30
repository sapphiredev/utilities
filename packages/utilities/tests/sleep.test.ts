import { sleep } from '../src';

const DOMException: typeof globalThis.DOMException =
	globalThis.DOMException ??
	// DOMException was only made a global in Node v17.0.0,
	// but our CI runs on Node v16.6.0 too
	AbortSignal.abort().reason.constructor;

describe('sleep', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	test('GIVEN a number of ms THEN resolve the promise after that time', async () => {
		const onResolved = vi.fn();
		const result = sleep(50);
		// eslint-disable-next-line promise/prefer-await-to-then -- Observe settlement without waiting for the deadline.
		void result.then(onResolved);

		expect(vi.getTimerCount()).toBe(1);
		await vi.advanceTimersByTimeAsync(49);
		expect(onResolved).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(1);

		await vi.advanceTimersByTimeAsync(1);
		await expect<Promise<undefined>>(result).resolves.toBe(undefined);
		expect(onResolved).toHaveBeenCalledTimes(1);
		expect(vi.getTimerCount()).toBe(0);
	});

	test('GIVEN a number of ms and a value THEN resolve the promise after that time with the value', async () => {
		const onResolved = vi.fn();
		const result = sleep(50, 'test');
		// eslint-disable-next-line promise/prefer-await-to-then -- Observe settlement without waiting for the deadline.
		void result.then(onResolved);

		expect(vi.getTimerCount()).toBe(1);
		await vi.advanceTimersByTimeAsync(49);
		expect(onResolved).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(1);

		await vi.advanceTimersByTimeAsync(1);
		await expect<Promise<string>>(result).resolves.toBe('test');
		expect(onResolved).toHaveBeenCalledExactlyOnceWith('test');
		expect(vi.getTimerCount()).toBe(0);
	});

	test('GIVEN an aborted signal THEN the promise rejects without a timeout', async () => {
		const setTimeout = vi.spyOn(globalThis, 'setTimeout');
		const signal = AbortSignal.abort();
		const promise = sleep(50, undefined, { signal });

		await expect(promise).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
		expect(setTimeout).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
	});

	test('GIVEN an immediately aborted signal THEN the promise rejects', async () => {
		const setTimeout = vi.spyOn(globalThis, 'setTimeout');
		const clearTimeout = vi.spyOn(globalThis, 'clearTimeout');
		const controller = new AbortController();
		const promise = sleep(50, undefined, { signal: controller.signal });

		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(vi.getTimerCount()).toBe(1);
		controller.abort();

		await expect(promise).rejects.toStrictEqual(new DOMException('This operation was aborted', 'AbortError'));
		expect(clearTimeout).toHaveBeenCalledExactlyOnceWith(setTimeout.mock.results[0].value);
		expect(vi.getTimerCount()).toBe(0);
	});

	test('GIVEN an immediately aborted signal with a reason THEN reject the promise with the reason as cause', async () => {
		const controller = new AbortController();
		const promise = sleep(50, undefined, { signal: controller.signal });

		expect(vi.getTimerCount()).toBe(1);
		controller.abort('Too late!');
		await expect(promise).rejects.toStrictEqual('Too late!');
		expect(vi.getTimerCount()).toBe(0);
	});
});

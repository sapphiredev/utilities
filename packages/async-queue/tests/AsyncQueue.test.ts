import { AsyncQueue, type AsyncQueueWaitOptions } from '../src';

function genNumbers(queue: AsyncQueue) {
	let i = 0;
	return async (options?: Readonly<AsyncQueueWaitOptions>): Promise<number> => {
		await queue.wait(options);
		try {
			return await Promise.resolve(++i);
		} finally {
			queue.shift();
		}
	};
}

describe('AsyncQueue', () => {
	test('GIVEN await calls THEN increments after each', async () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		expect(await tester()).toBe(1);
		expect(await tester()).toBe(2);
	});

	test('GIVEN race condition THEN entries are executed in queue order', async () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		const first = tester();
		const second = tester();
		const third = tester();

		expect(await Promise.race([second, first, third])).toBe(1);
	});

	test('GIVEN multiple calls without await THEN none is resolved', () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		void tester();
		void tester();
		void tester();

		expect(queue.remaining).toBe(3);
	});

	test("GIVEN shifting an undefined queue THEN doesn't throw", () => {
		const queue = new AsyncQueue();

		expect(queue.remaining).toBe(0);
		expect(() => queue.shift()).not.toThrow();
	});

	test('GIVEN AbortSignal on empty queue THEN does not set an abort handler', async () => {
		const queue = new AsyncQueue();
		const tester = genNumbers(queue);

		const controller = new AbortController();
		const promise = tester({ signal: controller.signal });
		expect(queue['promises'][0]['signal']).toBe(null);
		expect(queue['promises'][0]['signalListener']).toBe(null);

		controller.abort();
		await expect(promise).resolves.toBe(1);
	});

	test('GIVEN non-head item with AbortSignal + abort() THEN rejects queued item and dequeues it', async () => {
		const queue = new AsyncQueue();
		const controller = new AbortController();
		const tester = genNumbers(queue);

		const first = tester();
		const second = tester({ signal: controller.signal });
		const third = tester();

		expect(queue.remaining).toBe(3);
		expect(queue['promises'][1]['signal']).toBe(controller.signal);
		expect(queue['promises'][1]['signalListener']).not.toBe(null);

		const thirdEntry = queue['promises'][2];

		controller.abort();
		expect(queue.remaining).toBe(2);
		expect(queue['promises'][1]).toBe(thirdEntry);

		await expect(first).resolves.toBe(1);
		expect(queue.remaining).toBe(0);

		await expect(second).rejects.toThrowError('Request aborted manually');
		await expect(third).resolves.toBe(2);
	});

	test('GIVEN non-head item with aborted AbortSignal THEN does not set an abort handler', async () => {
		const queue = new AsyncQueue();
		const controller = new AbortController();
		controller.abort();

		const tester = genNumbers(queue);

		const first = tester();
		const second = tester({ signal: controller.signal });
		expect(queue.remaining).toBe(2);
		expect(queue['promises'][1]['signal']).toBe(null);
		expect(queue['promises'][1]['signalListener']).toBe(null);

		await expect(first).resolves.toBe(1);
		await expect(second).resolves.toBe(2);
	});

	test('GIVEN non-head item with AbortSignal + late abort() THEN unregisters abort listener', async () => {
		const queue = new AsyncQueue();
		const controller = new AbortController();
		const tester = genNumbers(queue);

		const first = tester();
		const second = tester({ signal: controller.signal });
		expect(queue.remaining).toBe(2);

		await expect(first).resolves.toBe(1);

		controller.abort();
		await expect(second).resolves.toBe(2);
	});

	describe('abortAll', () => {
		test('GIVEN empty queue THEN does no operation', () => {
			const queue = new AsyncQueue();

			expect(() => queue.abortAll()).not.toThrow();
		});

		test('GIVEN queue with only the head THEN does no operation', async () => {
			const queue = new AsyncQueue();
			const tester = genNumbers(queue);

			const first = tester();
			const firstSpy = vi.spyOn(queue['promises'][0], 'abort');

			expect(() => queue.abortAll()).not.toThrow();
			expect(firstSpy).not.toHaveBeenCalled();
			await expect(first).resolves.toBe(1);
		});

		test('GIVEN queue with several entries THEN aborts all non-head entries', async () => {
			const queue = new AsyncQueue();
			const tester = genNumbers(queue);

			const first = tester();
			const second = tester();
			const third = tester();

			const firstSpy = vi.spyOn(queue['promises'][0], 'abort');
			const secondSpy = vi.spyOn(queue['promises'][1], 'abort');
			const thirdSpy = vi.spyOn(queue['promises'][2], 'abort');

			expect(() => queue.abortAll()).not.toThrow();
			expect(firstSpy).not.toHaveBeenCalled();
			expect(secondSpy).toHaveBeenCalledOnce();
			expect(thirdSpy).toHaveBeenCalledOnce();

			await expect(first).resolves.toBe(1);
			await expect(second).rejects.toThrowError('Request aborted manually');
			await expect(third).rejects.toThrowError('Request aborted manually');
		});
	});
});

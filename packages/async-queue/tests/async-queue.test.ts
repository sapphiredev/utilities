import { AsyncQueue } from '../src';

function genNumbers(queue: AsyncQueue): () => Promise<number> {
	let i = 0;
	return async (): Promise<number> => {
		await queue.wait();
		try {
			return await Promise.resolve(++i);
		} finally {
			queue.shift();
		}
	};
}

test('GIVEN await calls THEN increments after each', async () => {
	const queue = new AsyncQueue();
	const tester = genNumbers(queue);

	expect(await tester()).toBe(1);
	expect(await tester()).toBe(2);
});

test('GIVEN race condition THEN each is identical', async () => {
	const queue = new AsyncQueue();
	const tester = genNumbers(queue);

	const first = tester();
	const second = tester();
	const third = tester();

	expect(await Promise.race([second, first, third])).toBe(1);
});

test('GIVEN multiple calls THEN none is resolved', () => {
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

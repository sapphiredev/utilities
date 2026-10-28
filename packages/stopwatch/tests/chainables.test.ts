import { setTimeout } from 'node:timers/promises';
import { Stopwatch } from '../src';

describe('Chainables', () => {
	test('restart', async () => {
		const stopwatch = new Stopwatch();

		await setTimeout(5_001);
		stopwatch.stop();
		expect(stopwatch.duration >= 4_990 && stopwatch.duration <= 5_200).toBe(true);

		stopwatch.restart();

		await setTimeout(1_000);
		stopwatch.stop();
		expect(stopwatch.duration >= 990 && stopwatch.duration <= 1_200).toBe(true);
	}, 10_000);

	test('reset', async () => {
		const stopwatch = new Stopwatch();

		await setTimeout(1_000);
		stopwatch.stop();
		expect(stopwatch.duration >= 990 && stopwatch.duration <= 1_200).toBe(true);

		stopwatch.reset();

		expect(stopwatch.duration === 0).toBe(true);
	});

	test('starting a previously stopped stopwatch', async () => {
		const stopwatch = new Stopwatch();

		await setTimeout(1_000);
		stopwatch.stop();

		expect(stopwatch.duration >= 990 && stopwatch.duration <= 1_200).toBe(true);

		stopwatch.start();

		await setTimeout(1_000);
		stopwatch.stop();
		expect(stopwatch.duration >= 1_990 && stopwatch.duration <= 2_200).toBe(true);
	});

	test('stopping the same stopwatch twice', async () => {
		const stopwatch = new Stopwatch();

		await setTimeout(1_000);
		stopwatch.stop();
		const first = stopwatch.duration;

		await setTimeout(1_000);
		// Redundant, but needed for code coverage.
		stopwatch.stop();
		const second = stopwatch.duration;
		expect(first).toBe(second);
	});
});

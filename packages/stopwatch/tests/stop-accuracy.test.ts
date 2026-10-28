import { setTimeout } from 'node:timers/promises';
import { Stopwatch } from '../src';

// ... others
describe('Stop Accuracy', () => {
	test('stop-accuracy(1 second)', async () => {
		const stopwatch = new Stopwatch();

		await setTimeout(1_000);
		stopwatch.stop();
		expect(stopwatch.duration >= 990 && stopwatch.duration <= 1_200).toBe(true);
	});

	test('stop-accuracy(5 seconds)', async () => {
		const stopwatch = new Stopwatch();

		await setTimeout(5_000);
		stopwatch.stop();
		expect(stopwatch.duration >= 4_990 && stopwatch.duration <= 5_200).toBe(true);
	}, 10_000);
});

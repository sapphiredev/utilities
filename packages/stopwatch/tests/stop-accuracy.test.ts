import { sleep } from './shared';
import { Stopwatch } from '../src';

// ... others
describe('Stop Accuracy', () => {
	test('stop-accuracy(1 second)', async () => {
		const stopwatch = new Stopwatch();

		await sleep(1000);
		stopwatch.stop();
		expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);
	});

	test('stop-accuracy(5 seconds)', async () => {
		const stopwatch = new Stopwatch();

		await sleep(5000);
		stopwatch.stop();
		expect(stopwatch.duration >= 4990 && stopwatch.duration <= 5200).toBe(true);
	}, 10000);
});

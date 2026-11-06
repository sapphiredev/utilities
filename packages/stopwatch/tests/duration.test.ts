import { setTimeout } from 'node:timers/promises';
import { Stopwatch } from '../src';

describe('Duration', () => {
	test('duration(running)', async () => {
		const stopwatch = new Stopwatch();

		const first = stopwatch.duration;

		await setTimeout(1_000);
		stopwatch.stop();
		const second = stopwatch.duration;

		expect(first < second).toBe(true);
	});
});

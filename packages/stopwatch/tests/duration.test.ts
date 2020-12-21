import { sleep } from './shared';
import { Stopwatch } from '../src';

describe('Duration', () => {
	test('duration(running)', async () => {
		const stopwatch = new Stopwatch();

		const first = stopwatch.duration;

		await sleep(1000);
		stopwatch.stop();
		const second = stopwatch.duration;

		expect(first < second).toBe(true);
	});
});

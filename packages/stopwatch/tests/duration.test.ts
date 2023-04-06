import { sleep } from './shared.js';
import { Stopwatch } from '../src/index.js';

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

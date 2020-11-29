import { sleep } from './shared';
import { Stopwatch } from '../src';

test('restart', async () => {
	const stopwatch = new Stopwatch();

	await sleep(5001);
	stopwatch.stop();
	expect(stopwatch.duration >= 4990 && stopwatch.duration <= 5200).toBe(true);

	stopwatch.restart();

	await sleep(1000);
	stopwatch.stop();
	expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);
}, 10000);

test('reset', async () => {
	const stopwatch = new Stopwatch();

	await sleep(1000);
	stopwatch.stop();
	expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);

	stopwatch.reset();

	expect(stopwatch.duration === 0).toBe(true);
});

test('start(stopped stopwatch)', async () => {
	const stopwatch = new Stopwatch();

	await sleep(1000);
	stopwatch.stop();

	expect(stopwatch.duration >= 990 && stopwatch.duration <= 1200).toBe(true);

	stopwatch.start();

	await sleep(1000);
	stopwatch.stop();
	expect(stopwatch.duration >= 1990 && stopwatch.duration <= 2200).toBe(true);
});

test('stopping(twice)', async () => {
	const stopwatch = new Stopwatch();

	await sleep(1000);
	stopwatch.stop();
	const first = stopwatch.duration;

	await sleep(1000);
	// Redundant, but needed for code coverage.
	stopwatch.stop();
	const second = stopwatch.duration;
	expect(first).toBe(second);
});

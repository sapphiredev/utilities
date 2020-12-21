import { Stopwatch } from '../src';

describe('Running', () => {
	test('stopped', () => {
		const stopwatch = new Stopwatch().stop();

		expect(stopwatch.running).toBe(false);
	});

	test('running(constructor)', () => {
		const stopwatch = new Stopwatch();

		expect(stopwatch.running).toBe(true);
	});

	test('running(method)', () => {
		const stopwatch = new Stopwatch().start();

		expect(stopwatch.running).toBe(true);
	});
});

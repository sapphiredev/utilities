import { sleep } from './shared';
import { Stopwatch } from '../src';

describe('To String', () => {
	test('toString(1 second)', async () => {
		const stopwatch = new Stopwatch();

		await sleep(1010);
		const str = stopwatch.stop().toString();
		// Should only be one second.
		expect(str.startsWith('1') && str.endsWith('s')).toBe(true);
	});

	test('toString(instant)', () => {
		const stopwatch = new Stopwatch();

		const str = stopwatch.stop().toString();
		expect(str.endsWith('μs')).toBe(true);
	});

	test('toString(less than a second)', async () => {
		const stopwatch = new Stopwatch();

		await sleep(100);
		const str = stopwatch.stop().toString();
		expect(str.endsWith('ms')).toBe(true);
	});
});

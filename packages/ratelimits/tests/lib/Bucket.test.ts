import { Bucket } from '../../src';

const run = <T>(time: number, cb: () => T): T => {
	jest.spyOn(global.Date, 'now').mockImplementationOnce(() => time);
	return cb();
};

describe('Bucket', () => {
	test('Common', () => {
		expect(typeof Bucket).toBe('function');
	});

	test('Token', () => {
		const now = Date.now();

		// Define a bucket with 1 usage every 5 seconds
		const bucket = new Bucket().setDelay(5000);

		expect(bucket.delay).toBe(5000);
		expect(bucket.limit.maximum).toBe(1);
		expect(bucket.limit.timespan).toBe(0);

		run(now, () => expect(bucket.take(420)).toBe(0));
		run(now, () => expect(bucket.take(420)).toBe(5000));
		run(now, () => expect(bucket.take(42)).toBe(0));
	});

	test('Leaky', () => {
		const now = Date.now();

		// Define a bucket with 2 usages every 5 seconds with timespan of 250 milliseconds
		const bucket = new Bucket().setLimit({ maximum: 2, timespan: 250 });

		expect(bucket.delay).toBe(0);
		expect(bucket.limit.maximum).toBe(2);
		expect(bucket.limit.timespan).toBe(250);

		run(now, () => expect(bucket.take(420)).toBe(0));
		run(now, () => expect(bucket.take(420)).toBe(0));
		run(now, () => expect(bucket.take(420)).toBe(250));
		run(now + 250, () => expect(bucket.take(420)).toBe(0));
		run(now + 250, () => expect(bucket.take(420)).toBe(0));
	});
});

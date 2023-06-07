import { retry } from '../src/lib/retry';

describe('retry', () => {
	test('GIVEN a simple string return THEN returns the same on first attempt', async () => {
		const result = await retry(() => 'test', 3);

		expect(result).toBe('test');
	});

	test('GIVEN a twice failing function THEN returns the third result', async () => {
		let counter = 0;
		const cb = () => {
			if (counter < 2) {
				++counter;
				throw new Error('💣💥');
			}

			return 'success!';
		};

		const result = await retry(cb, 3);

		expect(result).toBe('success!');
		expect(counter).toBe(2);
	});
});

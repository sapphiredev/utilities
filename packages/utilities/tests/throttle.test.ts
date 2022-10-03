import { throttle, sleep } from '../src';

describe('throttle', () => {
	test('GIVEN number callback THEN returns the same output until the delay', async () => {
		const callback = vi.fn((num: number) => num);

		const throttleFunc = throttle(callback, 100);
		const now = Date.now();
		expect(throttleFunc(now)).toEqual(now);
		expect(throttleFunc(100)).toEqual(now);
		expect(callback).toHaveBeenCalledOnce();
		await sleep(100);
		expect(throttleFunc(200)).toEqual(200);
	});

	test('GIVEN number callback THEN returns the new output when flush', () => {
		const callback = vi.fn((num: number) => num);

		const throttleFunc = throttle(callback, 100);
		const now = Date.now();
		expect(throttleFunc(now)).toEqual(now);
		throttleFunc.flush();
		expect(throttleFunc(100)).toEqual(100);
		expect(callback).toHaveBeenCalledTimes(2);
	});
});

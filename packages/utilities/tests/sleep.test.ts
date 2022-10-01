import { AbortError, sleep, sleepSync } from '../src';
import { expectError } from './util/macros/comparators';

const DOMException: typeof globalThis.DOMException =
	globalThis.DOMException ??
	(() => {
		// DOMException was only made a global in Node v17.0.0,
		// but our CI runs on Node v16.6.0 too
		try {
			atob('~');
		} catch (err) {
			return Object.getPrototypeOf(err).constructor;
		}
	})();

describe('sleep', () => {
	test('GIVEN a number of ms THEN resolve the promise after that time', async () => {
		const start = Date.now();
		await sleep(50);
		expect(Date.now() - start).greaterThanOrEqual(45);
	});

	test('GIVEN a number of ms and a value THEN resolve the promise after that time with the value', async () => {
		const start = Date.now();
		const value = await sleep(50, 'test');
		expect(Date.now() - start).greaterThanOrEqual(45);
		expect<string>(value).toBe('test');
	});

	test('GIVEN a abort signal THEN reject the promise', async () => {
		const controller = new AbortController();
		const promise = sleep(1000, 'test', { signal: controller.signal });
		controller.abort();
		await expectError(
			() => promise,
			new AbortError('The operation was aborted', {
				cause: new DOMException('This operation was aborted', 'AbortError')
			})
		);
	});

	test('GIVEN a abort signal with reason THEN reject the promise with the reason as cause', async () => {
		const controller = new AbortController();
		const promise = sleep(1000, 'test', { signal: controller.signal });
		controller.abort('test');
		await expectError(
			() => promise,
			new AbortError('The operation was aborted', {
				cause: 'test'
			})
		);
	});
});

describe('sleepSync', () => {
	test('GIVEN a number of ms THEN return after that time', () => {
		const start = Date.now();
		sleepSync(50);
		expect(Date.now() - start).greaterThanOrEqual(50);
	});

	test('GIVEN a number of ms and a value THEN return after that time with the value', () => {
		const start = Date.now();
		const value = sleepSync(50, 'test');
		expect(Date.now() - start).greaterThanOrEqual(50);
		expect<string>(value).toBe('test');
	});
});

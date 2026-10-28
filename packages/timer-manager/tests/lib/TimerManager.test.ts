/* eslint-disable @typescript-eslint/dot-notation */
import { TimerManager } from '../../src';

describe('TimerManager', () => {
	afterEach(() => {
		vi.clearAllTimers();
		TimerManager.destroy();
	});

	test('GIVEN "new" THEN  throws error', () => {
		expect(() => new TimerManager()).toThrow('Super constructor null of TimerManager is not a constructor');
	});

	test('GIVEN setTimeout static THEN creates and resolves timeout', async () => {
		expect.assertions(2);

		expect(TimerManager['storedTimeouts'].size).toBe(0);

		await new Promise<void>((resolve) =>
			// eslint-disable-next-line no-promise-executor-return
			TimerManager.setTimeout(() => {
				expect(true).toBe(true);
				resolve();
			}, 20)
		);
	});

	test('GIVEN setTimeout with clear THEN creates but clears timeout', () => {
		expect.assertions(3);

		expect(TimerManager['storedTimeouts'].size).toBe(0);

		const timer = TimerManager.setTimeout(() => {
			throw new Error('Woops, the TimerManager got into the timeout');
		}, 20_000);

		expect(TimerManager['storedTimeouts'].size).toBe(1);

		TimerManager.clearTimeout(timer);

		expect(TimerManager['storedTimeouts'].size).toBe(0);
	});

	test('GIVEN setInterval static THEN resolves given amount of times', async () => {
		expect.assertions(4);

		expect(TimerManager['storedIntervals'].size).toBe(0);

		let i = 0;
		await new Promise<void>((resolve) => {
			const interval = TimerManager.setInterval(() => {
				if (++i < 3) {
					expect(TimerManager['storedIntervals'].size).toBe(1);
				} else {
					TimerManager.clearInterval(interval);
					expect(TimerManager['storedIntervals'].size).toBe(0);
					resolve();
				}
			}, 20);
		});
	});

	test('GIVEN timer+interval->destroy THEN removes all', () => {
		expect.assertions(8);

		expect(TimerManager['storedTimeouts'].size).toBe(0);
		expect(TimerManager['storedIntervals'].size).toBe(0);

		TimerManager.setTimeout(() => {
			throw new Error('Woops, the TimerManager got into the timeout');
		}, 20_000);

		expect(TimerManager['storedTimeouts'].size).toBe(1);
		expect(TimerManager['storedIntervals'].size).toBe(0);

		TimerManager.setInterval(() => {
			throw new Error('Woops, the TimerManager got into the interval');
		}, 20_000);

		expect(TimerManager['storedTimeouts'].size).toBe(1);
		expect(TimerManager['storedIntervals'].size).toBe(1);

		TimerManager.destroy();

		expect(TimerManager['storedTimeouts'].size).toBe(0);
		expect(TimerManager['storedIntervals'].size).toBe(0);
	});
});

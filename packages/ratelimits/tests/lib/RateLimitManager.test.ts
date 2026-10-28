import { TimerManager } from '@sapphire/timer-manager';
import { setTimeout as sleep } from 'node:timers/promises';
import { RateLimitManager } from '../../src';

describe('RateLimitManager', () => {
	afterEach(() => TimerManager.destroy());

	test('Acquiring', () => {
		const manager = new RateLimitManager(1_000, 1);

		const ratelimit1 = manager.acquire('one');
		const ratelimit2 = manager.acquire('two');
		expect(ratelimit1).toBe(manager.get('one'));
		expect(ratelimit2).toBe(manager.get('two'));
	});

	test('Basic Consume', () => {
		const manager = new RateLimitManager(30_000, 2);

		const ratelimit = manager.acquire('one');
		ratelimit.consume().consume();
		expect(() => ratelimit.consume()).toThrow('Cannot consume a limited bucket');
	});

	test('Proper resetting', async () => {
		const manager = new RateLimitManager(1_000, 2);

		const ratelimit = manager.acquire('one');
		ratelimit.consume().consume();

		expect(ratelimit.limited).toBe(true);

		// Sleep for 1.2 seconds because of how timers work.
		await sleep(1_200);

		expect(ratelimit.limited).toBe(false);
		expect(() => ratelimit.consume()).not.toThrow();
	});

	test('Proper sweeping (everything)', async () => {
		const manager = new RateLimitManager(1_000, 2);

		manager.acquire('one').consume();

		// Sleep for 1.2 seconds because of how timers work.
		await sleep(1_200);
		manager.sweep();

		expect(manager.has('one')).toBe(false);
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(manager['sweepInterval']).toBeNull();
	});

	test('Proper sweeping (not everything)', async () => {
		const manager = new RateLimitManager(1_000, 2);

		manager.acquire('one').consume();

		// Sleep for 1.2 seconds because of how timers work.
		await sleep(1_200);
		manager.acquire('two').consume();
		manager.sweep();

		expect(manager.has('one')).toBe(false);
		expect(manager.has('two')).toBe(true);
		// eslint-disable-next-line @typescript-eslint/dot-notation
		expect(manager['sweepInterval']).not.toBeNull();
	});
});

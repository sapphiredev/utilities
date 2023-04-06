import { TwitterSnowflake, type DeconstructedSnowflake } from '../../src';

describe('Twitter Snowflakes', () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2020-01-01T00:00:00.000+00:00'));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	describe('Generate', () => {
		test('GIVEN basic code THEN generates snowflake', () => {
			const testId = '1212161512043450368';
			const snow = TwitterSnowflake.generate();

			expect(snow.toString()).toBe(testId);
		});
	});

	describe('Decode', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const flake = TwitterSnowflake.deconstruct('1823945883910279168');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 1823945883910279168n,
				timestamp: 1723697560657n,
				workerId: 1n,
				processId: 1n,
				increment: 0n,
				epoch: 1288834974657n
			});
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const flake = TwitterSnowflake.deconstruct(1823945883910279168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 1823945883910279168n,
				timestamp: 1723697560657n,
				workerId: 1n,
				processId: 1n,
				increment: 0n,
				epoch: 1288834974657n
			});
		});
	});
});

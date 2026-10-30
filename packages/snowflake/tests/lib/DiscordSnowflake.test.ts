import { DiscordSnowflake, type DeconstructedSnowflake } from '../../src';

describe('Discord Snowflakes', () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2020-01-01T00:00:00.000+00:00'));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	describe('Generate', () => {
		test('GIVEN basic code THEN generates snowflake', () => {
			const testId = '661720242585604096';
			const snow = DiscordSnowflake.generate();

			expect(snow.toString()).toBe(testId);
		});
	});

	describe('Decode', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const flake = DiscordSnowflake.deconstruct('661720242585735168');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 661_720_242_585_735_168n,
				timestamp: 1_577_836_800_000n,
				workerId: 1n,
				processId: 1n,
				increment: 0n,
				epoch: 1_420_070_400_000n
			});
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const flake = DiscordSnowflake.deconstruct(661_720_242_585_735_168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 661_720_242_585_735_168n,
				timestamp: 1_577_836_800_000n,
				workerId: 1n,
				processId: 1n,
				increment: 0n,
				epoch: 1_420_070_400_000n
			});
		});
	});
});

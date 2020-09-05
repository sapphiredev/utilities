import { DeconstructedSnowflake, DiscordSnowflake } from '../../src';

describe('Discord Snowflakes', () => {
	describe('Generate', () => {
		test('GIVEN basic code THEN generates snowflake', () => {
			const testID = '661720242585735168';
			const snowflake = new DiscordSnowflake();
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testID);
		});

		test('GIVEN basic code THEN generates snowflake using static method', () => {
			const testID = '661720242585735168';
			const snow = DiscordSnowflake.generate();

			expect(snow.toString()).toBe(testID);
		});
	});

	describe('Decode', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const flake = DiscordSnowflake.deconstruct('661720242585735168');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 661720242585735168n,
				timestamp: 1577836800000n,
				workerID: 1n,
				processID: 1n,
				increment: 0n,
				epoch: 1420070400000n
			});
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const flake = DiscordSnowflake.deconstruct(661720242585735168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 661720242585735168n,
				timestamp: 1577836800000n,
				workerID: 1n,
				processID: 1n,
				increment: 0n,
				epoch: 1420070400000n
			});
		});
	});
});

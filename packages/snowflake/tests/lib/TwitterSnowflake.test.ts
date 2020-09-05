import { DeconstructedSnowflake, TwitterSnowflake } from '../../src';

describe('Twitter Snowflakes', () => {
	describe('Generate', () => {
		test('GIVEN basic code THEN generates snowflake', () => {
			const testID = '1823945883910279168';
			const snowflake = new TwitterSnowflake();
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testID);
		});

		test('GIVEN basic code THEN generates snowflake using static method', () => {
			const testID = '1823945883910279168';
			const snow = TwitterSnowflake.generate();

			expect(snow.toString()).toBe(testID);
		});
	});

	describe('Decode', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const flake = TwitterSnowflake.deconstruct('1823945883910279168');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 1823945883910279168n,
				timestamp: 1577836800000n,
				workerID: 1n,
				processID: 1n,
				increment: 0n,
				epoch: 1142974214000n
			});
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const flake = TwitterSnowflake.deconstruct(1823945883910279168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 1823945883910279168n,
				timestamp: 1577836800000n,
				workerID: 1n,
				processID: 1n,
				increment: 0n,
				epoch: 1142974214000n
			});
		});
	});
});

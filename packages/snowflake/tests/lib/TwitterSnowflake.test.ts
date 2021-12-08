import { DeconstructedSnowflake, TwitterSnowflake } from '../../src';

describe('Twitter Snowflakes', () => {
	beforeAll(() => {
		jest.useFakeTimers('modern');
		jest.setSystemTime(new Date('2020-01-01T00:00:00.000+00:00'));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	describe('Generate', () => {
		test('GIVEN basic code THEN generates snowflake', () => {
			const testId = '1823945883910148096';
			const snow = TwitterSnowflake.generate();

			expect(snow.toString()).toBe(testId);
		});
	});

	describe('Decode', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const flake = TwitterSnowflake.deconstruct('1823945883910279168');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 1823945883910279168n,
				timestamp: 1577836800000n,
				workerId: 1n,
				processId: 1n,
				increment: 0n,
				epoch: 1142974214000n
			});
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const flake = TwitterSnowflake.deconstruct(1823945883910279168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 1823945883910279168n,
				timestamp: 1577836800000n,
				workerId: 1n,
				processId: 1n,
				increment: 0n,
				epoch: 1142974214000n
			});
		});
	});
});

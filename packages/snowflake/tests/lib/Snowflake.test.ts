import { DeconstructedSnowflake, Snowflake } from '../../src';

// 2020-01-01
const sampleEpoch = 1577836800000n;

describe('Snowflake', () => {
	beforeAll(() => {
		jest.useFakeTimers('modern');
		jest.setSystemTime(new Date('2020-01-01T00:00:00.000+00:00'));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	describe('Generate', () => {
		test('GIVEN timestamp as number THEN returns predefined snowflake', () => {
			const testID = '3971046231244935168';
			const testTimestamp = 2524608000000;
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testTimestamp });

			expect(snow.toString()).toBe(testID);
		});

		test('GIVEN timestamp as Date THEN returns predefined snowflake', () => {
			const testID = '3971046231244935168';
			const testDate = new Date(2524608000000);
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testDate });

			expect(snow.toString()).toBe(testID);
		});

		test('GIVEN timestamp as Date and increment higher than 4095n THEN returns predefined snowflake', () => {
			const testID = '3971046231244935168';
			const testDate = new Date(2524608000000);
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testDate, increment: 5000n });

			expect(snow.toString()).toBe(testID);
		});

		test('GIVEN empty object options THEN returns predefined snowflake', () => {
			const testID = '135168';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({});

			expect(snow.toString()).toBe(testID);
		});

		test('GIVEN no options THEN returns predefined snowflake', () => {
			const testID = '135168';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({});

			expect(snow.toString()).toBe(testID);
		});

		test('GIVEN timestamp as NaN THEN returns error', () => {
			const snowflake = new Snowflake(sampleEpoch);
			expect(() => snowflake.generate({ timestamp: NaN })).toThrowError('"timestamp" argument must be a number, BigInt or Date (received NaN)');
		});

		test('GIVEN timestamp as boolean THEN returns error', () => {
			const snowflake = new Snowflake(sampleEpoch);
			// @ts-expect-error testing fail case
			expect(() => snowflake.generate({ timestamp: true })).toThrowError(
				'"timestamp" argument must be a number, BigInt or Date (received boolean)'
			);
		});

		test('GIVEN multiple generate calls THEN generates distinct IDs', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const arrayOf10Snowflakes = [
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate(),
				snowflake.generate()
			];

			const setOf10Snowflakes = new Set(arrayOf10Snowflakes);

			// Validate that there are no duplicate IDs
			expect(setOf10Snowflakes.size).toBe(arrayOf10Snowflakes.length);
		});
	});

	describe('Deconstruct', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.deconstruct('3971046231244935169');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 3971046231244935169n,
				timestamp: 2524608000000n,
				workerID: 1n,
				processID: 1n,
				increment: 1n,
				epoch: 1577836800000n
			});
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.deconstruct(3971046231244935168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 3971046231244935168n,
				timestamp: 2524608000000n,
				workerID: 1n,
				processID: 1n,
				increment: 0n,
				epoch: 1577836800000n
			});
		});
	});

	describe('Decode', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.decode('3971046231244935169');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 3971046231244935169n,
				timestamp: 2524608000000n,
				workerID: 1n,
				processID: 1n,
				increment: 1n,
				epoch: 1577836800000n
			});
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.decode(3971046231244935168n);

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 3971046231244935168n,
				timestamp: 2524608000000n,
				workerID: 1n,
				processID: 1n,
				increment: 0n,
				epoch: 1577836800000n
			});
		});
	});
});

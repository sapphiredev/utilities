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
			const testId = '3971046231244804096';
			const testTimestamp = 2524608000000;
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testTimestamp });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN timestamp as Date THEN returns predefined snowflake', () => {
			const testId = '3971046231244804096';
			const testDate = new Date(2524608000000);
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testDate });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN timestamp as Date and increment higher than 4095n THEN returns predefined snowflake', () => {
			const testId = '3971046231244804096';
			const testDate = new Date(2524608000000);
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ timestamp: testDate, increment: 5000n });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN empty object options THEN returns predefined snowflake', () => {
			const testId = '4096';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({});

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN no options THEN returns predefined snowflake', () => {
			const testId = '4096';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({});

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN timestamp as NaN THEN returns error', () => {
			const bigIntNaNErrorMessage = (() => {
				try {
					BigInt(NaN);
					throw new RangeError('');
				} catch (error) {
					return (error as RangeError).message;
				}
			})();

			const snowflake = new Snowflake(sampleEpoch);
			expect(() => snowflake.generate({ timestamp: NaN })).toThrowError(bigIntNaNErrorMessage);
		});

		test('GIVEN timestamp as boolean THEN returns error', () => {
			const snowflake = new Snowflake(sampleEpoch);
			// @ts-expect-error testing fail case
			expect(() => snowflake.generate({ timestamp: true })).toThrowError(
				'"timestamp" argument must be a number, bigint, or Date (received boolean)'
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

		test('GIVEN overflowing processId THEN generates ID with truncated processId', () => {
			const testId = '106496';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ processId: 0b1111_1010n });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN overflowing workerId THEN generates ID with truncated workerId', () => {
			const testId = '3411968';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ workerId: 0b1111_1010n });

			expect(snow.toString()).toBe(testId);
		});
	});

	describe('Deconstruct', () => {
		test('GIVEN id as string THEN returns data about snowflake', () => {
			const snowflake = new Snowflake(sampleEpoch);

			const flake = snowflake.deconstruct('3971046231244935169');

			expect(flake).toStrictEqual<DeconstructedSnowflake>({
				id: 3971046231244935169n,
				timestamp: 2524608000000n,
				workerId: 1n,
				processId: 1n,
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
				workerId: 1n,
				processId: 1n,
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
				workerId: 1n,
				processId: 1n,
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
				workerId: 1n,
				processId: 1n,
				increment: 0n,
				epoch: 1577836800000n
			});
		});
	});
});

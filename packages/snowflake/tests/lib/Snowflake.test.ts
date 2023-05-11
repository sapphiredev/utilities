import { Snowflake, type DeconstructedSnowflake } from '../../src';

// 2020-01-01
const sampleEpoch = 1577836800000n;

describe('Snowflake', () => {
	beforeAll(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2020-01-01T00:00:00.000+00:00'));
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	describe('processId', () => {
		test('GIVEN default THEN returns 1n', () => {
			const snowflake = new Snowflake(sampleEpoch);
			expect(snowflake.processId).toBe(1n);
		});

		test.each([15, 15n])('GIVEN valid value (%s) THEN returns same value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.processId = value;
			expect(snowflake.processId).toBe(15n);
		});

		test.each([4200, 4200n])('GIVEN out-of-range value (%s) THEN returns masked value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.processId = value;
			expect(snowflake.processId).toBe(8n);
		});
	});

	describe('workerId', () => {
		test('GIVEN default THEN returns 0n', () => {
			const snowflake = new Snowflake(sampleEpoch);
			expect(snowflake.workerId).toBe(0n);
		});

		test.each([15, 15n])('GIVEN valid value (%s) THEN returns same value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.workerId = value;
			expect(snowflake.workerId).toBe(15n);
		});

		test.each([4200, 4200n])('GIVEN out-of-range value (%s) THEN returns masked value as bigint', (value) => {
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.workerId = value;
			expect(snowflake.workerId).toBe(8n);
		});
	});

	describe('epoch', () => {
		test.each([sampleEpoch, Number(sampleEpoch), new Date(Number(sampleEpoch))])('GIVEN %s THEN returns 1577836800000n', (value) => {
			const snowflake = new Snowflake(value);
			expect(snowflake.epoch).toBe(sampleEpoch);
		});
	});

	describe('generate', () => {
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

		test('GIVEN empty object options THEN returns predefined snowflake', () => {
			const testId = '4096';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN no options THEN returns predefined snowflake', () => {
			const testId = '4096';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate();

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

		test('GIVEN timestamp as Date and increment lower than 0n THEN returns predefined snowflake', () => {
			const testId = '8191';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ increment: -1n });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN timestamp as Date and increment higher than 4095n THEN returns predefined snowflake', () => {
			const testId = '6196';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ increment: 2100n });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN timestamp as Date and increment higher than 4095n THEN returns predefined snowflake', () => {
			const testId = '5000';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ increment: 5000n });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN overflowing processId THEN generates ID with truncated processId', () => {
			const testId = '106496';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ processId: 0b1111_1010n });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN overflowing default processId THEN generates ID with truncated processId', () => {
			const testId = '106496';
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.processId = 0b1111_1010n;
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN overflowing workerId THEN generates ID with truncated workerId', () => {
			const testId = '3411968';
			const snowflake = new Snowflake(sampleEpoch);
			const snow = snowflake.generate({ workerId: 0b1111_1010n });

			expect(snow.toString()).toBe(testId);
		});

		test('GIVEN overflowing default workerId THEN generates ID with truncated workerId', () => {
			const testId = '3411968';
			const snowflake = new Snowflake(sampleEpoch);
			snowflake.workerId = 0b1111_1010n;
			const snow = snowflake.generate();

			expect(snow.toString()).toBe(testId);
		});

		describe('increment overrides', () => {
			const IncrementSymbol = Object.getOwnPropertySymbols(new Snowflake(sampleEpoch)).find(
				(s) => s.description === '@sapphire/snowflake.increment'
			);

			if (!IncrementSymbol) throw new TypeError('Could not find IncrementSymbol');

			test('GIVEN near-limit THEN it reaches limit', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, 4094n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('8190');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(4095n);
			});

			test('GIVEN limit THEN it cycles to 0', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, 4095n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('8191');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(0n);
			});

			test('GIVEN over-limit THEN it cycles to 0', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, 4096n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('4096');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(1n);
			});

			test('GIVEN under-limit THEN it cycles to 0', () => {
				const snowflake = new Snowflake(sampleEpoch);
				Reflect.set(snowflake, IncrementSymbol, -1n);
				const snow = snowflake.generate();

				expect(snow.toString()).toBe('8191');
				expect(Reflect.get(snowflake, IncrementSymbol)).toBe(0n);
			});
		});
	});

	describe('deconstruct', () => {
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

	describe('decode', () => {
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

	describe('timestampFrom', () => {
		const snowflake = new Snowflake(sampleEpoch);

		test('GIVEN id as string THEN returns data about snowflake', () => {
			const timestamp = snowflake.timestampFrom('3971046231244935169');
			expect(timestamp).toBe(2524608000000);
		});

		test('GIVEN id as bigint THEN returns data about snowflake', () => {
			const timestamp = snowflake.timestampFrom(3971046231244935168n);
			expect(timestamp).toBe(2524608000000);
		});
	});

	describe.each([
		[String, String],
		[String, BigInt],
		[BigInt, String],
		[BigInt, BigInt]
	])('compare', (ctorA, ctorB) => {
		test.each([
			[ctorA(737141877803057244n), ctorB(254360814063058944n), 1],
			[ctorA(1737141877803057244n), ctorB(254360814063058944n), 1],
			[ctorA(737141877803057244n), ctorB(737141877803057244n), 0],
			[ctorA(254360814063058944n), ctorB(737141877803057244n), -1],
			[ctorA(254360814063058944n), ctorB(1737141877803057244n), -1]
		])('GIVEN %o and %o THEN returns %d', (a, b, expected) => {
			expect(Snowflake.compare(a, b)).toBe(expected);
		});
	});
});

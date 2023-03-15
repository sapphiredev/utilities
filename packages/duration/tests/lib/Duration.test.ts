import { Duration, Time } from '../../src';

describe('Duration', () => {
	describe('units', () => {
		function expectDurationUnits(duration: Duration, units: Partial<Record<keyof Duration, number>> = {}) {
			expect(duration.nanoseconds).toEqual(units.nanoseconds ?? 0);
			expect(duration.microseconds).toEqual(units.microseconds ?? 0);
			expect(duration.milliseconds).toEqual(units.milliseconds ?? 0);
			expect(duration.seconds).toEqual(units.seconds ?? 0);
			expect(duration.minutes).toEqual(units.minutes ?? 0);
			expect(duration.hours).toEqual(units.hours ?? 0);
			expect(duration.days).toEqual(units.days ?? 0);
			expect(duration.weeks).toEqual(units.weeks ?? 0);
			expect(duration.months).toEqual(units.months ?? 0);
			expect(duration.years).toEqual(units.years ?? 0);
		}

		test.each(['0ns', '0us', '0μs', '0ms', '0s', '0m', '0h', '0d', '0w', '0mo', '0yr'])('GIVEN %s THEN shows 0ms', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(0);
			expectDurationUnits(duration, {});
		});

		test.each(['a nanosecond', '1ns'])('GIVEN %s THEN shows 1ns', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Nanosecond);
			expectDurationUnits(duration, { nanoseconds: 1 });
		});

		test.each(['a microsecond', '1us', '1μs'])('GIVEN %s THEN shows 1μs', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Microsecond);
			expectDurationUnits(duration, { microseconds: 1 });
		});

		test.each(['a millisecond', '1ms'])('GIVEN %s THEN shows 1ms', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Millisecond);
			expectDurationUnits(duration, { milliseconds: 1 });
		});

		test.each(['a second', '1s'])('GIVEN %s THEN shows 1s', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Second);
			expectDurationUnits(duration, { seconds: 1 });
		});

		test.each(['a minute', '1m'])('GIVEN %s THEN shows 1m', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Minute);
			expectDurationUnits(duration, { minutes: 1 });
		});

		test.each(['a hour', '1h'])('GIVEN %s THEN shows 1h', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Hour);
			expectDurationUnits(duration, { hours: 1 });
		});

		test.each(['a day', '1d'])('GIVEN %s THEN shows 1d', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Day);
			expectDurationUnits(duration, { days: 1 });
		});

		test.each(['a week', '1w'])('GIVEN %s THEN shows 1w', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Week);
			expectDurationUnits(duration, { weeks: 1 });
		});

		test.each(['a month', '1mo'])('GIVEN %s THEN shows 1mo', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Month);
			expectDurationUnits(duration, { months: 1 });
		});

		test.each(['a year', '1yr'])('GIVEN %s THEN shows 1yr', (pattern) => {
			const duration = new Duration(pattern);
			expect(duration.offset).toEqual(Time.Year);
			expectDurationUnits(duration, { years: 1 });
		});
	});

	test('GIVEN invalid duration THEN show NaN', () => {
		const duration = new Duration('foo');
		expect(duration.offset).toEqual(NaN);
	});

	test('GIVEN duration with offset, THEN dateFrom is valid', () => {
		const duration = new Duration('a second');
		const date = new Date();
		expect(duration.dateFrom(date)).toEqual(new Date(date.getTime() + Time.Second));
	});
});

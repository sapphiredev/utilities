import { Duration } from '../../src';

describe('Duration', () => {
	test('GIVEN duration with an offset of 1s, THEN shows 1000ms', () => {
		const duration = new Duration('a second');
		expect(duration.offset).toEqual(1000);
	});

	test('GIVEN invalid duration THEN show zero offset', () => {
		const duration = new Duration('foo');
		expect(duration.offset).toEqual(0);
	});

	test('GIVEN duration with offset, THEN dateFrom is valid', () => {
		const duration = new Duration('a second');
		const date = new Date();
		expect(duration.dateFrom(date)).toEqual(new Date(date.getTime() + 1000));
	});

	test('GIVEN date 1 second ahead, THEN shows in seconds', () => {
		const duration = new Duration('a second');
		expect(Duration.toNow(duration.fromNow.valueOf(), true)).toBe('in seconds');
	});

	test('GIVEN date 62 seconds ahead, THEN shows a minute', () => {
		const duration = new Duration('62s');
		expect(Duration.toNow(duration.fromNow)).toBe('a minute');
	});

	test('GIVEN date 2 minutes ahead, THEN show 2 minutes', () => {
		const duration = new Duration('2mins');
		expect(Duration.toNow(duration.fromNow)).toBe('2 minutes');
	});

	test('GIVEN date 61 minutes ahead, THEN show an hour', () => {
		const duration = new Duration('61m');
		expect(Duration.toNow(duration.fromNow)).toBe('an hour');
	});

	test('GIVEN date 2 hours ahead, THEN show 2 hours', () => {
		const duration = new Duration('2h');
		expect(Duration.toNow(duration.fromNow)).toBe('2 hours');
	});

	test('GIVEN date 25 hours ahead, THEN show a day', () => {
		const duration = new Duration('25hrs');
		expect(Duration.toNow(duration.fromNow)).toBe('a day');
	});

	test('GIVEN date 2 days ahead, THEN show 2 days', () => {
		const duration = new Duration('2d');
		expect(Duration.toNow(duration.fromNow)).toBe('2 days');
	});

	test('GIVEN date 30 days ahead, THEN show a month', () => {
		const duration = new Duration('30days');
		expect(Duration.toNow(duration.fromNow)).toBe('a month');
	});

	test('GIVEN date 2 months ahead, THEN show 2 months', () => {
		const duration = new Duration('2 months');
		expect(Duration.toNow(duration.fromNow)).toBe('2 months');
	});

	test('GIVEN date 13 months ahead, THEN show a year', () => {
		const duration = new Duration('13 months');
		expect(Duration.toNow(duration.fromNow)).toBe('a year');
	});

	test('GIVEN date 3 years ahead, THEN show 3 years', () => {
		const duration = new Duration('3y');
		expect(Duration.toNow(duration.fromNow)).toBe('3 years');
	});
});

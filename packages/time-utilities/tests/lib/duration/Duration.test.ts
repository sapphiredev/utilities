import { Duration } from '../../../src';

describe('Duration', () => {
	test('GIVEN duration with an offset of 0s, THEN shows 0ms', () => {
		const duration = new Duration('0s');
		expect(duration.offset).toEqual(0);
	});

	test('GIVEN duration with an offset of 1s, THEN shows 1000ms', () => {
		const duration = new Duration('a second');
		expect(duration.offset).toEqual(1000);
	});

	test('GIVEN invalid duration THEN show NaN', () => {
		const duration = new Duration('foo');
		expect(duration.offset).toEqual(NaN);
	});

	test('GIVEN duration with offset, THEN dateFrom is valid', () => {
		const duration = new Duration('a second');
		const date = new Date();
		expect(duration.dateFrom(date)).toEqual(new Date(date.getTime() + 1000));
	});
});

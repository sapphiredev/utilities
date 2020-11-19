/* eslint-disable @typescript-eslint/restrict-plus-operands, @typescript-eslint/naming-convention */
import { DurationFormatter, Time } from '../../../src';

const formatter = new DurationFormatter();

function durationImpl(time: number, precision?: number) {
	return formatter.format(time, precision);
}

describe('FriendlyDuration', () => {
	test('GIVEN 1 millisecond w/o precision THEN shows 0 seconds', () => {
		expect(durationImpl(1)).toEqual('0 seconds');
	});

	test('GIVEN 1000 millisecond w/ precision THEN shows 1 second', () => {
		expect(durationImpl(1000, 5)).toEqual('1 second');
	});

	test('GIVEN 1 day, 3 hours and 2 minutes w/o precision THEN shows 1 day 3 hours and 2 minutes', () => {
		expect(durationImpl(Time.Day + Time.Hour * 3 + Time.Minute * 2)).toEqual('1 day 3 hours 2 minutes');
	});

	test('GIVEN 1 day, 3 hours and 2 minutes w/ precision of 2 THEN shows 1 day and 3 hours', () => {
		expect(durationImpl(Time.Day + Time.Hour * 3 + Time.Minute * 2, 2)).toEqual('1 day 3 hours');
	});

	test('GIVEN negative duration THEN prepends hyphen', () => {
		expect(durationImpl(Time.Day * -1)).toEqual('-1 day');
	});

	test('GIVEN durations higher than 1 THEN shows plurals', () => {
		expect(durationImpl(Time.Day * 2 + Time.Hour * 2)).toEqual('2 days 2 hours');
	});
});

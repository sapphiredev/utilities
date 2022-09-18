import type { DurationFormatAssetsTime, DurationFormatSeparators } from './DurationFormatter';

export enum Time {
	Millisecond = 1,
	Second = 1000,
	Minute = 1000 * 60,
	Hour = 1000 * 60 * 60,
	Day = 1000 * 60 * 60 * 24,
	Month = 1000 * 60 * 60 * 24 * (365 / 12),
	Year = 1000 * 60 * 60 * 24 * 365
}

/**
 * The supported time types
 */
export enum TimeTypes {
	Second = 'second',
	Minute = 'minute',
	Hour = 'hour',
	Day = 'day',
	Week = 'week',
	Month = 'month',
	Year = 'year'
}

export const DEFAULT_UNITS: DurationFormatAssetsTime = {
	[TimeTypes.Year]: {
		1: 'year',
		DEFAULT: 'years'
	},
	[TimeTypes.Month]: {
		1: 'month',
		DEFAULT: 'months'
	},
	[TimeTypes.Week]: {
		1: 'week',
		DEFAULT: 'weeks'
	},
	[TimeTypes.Day]: {
		1: 'day',
		DEFAULT: 'days'
	},
	[TimeTypes.Hour]: {
		1: 'hour',
		DEFAULT: 'hours'
	},
	[TimeTypes.Minute]: {
		1: 'minute',
		DEFAULT: 'minutes'
	},
	[TimeTypes.Second]: {
		1: 'second',
		DEFAULT: 'seconds'
	}
};

export const DEFAULT_SEPARATORS: DurationFormatSeparators = {
	left: ' ',
	right: ' '
};

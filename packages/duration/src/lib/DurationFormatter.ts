import { DEFAULT_SEPARATORS, DEFAULT_UNITS, TimeTypes } from './constants';

/**
 * The duration of each time type in milliseconds
 */
const kTimeDurations: readonly [TimeTypes, number][] = [
	[TimeTypes.Year, 31536000000],
	// 29.53059 days is the official duration of a month: https://en.wikipedia.org/wiki/Month
	[TimeTypes.Month, 2628000000],
	[TimeTypes.Week, 1000 * 60 * 60 * 24 * 7],
	[TimeTypes.Day, 1000 * 60 * 60 * 24],
	[TimeTypes.Hour, 1000 * 60 * 60],
	[TimeTypes.Minute, 1000 * 60],
	[TimeTypes.Second, 1000]
];

/**
 * Display the duration
 * @param duration The duration in milliseconds to parse and display
 * @param assets The language assets
 */
export class DurationFormatter {
	public constructor(public units: DurationFormatAssetsTime = DEFAULT_UNITS) {}

	public format(
		duration: number,
		precision = 7,
		{
			left: leftSeparator = DEFAULT_SEPARATORS.left,
			right: rightSeparator = DEFAULT_SEPARATORS.right
		}: DurationFormatSeparators = DEFAULT_SEPARATORS
	) {
		const output: string[] = [];
		const negative = duration < 0;
		if (negative) duration *= -1;

		for (const [type, timeDuration] of kTimeDurations) {
			const division = duration / timeDuration;
			if (division < 1) continue;

			const floored = Math.floor(division);
			duration -= floored * timeDuration;
			output.push(addUnit(floored, this.units[type], leftSeparator!));

			// If the output has enough precision, break
			if (output.length >= precision) break;
		}

		return `${negative ? '-' : ''}${output.join(rightSeparator) || addUnit(0, this.units.second, leftSeparator!)}`;
	}
}

/**
 * Adds an unit, if non zero
 * @param time The duration of said unit
 * @param unit The unit language assets
 */
function addUnit(time: number, unit: DurationFormatAssetsUnit, separator: string) {
	if (Reflect.has(unit, time)) return `${time}${separator}${Reflect.get(unit, time)}`;
	return `${time}${separator}${unit.DEFAULT}`;
}

export interface DurationFormatSeparators {
	left?: string;
	right?: string;
}

export interface DurationFormatAssetsUnit extends Record<number, string> {
	DEFAULT: string;
}

export interface DurationFormatAssetsTime {
	[TimeTypes.Second]: DurationFormatAssetsUnit;
	[TimeTypes.Minute]: DurationFormatAssetsUnit;
	[TimeTypes.Hour]: DurationFormatAssetsUnit;
	[TimeTypes.Day]: DurationFormatAssetsUnit;
	[TimeTypes.Week]: DurationFormatAssetsUnit;
	[TimeTypes.Month]: DurationFormatAssetsUnit;
	[TimeTypes.Year]: DurationFormatAssetsUnit;
}

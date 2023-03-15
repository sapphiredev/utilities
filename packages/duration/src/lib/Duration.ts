import { Time } from './constants';

const tokens = new Map([
	['nanosecond', Time.Nanosecond],
	['nanoseconds', Time.Nanosecond],
	['ns', Time.Nanosecond],

	['microsecond', Time.Microsecond],
	['microseconds', Time.Microsecond],
	['μs', Time.Microsecond],
	['us', Time.Microsecond],

	['millisecond', Time.Millisecond],
	['milliseconds', Time.Millisecond],
	['ms', Time.Millisecond],

	['second', Time.Second],
	['seconds', Time.Second],
	['sec', Time.Second],
	['secs', Time.Second],
	['s', Time.Second],

	['minute', Time.Minute],
	['minutes', Time.Minute],
	['min', Time.Minute],
	['mins', Time.Minute],
	['m', Time.Minute],

	['hour', Time.Hour],
	['hours', Time.Hour],
	['hr', Time.Hour],
	['hrs', Time.Hour],
	['h', Time.Hour],

	['day', Time.Day],
	['days', Time.Day],
	['d', Time.Day],

	['week', Time.Week],
	['weeks', Time.Week],
	['wk', Time.Week],
	['wks', Time.Week],
	['w', Time.Week],

	['month', Time.Month],
	['months', Time.Month],
	['b', Time.Month],
	['mo', Time.Month],

	['year', Time.Year],
	['years', Time.Year],
	['yr', Time.Year],
	['yrs', Time.Year],
	['y', Time.Year]
]);

const mappings = new Map([
	[Time.Nanosecond, 'nanoseconds'],
	[Time.Microsecond, 'microseconds'],
	[Time.Millisecond, 'milliseconds'],
	[Time.Second, 'seconds'],
	[Time.Minute, 'minutes'],
	[Time.Hour, 'hours'],
	[Time.Day, 'days'],
	[Time.Week, 'weeks'],
	[Time.Month, 'months'],
	[Time.Year, 'years']
] as const);

/**
 * Converts duration strings into ms and future dates
 */
export class Duration {
	/**
	 * The offset
	 */
	public offset: number;

	/**
	 * The amount of nanoseconds extracted from the text.
	 */
	public nanoseconds = 0;

	/**
	 * The amount of microseconds extracted from the text.
	 */
	public microseconds = 0;

	/**
	 * The amount of milliseconds extracted from the text.
	 */
	public milliseconds = 0;

	/**
	 * The amount of seconds extracted from the text.
	 */
	public seconds = 0;

	/**
	 * The amount of minutes extracted from the text.
	 */
	public minutes = 0;

	/**
	 * The amount of hours extracted from the text.
	 */
	public hours = 0;

	/**
	 * The amount of days extracted from the text.
	 */
	public days = 0;

	/**
	 * The amount of weeks extracted from the text.
	 */
	public weeks = 0;

	/**
	 * The amount of months extracted from the text.
	 */
	public months = 0;

	/**
	 * The amount of years extracted from the text.
	 */
	public years = 0;

	/**
	 * Create a new Duration instance
	 * @param pattern The string to parse
	 */
	public constructor(pattern: string) {
		let result = 0;
		let valid = false;

		pattern
			.toLowerCase()
			// ignore commas
			.replace(Duration.commaRegex, '')
			// a / an = 1
			.replace(Duration.aAndAnRegex, '1')
			// do math
			.replace(Duration.patternRegex, (_, i, units) => {
				const token = tokens.get(units);
				if (token !== undefined) {
					const n = Number(i);
					result += n * token;
					this[mappings.get(token)!] += n;
					valid = true;
				}
				return '';
			});

		this.offset = valid ? result : NaN;
	}

	/**
	 * Get the date from now
	 */
	public get fromNow(): Date {
		return this.dateFrom(new Date());
	}

	/**
	 * Get the date from
	 * @param date The Date instance to get the date from
	 */
	public dateFrom(date: Date): Date {
		return new Date(date.getTime() + this.offset);
	}

	/**
	 * The RegExp used for the pattern parsing
	 */
	private static readonly patternRegex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/gi;

	/**
	 * The RegExp used for removing commas
	 */
	private static readonly commaRegex = /,/g;

	/**
	 * The RegExp used for replacing a/an with 1
	 */
	private static readonly aAndAnRegex = /\ban?\b/gi;
}

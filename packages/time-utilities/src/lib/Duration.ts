/* eslint-disable @typescript-eslint/restrict-plus-operands */
const tokens = new Map([
	['nanosecond', 1 / 1e6],
	['nanoseconds', 1 / 1e6],
	['ns', 1 / 1e6],

	['millisecond', 1],
	['milliseconds', 1],
	['ms', 1],

	['second', 1000],
	['seconds', 1000],
	['sec', 1000],
	['secs', 1000],
	['s', 1000],

	['minute', 1000 * 60],
	['minutes', 1000 * 60],
	['min', 1000 * 60],
	['mins', 1000 * 60],
	['m', 1000 * 60],

	['hour', 1000 * 60 * 60],
	['hours', 1000 * 60 * 60],
	['hr', 1000 * 60 * 60],
	['hrs', 1000 * 60 * 60],
	['h', 1000 * 60 * 60],

	['day', 1000 * 60 * 60 * 24],
	['days', 1000 * 60 * 60 * 24],
	['d', 1000 * 60 * 60 * 24],

	['week', 1000 * 60 * 60 * 24 * 7],
	['weeks', 1000 * 60 * 60 * 24 * 7],
	['wk', 1000 * 60 * 60 * 24 * 7],
	['wks', 1000 * 60 * 60 * 24 * 7],
	['w', 1000 * 60 * 60 * 24 * 7],

	['month', 1000 * 60 * 60 * 24 * (365.25 / 12)],
	['months', 1000 * 60 * 60 * 24 * (365.25 / 12)],
	['b', 1000 * 60 * 60 * 24 * (365.25 / 12)],
	['mo', 1000 * 60 * 60 * 24 * (365.25 / 12)],

	['year', 1000 * 60 * 60 * 24 * 365.25],
	['years', 1000 * 60 * 60 * 24 * 365.25],
	['yr', 1000 * 60 * 60 * 24 * 365.25],
	['yrs', 1000 * 60 * 60 * 24 * 365.25],
	['y', 1000 * 60 * 60 * 24 * 365.25]
]);

/**
 * Converts duration strings into ms and future dates
 */
export class Duration {
	/**
	 * The offset
	 */
	public offset: number;

	/**
	 * Create a new Duration instance
	 * @param pattern The string to parse
	 */
	public constructor(pattern: string) {
		this.offset = Duration.parse(pattern.toLowerCase());
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
	private static readonly kPatternRegex = /(-?\d*\.?\d+(?:e[-+]?\d+)?)\s*([a-zμ]*)/gi;

	/**
	 * The RegExp used for removing commas
	 */
	private static readonly kCommaRegex = /,/g;

	/**
	 * The RegExp used for replacing a/an with 1
	 */
	private static readonly kAanRegex = /\ban?\b/gi;

	/**
	 * Parse the pattern
	 * @param pattern The pattern to parse
	 */
	private static parse(pattern: string): number {
		let result = 0;
		let valid = false;

		pattern
			// ignore commas
			.replace(Duration.kCommaRegex, '')
			// a / an = 1
			.replace(Duration.kAanRegex, '1')
			// do math
			.replace(Duration.kPatternRegex, (_, i, units) => {
				const token = tokens.get(units);
				if (token !== undefined) {
					result += Number(i) * token;
					valid = true;
				}
				return '';
			});

		return valid ? result : NaN;
	}
}

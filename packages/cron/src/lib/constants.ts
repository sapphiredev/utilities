export enum Time {
	Nanosecond = 1 / 1_000_000,
	Microsecond = 1 / 1000,
	Millisecond = 1,
	Second = 1000,
	Minute = Second * 60,
	Hour = Minute * 60,
	Day = Hour * 24,
	Week = Day * 7,
	Month = Day * (365 / 12),
	Year = Day * 365
}

export const partRegex = /^(?:(\*)|(\d+)(?:-(\d+))?)(?:\/(\d+))?$/;

export const wildcardRegex = /\bh\b|\B\?\B/g;

export const allowedNum = [
	[0, 59],
	[0, 23],
	[1, 31],
	[1, 12],
	[0, 6]
];

export const predefined = {
	'@annually': '0 0 1 1 *',
	'@yearly': '0 0 1 1 *',
	'@monthly': '0 0 1 * *',
	'@weekly': '0 0 * * 0',
	'@daily': '0 0 * * *',
	'@hourly': '0 * * * *'
} as const;

export const cronTokens = {
	jan: 1,
	feb: 2,
	mar: 3,
	apr: 4,
	may: 5,
	jun: 6,
	jul: 7,
	aug: 8,
	sep: 9,
	oct: 10,
	nov: 11,
	dec: 12,
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
} as const;

export const tokensRegex = new RegExp(Object.keys(cronTokens).join('|'), 'g');

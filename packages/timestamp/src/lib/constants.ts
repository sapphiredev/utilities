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

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const tokens = new Map<string, number>([
	['Y', 4],
	['Q', 1],
	['M', 4],
	['D', 4],
	['d', 4],
	['X', 1],
	['x', 1],
	['H', 2],
	['h', 2],
	['a', 1],
	['A', 1],
	['m', 2],
	['s', 2],
	['S', 3],
	['Z', 2],
	['l', 4],
	['L', 4],
	['T', 1],
	['t', 1]
]);

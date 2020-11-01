import { days, months, Time, tokens } from './constants';

interface TokenResolver {
	(time: Date): string;
}

const tokenResolvers = new Map<string, TokenResolver>([
	// Dates
	['Y', (time): string => String(time.getFullYear()).slice(2)],
	['YY', (time): string => String(time.getFullYear()).slice(2)],
	['YYY', (time): string => String(time.getFullYear())],
	['YYYY', (time): string => String(time.getFullYear())],
	['Q', (time): string => String((time.getMonth() + 1) / 3)],
	['M', (time): string => String(time.getMonth() + 1)],
	['MM', (time): string => String(time.getMonth() + 1).padStart(2, '0')],
	['MMM', (time): string => months[time.getMonth()]],
	['MMMM', (time): string => months[time.getMonth()]],
	['D', (time): string => String(time.getDate())],
	['DD', (time): string => String(time.getDate()).padStart(2, '0')],
	['DDD', (time): string => String(Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / Time.Day))],
	['DDDD', (time): string => String(Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / Time.Day))],
	[
		'd',
		(time): string => {
			const day = String(time.getDate());
			if (day !== '11' && day.endsWith('1')) return `${day}st`;
			if (day !== '12' && day.endsWith('2')) return `${day}nd`;
			if (day !== '13' && day.endsWith('3')) return `${day}rd`;
			return `${day}th`;
		}
	],
	['dd', (time): string => days[time.getDay()].slice(0, 2)],
	['ddd', (time): string => days[time.getDay()].slice(0, 3)],
	['dddd', (time): string => days[time.getDay()]],
	['X', (time): string => String(time.valueOf() / Time.Second)],
	['x', (time): string => String(time.valueOf())],

	// Locales
	['H', (time): string => String(time.getHours())],
	['HH', (time): string => String(time.getHours()).padStart(2, '0')],
	['h', (time): string => String(time.getHours() % 12 || 12)],
	['hh', (time): string => String(time.getHours() % 12 || 12).padStart(2, '0')],
	['a', (time): string => (time.getHours() < 12 ? 'am' : 'pm')],
	['A', (time): string => (time.getHours() < 12 ? 'AM' : 'PM')],
	['m', (time): string => String(time.getMinutes())],
	['mm', (time): string => String(time.getMinutes()).padStart(2, '0')],
	['s', (time): string => String(time.getSeconds())],
	['ss', (time): string => String(time.getSeconds()).padStart(2, '0')],
	['S', (time): string => String(time.getMilliseconds())],
	['SS', (time): string => String(time.getMilliseconds()).padStart(2, '0')],
	['SSS', (time): string => String(time.getMilliseconds()).padStart(3, '0')],
	[
		'T',
		(time): string => `${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`
	],
	[
		't',
		(time): string =>
			`${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')} ${
				time.getHours() < 12 ? 'am' : 'pm'
			}`
	],
	[
		'L',
		(time): string => `${String(time.getMonth() + 1).padStart(2, '0')}/${String(time.getDate()).padStart(2, '0')}/${String(time.getFullYear())}`
	],
	['l', (time): string => `${String(time.getMonth() + 1)}/${String(time.getDate()).padStart(2, '0')}/${String(time.getFullYear())}`],
	['LL', (time): string => `${months[time.getMonth()]} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())}`],
	['ll', (time): string => `${months[time.getMonth()].slice(0, 3)} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())}`],
	[
		'LLL',
		(time): string =>
			`${months[time.getMonth()]} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())} ${String(
				time.getHours() % 12 || 12
			)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`
	],
	[
		'lll',
		(time): string =>
			`${months[time.getMonth()].slice(0, 3)} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())} ${String(
				time.getHours() % 12 || 12
			)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`
	],
	[
		'LLLL',
		(time): string =>
			`${days[time.getDay()]}, ${months[time.getMonth()]} ${String(time.getDate()).padStart(2, '0')}, ${String(time.getFullYear())} ${String(
				time.getHours() % 12 || 12
			)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`
	],
	[
		'llll',
		(time): string =>
			`${days[time.getDay()].slice(0, 3)} ${months[time.getMonth()].slice(0, 3)} ${String(time.getDate()).padStart(2, '0')}, ${String(
				time.getFullYear()
			)} ${String(time.getHours() % 12 || 12)}:${String(time.getMinutes()).padStart(2, '0')} ${time.getHours() < 12 ? 'AM' : 'PM'}`
	],
	[
		'Z',
		(time): string => {
			const offset = time.getTimezoneOffset();
			const unsigned = offset >= 0;
			const absolute = Math.abs(offset);
			/* istanbul ignore next: whether it's signed or unsigned, depends on where the machine is, I cannot control this. */
			return `${unsigned ? '+' : '-'}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
		}
	],
	[
		'ZZ',
		(time): string => {
			const offset = time.getTimezoneOffset();
			const unsigned = offset >= 0;
			const absolute = Math.abs(offset);
			/* istanbul ignore next: whether it's signed or unsigned, depends on where the machine is, I cannot control this. */
			return `${unsigned ? '+' : '-'}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
		}
	]
]);
/* eslint-enable max-len */

export type TimeResolvable = Date | number | string;

export interface TimestampTemplateEntry {
	type: string;
	content: string | null;
}

/**
 * Timestamp class, parses the pattern once, displays the desired Date or UNIX timestamp with the selected pattern.
 */
export class Timestamp {
	/**
	 * The raw pattern
	 * @since 1.0.0
	 */
	public pattern: string;

	/**
	 * @since 1.0.0
	 */
	private template: TimestampTemplateEntry[];

	/**
	 * Starts a new Timestamp and parses the pattern.
	 * @since 1.0.0
	 * @param pattern The pattern to parse
	 */
	public constructor(pattern: string) {
		this.pattern = pattern;
		this.template = Timestamp.parse(pattern);
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 1.0.0
	 * @param time The time to display
	 */
	public display(time: TimeResolvable = new Date()): string {
		return Timestamp.display(this.template, time);
	}

	/**
	 * Display the current date utc with the current pattern.
	 * @since 1.0.0
	 * @param time The time to display in utc
	 */
	public displayUTC(time: TimeResolvable): string {
		return Timestamp.display(this.template, Timestamp.utc(time));
	}

	/**
	 * Edits the current pattern.
	 * @since 1.0.0
	 * @param pattern The new pattern for this instance
	 * @chainable
	 */
	public edit(pattern: string): this {
		this.pattern = pattern;
		this.template = Timestamp.parse(pattern);
		return this;
	}

	/**
	 * Defines the toString behavior of Timestamp.
	 */
	public toString(): string {
		return this.display();
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 1.0.0
	 * @param pattern The pattern to parse
	 * @param time The time to display
	 */
	public static displayArbitrary(pattern: string, time: TimeResolvable = new Date()): string {
		return Timestamp.display(Timestamp.parse(pattern), time);
	}

	/**
	 * Display the current date utc with the current pattern.
	 * @since 1.0.0
	 * @param pattern The pattern to parse
	 * @param time The time to display
	 */
	public static displayUTCArbitrary(pattern: string, time: TimeResolvable = new Date()): string {
		return Timestamp.display(Timestamp.parse(pattern), Timestamp.utc(time));
	}

	/**
	 * Creates a UTC Date object to work with.
	 * @since 1.0.0
	 * @param time The date to convert to utc
	 */
	public static utc(time: Date | number | string = new Date()): Date {
		time = Timestamp.resolveDate(time);
		return new Date(time.valueOf() + time.getTimezoneOffset() * 60000);
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 1.0.0
	 * @param template The pattern to parse
	 * @param time The time to display
	 */
	private static display(template: TimestampTemplateEntry[], time: Date | number | string): string {
		let output = '';
		const parsedTime = Timestamp.resolveDate(time);
		for (const { content, type } of template) output += content || tokenResolvers.get(type)!(parsedTime);
		return output;
	}

	/**
	 * Parses the pattern.
	 * @since 1.0.0
	 * @param pattern The pattern to parse
	 */
	private static parse(pattern: string): TimestampTemplateEntry[] {
		const template: TimestampTemplateEntry[] = [];
		for (let i = 0; i < pattern.length; i++) {
			let current = '';
			const currentChar = pattern[i];
			const tokenMax = tokens.get(currentChar);
			if (typeof tokenMax === 'number') {
				current += currentChar;
				while (pattern[i + 1] === currentChar && current.length < tokenMax) current += pattern[++i];
				template.push({ type: current, content: null });
			} else if (currentChar === '[') {
				while (i + 1 < pattern.length && pattern[i + 1] !== ']') current += pattern[++i];
				i++;
				template.push({ type: 'literal', content: current || '[' });
			} else {
				current += currentChar;
				while (i + 1 < pattern.length && !tokens.has(pattern[i + 1]) && pattern[i + 1] !== '[') current += pattern[++i];
				template.push({ type: 'literal', content: current });
			}
		}

		return template;
	}

	/**
	 * Resolves a date.
	 * @since 1.0.0
	 * @param time The time to parse
	 */
	private static resolveDate(time: TimeResolvable): Date {
		return time instanceof Date ? time : new Date(time);
	}
}

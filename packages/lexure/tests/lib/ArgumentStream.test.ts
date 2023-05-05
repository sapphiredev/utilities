import { Option, Result } from '@sapphire/result';
import { ArgumentStream, Lexer, Parser, PrefixedStrategy, WordParameter, type Parameter } from '../../src';

describe('ArgumentStream', () => {
	const parser = new Parser(new PrefixedStrategy(['--', '/'], ['=', ':']));
	const lexer = new Lexer({
		quotes: [
			['"', '"'],
			['“', '”'],
			['「', '」']
		]
	});

	describe('no parameters', () => {
		const results = parser.run(lexer.run(''));
		const stream = new ArgumentStream(results);

		test('GIVEN instance THEN yields initial state with correct values', () => {
			expect(stream.results).toBe(results);
			expect(stream.state).toStrictEqual({ used: new Set(), position: 0 });
			expect(stream.finished).toBe(true);
			expect(stream.length).toBe(0);
			expect(stream.remaining).toBe(0);
			expect(stream.used).toBe(0);
		});
	});

	describe('single', () => {
		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			expect<Option<string>>(stream.single()).toEqual(Option.none);
		});

		test('GIVEN one parameter THEN returns one', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1')));

			expect<Option<string>>(stream.single()).toEqual(Option.some('1'));
			expect<Option<string>>(stream.single()).toEqual(Option.none);
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1 2 3')));

			expect<Option<string>>(stream.single()).toEqual(Option.some('1'));
			expect<Option<string>>(stream.single()).toEqual(Option.some('2'));
			expect<Option<string>>(stream.single()).toEqual(Option.some('3'));
			expect<Option<string>>(stream.single()).toEqual(Option.none);
		});
	});

	describe('singleMap', () => {
		const parse = (value: string) => {
			const number = Number(value);
			return Number.isNaN(number) ? Option.none : Option.some(number);
		};
		type ReturnType = Option<number>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.none);
		});

		test('GIVEN one parameter THEN returns one', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1')));

			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.some(1));
			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.none);
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1 2 3')));

			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.some(1));
			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.some(2));
			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.some(3));
			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.none);
		});

		test('GIVEN an invalid parameter THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			expect<ReturnType>(stream.singleMap(parse)).toEqual(Option.none);
			expect(stream.state.position).toBe(0);
		});

		test('GIVEN an invalid parameter and useAnyways THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			expect<ReturnType>(stream.singleMap(parse, true)).toEqual(Option.none);
			expect(stream.state.position).toBe(1);
		});
	});

	describe('singleMapAsync', () => {
		const parse = (value: string) => {
			const number = Number(value);
			return Promise.resolve(Number.isNaN(number) ? Option.none : Option.some(number));
		};
		type ReturnType = Promise<Option<number>>;

		test('GIVEN no parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.none);
		});

		test('GIVEN one parameter THEN returns one', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1')));

			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.some(1));
			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.none);
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1 2 3')));

			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.some(1));
			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.some(2));
			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.some(3));
			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.none);
		});

		test('GIVEN an invalid parameter THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			await expect<ReturnType>(stream.singleMapAsync(parse)).resolves.toEqual(Option.none);
			expect(stream.state.position).toBe(0);
		});

		test('GIVEN an invalid parameter and useAnyways THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			await expect<ReturnType>(stream.singleMapAsync(parse, true)).resolves.toEqual(Option.none);
			expect(stream.state.position).toBe(1);
		});
	});

	describe('singleParse', () => {
		const parse = (value: string) => {
			const number = Number(value);
			return Number.isNaN(number) ? Result.err(`Could not parse ${value} to a number`) : Result.ok(number);
		};
		type ReturnType = Result<number, string | null>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.err(null));
		});

		test('GIVEN one parameter THEN returns one', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1')));

			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.ok(1));
			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.err(null));
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1 2 3')));

			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.ok(1));
			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.ok(2));
			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.ok(3));
			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.err(null));
		});

		test('GIVEN an invalid parameter THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			expect<ReturnType>(stream.singleParse(parse)).toEqual(Result.err('Could not parse a to a number'));
			expect(stream.state.position).toBe(0);
		});

		test('GIVEN an invalid parameter and useAnyways THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			expect<ReturnType>(stream.singleParse(parse, true)).toEqual(Result.err('Could not parse a to a number'));
			expect(stream.state.position).toBe(1);
		});
	});

	describe('singleParseAsync', () => {
		const parse = (value: string) => {
			const number = Number(value);
			return Promise.resolve(Number.isNaN(number) ? Result.err(`Could not parse ${value} to a number`) : Result.ok(number));
		};
		type ReturnType = Promise<Result<number, string | null>>;

		test('GIVEN no parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.err(null));
		});

		test('GIVEN one parameter THEN returns one', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1')));

			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.ok(1));
			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.err(null));
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('1 2 3')));

			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.ok(1));
			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.ok(2));
			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.ok(3));
			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.err(null));
		});

		test('GIVEN an invalid parameter THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			await expect<ReturnType>(stream.singleParseAsync(parse)).resolves.toEqual(Result.err('Could not parse a to a number'));
			expect(stream.state.position).toBe(0);
		});

		test('GIVEN an invalid parameter and useAnyways THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('a')));

			await expect<ReturnType>(stream.singleParseAsync(parse, true)).resolves.toEqual(Result.err('Could not parse a to a number'));
			expect(stream.state.position).toBe(1);
		});
	});

	describe('find', () => {
		const predicate = (value: string) => value.startsWith('a');
		type ReturnType = Option<string>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.find(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.find(cb)).toEqual(Option.some('aa'));
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			expect<ReturnType>(stream.find(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.find(cb)).toEqual(Option.some('aa'));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledTimes(1);
			cb.mockClear();

			expect<ReturnType>(stream.find(cb)).toEqual(Option.some('ac'));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
			cb.mockClear();

			expect<ReturnType>(stream.find(cb)).toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.find(cb)).toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('findAsync', () => {
		const predicate = (value: string) => Promise.resolve(value.startsWith('a'));
		type ReturnType = Promise<Option<string>>;

		test('GIVEN no parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findAsync(cb)).resolves.toEqual(Option.some('aa'));
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			await expect<ReturnType>(stream.findAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findAsync(cb)).resolves.toEqual(Option.some('aa'));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledTimes(1);
			cb.mockClear();

			await expect<ReturnType>(stream.findAsync(cb)).resolves.toEqual(Option.some('ac'));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
			cb.mockClear();

			await expect<ReturnType>(stream.findAsync(cb)).resolves.toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findAsync(cb)).resolves.toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('findMap', () => {
		const predicate = (value: string) => (value.startsWith('a') ? Option.some(value.repeat(2)) : Option.none);
		type ReturnType = Option<string>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findMap(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findMap(cb)).toEqual(Option.some('aaaa'));
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			expect<ReturnType>(stream.findMap(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findMap(cb)).toEqual(Option.some('aaaa'));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledTimes(1);
			cb.mockClear();

			expect<ReturnType>(stream.findMap(cb)).toEqual(Option.some('acac'));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
			cb.mockClear();

			expect<ReturnType>(stream.findMap(cb)).toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findMap(cb)).toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('findMapAsync', () => {
		const predicate = (value: string) => Promise.resolve(value.startsWith('a') ? Option.some(value.repeat(2)) : Option.none);
		type ReturnType = Promise<Option<string>>;

		test('GIVEN no parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findMapAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findMapAsync(cb)).resolves.toEqual(Option.some('aaaa'));
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			await expect<ReturnType>(stream.findMapAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findMapAsync(cb)).resolves.toEqual(Option.some('aaaa'));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledTimes(1);
			cb.mockClear();

			await expect<ReturnType>(stream.findMapAsync(cb)).resolves.toEqual(Option.some('acac'));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
			cb.mockClear();

			await expect<ReturnType>(stream.findMapAsync(cb)).resolves.toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findMapAsync(cb)).resolves.toEqual(Option.none);
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('findParse', () => {
		const predicate = (value: string) => {
			const number = Number(value);
			return Number.isNaN(number) ? Result.err(`Could not parse ${value} to a number`) : Result.ok(number);
		};
		type ReturnType = Result<number, string[]>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findParse(cb)).toEqual(Result.err([]));
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('4')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findParse(cb)).toEqual(Result.ok(4));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			expect<ReturnType>(stream.findParse(cb)).toEqual(Result.err([]));
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('4 a 2 b')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findParse(cb)).toEqual(Result.ok(4));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledTimes(1);
			cb.mockClear();

			expect<ReturnType>(stream.findParse(cb)).toEqual(Result.ok(2));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
			cb.mockClear();

			expect<ReturnType>(stream.findParse(cb)).toEqual(Result.err(['Could not parse a to a number', 'Could not parse b to a number']));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.findParse(cb)).toEqual(
				Result.err([
					'Could not parse ba to a number',
					'Could not parse bb to a number',
					'Could not parse ca to a number',
					'Could not parse dd to a number'
				])
			);
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('findParseAsync', () => {
		const predicate = (value: string) => {
			const number = Number(value);
			return Promise.resolve(Number.isNaN(number) ? Result.err(`Could not parse ${value} to a number`) : Result.ok(number));
		};
		type ReturnType = Promise<Result<number, string[]>>;

		test('GIVEN no parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findParseAsync(cb)).resolves.toEqual(Result.err([]));
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('4')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findParseAsync(cb)).resolves.toEqual(Result.ok(4));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			await expect<ReturnType>(stream.findParseAsync(cb)).resolves.toEqual(Result.err([]));
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('4 a 2 b')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findParseAsync(cb)).resolves.toEqual(Result.ok(4));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledTimes(1);
			cb.mockClear();

			await expect<ReturnType>(stream.findParseAsync(cb)).resolves.toEqual(Result.ok(2));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
			cb.mockClear();

			await expect<ReturnType>(stream.findParseAsync(cb)).resolves.toEqual(
				Result.err(['Could not parse a to a number', 'Could not parse b to a number'])
			);
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.findParseAsync(cb)).resolves.toEqual(
				Result.err([
					'Could not parse ba to a number',
					'Could not parse bb to a number',
					'Could not parse ca to a number',
					'Could not parse dd to a number'
				])
			);
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('many', () => {
		type ReturnType = Option<Parameter[]>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			expect<ReturnType>(stream.many()).toEqual(Option.none);
		});

		test('GIVEN one parameter THEN returns some', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('foo')));

			expect<ReturnType>(stream.many()).toEqual(Option.some([new WordParameter([], { value: 'foo' })]));
		});
	});

	describe('filter', () => {
		const predicate = (value: string) => value.startsWith('a');
		type ReturnType = Option<string[]>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filter(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filter(cb)).toEqual(Option.some(['aa']));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			expect<ReturnType>(stream.filter(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filter(cb)).toEqual(Option.some(['aa', 'ac']));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(4);
			cb.mockClear();

			expect<ReturnType>(stream.filter(cb)).toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filter(cb)).toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('filterAsync', () => {
		const predicate = (value: string) => Promise.resolve(value.startsWith('a'));
		type ReturnType = Promise<Option<string[]>>;

		test('GIVEN no parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterAsync(cb)).resolves.toEqual(Option.some(['aa']));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			await expect<ReturnType>(stream.filterAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterAsync(cb)).resolves.toEqual(Option.some(['aa', 'ac']));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(4);
			cb.mockClear();

			await expect<ReturnType>(stream.filterAsync(cb)).resolves.toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterAsync(cb)).resolves.toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('filterMap', () => {
		const predicate = (value: string) => (value.startsWith('a') ? Option.some(value.repeat(2)) : Option.none);
		type ReturnType = Option<string[]>;

		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filterMap(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filterMap(cb)).toEqual(Option.some(['aaaa']));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			expect<ReturnType>(stream.filterMap(cb)).toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filterMap(cb)).toEqual(Option.some(['aaaa', 'acac']));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(4);
			cb.mockClear();

			expect<ReturnType>(stream.filterMap(cb)).toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			expect<ReturnType>(stream.filterMap(cb)).toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('filterMapAsync', () => {
		const predicate = (value: string) => Promise.resolve(value.startsWith('a') ? Option.some(value.repeat(2)) : Option.none);
		type ReturnType = Promise<Option<string[]>>;

		test('GIVEN no parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterMapAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN one matching parameter THEN returns it', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterMapAsync(cb)).resolves.toEqual(Option.some(['aaaa']));
			expect([...stream.state.used]).toStrictEqual([0]);
			expect(cb).toHaveBeenCalledOnce();
			cb.mockClear();

			await expect<ReturnType>(stream.filterMapAsync(cb)).resolves.toEqual(Option.none);
			expect(cb).not.toHaveBeenCalled();
		});

		test('GIVEN multiple parameters THEN returns each one in sequential order', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('aa bb ac dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterMapAsync(cb)).resolves.toEqual(Option.some(['aaaa', 'acac']));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(4);
			cb.mockClear();

			await expect<ReturnType>(stream.filterMapAsync(cb)).resolves.toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([0, 2]);
			expect(cb).toHaveBeenCalledTimes(2);
		});

		test('GIVEN invalid parameters THEN returns none', async () => {
			const stream = new ArgumentStream(parser.run(lexer.run('ba bb ca dd')));
			const cb = vi.fn(predicate);

			await expect<ReturnType>(stream.filterMapAsync(cb)).resolves.toEqual(Option.some([]));
			expect([...stream.state.used]).toStrictEqual([]);
			expect(cb).toHaveBeenCalledTimes(4);
		});
	});

	describe('flag', () => {
		test('GIVEN no parameters THEN returns false', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			expect(stream.flag('a', 'b')).toEqual(false);
		});

		test('GIVEN one matching flag parameter THEN returns true', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--a')));

			expect(stream.flag('a', 'b')).toEqual(true);
		});

		test('GIVEN multiple matching flag parameters THEN returns true', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--a --b')));

			expect(stream.flag('a', 'b')).toEqual(true);
		});

		test('GIVEN non-matching flags parameter THEN returns false', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--c --foo --bar')));

			expect(stream.flag('a', 'b')).toEqual(false);
		});
	});

	describe('option', () => {
		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			expect(stream.option('foo', 'bar')).toEqual(Option.none);
		});

		test('GIVEN one matching option parameter THEN returns its value', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--foo=1')));

			expect(stream.option('foo', 'bar')).toEqual(Option.some('1'));
		});

		test('GIVEN multiple matching options parameter THEN returns the last value', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--foo=1 --foo=2 --bar=3')));

			expect(stream.option('foo', 'bar')).toEqual(Option.some('3'));
		});

		test('GIVEN non-matching options parameter THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--hello=1 --hello=2 --baz=3')));

			expect(stream.option('foo', 'bar')).toEqual(Option.none);
		});
	});

	describe('options', () => {
		test('GIVEN no parameters THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			expect(stream.options('foo', 'bar')).toEqual(Option.none);
		});

		test('GIVEN one matching option parameter THEN returns its value', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--foo=1')));

			expect(stream.options('foo', 'bar')).toEqual(Option.some(['1']));
		});

		test('GIVEN multiple matching options parameter THEN returns its values', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--foo=1 --foo=2 --bar=3')));

			expect(stream.options('foo', 'bar')).toEqual(Option.some(['1', '2', '3']));
		});

		test('GIVEN non-matching options parameter THEN returns none', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('--hello=1 --hello=2 --baz=3')));

			expect(stream.options('foo', 'bar')).toEqual(Option.none);
		});
	});

	describe('save', () => {
		test('GIVEN an instance THEN returns a clone of the state', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const state = stream.save();

			// The returned state equals the current one:
			expect(state).toEqual(stream.state);

			// But is not equal to the current one:
			expect(Object.is(state, stream.state)).toBe(false);
			expect(Object.is(state.used, stream.state.used)).toBe(false);
		});
	});

	describe('restore', () => {
		test('GIVEN an instance THEN sets the given state', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));
			const state: ArgumentStream.State = { used: new Set(), position: 0 };

			stream.restore(state);
			expect(stream.state).toBe(state);
		});
	});

	describe('reset', () => {
		test('GIVEN an instance THEN sets a blank new state', () => {
			const stream = new ArgumentStream(parser.run(lexer.run('')));

			const fn = vi.spyOn(stream, 'restore');
			stream.reset();

			expect(fn).toHaveBeenCalledOnce();
			expect(fn).toHaveBeenLastCalledWith({ used: new Set(), position: 0 });
		});
	});
});

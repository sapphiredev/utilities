import { Option, OptionError, Result } from '../src/index';
import type { None } from '../src/lib/Option/None';
import type { Some } from '../src/lib/Option/Some';
import type { Err } from '../src/lib/Result/Err';
import type { Ok } from '../src/lib/Result/Ok';

const { some, none, from } = Option;
const { ok, err } = Result;

describe('Option', () => {
	describe('prototype', () => {
		describe('isSome', () => {
			test('GIVEN some THEN always returns true', () => {
				const x = some(2);
				expect<boolean>(x.isSome()).toBe(true);
			});

			test('GIVEN none THEN always returns false', () => {
				const x = none;
				expect<false>(x.isSome()).toBe(false);
			});
		});

		describe('isSomeAnd', () => {
			test('GIVEN some AND true-returning callback THEN returns true', () => {
				const x = some(2);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isSomeAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveReturnedWith(true);
			});

			test('GIVEN some AND false-returning callback THEN returns false', () => {
				const x = some(0);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isSomeAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(0);
				expect(cb).toHaveReturnedWith(false);
			});

			test('GIVEN none THEN always returns false', () => {
				const x = none;
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isSomeAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('isNone', () => {
			test('GIVEN some THEN always returns false', () => {
				const x = some(2);
				expect<false>(x.isNone()).toBe(false);
			});

			test('GIVEN none THEN always returns true', () => {
				const x = none;
				expect<boolean>(x.isNone()).toBe(true);
			});
		});

		describe('expect', () => {
			test('GIVEN ok THEN returns value', () => {
				const x = some(2);

				expect<number>(x.expect('Whoops!')).toBe(2);
			});

			test('GIVEN none THEN throws OptionError', () => {
				const x = none;

				expectOptionError('Whoops!', () => x.expect('Whoops!'));
			});
		});

		describe('unwrap', () => {
			test('GIVEN some THEN returns value', () => {
				const x = some(2);

				expect<number>(x.unwrap()).toBe(2);
			});

			test('GIVEN none THEN throws OptionError', () => {
				const x = none;

				expectOptionError('Unwrap failed', () => x.unwrap());
			});
		});

		describe('unwrapOr', () => {
			test('GIVEN some THEN returns value', () => {
				const x = some(2);

				expect<number>(x.unwrapOr(5)).toBe(2);
			});

			test('GIVEN none THEN returns default', () => {
				const x = none;

				expect<5>(x.unwrapOr(5)).toBe(5);
			});
		});

		describe('unwrapOrElse', () => {
			test('GIVEN some THEN returns value', () => {
				const x = some(2);

				expect<number>(x.unwrapOrElse(() => 5)).toBe(2);
			});

			test('GIVEN none THEN returns default', () => {
				const x = none;

				expect<5>(x.unwrapOrElse(() => 5)).toBe(5);
			});
		});

		describe('map', () => {
			test('GIVEN some THEN returns mapped value', () => {
				const x = some('Hello, world!');
				const op = vi.fn((value: string) => value.length);

				expect<Some<number>>(x.map(op)).toEqual(some(13));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Hello, world!');
				expect(op).toHaveReturnedWith(13);
			});

			test('GIVEN none THEN returns self', () => {
				const x = none;
				const op = vi.fn((value: string) => value.length);

				expect<None>(x.map(op)).toBe(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('mapOr', () => {
			test('GIVEN some THEN returns mapped value', () => {
				const x = some('Hello, world!');
				const op = vi.fn((value: string) => value.length);

				expect<number>(x.mapOr(5, op)).toEqual(13);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Hello, world!');
				expect(op).toHaveReturnedWith(13);
			});

			test('GIVEN none THEN returns default value', () => {
				const x = none;
				const op = vi.fn((value: string) => value.length);

				expect<number>(x.mapOr(5, op)).toBe(5);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('mapOrElse', () => {
			test('GIVEN some THEN returns mapped value', () => {
				const x = some('Hello, world!');
				const op = vi.fn((value: string) => value.length);
				const df = vi.fn(() => 5);

				expect<number>(x.mapOrElse(df, op)).toEqual(13);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Hello, world!');
				expect(op).toHaveReturnedWith(13);
				expect(df).not.toHaveBeenCalled();
			});

			test('GIVEN none THEN returns default value', () => {
				const x = none;
				const op = vi.fn((value: string) => value.length);
				const df = vi.fn(() => 5);

				expect<number>(x.mapOrElse(df, op)).toBe(5);
				expect(df).toHaveBeenCalledTimes(1);
				expect(df).toHaveBeenCalledWith();
				expect(df).toHaveReturnedWith(5);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('inspect', () => {
			test('GIVEN some THEN calls callback and returns self', () => {
				const x = some(2);
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
			});

			test('GIVEN none THEN returns self', () => {
				const x = none;
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('okOr', () => {
			test('GIVEN some(s) THEN returns ok(s)', () => {
				const x = some('hello');

				expect<Ok<string>>(x.okOr(0)).toEqual(ok('hello'));
			});

			test('GIVEN none THEN returns err(default)', () => {
				const x = none;

				expect<Err<number>>(x.okOr(0)).toEqual(err(0));
			});
		});

		describe('okOrElse', () => {
			test('GIVEN some(s) THEN returns ok(s)', () => {
				const x = some('hello');
				const op = vi.fn(() => 0);

				expect<Ok<string>>(x.okOrElse(op)).toEqual(ok('hello'));
				expect(op).not.toHaveBeenCalled();
			});

			test('GIVEN none THEN returns err(default)', () => {
				const x = none;
				const op = vi.fn(() => 0);

				expect<Err<number>>(x.okOrElse(op)).toEqual(err(0));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith();
				expect(op).toHaveReturnedWith(0);
			});
		});

		describe('iter', () => {
			test('GIVEN ok THEN yields one value', () => {
				const x = some(2);

				expect<number[]>([...x.iter()]).toStrictEqual([2]);
			});

			test('GIVEN err THEN yields no values', () => {
				const x = none;

				expect<number[]>([...x.iter()]).toStrictEqual([]);
			});
		});

		describe('and', () => {
			test('GIVEN x=some and y=some THEN returns y', () => {
				const x = some(2);
				const y = some('Hello');

				expect<typeof y>(x.and(y)).toBe(y);
			});

			test('GIVEN x=some and y=none THEN returns y', () => {
				const x = some(2);
				const y = none;

				expect<typeof y>(x.and(y)).toBe(y);
			});

			test('GIVEN x=none and y=some THEN returns x', () => {
				const x = none;
				const y = some('Hello');

				expect<typeof x>(x.and(y)).toBe(x);
			});

			test('GIVEN x=none and y=none THEN returns x', () => {
				const x = none;
				const y = none;

				expect<typeof x>(x.and(y)).toBe(x);
			});
		});

		describe('andThen', () => {
			const cb = (value: number) => (value === 0 ? none : some(4 / value));

			test('GIVEN some AND some-returning callback THEN returns some', () => {
				const x = some(4);
				const op = vi.fn(cb);

				expect<Option<number>>(x.andThen(op)).toEqual(some(1));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(4);
				expect(op).toHaveReturnedWith(some(1));
			});

			test('GIVEN some AND none-returning callback THEN returns none', () => {
				const x = some(0);
				const op = vi.fn(cb);

				expect<Option<number>>(x.andThen(op)).toEqual(none);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(0);
				expect(op).toHaveReturnedWith(none);
			});

			test('GIVEN none THEN always returns none', () => {
				const x = none;
				const op = vi.fn(cb);

				expect<typeof x>(x.andThen(op)).toBe(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('or', () => {
			test('GIVEN x=some and y=some THEN returns x', () => {
				const x = some(2);
				const y = some(100);

				expect<typeof x>(x.or(y)).toBe(x);
			});

			test('GIVEN x=some and y=none THEN returns x', () => {
				const x = some(2);
				const y = none;

				expect<typeof x>(x.or(y)).toBe(x);
			});

			test('GIVEN x=none and y=some THEN returns y', () => {
				const x = none;
				const y = some(2);

				expect<typeof y>(x.or(y)).toBe(y);
			});

			test('GIVEN x=none and y=none THEN returns y', () => {
				const x = none;
				const y = none;

				expect<typeof y>(x.or(y)).toBe(y);
			});
		});

		describe('orElse', () => {
			const nobody = () => none;
			const vikings = () => some('vikings');

			test('GIVEN some AND some-returning callback THEN returns self', () => {
				const x = some('barbarians');
				const op = vi.fn(vikings);

				expect<typeof x>(x.orElse(op)).toBe(x);
				expect(op).not.toHaveBeenCalled();
			});

			test('GIVEN none AND some-returning callback THEN returns some', () => {
				const x = none;
				const op = vi.fn(vikings);

				expect<Some<string>>(x.orElse(op)).toEqual(some('vikings'));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith();
				expect(op).toHaveReturnedWith(some('vikings'));
			});

			test('GIVEN none AND none-returning callback THEN returns none', () => {
				const x = none;
				const op = vi.fn(nobody);

				expect<None>(x.orElse(op)).toEqual(none);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith();
				expect(op).toHaveReturnedWith(none);
			});
		});

		describe('xor', () => {
			test('GIVEN x=some(s), y=some(t) / s !== t THEN returns none', () => {
				const x = some(2);
				const y = some(3);

				expect<None>(x.xor(y)).toEqual(none);
			});

			test('GIVEN x=some(s), y=none THEN returns some(s)', () => {
				const x = some(2);
				const y = none;

				expect<typeof x>(x.xor(y)).toBe(x);
			});

			test('GIVEN x=none, y=some(t) THEN returns some(t)', () => {
				const x = none;
				const y = some(3);

				expect<typeof y>(x.xor(y)).toBe(y);
			});

			test('GIVEN x=none, y=none THEN returns none', () => {
				const x = none;
				const y = none;

				expect<None>(x.xor(y)).toEqual(none);
			});
		});

		describe('filter', () => {
			const cb = (value: number) => value % 2 === 0;

			test('GIVEN some(s) AND some-returning callback THEN returns some(s)', () => {
				const x = some(4);
				const op = vi.fn(cb);

				expect(x.filter(op)).toBe(x);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(4);
				expect(op).toHaveReturnedWith(true);
			});

			test('GIVEN some(s) AND none-returning callback THEN returns none', () => {
				const x = some(3);
				const op = vi.fn(cb);

				expect(x.filter(op)).toEqual(none);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(3);
				expect(op).toHaveReturnedWith(false);
			});

			test('GIVEN none THEN always returns none', () => {
				const x = none;
				const op = vi.fn(cb);

				expect(x.filter(op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('contains', () => {
			test('GIVEN some(s), s THEN returns true', () => {
				const x = some(2);

				expect<boolean>(x.contains(2)).toBe(true);
			});

			test('GIVEN some(s), t / s !== t THEN returns false', () => {
				const x = some(2);

				expect<boolean>(x.contains(3)).toBe(false);
			});

			test('GIVEN none THEN always returns false', () => {
				const x = none;

				expect<false>(x.contains(2)).toBe(false);
			});
		});

		describe('zip', () => {
			test('GIVEN x=some(s), y=some(t) THEN always returns some([s, t])', () => {
				const x = some(1);
				const y = some('hi');

				expect<Some<[number, string]>>(x.zip(y)).toEqual(some([1, 'hi']));
			});

			test('GIVEN x=some(s), y=none THEN always returns none', () => {
				const x = some(1);
				const y = none;

				expect<None>(x.zip(y)).toEqual(none);
			});

			test('GIVEN x=none, y=some(t) THEN always returns none', () => {
				const x = none;
				const y = some('hi');

				expect<None>(x.zip(y)).toEqual(none);
			});

			test('GIVEN x=none, y=none THEN always returns none', () => {
				const x = none;
				const y = none;

				expect<None>(x.zip(y)).toEqual(none);
			});
		});

		describe('zipWith', () => {
			const cb = (s: number, o: number) => s * o;

			test('GIVEN x=some, y=some THEN always returns some', () => {
				const x = some(2);
				const y = some(4);
				const op = vi.fn(cb);

				expect<Some<number>>(x.zipWith(y, op)).toEqual(some(8));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(2, 4);
				expect(op).toHaveReturnedWith(8);
			});

			test('GIVEN x=some, y=none THEN always returns none', () => {
				const x = some(2);
				const y = none;
				const op = vi.fn(cb);

				expect<None>(x.zipWith(y, op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});

			test('GIVEN x=none, y=some THEN always returns none', () => {
				const x = none;
				const y = some(4);
				const op = vi.fn(cb);

				expect<None>(x.zipWith(y, op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});

			test('GIVEN x=none, y=none THEN always returns none', () => {
				const x = none;
				const y = none;
				const op = vi.fn(cb);

				expect<None>(x.zipWith(y, op)).toEqual(none);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('unzip', () => {
			test('GIVEN some([s, t]) THEN always returns [some(s), some(t)]', () => {
				const x = some([1, 'hi'] as const);

				expect<[Some<1>, Some<'hi'>]>(x.unzip()).toEqual([some(1), some('hi')]);
			});

			test('GIVEN none THEN always returns [none, none]', () => {
				const x = none;

				expect<[None, None]>(x.unzip()).toEqual([none, none]);
			});
		});

		describe('transpose', () => {
			test('GIVEN some(ok(s)) THEN returns ok(some(s))', () => {
				const x = some(ok(5));

				expect(x.transpose()).toEqual(ok(some(5)));
			});

			test('GIVEN some(err(e)) THEN returns err(e)', () => {
				const x = some(err('Some error message'));

				expect(x.transpose()).toEqual(err('Some error message'));
			});

			test('GIVEN none THEN returns ok(none)', () => {
				const x = none;

				expect<Ok<None>>(x.transpose()).toEqual(ok(none));
			});
		});

		describe('flatten', () => {
			test('GIVEN some(some(s)) THEN returns some(s)', () => {
				const x = some(some(3));

				expect<Some<number>>(x.flatten()).toEqual(some(3));
			});

			test('GIVEN some(none) THEN returns none', () => {
				const x = some(none);

				expect<None>(x.flatten()).toEqual(none);
			});

			test('GIVEN none THEN returns self', () => {
				const x = none;

				expect<typeof x>(x.flatten()).toBe(x);
			});
		});

		describe('eq', () => {
			test('GIVEN x=some(s), y=some(s) THEN returns true', () => {
				const x = some(3);
				const y = some(3);

				expect<boolean>(x.eq(y)).toBe(true);
			});

			test('GIVEN x=some(s), y=some(t) / s !== t THEN returns false', () => {
				const x = some(3);
				const y = some(4);

				expect<boolean>(x.eq(y)).toBe(false);
			});

			test('GIVEN x=some(s), y=none THEN always returns false', () => {
				const x = some(3);
				const y = none;

				expect<false>(x.eq(y)).toBe(false);
			});

			test('GIVEN x=none, y=some(t) THEN always returns false', () => {
				const x = none;
				const y = some(4);

				expect<false>(x.eq(y)).toBe(false);
			});

			test('GIVEN x=none, y=none THEN returns true', () => {
				const x = none;
				const y = none;

				expect<true>(x.eq(y)).toBe(true);
			});
		});

		describe('ne', () => {
			test('GIVEN x=some(s), y=some(s) THEN returns false', () => {
				const x = some(3);
				const y = some(3);

				expect<boolean>(x.ne(y)).toBe(false);
			});

			test('GIVEN x=some(s), y=some(t) / s !== t THEN returns true', () => {
				const x = some(3);
				const y = some(4);

				expect<boolean>(x.ne(y)).toBe(true);
			});

			test('GIVEN x=some(s), y=none THEN always returns true', () => {
				const x = some(3);
				const y = none;

				expect<true>(x.ne(y)).toBe(true);
			});

			test('GIVEN x=none, y=some(t) THEN always returns true', () => {
				const x = none;
				const y = some(4);

				expect<true>(x.ne(y)).toBe(true);
			});

			test('GIVEN x=none, y=none THEN always returns false', () => {
				const x = none;
				const y = none;

				expect<false>(x.ne(y)).toBe(false);
			});
		});

		describe('match', () => {
			test('GIVEN some THEN calls some callback', () => {
				const x = Option.some(2);
				const some = vi.fn((value: number) => value * 2);
				const none = vi.fn(() => 0);

				expect<number>(x.match({ some, none })).toBe(4);
				expect(some).toHaveBeenCalledTimes(1);
				expect(some).toHaveBeenCalledWith(2);
				expect(some).toHaveReturnedWith(4);
				expect(none).not.toHaveBeenCalled();
			});

			test('GIVEN none THEN calls none callback', () => {
				const x = Option.none;
				const some = vi.fn((value: number) => value * 2);
				const none = vi.fn(() => 0);

				expect<number>(x.match({ some, none })).toBe(0);
				expect(some).not.toHaveBeenCalled();
				expect(none).toHaveBeenCalledTimes(1);
				expect(none).toHaveBeenCalledWith();
				expect(none).toHaveReturnedWith(0);
			});
		});
	});

	describe('some', () => {
		test('GIVEN some THEN returns Some', () => {
			const x = Option.some(42);

			expect(x.isSome()).toBe(true);
			expect(x.isNone()).toBe(false);
		});
	});

	describe('none', () => {
		test('GIVEN none THEN returns None', () => {
			const x = Option.none;

			expect(x.isSome()).toBe(false);
			expect(x.isNone()).toBe(true);
		});
	});

	describe('from', () => {
		test('GIVEN from(T) THEN returns Some', () => {
			const x = from(42);

			expect(x.isSome()).toBe(true);
			expect(x.isNone()).toBe(false);
		});

		test('GIVEN from(Some(T)) THEN returns Some', () => {
			const x = from(Option.some(42));

			expect(x.isSome()).toBe(true);
			expect(x.isNone()).toBe(false);
		});

		test('GIVEN from(null) WITH value as null THEN returns None', () => {
			const x = from(null);

			expect(x.isSome()).toBe(false);
			expect(x.isNone()).toBe(true);
		});

		test('GIVEN from(None) WITH value as isMaybe result THEN returns None', () => {
			const x = from(Option.none);

			expect(x.isSome()).toBe(false);
			expect(x.isNone()).toBe(true);
		});

		test('GIVEN from(() => T) THEN returns Some', () => {
			const x = from(() => 42);

			expect(x.isSome()).toBe(true);
			expect(x.isNone()).toBe(false);
		});

		test('GIVEN from(() => Some(T)) THEN returns Some', () => {
			const x = from(() => Option.some(42));

			expect(x.isSome()).toBe(true);
			expect(x.isNone()).toBe(false);
		});

		test('GIVEN from(() => null) WITH value as null THEN returns None', () => {
			const x = from(() => null);

			expect(x.isSome()).toBe(false);
			expect(x.isNone()).toBe(true);
		});

		test('GIVEN from(() => None) WITH value as isMaybe result THEN returns None', () => {
			const x = from(() => Option.none);

			expect(x.isSome()).toBe(false);
			expect(x.isNone()).toBe(true);
		});

		test('GIVEN from(() => throw) WITH value as isMaybe result THEN returns None', () => {
			const x = from(() => {
				throw new Error('throws');
			});

			expect(x.isSome()).toBe(false);
			expect(x.isNone()).toBe(true);
		});
	});
});

function expectOptionError(message: string, cb: () => any) {
	try {
		cb();

		throw new Error('cb should have thrown');
	} catch (raw) {
		const error = raw as OptionError;

		expect(error).toBeInstanceOf(OptionError);
		expect<string>(error.name).toBe('OptionError');
		expect<string>(error.message).toBe(message);
	}
}

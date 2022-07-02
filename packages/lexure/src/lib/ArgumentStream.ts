import { Option, Result } from '@sapphire/result';
import type { Parameter } from './lexer/streams/ParameterStream';
import type { ParserResult } from './parser/ParserResult';

export class ArgumentStream {
	public readonly results: ParserResult;
	public state: ArgumentStream.State;

	public constructor(results: ParserResult) {
		this.results = results;
		this.state = { used: new Set(), position: 0 };
	}

	/**
	 * Whether or not all ordered parameters were used.
	 */
	public get finished() {
		return this.used === this.length;
	}

	/**
	 * The amount of ordered parameters.
	 */
	public get length() {
		return this.results.ordered.length;
	}

	/**
	 * The remaining amount of ordered parameters.
	 */
	public get remaining() {
		return this.length - this.used;
	}

	/**
	 * The amount of ordered parameters that have been used.
	 */
	public get used() {
		return this.state.used.size;
	}

	/**
	 * Retrieves the value of the next unused ordered token.
	 *
	 * @example
	 * ```typescript
	 * // Assume args are '1 2 3':
	 *
	 * console.log(args.single());
	 * // Ok { value: '1' }
	 *
	 * console.log(args.single());
	 * // Ok { value: '2' }
	 *
	 * console.log(args.single());
	 * // Ok { value: '3' }
	 *
	 * console.log(args.single());
	 * // None
	 * ```
	 *
	 * @returns The value, if any.
	 */
	public single(): Option<string> {
		if (this.finished) return Option.none;

		while (this.state.used.has(this.state.position)) {
			++this.state.position;
		}

		this.state.used.add(this.state.position);
		return Option.some(this.results.ordered[this.state.position++].value);
	}

	/**
	 * Retrieves the value of the next unused ordered token, but only if it could be transformed.
	 *
	 * @note This does not support asynchronous results, refer to {@link singleMapAsync}.
	 *
	 * @example
	 * ```typescript
	 * const parse = (value) => {
	 *   const number = Number(value);
	 *   return Number.isNaN(number) ? Option.none : Option.some(number);
	 * };
	 *
	 * // Assume args are '1 2 3':
	 *
	 * console.log(args.singleMap(parse));
	 * // Some { value: 1 }
	 *
	 * console.log(args.singleMap(parse));
	 * // Some { value: 2 }
	 *
	 * console.log(args.singleMap(parse));
	 * // Some { value: 3 }
	 *
	 * console.log(args.singleMap(parse));
	 * // None
	 * ```
	 *
	 * @typeparam T The output type.
	 * @param predicate The predicate that determines the parameter's mapped value, or nothing if failed.
	 * @param useAnyways Whether to consider the parameter used even if the mapping failed. Defaults to `false`.
	 * @returns The mapped value, if any.
	 */
	public singleMap<T>(predicate: (value: string) => Option<T>, useAnyways = false): Option<T> {
		if (this.finished) return Option.none;

		while (this.state.used.has(this.state.position)) {
			++this.state.position;
		}

		const result = predicate(this.results.ordered[this.state.position].value);
		if (result.isSome() || useAnyways) {
			this.state.used.add(this.state.position);
			++this.state.position;
		}

		return result;
	}

	/**
	 * Retrieves the value of the next unused ordered token, but only if it could be transformed.
	 *
	 * @note This is an asynchronous variant of {@link singleMap}.
	 *
	 * @typeparam T The output type.
	 * @param predicate The predicate that determines the parameter's mapped value, or nothing if failed.
	 * @param useAnyways Whether to consider the parameter used even if the mapping failed. Defaults to `false`.
	 * @returns The mapped value, if any.
	 */
	public async singleMapAsync<T>(predicate: (value: string) => Promise<Option<T>>, useAnyways = false): Promise<Option<T>> {
		if (this.finished) return Option.none;

		while (this.state.used.has(this.state.position)) {
			++this.state.position;
		}

		const result = await predicate(this.results.ordered[this.state.position].value);
		if (result.isSome() || useAnyways) {
			this.state.used.add(this.state.position);
			++this.state.position;
		}

		return result;
	}

	/**
	 * Finds and retrieves the next unused parameter and transforms it.
	 *
	 * @note This is a variant of {@link findMap} that returns the errors on failure.
	 * @note This does not support asynchronous results, refer to {@link singleParseAsync}.
	 *
	 * @example
	 * ```typescript
	 * const parse = (value) => {
	 *   const number = Number(value);
	 *   return Number.isNaN(number)
	 *     ? Result.err(`Could not parse ${value} to a number`)
	 *     : Result.ok(number);
	 * };
	 *
	 * // Assume args are '1 2 3':
	 *
	 * console.log(args.singleParse(parse));
	 * // Ok { value: 1 }
	 *
	 * console.log(args.singleParse(parse));
	 * // Ok { value: 2 }
	 *
	 * console.log(args.singleParse(parse));
	 * // Ok { value: 3 }
	 *
	 * console.log(args.singleParse(parse));
	 * // Err { error: null }
	 * ```
	 *
	 * @typeparam T The output type.
	 * @typeparam E The error type.
	 * @param predicate The predicate that determines the parameter's transformed value, or nothing if failed.
	 * @param useAnyways Whether to consider the parameter used even if the transformation failed. Defaults to `false`.
	 * @returns The transformed value, if any.
	 */
	public singleParse<T, E>(predicate: (value: string) => Result<T, E>, useAnyways = false): Result<T, E | null> {
		if (this.finished) return Result.err(null);

		while (this.state.used.has(this.state.position)) {
			++this.state.position;
		}

		const result = predicate(this.results.ordered[this.state.position].value);
		if (result.isOk() || useAnyways) {
			this.state.used.add(this.state.position);
			++this.state.position;
		}

		return result;
	}

	/**
	 * Retrieves the value of the next unused ordered token, but only if it could be transformed.
	 *
	 * @note This is an asynchronous variant of {@link singleParse}.
	 *
	 * @typeparam T The output type.
	 * @typeparam E The error type.
	 * @param predicate The predicate that determines the parameter's mapped value, or nothing if failed.
	 * @param useAnyways Whether to consider the parameter used even if the mapping failed. Defaults to `false`.
	 * @returns The mapped value, if any.
	 */
	public async singleParseAsync<T, E>(predicate: (value: string) => Promise<Result<T, E>>, useAnyways = false): Promise<Result<T, E | null>> {
		if (this.finished) return Result.err(null);

		while (this.state.used.has(this.state.position)) {
			++this.state.position;
		}

		const result = await predicate(this.results.ordered[this.state.position].value);
		if (result.isOk() || useAnyways) {
			this.state.used.add(this.state.position);
			++this.state.position;
		}

		return result;
	}

	/**
	 * Returns the value of the first element in the array within `Option.some` where `predicate` returns `true`, and
	 * `Option.none` otherwise.
	 *
	 * @note This does not support asynchronous results, refer to {@link findAsync}.
	 *
	 * @example
	 * ```typescript
	 * // Suppose args are from 'ba aa cc'.
	 *
	 * console.log(args.find((value) => value.startsWith('a')));
	 * // Some { value: 'aa' }
	 * ```
	 *
	 * @param predicate find calls `predicate` once for each unused ordered parameter, in ascending order, until it
	 * finds one where `predicate` returns `true`. If such an element is found, find immediately returns a `Option.some`
	 * with that element value. Otherwise, find returns `Option.none`.
	 * @param from The position where to start looking for unused parameters, defaults to current position.
	 * @returns The found parameter's value.
	 */
	public find(predicate: (value: string) => boolean, from = this.state.position): Option<string> {
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			if (predicate(parameter)) {
				this.state.used.add(i);
				return Option.some(parameter);
			}
		}

		return Option.none;
	}

	/**
	 * Returns the value of the first element in the array within `Option.some` where `predicate` returns `true`, and
	 * `Option.none` otherwise.
	 *
	 * @note This is an asynchronous variant of {@link find}.
	 *
	 * @example
	 * ```typescript
	 * // Suppose args are from 'ba aa cc'.
	 *
	 * console.log(args.find((value) => value.startsWith('a')));
	 * // Some { value: 'aa' }
	 * ```
	 *
	 * @param predicate find calls `predicate` once for each unused ordered parameter, in ascending order, until it
	 * finds one where `predicate` returns `true`. If such an element is found, find immediately returns a `Option.some`
	 * with that element value. Otherwise, find returns `Option.none`.
	 * @param from The position where to start looking for unused parameters, defaults to current position.
	 * @returns The found parameter's value.
	 */
	public async findAsync(predicate: (value: string) => Promise<boolean>, from = this.state.position): Promise<Option<string>> {
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			if (await predicate(parameter)) {
				this.state.used.add(i);
				return Option.some(parameter);
			}
		}

		return Option.none;
	}

	/**
	 * Returns the value of the first element in the array within `Option.some` where `predicate` returns `Some`, and
	 * `Option.none` otherwise.
	 *
	 * @note This does not support asynchronous results, refer to {@link findMapAsync}.
	 *
	 * @example
	 * ```typescript
	 * // Suppose args are from 'ba aa cc'.
	 *
	 * console.log(args.find((value) => value.startsWith('a')));
	 * // Some { value: 'aa' }
	 * ```
	 *
	 * @typeparam T The output type.
	 * @param predicate find calls `predicate` once for each unused ordered parameter, in ascending order, until it
	 * finds one where `predicate` returns `Some`. If such an element is found, find immediately returns the returned
	 * value. Otherwise, find returns `Option.none`.
	 * @param from The position where to start looking for unused parameters, defaults to current position.
	 * @returns The found parameter's value.
	 */
	public findMap<T>(predicate: (value: string) => Option<T>, from = this.state.position): Option<T> {
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			const result = predicate(parameter);
			if (result.isSome()) {
				this.state.used.add(i);
				return result;
			}
		}

		return Option.none;
	}

	/**
	 * Returns the value of the first element in the array within `Option.some` where `predicate` returns `Some`, and
	 * `Option.none` otherwise.
	 *
	 * @note This is an asynchronous variant of {@link findMap}.
	 *
	 * @example
	 * ```typescript
	 * // Suppose args are from 'ba aa cc'.
	 *
	 * console.log(args.find((value) => value.startsWith('a')));
	 * // Some { value: 'aa' }
	 * ```
	 *
	 * @typeparam T The output type.
	 * @param predicate find calls `predicate` once for each unused ordered parameter, in ascending order, until it
	 * finds one where `predicate` returns `Some`. If such an element is found, find immediately returns the returned
	 * value. Otherwise, find returns `Option.none`.
	 * @param from The position where to start looking for unused parameters, defaults to current position.
	 * @returns The found parameter's value.
	 */
	public async findMapAsync<T>(predicate: (value: string) => Promise<Option<T>>, from = this.state.position): Promise<Option<T>> {
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			const result = await predicate(parameter);
			if (result.isSome()) {
				this.state.used.add(i);
				return result;
			}
		}

		return Option.none;
	}

	/**
	 * Finds and retrieves the first unused parameter that could be transformed.
	 *
	 * @note This is a variant of {@link findMap} that returns the errors on failure.
	 * @note This does not support asynchronous results, refer to {@link findParseAsync}.
	 *
	 * @example
	 * ```typescript
	 * const parse = (value) => {
	 *   const number = Number(value);
	 *   return Number.isNaN(number)
	 *     ? Result.err(`Could not parse ${value} to a number`)
	 *     : Result.ok(number);
	 * };
	 *
	 * // Suppose args are from 'ba 1 cc'.
	 *
	 * console.log(args.findParse(parse));
	 * // Ok { value: 1 }
	 *
	 * console.log(args.findParse(parse));
	 * // Err {
	 * //   error: [
	 * //     'Could not parse ba to a number',
	 * //     'Could not parse cc to a number'
	 * //   ]
	 * // }
	 * ```
	 *
	 * @typeparam T The output type.
	 * @typeparam E The error type.
	 * @param predicate `findParse` calls `predicate` once for each unused ordered parameter, in ascending order, until
	 * it finds one where `predicate` returns `Ok`. If such an element is found, `findParse` immediately returns the
	 * returned value. Otherwise, `findParse` returns `Result.Err` with all the returned errors.
	 * @param from The position where to start looking for unused parameters, defaults to current position.
	 * @returns The found parameter's value.
	 */
	public findParse<T, E>(predicate: (value: string) => Result<T, E>, from = this.state.position): Result<T, E[]> {
		const errors: E[] = [];
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			const result = predicate(parameter);
			if (result.isOk()) {
				this.state.used.add(i);
				return result as Result.Ok<T>;
			}

			errors.push(result.unwrapErr());
		}

		return Result.err(errors);
	}

	/**
	 * Finds and retrieves the first unused parameter that could be transformed.
	 *
	 * @note This is a variant of {@link findMapAsync} that returns the errors on failure.
	 * @note This is an asynchronous variant of {@link findParse}.
	 *
	 * @typeparam T The output type.
	 * @typeparam E The error type.
	 * @param predicate `findParse` calls `predicate` once for each unused ordered parameter, in ascending order, until
	 * it finds one where `predicate` returns `Ok`. If such an element is found, `findParse` immediately returns the
	 * returned value. Otherwise, `findParse` returns `Result.Err` with all the returned errors.
	 * @param from The position where to start looking for unused parameters, defaults to current position.
	 * @returns The found parameter's value.
	 */
	public async findParseAsync<T, E>(predicate: (value: string) => Promise<Result<T, E>>, from = this.state.position): Promise<Result<T, E[]>> {
		const errors: E[] = [];
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			const result = await predicate(parameter);
			if (result.isOk()) {
				this.state.used.add(i);
				return result as Result.Ok<T>;
			}

			errors.push(result.unwrapErr());
		}

		return Result.err(errors);
	}

	/**
	 * Retrieves multiple unused parameters.
	 *
	 * @example
	 * ```typescript
	 * // Assume args are '1 2 3':
	 *
	 * console.log(join(args.many().unwrap()));
	 * // '1 2 3'
	 * ```
	 *
	 * @example
	 * ```typescript
	 * // Assume args are '1 2 3':
	 *
	 * console.log(join(args.many(2).unwrap()));
	 * // '1 2'
	 * ```
	 *
	 * @param limit The maximum amount of parameters to retrieve, defaults to `Infinity`.
	 * @param from The position where to start looking for unused parameters, defaults to current position.
	 * @returns The unused parameters within the range.
	 */
	public many(limit = Infinity, from = this.state.position): Option<Parameter[]> {
		if (this.finished) return Option.none;

		const parameters: Parameter[] = [];
		for (let i = from; i < this.length; ++i) {
			// If the current parameter was already used, skip:
			if (this.state.used.has(i)) continue;

			// Mark current parameter as used, and push it to the resulting array:
			this.state.used.add(i);
			parameters.push(this.results.ordered[i]);

			// If the parameters reached the limit, break the loop:
			if (parameters.length >= limit) break;
		}

		return parameters.length ? Option.some(parameters) : Option.none;
	}

	public filter(predicate: (value: string) => boolean, from = this.state.position): Option<string[]> {
		if (this.finished) return Option.none;

		const parameters: string[] = [];
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			if (predicate(parameter)) {
				this.state.used.add(i);
				parameters.push(parameter);
			}
		}

		return Option.some(parameters);
	}

	public async filterAsync(predicate: (value: string) => Promise<boolean>, from = this.state.position): Promise<Option<string[]>> {
		if (this.finished) return Option.none;

		const parameters: string[] = [];
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			if (await predicate(parameter)) {
				this.state.used.add(i);
				parameters.push(parameter);
			}
		}

		return Option.some(parameters);
	}

	public filterMap<T>(predicate: (value: string) => Option<T>, from = this.state.position): Option<T[]> {
		if (this.finished) return Option.none;

		const parameters: T[] = [];
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			const result = predicate(parameter);
			result.inspect((value) => {
				this.state.used.add(i);
				parameters.push(value);
			});
		}

		return Option.some(parameters);
	}

	public async filterMapAsync<T>(predicate: (value: string) => Promise<Option<T>>, from = this.state.position): Promise<Option<T[]>> {
		if (this.finished) return Option.none;

		const parameters: T[] = [];
		for (let i = from; i < this.length; ++i) {
			if (this.state.used.has(i)) continue;

			const parameter = this.results.ordered[i].value;
			const result = await predicate(parameter);
			result.inspect((value) => {
				this.state.used.add(i);
				parameters.push(value);
			});
		}

		return Option.some(parameters);
	}

	/**
	 * Checks whether any of the flags were given.
	 *
	 * @example
	 * ```typescript
	 * // Assume args are '--f --g':
	 *
	 * console.log(args.flag('f'));
	 * // true
	 *
	 * console.log(args.flag('g', 'h'));
	 * // true
	 *
	 * console.log(args.flag('h'));
	 * // false
	 * ```
	 *
	 * @param keys The names of the flags to check.
	 * @returns Whether or not any of the flags were given.
	 */
	public flag(...keys: readonly string[]): boolean {
		return keys.some((key) => this.results.flags.has(key));
	}

	/**
	 * Gets the last value of any option. When there are multiple names, the last value of the last found name is given.
	 *
	 * @example
	 * ```typescript
	 * // Assume args are '--a=1 --b=2 --c=3'.
	 * console.log(args.option('a'));
	 * // Some { value: '1' }
	 *
	 * console.log(args.option('b', 'c'));
	 * // Some { value: '3' }
	 *
	 * console.log(args.option('d'));
	 * // None {}
	 * ```
	 *
	 * @param keys The names of the options to check.
	 * @returns The last value of the option, if any.
	 */
	public option(...keys: readonly string[]): Option<string> {
		return this.options(...keys).map((values) => values.at(-1)!);
	}

	/**
	 * Gets all values from all options.
	 *
	 * @example
	 * ```typescript
	 * // Assume args are '--a=1 --a=1 --b=2 --c=3'.
	 * console.log(args.option('a'));
	 * // Some { value: ['1', '1'] }
	 *
	 * console.log(args.option('b', 'c'));
	 * // Some { value: ['2', '3'] }
	 *
	 * console.log(args.option('d'));
	 * // None {}
	 * ```
	 *
	 * @param keys The names of the options to check.
	 * @returns The values from all the options concatenated, if any.
	 */
	public options(...keys: readonly string[]): Option<readonly string[]> {
		const entries: string[] = [];
		for (const key of keys) {
			const values = this.results.options.get(key);
			if (values) entries.push(...values);
		}

		return entries.length ? Option.some(entries) : Option.none;
	}

	public save(): ArgumentStream.State {
		return {
			used: new Set(this.state.used),
			position: this.state.position
		};
	}

	public restore(state: ArgumentStream.State) {
		this.state = state;
	}

	public reset() {
		this.restore({ used: new Set(), position: 0 });
	}
}

export namespace ArgumentStream {
	export interface State {
		used: Set<number>;
		position: number;
	}
}

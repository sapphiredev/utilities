const FlagEntriesSymbol = Symbol('@sapphire/bitfield.flags.entries');

export class BitField<Flags extends Record<string, number> | Record<string, bigint>> {
	public readonly type: Flags[keyof Flags] extends number ? 'number' : 'bigint';
	public readonly zero: Flags[keyof Flags] extends number ? 0 : 0n;
	public readonly mask: ValueType<this>;
	public readonly flags: Flags;
	private readonly [FlagEntriesSymbol]: readonly [string, Flags[keyof Flags]][];

	public constructor(flags: Readonly<Flags>) {
		if (typeof flags !== 'object' || flags === null) {
			throw new TypeError('flags must be a non-null object');
		}

		const entries = Object.entries(flags) as [string, Flags[keyof Flags]][];
		if (entries.length === 0) {
			throw new TypeError('flags must be a non-empty object');
		}

		const type = typeof entries[0][1];
		if (type !== 'number' && type !== 'bigint') {
			throw new TypeError('A bitfield can only use numbers or bigints for its values');
		}

		this.type = type as any;
		this.flags = flags;
		this[FlagEntriesSymbol] = entries;

		if (type === 'number') {
			this.zero = 0 as any;

			let mask = 0;
			for (const [key, value] of entries) {
				if (typeof value !== 'number') throw new TypeError(`The property "${key}" does not resolve to a number`);
				if (value !== (value | 0)) throw new RangeError(`The property "${key}" does not resolve to a safe bitfield value`);
				if (value <= 0) throw new RangeError(`The property "${key}" resolves to a non-positive value`);
				mask |= value;
			}

			this.mask = mask as any;
		} else {
			this.zero = 0n as any;

			let mask = 0n;
			for (const [key, value] of entries) {
				if (typeof value !== 'bigint') throw new TypeError(`The property "${key}" does not resolve to a bigint`);
				if (value <= 0n) throw new RangeError(`The property "${key}" resolves to a non-positive value`);
				mask |= value;
			}

			this.mask = mask as any;
		}
	}

	/**
	 * Resolves a:
	 * - `string`: If it's a property of {@link Flags}.
	 * - `number`: If the BitField processes `number` primitives.
	 * - `bigint`: If the BitField processes `bigint` primitives.
	 * - `Array`: Resolves recursively.
	 * @param resolvable The value to resolve.
	 * @returns The resolved value.
	 */
	public resolve(resolvable: ValueResolvable<this>): ValueType<this> {
		switch (typeof resolvable) {
			case 'string':
				if ((resolvable as string) in this.flags) return this.flags[resolvable as keyof Flags] as any;
				throw new RangeError('Received a name that could not be resolved to a property of flags');
			case this.type:
				return ((resolvable as ValueType<this>) & this.mask) as any;
			case 'object':
				if (Array.isArray(resolvable)) return resolvable.reduce((acc, value) => this.resolve(value) | acc, this.zero);
				throw new TypeError('Received an object value that is not an Array');
			default:
				throw new TypeError(`Received a value that is not either type "string", type "${this.type}", or an Array`);
		}
	}

	/**
	 * Checks whether or not `field` contains any of the bits from `bits`.
	 * @param field The bits to compare the bits from.
	 * @param bits The bits to compare with.
	 * @returns Whether or not `field` has any of `bits`'s bits, also denoted as `A ∩ B ≠ ∅`.
	 */
	public any(field: ValueResolvable<this>, bits: ValueResolvable<this>): boolean {
		return (this.resolve(field) & this.resolve(bits)) !== this.zero;
	}

	/**
	 * Checks whether or not `field` is a superset of or equal to `bits`.
	 * @param field The bits to compare the bits from.
	 * @param bits The bits to compare with.
	 * @returns Whether or not `field` is a superset of or equal to `bits`, also denoted as `A ⊇ B`.
	 */
	public has(field: ValueResolvable<this>, bits: ValueResolvable<this>): boolean {
		const resolved = this.resolve(bits);
		return (this.resolve(field) & resolved) === resolved;
	}

	/**
	 * Makes the complement of `field`, which is a field of all bits (of `U` or the union of all {@link Flags} bits)
	 * that do not belong to `A`. It is the result of `U ∖ A`, or `difference(U, field)`.
	 * @param field The bits to get the complement of.
	 * @returns The complement of `field`, also denoted `Aᶜ` or `A'`.
	 * @example
	 * ```typescript
	 * const bitfield = new BitField({
	 * 	Read:   0b0001,
	 * 	Write:  0b0010,
	 * 	Edit:   0b0100,
	 * 	Delete: 0b1000
	 * });
	 *
	 * bitfield.complement(0b0100);
	 * // 0b1011
	 * ```
	 */
	public complement(field: ValueResolvable<this>): ValueType<this> {
		return this.difference(this.mask, field);
	}

	/**
	 * Makes a union of all the bits.
	 * @param fields The bits to create a union of.
	 * @returns The result of combining all bits together, also denoted as `∅ ⋃ fields`.
	 * @example
	 * ```typescript
	 * bitfield.union(0b0001, 0b0100);
	 * // 0b0101
	 *
	 * bitfield.union(0b1100, 0b0001, 0b0010);
	 * // 0b1111
	 * ```
	 * @seealso {@link https://en.wikipedia.org/wiki/Union_(set_theory)}
	 */
	public union(...fields: readonly ValueResolvable<this>[]): ValueType<this> {
		let field = this.zero as ValueType<this>;
		for (const resolvable of fields) {
			field = (field | this.resolve(resolvable)) as ValueType<this>;
		}

		return field;
	}

	/**
	 * Makes an intersection of all the bits.
	 * @param bitfield The first field.
	 * @param fields The bits to intersect with `bitfield`.
	 * @returns The result of intersecting `bitfield` with all of the `fields`, also denoted as `A ⋂ fields`.
	 * @example
	 * ```typescript
	 * bitfield.intersection(0b0001, 0b0100);
	 * // 0b0000
	 *
	 * bitfield.intersection(0b1100, 0b0100);
	 * // 0b0100
	 *
	 * bitfield.intersection(0b1101, 0b0101, 0b1100);
	 * // 0b0100
	 * ```
	 * @seealso {@link https://en.wikipedia.org/wiki/Intersection_(set_theory)}
	 */
	public intersection(bitfield: ValueResolvable<this>, ...fields: readonly ValueResolvable<this>[]): ValueType<this> {
		let field = this.resolve(bitfield);
		for (const resolvable of fields) {
			field = (field & this.resolve(resolvable)) as ValueType<this>;
		}

		return field;
	}

	/**
	 * Removes from `a` the bits that exist in `b`.
	 * @param a The first field.
	 * @param b The bits to remove from `a`.
	 * @returns The result of `a ∖ b`.
	 * @example
	 * ```typescript
	 * bitfield.difference(0b1100, 0b0100);
	 * // 0b1000
	 *
	 * bitfield.difference(0b1111, 0b0110);
	 * // 0b1001
	 * ```
	 * @seealso {@link https://en.wikipedia.org/wiki/Difference_(set_theory)}
	 */
	public difference(a: ValueResolvable<this>, b: ValueResolvable<this>): ValueType<this> {
		return (this.resolve(a) & ~this.resolve(b)) as ValueType<this>;
	}

	/**
	 * Computes the symmetric difference, denoted as `A ⊖ B` or `A Δ B`, which is the disjunctive union, or the set of
	 * elements which are in either of the sets, but not in their intersection. As such, this is the result of
	 * `(A ∖ B) ∪ (B ∖ A)`, `union(difference(a, b), difference(b, a))`, or `a ⊕ b`.
	 * @remarks The empty set (`∅`) is neutral, as such, `A Δ ∅ = A` and `A Δ A = ∅`
	 * @param a The first field.
	 * @param b The second field.
	 * @returns The result of computing `a Δ b`.
	 * @example
	 * ```typescript
	 * bitfield.symmetricDifference(0b1100, 0b0011);
	 * // 0b1111
	 *
	 * bitfield.symmetricDifference(0b1101, 0b1011);
	 * // 0b0110
	 * ```
	 * @seealso {@link https://en.wikipedia.org/wiki/Symmetric_difference}
	 */
	public symmetricDifference(a: ValueResolvable<this>, b: ValueResolvable<this>): ValueType<this> {
		return (this.resolve(a) ^ this.resolve(b)) as ValueType<this>;
	}

	/**
	 * Retrieves an array of the properties from {@link Flags} whose values are contained in `field`.
	 * @param field The field to convert to an array.
	 * @returns The names of the {@link BitField}'s flag properties whose value are contained in `field`.
	 * @example
	 * ```typescript
	 * const bitfield = new BitField({
	 * 	Read:   0b0001,
	 * 	Write:  0b0010,
	 * 	Edit:   0b0100,
	 * 	Delete: 0b1000
	 * });
	 *
	 * bitfield.toArray(0b0101);
	 * // ['Read', 'Edit']
	 * ```
	 */
	public toArray(field: ValueResolvable<this>): (keyof Flags)[] {
		return [...this.toKeys(field)];
	}

	/**
	 * Retrieves an iterator of the properties from {@link Flags} whose values are contained in `field`.
	 * @param field The field to convert to an iterator.
	 * @returns An iterator with the keys of the {@link BitField}'s flag properties whose value are contained in `field`.
	 * @example
	 * ```typescript
	 * const bitfield = new BitField({
	 * 	Read:   0b0001,
	 * 	Write:  0b0010,
	 * 	Edit:   0b0100,
	 * 	Delete: 0b1000
	 * });
	 *
	 * [...bitfield.toKeys(0b0101)];
	 * // ['Read', 'Edit']
	 * ```
	 */
	public *toKeys(field: ValueResolvable<this>): IterableIterator<keyof Flags> {
		const bits = this.resolve(field);
		for (const [key, bit] of this[FlagEntriesSymbol]) {
			// Inline `.has` code for lower overhead:
			if ((bits & bit) === bit) yield key;
		}
	}

	/**
	 * Retrieves an iterator of the values from {@link Flags} whose values are contained in `field`.
	 * @param field The field to convert to an iterator.
	 * @returns An iterator with the values of the {@link BitField}'s flag properties whose value are contained in `field`.
	 * @example
	 * ```typescript
	 * const bitfield = new BitField({
	 * 	Read:   0b0001,
	 * 	Write:  0b0010,
	 * 	Edit:   0b0100,
	 * 	Delete: 0b1000
	 * });
	 *
	 * [...bitfield.toValues(0b0101)];
	 * // [0b0001, 0b0100]
	 * ```
	 */
	public *toValues(field: ValueResolvable<this>): IterableIterator<ValueType<this>> {
		const bits = this.resolve(field);
		for (const [_, bit] of this[FlagEntriesSymbol]) {
			// Inline `.has` code for lower overhead:
			if ((bits & bit) === bit) yield bit as unknown as ValueType<this>;
		}
	}

	/**
	 * Retrieves an iterator of the entries from {@link Flags} whose values are contained in `field`.
	 * @param field The field to convert to an iterator.
	 * @returns An iterator with the entries of the {@link BitField}'s flag properties whose value are contained in `field`.
	 * @example
	 * ```typescript
	 * const bitfield = new BitField({
	 * 	Read:   0b0001,
	 * 	Write:  0b0010,
	 * 	Edit:   0b0100,
	 * 	Delete: 0b1000
	 * });
	 *
	 * [...bitfield.toEntries(0b0101)];
	 * // [['Read', 0b0001], ['Edit', 0b0100]]
	 * ```
	 */
	public *toEntries(field: ValueResolvable<this>): IterableIterator<[key: keyof Flags, value: ValueType<this>]> {
		const bits = this.resolve(field);
		for (const [key, bit] of this[FlagEntriesSymbol]) {
			// Inline `.has` code for lower overhead:
			if ((bits & bit) === bit) yield [key, bit as unknown as ValueType<this>];
		}
	}

	/**
	 * Retrieves an object with the properties from {@link Flags} whose values are boolean denoting whether or not the
	 * flag's bit is contained in `field`.
	 * @param field The field to convert to an object.
	 * @returns An object with the properties of {@link Flags} which values are boolean.
	 * @example
	 * ```typescript
	 * const bitfield = new BitField({
	 * 	Read:   0b0001,
	 * 	Write:  0b0010,
	 * 	Edit:   0b0100,
	 * 	Delete: 0b1000
	 * });
	 *
	 * bitfield.toObject(0b0101);
	 * // {
	 * // 	Read: true,
	 * // 	Write: false,
	 * // 	Edit: true,
	 * // 	Delete: false
	 * // }
	 * ```
	 */
	public toObject(field: ValueResolvable<this>): Record<keyof Flags, boolean> {
		const bits = this.resolve(field);
		return Object.fromEntries(this[FlagEntriesSymbol].map(([key, bit]) => [key, (bits & bit) === bit])) as Record<keyof Flags, boolean>;
	}
}

export type PrimitiveType<T> = T extends number ? number : bigint;

export type MaybeArray<T> = T | readonly T[];

/**
 * Resolves the type of the values the specified {@link BitField} takes.
 * @typeparam A {@link BitField} instance type.
 */
export type ValueType<T> = T extends BitField<infer Flags> ? PrimitiveType<Flags[keyof Flags]> : never;

/**
 * Resolves the possible types accepted by the specified {@link BitField}.
 * @typeparam A {@link BitField} instance type.
 */
export type ValueResolvable<T> = T extends BitField<infer Flags> ? MaybeArray<keyof Flags | PrimitiveType<Flags[keyof Flags]>> : never;

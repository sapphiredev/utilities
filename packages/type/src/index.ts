const { getPromiseDetails, getProxyDetails } =
	typeof process === 'undefined'
		? {
				getPromiseDetails: () => undefined,
				getProxyDetails: () => undefined
		  }
		: // @ts-ignore process.binding exists
		  process.binding('util');

/**
 * The class for deep checking Types
 */
export class Type {
	/**
	 * The value to generate a deep Type of
	 */
	public readonly value: unknown;

	/**
	 * The shallow type of this
	 */
	public is: string;

	/**
	 * The parent of this Type
	 */
	private readonly parent: Type | null;

	/**
	 * The child keys of this Type
	 */
	private readonly childKeys = new Map<string, Type>();

	/**
	 * The child values of this Type
	 */
	private readonly childValues = new Map<string, Type>();

	/**
	 * @param value The value to generate a deep Type of
	 * @param parent The parent value used in recursion
	 */
	public constructor(value: unknown, parent: Type | null = null) {
		this.value = value;
		this.is = Type.resolve(value);
		this.parent = parent;
	}

	/**
	 * The type string for the children of this Type
	 */
	private get childTypes(): string {
		if (!this.childValues.size) return '';
		return `<${(this.childKeys.size ? `${Type.list(this.childKeys)}, ` : '') + Type.list(this.childValues)}>`;
	}

	/**
	 * The full type string generated.
	 */
	public toString(): string {
		this.check();
		return `${this.is}${this.childTypes}`;
	}

	/**
	 * Walks the linked list backwards, for checking circulars.
	 */
	private *parents(): Generator<Type, void, unknown> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias, no-cond-assign, consistent-this
		let current: Type | null = this;
		// eslint-disable-next-line no-cond-assign
		while ((current = current.parent)) yield current;
	}

	/**
	 * Checks if the value of this Type is a circular reference to any parent.
	 */
	private isCircular(): boolean {
		for (const parent of this.parents()) if (parent.value === this.value) return true;
		return false;
	}

	/**
	 * The subtype to create based on this.value's sub value.
	 * @param value The sub value
	 */
	private addValue(value: unknown): void {
		const child = new Type(value, this);
		this.childValues.set(child.is, child);
	}

	/**
	 * The subtype to create based on this.value's entries.
	 * @param entry The entry
	 */
	private addEntry([key, value]: [string, unknown]): void {
		const child = new Type(key, this);
		this.childKeys.set(child.is, child);
		this.addValue(value);
	}

	/**
	 * Get the deep type name that defines the input.
	 */
	private check(): void {
		if (Object.isFrozen(this)) return;

		const promise = getPromiseDetails(this.value);
		const proxy = getProxyDetails(this.value);
		if (typeof this.value === 'object' && this.isCircular()) {
			this.is = `[Circular:${this.is}]`;
		} else if (promise && promise[0]) {
			this.addValue(promise[1]);
		} else if (proxy && proxy[0]) {
			this.is = 'Proxy';
			this.addValue(proxy[0]);
		} else if (this.value instanceof Map) {
			for (const entry of this.value) this.addEntry(entry);
		} else if (Array.isArray(this.value) || this.value instanceof Set) {
			for (const value of this.value) this.addValue(value);
		} else if (this.is === 'Object') {
			this.is = 'Record';
			for (const entry of Object.entries(this.value as Record<PropertyKey, unknown>)) this.addEntry(entry);
		}

		Object.freeze(this);
	}

	/**
	 * Resolves the type name that defines the input.
	 * @param value The value to get the type name of
	 */
	public static resolve(value: any): string {
		const type = typeof value;
		switch (type) {
			case 'object':
				return value === null ? 'null' : value.constructor && value.constructor.name;
			case 'function':
				return `${value.constructor.name}(${value.length}-arity)`;
			case 'undefined':
				return 'void';
			default:
				return type;
		}
	}

	/**
	 * Joins the list of child types.
	 * @param values The values to list
	 */
	private static list(values: Map<string, Type>): string {
		return [...values.values()].sort().join(' | ');
	}
}

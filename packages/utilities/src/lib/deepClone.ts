import { isPrimitive } from './isPrimitive';

/**
 * Deep clone an object
 * @param source The object to clone
 */
export function deepClone<T>(source: T): T {
	// Check if it's a primitive (with exception of function and null, which is typeof object)
	if (source === null || isPrimitive(source)) {
		return source;
	}

	if (source instanceof Date) {
		const output = new (source.constructor as DateConstructor)(source);

		return output as unknown as T;
	}

	if (Array.isArray(source)) {
		const output = new (source.constructor as ArrayConstructor)(source.length) as unknown as T & T extends (infer S)[] ? S[] : never;

		for (let i = 0; i < source.length; i++) {
			output[i] = deepClone(source[i]);
		}

		return output as unknown as T;
	}

	if (source instanceof Map) {
		const output = new (source.constructor as MapConstructor)() as unknown as T & T extends Map<infer K, infer V> ? Map<K, V> : never;

		for (const [key, value] of source.entries()) {
			output.set(key, deepClone(value));
		}

		return output as unknown as T;
	}

	if (source instanceof Set) {
		const output = new (source.constructor as SetConstructor)() as unknown as T & T extends Set<infer K> ? Set<K> : never;

		for (const value of source.values()) {
			output.add(deepClone(value));
		}

		return output as unknown as T;
	}

	if (typeof source === 'object') {
		const output = new ((source as T & (object | Record<PropertyKey, unknown>)).constructor as ObjectConstructor)() as unknown as Record<
			PropertyKey,
			unknown
		>;

		for (const [key, value] of Object.entries(source)) {
			Object.defineProperty(output, key, {
				configurable: true,
				enumerable: true,
				value: deepClone(value),
				writable: true
			});
		}

		return output as unknown as T;
	}

	return source;
}

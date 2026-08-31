/**
 * Turn a dotted path into a json object.
 * @param path The dotted path
 * @param value The value
 * @param obj The object to edit
 * @throws If the path contains a segment that can mutate an object's prototype.
 */
export function makeObject(path: string, value: unknown, obj: Record<string, unknown> = {}): Record<string, unknown> {
	const route = path.split('.');
	if (route.some((key) => key === '__proto__' || key === 'constructor' || key === 'prototype')) {
		throw new TypeError('path cannot contain __proto__, constructor, or prototype');
	}

	if (path.includes('.')) {
		const lastKey = route.pop() as string;
		let reference = obj;
		for (const key of route) {
			if (!Object.prototype.hasOwnProperty.call(reference, key) || !reference[key]) reference[key] = {};
			reference = reference[key] as Record<string, unknown>;
		}
		reference[lastKey] = value;
	} else {
		obj[path] = value;
	}
	return obj;
}

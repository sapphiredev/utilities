/**
 * Sample function that's used internally to confirm the tsconfig is valid
 * @param param sample param
 * @private
 */
export const testBuild = <T extends unknown>(param?: T): [T | undefined] | T | number | Record<PropertyKey, T> => {
	if (typeof param === 'string') return param;
	if (typeof param === 'number') return (param as number) + 5;
	if (param instanceof Object) {
		return { key: param };
	}

	return [param];
};

import type { Parameter } from '../lexer/streams/ParameterStream';

/**
 * Joins the parameters by their `leading` value, using the `value` property.
 * @seealso {@link joinRaw} for the version using `raw` instead of `value`.
 * @param parameters The parameters to join.
 * @returns The result of joining the parameters.
 */
export function join(parameters: readonly Parameter[]) {
	if (parameters.length === 0) return '';
	if (parameters.length === 1) return parameters[0].value;

	let output = parameters[0].value;
	for (let i = 1; i < parameters.length; i++) {
		const parameter = parameters[i];
		output += parameter.leading + parameter.value;
	}

	return output;
}

/**
 * Joins the parameters by their `leading` value, using the `raw` property.
 * @seealso {@link join} for the version using `value` instead of `raw`.
 * @param parameters The parameters to join.
 * @returns The result of joining the parameters.
 */
export function joinRaw(parameters: readonly Parameter[]) {
	if (parameters.length === 0) return '';
	if (parameters.length === 1) return parameters[0].raw;

	let output = parameters[0].raw;
	for (let i = 1; i < parameters.length; i++) {
		const parameter = parameters[i];
		output += parameter.leading + parameter.raw;
	}

	return output;
}

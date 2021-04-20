import type { TitleInformation } from './EmbedJsx';
import { ValidationError, ValidationKeys } from './errors/ValidationError';

export function validateTitleData(data: unknown): asserts data is TitleInformation {
	if (!Array.isArray(data)) throw new ValidationError(ValidationKeys.Title, 'Expected an array');
	if (typeof data[0] !== 'object') throw new ValidationError(ValidationKeys.Title, 'Expected first entry to be an object or null');
	if (data[0] !== null && !Reflect.has(data[0], 'url'))
		throw new ValidationError(ValidationKeys.Title, "Invalid properties were passed, expected props are 'url'");
	if (typeof data[0].url !== 'string') throw new ValidationError(ValidationKeys.Title, `URL should be of type string, got: ${typeof data[0].url}`);
	if (typeof data[1] !== 'string') throw new ValidationError(ValidationKeys.Title, `Title should be a string, got: ${typeof data[1]}`);
}

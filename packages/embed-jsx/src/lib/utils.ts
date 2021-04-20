import type {
	TitleInformation,
	FieldInformation,
	FooterInformation,
	TimestampInformation,
	DescriptionInformation,
	ImageInformation,
	AuthorInformation
} from './EmbedJsx';
import { ValidationError, ValidationKeys } from './errors/ValidationError';

export function validateTitleData(data: unknown): asserts data is TitleInformation {
	/* istanbul ignore next */
	if (!Array.isArray(data)) throw new ValidationError(ValidationKeys.Title, 'Expected an array');
	if (typeof data[0] !== 'object') throw new ValidationError(ValidationKeys.Title, 'Expected first entry to be an object or null');
	if (data[0] !== null && !Reflect.has(data[0], 'url'))
		throw new ValidationError(ValidationKeys.Title, "Invalid properties were passed, expected props are 'url'");
	if (!['undefined', 'string'].includes(typeof data[0]?.url))
		throw new ValidationError(ValidationKeys.Title, `URL should be of type string, got: ${typeof data[0]?.url}`);
	if (typeof data[1] !== 'string') throw new ValidationError(ValidationKeys.Title, `Title should be a string, got: ${typeof data[1]}`);
}

export function validateFieldData(data: unknown): asserts data is FieldInformation {
	/* istanbul ignore next */
	if (!Array.isArray(data)) throw new ValidationError(ValidationKeys.Field, 'Expected an array');
	if (typeof data[0] !== 'object') throw new ValidationError(ValidationKeys.Field, 'Expected first entry to be an object or null');
	if (data[0] !== null && !Reflect.has(data[0], 'name') && !Reflect.has(data[0], 'inline'))
		throw new ValidationError(ValidationKeys.Field, "Invalid properties were passed, expected props are 'name', 'inline'");
	if (!['undefined', 'string'].includes(typeof data[0]?.name))
		throw new ValidationError(ValidationKeys.Field, `Name should be of type string, got: ${typeof data[0]?.name}`);
	if (!['undefined', 'boolean'].includes(typeof data[0]?.inline))
		throw new ValidationError(ValidationKeys.Field, `Inline should be of type boolean, got: ${typeof data[0]?.inline}`);
	if (typeof data[1] !== 'string') throw new ValidationError(ValidationKeys.Field, `Field value should be of type string, got: ${typeof data[1]}`);
}

export function validateFooterData(data: unknown): asserts data is FooterInformation {
	/* istanbul ignore next */
	if (!Array.isArray(data)) throw new ValidationError(ValidationKeys.Footer, 'Expected an array');
	if (typeof data[0] !== 'object') throw new ValidationError(ValidationKeys.Footer, 'Expected first entry to be an object or null');
	if (data[0] !== null && !Reflect.has(data[0], 'iconURL'))
		throw new ValidationError(ValidationKeys.Footer, "Invalid properties were passed, expected props are 'iconURL'");
	if (!['undefined', 'string'].includes(typeof data[0]?.iconURL))
		throw new ValidationError(ValidationKeys.Footer, `iconURL should be of type string, got: ${typeof data[0]?.iconURL}`);
	if (typeof data[1] !== 'string')
		throw new ValidationError(ValidationKeys.Footer, `Footer value should be of type string, got: ${typeof data[1]}`);
}

/* istanbul ignore next */
export function validateTimestampData(data: unknown): asserts data is TimestampInformation {
	/* istanbul ignore next */
	if (!Array.isArray(data)) throw new ValidationError(ValidationKeys.Timestamp, 'Expected an array');
	if (data[0] !== null) throw new ValidationError(ValidationKeys.Timestamp, 'Invalid properties were passed, no properties were expected');
	if (data[1] !== null && !['string', 'number'].includes(typeof data[1]) && !(data[1] instanceof Date))
		throw new ValidationError(ValidationKeys.Timestamp, `Data passed should be a string, number, or Date, got: ${typeof data[1]}`);
}

export function validateDescriptionData(data: unknown): asserts data is DescriptionInformation {
	/* istanbul ignore next */
	if (!Array.isArray(data)) throw new ValidationError(ValidationKeys.Description, 'Expected an array');
	if (data[0] !== null) throw new ValidationError(ValidationKeys.Description, 'Invalid properties were passed, no properties were expected');
	if (typeof data[1] !== 'string') throw new ValidationError(ValidationKeys.Description, `Data passed should be a string, got: ${typeof data[1]}`);
}

export function validateImageData(data: unknown, type: 'image' | 'thumbnail'): asserts data is ImageInformation {
	const key = type === 'thumbnail' ? ValidationKeys.Thumbnail : ValidationKeys.Image;
	/* istanbul ignore next */
	if (!Array.isArray(data)) throw new ValidationError(key, 'Expected an array');
	if (typeof data[0] !== 'object' || data[0] === null || !Reflect.has(data[0], 'url'))
		throw new ValidationError(key, "Invalid properties were passed, expected props are 'url'");
	if (typeof data[0].url !== 'string') throw new ValidationError(key, `URL should be of type string, got: ${typeof data[0].url}`);
	if (data[1] !== null && typeof data[1] !== 'undefined') throw new ValidationError(key, 'Value passed was invalid, no value expected');
}

export function validateAuthorData(data: unknown): asserts data is AuthorInformation {
	if (!Array.isArray(data)) throw new ValidationError(ValidationKeys.Author, 'Expected an array');
	if (typeof data[0] !== 'object') throw new ValidationError(ValidationKeys.Author, 'Expected first entry to be an object or null');
	if (data[0] !== null && !Reflect.has(data[0], 'url') && !Reflect.has(data[0], 'iconURL'))
		throw new ValidationError(ValidationKeys.Author, "Invalid properties were passed, expected props are 'url', 'iconURL'");
	if (!['undefined', 'string'].includes(typeof data[0]?.url))
		throw new ValidationError(ValidationKeys.Author, `URL should be of type string, got: ${typeof data[0]?.url}`);
	if (!['undefined', 'string'].includes(typeof data[0]?.iconURL))
		throw new ValidationError(ValidationKeys.Author, `Icon URL should be of type string, got: ${typeof data[0]?.iconURL}`);
	if (typeof data[1] !== 'string')
		throw new ValidationError(ValidationKeys.Author, `Author value should be of type string, got: ${typeof data[1]}`);
}

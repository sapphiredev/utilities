// eslint-disable-next-line spaced-comment
/// <reference lib="dom" />

import { QueryError } from './QueryError';
import { FetchResultTypes, type RequestOptions } from './types';

/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param type - The {@link FetchResultTypes}
 *
 * @returns A JSON of the response body. Defaults to `unknown`, with the type set by passing the generic type of this function, or casting the result.
 */
export async function fetch<R>(url: URL | string, type?: FetchResultTypes.JSON): Promise<R>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param options - The {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Request `Request`} ({@link RequestInit} for TypeScript)
 * @param type - The {@link FetchResultTypes}
 *
 * @returns A JSON of the response body. Defaults to `unknown`, with the type set by passing the generic type of this function, or casting the result.
 */
export async function fetch<R>(url: URL | string, options: RequestOptions, type?: FetchResultTypes.JSON): Promise<R>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param type - The {@link FetchResultTypes}
 *
 * @returns A {@linkplain https://nodejs.org/api/buffer.html `Buffer`} of the response body
 */
export async function fetch(url: URL | string, type: FetchResultTypes.Buffer): Promise<Buffer>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param options - The {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Request `Request`} ({@link RequestInit} for TypeScript)
 * @param type - The {@link FetchResultTypes}
 *
 * @returns A {@linkplain https://nodejs.org/api/buffer.html `Buffer`} of the response body
 */
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Buffer): Promise<Buffer>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param type - The {@link FetchResultTypes}
 *
 * @returns A {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Blob `Blob`} of the response body
 */
export async function fetch(url: URL | string, type: FetchResultTypes.Blob): Promise<Blob>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param options - The {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Request `Request`} ({@link RequestInit} for TypeScript)
 * @param type - The {@link FetchResultTypes}
 *
 * @returns A {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Blob `Blob`} of the response body
 */
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Blob): Promise<Blob>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param type - The {@link FetchResultTypes}
 *
 * @returns The response body as a raw `string`.
 */
export async function fetch(url: URL | string, type: FetchResultTypes.Text): Promise<string>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param options - The {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Request `Request`} ({@link RequestInit} for TypeScript)
 * @param type - The {@link FetchResultTypes}
 *
 * @returns The response body as a raw `string`.
 */
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Text): Promise<string>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param type - The {@link FetchResultTypes}
 *
 * @returns The raw {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} ({@link Response} in typescript).
 */
export async function fetch(url: URL | string, type: FetchResultTypes.Result): Promise<Response>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param options - The {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Request `Request`} ({@link RequestInit} for TypeScript)
 * @param type - The {@link FetchResultTypes}
 *
 * @returns The raw {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} ({@link Response} in typescript).
 */
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Result): Promise<Response>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param options - The {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Request `Request`} ({@link RequestInit} for TypeScript)
 * @param type - The {@link FetchResultTypes}
 *
 * @returns The return type is determined by the provided `type`.
 * - When using `FetchResultTypes.JSON` then the return type is `unknown` by default. The type should be specified by filling in the generic type of the function, or casting the result.
 * - When using `FetchResultTypes.Buffer` the return type will be {@linkplain https://nodejs.org/api/buffer.html `Buffer`}.
 * - When using `FetchResultTypes.Blob` the return type will be a {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Blob `Blob`}.
 * - When using `FetchResultTypes.Text` the return type will be a `string`
 * - When using `FetchResultTypes.Result` the return type will be a {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} ({@link Response} in typescript)
 */
export async function fetch<R>(url: URL | string, options: RequestOptions, type: FetchResultTypes): Promise<Response | Blob | Buffer | string | R>;
/**
 * Performs an HTTP(S) fetch
 *
 * @param url - The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param options - The {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Request `Request`} ({@link RequestInit} for TypeScript)
 * @param type - The {@link FetchResultTypes}
 *
 * @returns The return type is determined by the provided `type`.
 * - When using `FetchResultTypes.JSON` then the return type is `unknown` by default. The type should be specified by filling in the generic type of the function, or casting the result.
 * - When using `FetchResultTypes.Buffer` the return type will be {@linkplain https://nodejs.org/api/buffer.html `Buffer`}.
 * - When using `FetchResultTypes.Blob` the return type will be a {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Blob `Blob`}.
 * - When using `FetchResultTypes.Text` the return type will be a `string`
 * - When using `FetchResultTypes.Result` the return type will be a {@linkplain https://developer.mozilla.org/en-US/docs/Web/API/Response `Response`} ({@link Response} in typescript)
 */
export async function fetch(url: URL | string, options?: RequestOptions | FetchResultTypes, type?: FetchResultTypes) {
	if (typeof options === 'undefined') {
		options = {};
		type = FetchResultTypes.JSON;
	} else if (typeof options === 'string') {
		type = options;
		options = {};
	} else if (typeof type === 'undefined') {
		type = FetchResultTypes.JSON;
	}

	let { body } = options;

	if (shouldJsonStringify(body)) {
		body = JSON.stringify(body);
	}

	// Transform the URL to a String, in case an URL object was passed
	const stringUrl = String(url);

	const result: Response = await globalThis.fetch(stringUrl, {
		...options,
		body: body as RequestInit['body']
	});
	if (!result.ok) throw new QueryError(stringUrl, result.status, result, await result.clone().text());

	switch (type) {
		case FetchResultTypes.Result:
			return result;
		case FetchResultTypes.Buffer:
			return Buffer.from(await (await result.blob()).arrayBuffer());
		case FetchResultTypes.Blob:
			return result.blob();
		case FetchResultTypes.JSON:
			return result.json();
		case FetchResultTypes.Text:
			return result.text();
		default:
			throw new Error(`Unknown type "${type}"`);
	}
}

/**
 * Determines whether a value should be stringified as JSON.
 *
 * @param value - The value to check.
 * @returns A boolean indicating whether the value should be stringified as JSON.
 */
function shouldJsonStringify(value: unknown): boolean {
	// If the value is not an object, it should not be stringified
	if (typeof value !== 'object') return false;
	// Buffers should not be stringified
	if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) return false;

	// null object
	if (value === null) return true;
	// Object.create(null)
	if (value.constructor === undefined) return true;
	// Plain objects
	if (value.constructor === Object) return true;
	// Has toJSON method
	if ('toJSON' in value && typeof value.toJSON === 'function') return true;
	// Array of items, check if every item in the array is serializable
	if (Array.isArray(value)) return value.every(shouldJsonStringify);

	// Anything else (such as streams or unserializables)
	return false;
}

// eslint-disable-next-line spaced-comment
/// <reference lib="dom" />

import { QueryError } from './QueryError';
import { FetchResultTypes, type RequestOptions } from './types';

/**
 * Performs an HTTP(S) fetch
 * @param url The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param optionsOrType Either the [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) ({@link RequestInit} for TypeScript) or one of the {@link FetchResultTypes}
 * @param type Only needs to be provided if the second parameter are [Request options](https://developer.mozilla.org/en-US/docs/Web/API/Request) ({@link RequestInit} for TypeScript). One of the {@link FetchResultTypes} that will determine how the result is returned.
 * @returns The return type is determined by the provided `type`.
 * - When using `FetchResultTypes.JSON` then the return type is `unknown` by default. The type should be specified by filling in the generic type of the function, or casting the result.
 * - When using `FetchResultTypes.Buffer` the return type will be [`Buffer`](https://nodejs.org/api/buffer.html).
 * - When using `FetchResultTypes.Blob` the return type will be a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
 * - When using `FetchResultTypes.Text` the return type will be a `string`
 * - When using `FetchResultTypes.Result` the return type will be a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) ({@link Response} in typescript)
 */

export async function fetch<R>(url: URL | string, type?: FetchResultTypes.JSON): Promise<R>;
export async function fetch<R>(url: URL | string, options: RequestOptions, type?: FetchResultTypes.JSON): Promise<R>;
export async function fetch(url: URL | string, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: URL | string, type: FetchResultTypes.Blob): Promise<Blob>;
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Blob): Promise<Blob>;
export async function fetch(url: URL | string, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: URL | string, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch(url: URL | string, options: RequestOptions, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch<R>(url: URL | string, options: RequestOptions, type: FetchResultTypes): Promise<Response | Blob | Buffer | string | R>;
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

	if (body && typeof body === 'object') {
		body = JSON.stringify(body);
	}

	// Transform the URL to a String, in case an URL object was passed
	const stringUrl = String(url);

	const result: Response = await globalThis.fetch(stringUrl, { ...options, body });
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

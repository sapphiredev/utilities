import nodeFetch, { RequestInit, Response } from 'node-fetch';
import type { URL } from 'url';
import { QueryError } from './QueryError';
import { FetchResultTypes } from './types';

/**
 * Performs an HTTP(S) fetch
 * @param url The URL to send the request to. Can be either a `string` or an `URL` object.
 * `url` should be an absolute url, such as `https://example.com/`. A path-relative URL (`/file/under/root`) or protocol-relative URL (`//can-be-http-or-https.com/`) will result in a rejected `Promise`.
 * @param optionsOrType Either the [node-fetch options](https://github.com/node-fetch/node-fetch#options) or one of the {@link FetchResultTypes}
 * @param type Only needs to be provided if the second parameter are [node-fetch options](https://github.com/node-fetch/node-fetch#options). One of the {@link FetchResultTypes} that will determine how the result is returned.
 * @returns The return type is determined by the provided `type`.
 * - When using `FetchResultTypes.JSON` then the return type is `unknown` by default. The type should be specified by filling in the generic type of the function, or casting the result.
 * - When using `FetchResultTypes.Buffer` the return type is always [`Buffer`](https://nodejs.org/api/buffer.html)
 * - When using `FetchResultTypes.Text` the return type is always `string`
 * - When using `FetchResultTypes.Result` the return type is always [`Response`](https://github.com/node-fetch/node-fetch#class-response)
 */
export async function fetch<R>(url: URL | string, type?: FetchResultTypes.JSON): Promise<R>;
export async function fetch<R>(url: URL | string, options: RequestInit, type?: FetchResultTypes.JSON): Promise<R>;
export async function fetch(url: URL | string, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: URL | string, options: RequestInit, type: FetchResultTypes.Buffer): Promise<Buffer>;
export async function fetch(url: URL | string, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: URL | string, options: RequestInit, type: FetchResultTypes.Text): Promise<string>;
export async function fetch(url: URL | string, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch(url: URL | string, options: RequestInit, type: FetchResultTypes.Result): Promise<Response>;
export async function fetch<R>(url: URL | string, options: RequestInit, type: FetchResultTypes): Promise<Response | Buffer | string | R>;
export async function fetch(url: URL | string, options?: RequestInit | FetchResultTypes, type?: FetchResultTypes) {
	if (typeof options === 'undefined') {
		options = {};
		type = FetchResultTypes.JSON;
	} else if (typeof options === 'string') {
		type = options;
		options = {};
	} else if (typeof type === 'undefined') {
		type = FetchResultTypes.JSON;
	}

	const result: Response = await nodeFetch(url, options);
	if (!result.ok) throw new QueryError(url, result.status, result, await result.clone().text());

	switch (type) {
		case FetchResultTypes.Result:
			return result;
		case FetchResultTypes.Buffer:
			return result.buffer();
		case FetchResultTypes.JSON:
			return result.json();
		case FetchResultTypes.Text:
			return result.text();
		default:
			throw new Error(`Unknown type "${type}"`);
	}
}

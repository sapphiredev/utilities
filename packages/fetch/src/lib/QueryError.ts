import type { Response } from 'node-fetch';
import type { URL } from 'url';

/**
 * The QueryError class which is thrown by the `fetch` method
 */
export class QueryError extends Error {
	/** The requested url. */
	public readonly url: string;
	/** The HTTP status code. */
	public readonly code: number;
	/** The returned response body as a string */
	public readonly body: string;
	/** The original {@link Response} object */
	public readonly response: Response;
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	#json: unknown;

	public constructor(url: string | URL, code: number, response: Response, body: string) {
		super(`Failed to request '${url}' with code ${code}.`);
		this.url = typeof url === 'string' ? url : url.href;
		this.code = code;
		this.body = body;
		this.response = response;
		this.#json = null;
	}

	public toJSON() {
		return this.#json ?? (this.#json = JSON.parse(this.body));
	}
}

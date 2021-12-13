// eslint-disable-next-line spaced-comment
/// <reference lib="dom" />

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

	#json: unknown;

	public constructor(url: string, code: number, response: Response, body: string) {
		super(`Failed to request '${url}' with code ${code}.`);
		this.url = url;
		this.code = code;
		this.body = body;
		this.response = response;
		this.#json = null;
	}

	public toJSON() {
		return this.#json ?? (this.#json = JSON.parse(this.body));
	}
}

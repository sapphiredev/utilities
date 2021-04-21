/**
 * The supported return types for the `fetch` method
 */
export const enum FetchResultTypes {
	/**
	 * Returns only the body, as JSON. Similar to [`Body.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json).
	 *
	 * You should provide your own type cast (either through the generic return type, or with `as <type>`) to the response to define
	 * the JSON structure, otherwise the result will be `unknown`.
	 */
	JSON = 'json',
	/**
	 * Returns only the body, as a [Buffer](https://nodejs.org/api/buffer.html). Similar to [`Body.blob()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/blob).
	 */
	Buffer = 'buffer',
	/**
	 * Returns only the body, as plain text. Similar to [`Body.text()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/text).
	 */
	Text = 'text',
	/**
	 * Returns the entire response and doesn't parse the `body` in any way.
	 */
	Result = 'result'
}

/**
 * The list of [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
 */
export const enum FetchMethods {
	/**
	 * The `GET` method requests a representation of the specified resource. Requests using `GET` should only retrieve data.
	 * @see [MDN / Web / HTTP / Methods / GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET)
	 */
	Get = 'GET',
	/**
	 * The `HEAD` method asks for a response identical to that of a {@link FetchMethods.Get `GET`} request, but without the response body.
	 * @see [MDN / Web / HTTP / Methods / HEAD](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD)
	 */
	Head = 'HEAD',
	/**
	 * The `POST` method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
	 * @see [MDN / Web / HTTP / Methods / POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
	 */
	Post = 'POST',
	/**
	 * The `PUT` method replaces all current representations of the target resource with the request payload.
	 * @see [MDN / Web / HTTP / Methods / PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)
	 */
	Put = 'PUT',
	/**
	 * The `DELETE` method deletes the specified resource.
	 * @see [MDN / Web / HTTP / Methods / DELETE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE)
	 */
	Delete = 'DELETE',
	/**
	 *  The `CONNECT` method establishes a tunnel to the server identified by the target resource
	 * @see [MDN / Web / HTTP / Methods / CONNECT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT)
	 */
	Connect = 'CONNECT',
	/**
	 * The `OPTIONS` method is used to describe the communication options for the target resource.
	 * @see [MDN / Web / HTTP / Methods / OPTIONS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS)
	 */
	Options = 'OPTIONS',
	/**
	 * The `TRACE` method performs a message loop-back test along the path to the target resource.
	 * @see [MDN / Web / HTTP / Methods / TRACE](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE)
	 */
	Trace = 'TRACE',
	/**
	 * The `PATCH` method is used to apply partial modifications to a resource.
	 * @see [MDN / Web / HTTP / Methods / PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)
	 */
	Patch = 'PATCH'
}

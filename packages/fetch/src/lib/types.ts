/**
 * The supported return types for the `fetch` method
 */
export enum FetchResultTypes {
	/**
	 * Returns only the body, as JSON. Similar to [`Body.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json).
	 *
	 * You should provide your own type cast (either through the generic return type, or with `as <type>`) to the response to define
	 * the JSON structure, otherwise the result will be `unknown`.
	 */
	JSON = 'json',
	/**
	 * Returns only the body, as a [Buffer](https://nodejs.org/api/buffer.html).
	 * @remark Does not work in a Browser environment. For browsers use {@link FetchResultTypes.Blob} instead.
	 * If you use this type in a Browsers environment a {@link ReferenceError `ReferenceError: Buffer is not defined`} will be thrown!
	 */
	Buffer = 'buffer',
	/**
	 * Returns only the body, as a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
	 * @remark For NodeJS environment other `FetchResultTypes` are recommended, but you can use a Blob if you want to.
	 */
	Blob = 'blob',
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
export enum FetchMethods {
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

/**
 * A list of common [Media Content Types](https://www.iana.org/assignments/media-types/media-types.xhtml) as defined by the [IANA](https://www.iana.org/).
 * Media Content Types are also known as a Multipurpose Internet Mail Extensions or MIME type
 * Media Content Types are defined and standardized in IETF's [RFC 6838](https://datatracker.ietf.org/doc/html/rfc6838).
 */
export enum FetchMediaContentTypes {
	/**
	 * The `audio/aac` media content type.
	 * @see [Media-Types / audio / aac](https://www.iana.org/assignments/media-types/audio/aac)
	 */
	AudioAac = 'audio/aac',
	/**
	 * The `audio/mp4` media content type.
	 * @see [Media-Types / audio / mp4](https://www.iana.org/assignments/media-types/audio/mp4)
	 * @see [[RFC4337](https://www.iana.org/go/rfc4337)] [[RFC6381](https://www.iana.org/go/rfc6381)]
	 */
	AudioMp4 = 'audio/mp4',
	/**
	 * The `audio/mpeg` media content type.
	 * @see [Media-Types / audio / mpeg](https://www.iana.org/assignments/media-types/audio/mpeg)
	 * @see [[RFC3003](https://www.iana.org/go/rfc3003)]
	 */
	AudioMpeg = 'audio/mpeg',
	/**
	 * The `audio/ogg` media content type.
	 * @see [Media-Types / audio / ogg](https://www.iana.org/assignments/media-types/audio/ogg)
	 * @see [[RFC5334](https://www.iana.org/go/rfc5334)] [[RFC7845](https://www.iana.org/go/rfc7845)]
	 */
	AudioOgg = 'audio/ogg',
	/**
	 * The `audio/opus` media content type.
	 * @see [Media-Types / audio / opus](https://www.iana.org/assignments/media-types/audio/opus)
	 * @see [[RFC7587](https://www.iana.org/go/rfc7587)]
	 */
	AudioOpus = 'audio/opus',
	/**
	 * The `audio/vorbis` media content type.
	 * @see [Media-Types / audio / vorbis](https://www.iana.org/assignments/media-types/audio/vorbis)
	 * @see [[RFC5215](https://www.iana.org/go/rfc5215)]
	 */
	AudioVorbis = 'audio/vorbis',
	/**
	 * The `audio/wav` media content type.
	 */
	AudioWav = 'audio/wav',
	/**
	 * The `audio/webm` media content type.
	 */
	AudioWebm = 'audio/webm',
	/**
	 * The `font/otf` media content type.
	 * @see [Media-Types / font / otf](https://www.iana.org/assignments/media-types/font/otf)
	 * @see [[RFC8081](https://www.iana.org/go/rfc8081)]
	 */
	FontOtf = 'font/otf',
	/**
	 * The `font/ttf` media content type.
	 * @see [Media-Types / font / ttf](https://www.iana.org/assignments/media-types/font/ttf)
	 * @see [[RFC8081](https://www.iana.org/go/rfc8081)]
	 */
	FontTtf = 'font/ttf',
	/**
	 * The `font/woff` media content type.
	 * @see [Media-Types / font / woff](https://www.iana.org/assignments/media-types/font/woff)
	 * @see [[RFC8081](https://www.iana.org/go/rfc8081)]
	 */
	FontWoff = 'font/woff',
	/**
	 * The `font/woff2` media content type.
	 * @see [Media-Types / font / woff2](https://www.iana.org/assignments/media-types/font/woff2)
	 * @see [[RFC8081](https://www.iana.org/go/rfc8081)]
	 */
	FontWoff2 = 'font/woff2',
	/**
	 * The `multipart/form-data` media content type.
	 * @see [Media-Types / multipart / form-data](https://www.iana.org/assignments/media-types/multipart/form-data)
	 * @see [[RFC7578](https://www.iana.org/go/rfc7578)]
	 */
	FormData = 'multipart/form-data',
	/**
	 * The `x-www-form-urlencoded` media content type.
	 * @see [Media-Types / application / x-www-form-urlencoded](https://www.iana.org/assignments/media-types/application/x-www-form-urlencoded)
	 */
	FormURLEncoded = 'application/x-www-form-urlencoded',
	/**
	 * The `image/apng` media content type.
	 * @see [Media-Types / image / apng](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#apng_animated_portable_network_graphics)
	 */
	ImageAPNG = 'image/apng',
	/**
	 * The `image/gif` media content type.
	 * @see [Media-Types / image / gif](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#gif_graphics_interchange_format)
	 * @see [[RFC2045](https://www.iana.org/go/rfc2045)] [[RFC2046](https://www.iana.org/go/rfc2046)]
	 */
	ImageGIF = 'image/gif',
	/**
	 * The `image/jpeg` media content type.
	 * @see [Media-Types / image / jpeg](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#jpeg_joint_photographic_experts_group_image)
	 * @see [[RFC2045](https://www.iana.org/go/rfc2045)] [[RFC2046](https://www.iana.org/go/rfc2046)]
	 */
	ImageJPEG = 'image/jpeg',
	/**
	 * The `image/png` media content type.
	 * @see [Media-Types / image / png](https://www.iana.org/assignments/media-types/image/png)
	 */
	ImagePNG = 'image/png',
	/**
	 * The `image/webp` media content type.
	 * @see [Media-Types / image / webp](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#webp_image)
	 */
	ImageWEBP = 'image/webp',
	/**
	 * The `application/json` media content type.
	 * @see [Media-Types / application / json](https://www.iana.org/assignments/media-types/application/json)
	 * @see [[RFC8259](https://www.iana.org/go/rfc8259)]
	 */
	JSON = 'application/json',
	/**
	 * The `application/javascript` media content type.
	 * @see [Media-Types / application / javascript](https://www.iana.org/assignments/media-types/application/javascript)
	 * @see [[RFC4329](https://www.iana.org/go/rfc4329)]
	 */
	JavaScript = 'application/javascript',
	/**
	 * The `application/octet-stream` media content type.
	 * @see [Media-Types / application / octet-stream](https://www.iana.org/assignments/media-types/application/octet-stream)
	 * @see [[RFC2045](https://www.iana.org/go/rfc2045)] [[RFC2046(https://www.iana.org/go/rfc2046)]
	 */
	OctetStream = 'application/octet-stream',
	/**
	 * The `text/css` media content type.
	 * @see [Media-Types / text / css](https://www.iana.org/assignments/media-types/text/css)
	 * @see [[RFC2318](https://www.iana.org/go/rfc2318)]
	 */
	TextCSS = 'text/css',
	/**
	 * The `text/HTML` media content type.
	 * @see [Media-Types / text / html](https://www.iana.org/assignments/media-types/text/html)
	 */
	TextHTML = 'text/html',
	/**
	 * The `text/plain` media content type.
	 * @see [Media-Types / text / plain](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#textplain)
	 * @see [[RFC2046](https://www.iana.org/go/rfc2046)] [[RFC3676](https://www.iana.org/go/rfc3676)] [[RFC5147](https://www.iana.org/go/rfc5147)]
	 */
	TextPlain = 'text/plain',
	/**
	 * The `video/h264` media content type.
	 * @see [Media-Types / video / h264](https://www.iana.org/assignments/media-types/video/H264)
	 * @see [[RFC6184](https://www.iana.org/go/rfc6184)]
	 */
	VideoH264 = 'video/h264',
	/**
	 * The `video/h265` media content type.
	 * @see [Media-Types / video / h265](https://www.iana.org/assignments/media-types/video/H265)
	 * @see [[RFC7798](https://www.iana.org/go/rfc7798)]
	 */
	VideoH265 = 'video/h265',
	/**
	 * The `video/mp4` media content type.
	 * @see [Media-Types / video / mp4](https://www.iana.org/assignments/media-types/video/mp4)
	 * @see [[RFC4337](https://www.iana.org/go/rfc4337)] [[RFC6381](https://www.iana.org/go/rfc6381)]
	 */
	VideoMp4 = 'video/mp4',
	/**
	 * The `video/ogg` media content type.
	 * @see [Media-Types / video / ogg](https://www.iana.org/assignments/media-types/video/ogg)
	 * @see [[RFC5334](https://www.iana.org/go/rfc5334)] [[RFC7845](https://www.iana.org/go/rfc7845)]
	 */
	VideoOgg = 'video/ogg',
	/**
	 * The `video/webm` media content type.
	 */
	VideoWebm = 'video/webm',
	/**
	 * The `application/xml` media content type.
	 * @see [Media-Types / application / xml](https://www.iana.org/assignments/media-types/application/xml)
	 * @see [[RFC7303](https://www.iana.org/go/rfc7303)]
	 */
	XML = 'application/xml'
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
	body?: BodyInit | Record<any, any>;
}

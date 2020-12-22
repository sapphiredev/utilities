declare module 'twemoji-parser/dist/lib/regex' {
	/**
	 * Regex that can capture a Twemoji (Twitter Emoji)
	 * @raw {@link https://github.com/twitter/twemoji-parser/blob/master/src/lib/regex.js See official source code}
	 * @remark Capture group 1 is the Twemoji name. It is named `name`.
	 */
	const regex: string;

	export default regex;
}

const WordSeparatorCharacter = /[\p{Separator}\p{Punctuation}\p{Control}]/u;

/**
 * Split a text by its latest space character in a range from the character 0 to the selected one.
 * @param str The text to split.
 * @param length The length of the desired string.
 * @copyright 2019 Aura Román
 * @license Apache-2.0
 */
export function cutText(str: string, length: number) {
	if (str.length <= length) return str;

	const codepoints = [...str];
	if (codepoints.length <= length) return str;

	let lastSeparator = length;
	for (let i = 0; i < length; ++i) {
		if (WordSeparatorCharacter.test(codepoints[i])) {
			lastSeparator = i;
		}
	}

	const lastCharacterIndex = lastSeparator === length ? length - 1 : lastSeparator;
	return codepoints.slice(0, lastCharacterIndex).concat('…').join('');
}

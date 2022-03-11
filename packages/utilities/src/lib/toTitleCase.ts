const TO_TITLE_CASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;

/**
 * The variants that will not strictly follow the `toTitleCase` algorithm
 * and will instead return the value matched with the key.
 *
 * This table lists how certain terms are converted.
 * Any terms not included are converted to regular `Titlecase`.
 * |       Term       |   Converted To   |
 * |:---------------- |:---------------- |
 * | textchannel      | TextChannel      |
 * | voicechannel     | VoiceChannel     |
 * | categorychannel  | CategoryChannel  |
 * | guildmember      | GuildMember      |
 */
export const baseVariants: Record<string, string> = {
	textchannel: 'TextChannel',
	voicechannel: 'VoiceChannel',
	categorychannel: 'CategoryChannel',
	guildmember: 'GuildMember'
};

/**
 * Converts a string to Title Case
 *
 * @description This is designed to also ensure common Discord PascalCased strings
 * are put in their TitleCase {@link baseVariants}.
 *
 * You can also provide your own variants to merge with the {@link baseVariants} for
 * your own functionality use.
 *
 * @param str The string to title case
 * @param options The options to use when converting the string
 */
export function toTitleCase(str: string, options: ToTitleCaseOptions = {}): string {
	const { additionalVariants = {}, caseSensitive } = options;
	const titleCaseVariants = {
		...baseVariants,
		...(caseSensitive
			? additionalVariants
			: Object.entries(additionalVariants).reduce<Record<string, string>>(
					(variants, [key, variant]) => ({ ...variants, [key.toLowerCase()]: variant }),
					{}
			  ))
	};

	return str.replace(
		TO_TITLE_CASE,
		(txt) => titleCaseVariants[caseSensitive ? txt : txt.toLowerCase()] ?? txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
	);
}

/**
 * The options to use when converting a string to title case
 */
export interface ToTitleCaseOptions {
	/**
	 * The optional additional variants to use when converting the string
	 */
	additionalVariants?: Record<string, string>;

	/**
	 * Whether to convert the string to title case in a case sensitive manner.
	 */
	caseSensitive?: boolean;
}

const TO_TITLE_CASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;

/**
 * The variants that will not strictly follow the `toTitleCase` algorithm
 * and will instead return the value matched with the key.
 *
 * This table lists how certain terms are converted, these are case insensitive.
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
 * @param additionalVariants The optional title case variants to merge with {@link baseVariants}
 */
export function toTitleCase(str: string, additionalVariants: Record<string, string> = {}): string {
	const titleCaseVariants = { ...baseVariants, ...additionalVariants };

	return str.replace(TO_TITLE_CASE, (txt) => titleCaseVariants[txt] ?? txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

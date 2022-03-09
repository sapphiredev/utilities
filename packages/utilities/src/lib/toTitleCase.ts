const TO_TITLE_CASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;
const baseVariants: Record<string, string> = {
	textchannel: 'TextChannel',
	voicechannel: 'VoiceChannel',
	categorychannel: 'CategoryChannel',
	guildmember: 'GuildMember'
};

/**
 * Converts a string to Title Case
 * @description This is designed to also ensure common Discord PascalCased strings
 * 				are put in their TitleCase baseVariants. See below for the full list.
 *              You can also provide your own variants to merge with the baseVariants
 *              for your own functionality use.
 * @param str The string to title case
 * @param variants The optional title case variants to merge with baseVariants
 * @terms
 * This table lists how certain terms are converted, these are case insensitive.
 * Any terms not included are converted to regular Titlecase.
 *
 *      | Term            |    Converted To |
 *      |-----------------|-----------------|
 *      | textchannel     |     TextChannel |
 *      | voicechannel    |    VoiceChannel |
 *      | categorychannel | CategoryChannel |
 *      | guildmember     |     GuildMember |
 */
export function toTitleCase(str: string, variants: Record<string, string> = {}): string {
	const titleCaseVariants = { ...baseVariants, ...variants };

	return str.replace(TO_TITLE_CASE, (txt) => titleCaseVariants[txt] ?? txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

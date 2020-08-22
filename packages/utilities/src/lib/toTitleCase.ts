// eslint-disable-next-line @typescript-eslint/naming-convention
const TOTITLECASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;
const titleCaseVariants: Record<string, string> = {
	textchannel: 'TextChannel',
	voicechannel: 'VoiceChannel',
	categorychannel: 'CategoryChannel',
	guildmember: 'GuildMember'
};

/**
 * Converts a string to Title Case
 * @description This is designed to also ensure common Discord PascalCased strings
 * 				are put in their TitleCase titleCaseVariants. See below for the full list.
 * @param str The string to title case
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
export function toTitleCase(str: string): string {
	return str.replace(TOTITLECASE, (txt) => titleCaseVariants[txt] || txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

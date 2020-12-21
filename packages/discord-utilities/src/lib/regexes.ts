/**
 * Regex that can capture the ID in Discord Channel mentions
 * @raw `/^(?:<#)?(\d{17,19})>?$/`
 * @remark Capture group 1 is the ID of the channel. It is named `id`.
 */
export const ChannelMentionRegex = /^(?:<#)?(?<id>\d{17,19})>?$/;

/**
 * Regex that matches links on the known Discord host names
 * @raw `/^(?:\w+\.)?(?:discordapp.com|discord.gg|discord.com)$/i`
 * @remark The regex is case insensitive
 */
export const DiscordHostnameRegex = /(?:\w+\.)?(?:(?:discordapp|discord)\.com|discord\.gg)/i;

/**
 * Regex that can can capture the code of Discord invite links
 * @raw `^(?:https?:\/\/)?(?:www.)?(?:discord\.gg\/|discordapp\.com\/invite\/)?(?<code>[\w\d-]{2,})$`
 * @remark Capture group 1 is the invite URL's unique code. It is named `code`.
 */
export const DiscordInviteLinkRegex = /^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg\/|discordapp\.com\/invite\/)?(?<code>[\w\d-]{2,})$/i;

/**
 * Regex that can capture the ID of any animated or non-animated custom Discord emoji
 * @raw `/^(?:<a?:\w{2,32}:)?(\d{17,21})>?$/`
 * @remark Capture group 1 is the ID of the emoji. It is named `id`.
 */
export const EmojiRegex = /^(?:<a?:\w{2,32}:)?(?<id>\d{17,21})>?$/;

/**
 * Regex that matches any animated or non-animated custom Discord emoji.
 * Unlike [[EmojiRegex]] It can be a substring of a larger string.
 * @raw `/<a?:\w{2,32}:\d{17,18}>/`
 */
export const FormattedCustomEmoji = /<a?:\w{2,32}:\d{17,18}>/;

/**
 * Regex that can capture any animated or non-animated custom Discord emoji.
 * Similar to [[FormattedCustomEmoji]] and unlike [[EmojiRegex]] can also be a substring of a larger string.
 * @raw `/^(a?):([^:]+):(\d{17,19})$/`
 * @remark Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * @remark Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * @remark Capture group 2 is the ID of the emoji. It is named `id`.
 */
export const FormattedCustomEmojiWithGroups = /^(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,19})$/;

/**
 * Regex that matches any URL starting with `http` or `https`
 * @raw `/^https?:\/\//`
 * @remark for WebSocket URLs see [[WebsocketGenericUrlRegex]]
 */
export const HttpUrlRegex = /^https?:\/\//;

/**
 * Regex that can capture the Guild, Channel, and Message ID based on a shareable Discord message link.
 * @raw `/^(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,19}|@me))\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})$/`
 * @remark Capture group 1 is the ID of the guild the message was sent in. It is named `guildId`.
 * @remark Capture group 2 is the ID of the channel in that guild the message was sent in. It is named `channelId`.
 * @remark Capture group 3 is the ID of the message itself. It is named `messageId`.
 */
export const MessageLinkRegex = /^(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,19}|@me))\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})$/;

/**
 * Regex that matches any animated or non-animated custom Discord emoji *without the wrapping `<...>` symbols.
 * This means that a string that matches this regex can directly be send inside a Discord message.
 * Other than this difference it is similar to [[FormattedCustomEmoji]].
 * @raw `/a?:\w{2,32}:\d{17,18}/`
 */
export const ParsedCustomEmoji = /a?:\w{2,32}:\d{17,18}/;

/**
 * Regex that matches any animated or non-animated custom Discord emoji *without the wrapping `<...>` symbols.
 * This means that a string that matches this regex can directly be send inside a Discord message.
 * Other than this difference it is similar to [[FormattedCustomEmojiWithGroups]].
 * @raw `/^(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,19})$/`
 * @remark Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * @remark Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * @remark Capture group 2 is the ID of the emoji. It is named `id`.
 */
export const ParsedCustomEmojiWithGroups = /^(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,19})$/;

/**
 * Regex that can capture the ID in Discord Role mentions
 * @raw `/^(?:<@&)?(?<id>\d{17,19})>?$/`
 * @remark Capture group 1 is the ID of the role. It is named `id`.
 */
export const RoleMentionRegex = /^(?:<@&)?(?<id>\d{17,19})>?$/;

/**
 * Regex that can capture any Discord Snowflake ID
 * @raw `/^(?<snowflake>\d{17,19})$/`
 * @remark Capture group 1 is the Snowflake. It is named `snowflake`.
 */
export const SnowflakeRegex = /^(?<snowflake>\d{17,19})$/;

/**
 * Regex that can capture a Twemoji (Twitter Emoji)
 * @raw `/^(?<name>[^a-zA-Z0-9]{1,11})$/`
 * @remark Capture group 1 is the Twemoji name. It is named `name`.
 */
export const TwemojiRegex = /^(?<name>[^a-zA-Z0-9]{1,11})$/;

/**
 * Regex that can capture the ID of a user in Discord user mentions
 * @raw `^(?:<@!?)?(?<id>\d{17,19})>?$`
 * @remark Capture group 1 is the ID of the user. It is named `id`.
 */
export const UserOrMemberMentionRegex = /^(?:<@!?)?(?<id>\d{17,19})>?$/;

/**
 * Regex that matches any WebSocket URL starting with `ws` or `wss`
 * @raw `/^wss?:\/\//`
 * @remark for regular HTTP URLs see [[HttpUrlRegex]]
 */
export const WebsocketUrlRegex = /^wss?:\/\//;

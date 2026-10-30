/**
 * Regex that can capture the ID in Discord Channel mentions
 *
 * `/^<#(?<id>\d{17,20})>$/`
 * Capture group 1 is the ID of the channel. It is named `id`.
 */
export const ChannelMentionRegex = /^<#(?<id>\d{17,20})>$/;

/**
 * Regex that can capture the channel and message IDs in a channelId-messageId pattern
 * This pattern can be found when you hold Shift and hover over a message, and click the "ID" button
 *
 * `/^(?<channelId>\d{17,20})-(?<messageId>\d{17,20})$/`
 * Capture group 1 is the ID of the channel, named `channelId`.
 * Capture group 2 is the ID of the message, named `messageId`.
 */
export const ChannelMessageRegex = /^(?<channelId>\d{17,20})-(?<messageId>\d{17,20})$/;

/**
 * Regex that matches links on the known Discord host names
 *
 * `/(?<subdomain>\w+)\.?(?<hostname>dis(?:cord)?(?:app|merch|status)?)\.(?<tld>com|g(?:d|g|ift)|(?:de(?:sign|v))|media|new|store|net)/i`
 * The regex is case insensitive
 * Capture group 1 is the subdomain for this URL. It is named `subdomain`.
 * Capture group 2 is the hostname for this URL, primarily `discord` but can also be `discordmerch`, `discordstatus`, `dis`, and `discordapp`. It is named `hostname`.
 * Capture group 3 is the Top-Level Domain *without* `.`. It is named `tld`.
 */
export const DiscordHostnameRegex =
	/(?<subdomain>\w+)\.?(?<hostname>dis(?:cord)?(?:app|merch|status)?)\.(?<tld>com|g(?:d|g|ift)|(?:de(?:sign|v))|media|new|store|net)/i;

/**
 * Regex that can can capture the code of Discord invite links
 *
 * `/(?:^|\b)discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/(?<code>[\w-]{2,255})(?:$|\b)/gi`
 * Capture group 1 is the invite URL's unique code. It is named `code`.
 */
export const DiscordInviteLinkRegex = /(?:^|\b)discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/(?<code>[\w-]{2,255})(?:$|\b)/gi;

/**
 * Regex that can capture the ID of any animated or non-animated custom Discord emoji
 *
 * `/^(?:<(?<animated>a)?:(?<name>\w{2,32}):)?(?<id>\d{17,21})>?$/`
 * Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * Capture group 3 is the ID of the emoji. It is named `id`.
 */
export const EmojiRegex = /^(?:<(?<animated>a)?:(?<name>\w{2,32}):)?(?<id>\d{17,21})>?$/;

/**
 * Regex that matches any animated or non-animated custom Discord emoji.
 * Unlike {@link EmojiRegex} It can be a substring of a larger string.
 *
 * `/<a?:\w{2,32}:\d{17,20}>/`
 */
export const FormattedCustomEmoji = /<a?:\w{2,32}:\d{17,20}>/;

/**
 * Regex that can capture any animated or non-animated custom Discord emoji.
 * Similar to {@link FormattedCustomEmoji} and unlike {@link EmojiRegex} can also be a substring of a larger string.
 *
 * `/(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/`
 * Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * Capture group 3 is the ID of the emoji. It is named `id`.
 */
export const FormattedCustomEmojiWithGroups = /(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/;

/**
 * Regex that matches any URL starting with `http` or `https`
 *
 * `/^https?:\/\//`
 * for WebSocket URLs see {@link WebSocketUrlRegex}
 */
export const HttpUrlRegex = /^https?:\/\//;

/**
 * Regex that can capture the Guild, Channel, and Message ID based on a shareable Discord message link.
 *
 * `/^(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,20}|@me))\/(?<channelId>\d{17,20})\/(?<messageId>\d{17,20})$/`
 * Capture group 1 is the ID of the guild the message was sent in. It is named `guildId`.
 * Capture group 2 is the ID of the channel in that guild the message was sent in. It is named `channelId`.
 * Capture group 3 is the ID of the message itself. It is named `messageId`.
 */
export const MessageLinkRegex =
	/^(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,20}|@me))\/(?<channelId>\d{17,20})\/(?<messageId>\d{17,20})$/;

/**
 * Regex that matches any animated or non-animated custom Discord emoji *without the wrapping `<...>` symbols.
 * This means that a string that matches this regex can directly be send inside a Discord message.
 * Other than this difference it is similar to {@link FormattedCustomEmoji}.
 *
 * `/a?:\w{2,32}:\d{17,20}/`
 */
export const ParsedCustomEmoji = /a?:\w{2,32}:\d{17,20}/;

/**
 * Regex that matches any animated or non-animated custom Discord emoji *without the wrapping `<...>` symbols.
 * This means that a string that matches this regex can directly be send inside a Discord message.
 * Other than this difference it is similar to {@link FormattedCustomEmojiWithGroups}.
 *
 * `/(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/`
 * Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * Capture group 3 is the ID of the emoji. It is named `id`.
 */
export const ParsedCustomEmojiWithGroups = /(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,20})/;

/**
 * Regex that can capture the ID in Discord Role mentions
 *
 * `/^<@&(?<id>\d{17,20})>$/`
 * Capture group 1 is the ID of the role. It is named `id`.
 */
export const RoleMentionRegex = /^<@&(?<id>\d{17,20})>$/;

/**
 * Regex that can capture any Discord Snowflake ID
 *
 * `/^(?<id>\d{17,20})$/`
 * Capture group 1 is the Snowflake. It is named `id`.
 */
export const SnowflakeRegex = /^(?<id>\d{17,20})$/;

/**
 * Regex that can capture a Discord Token
 *
 * `/(?<mfaToken>mfa\.[\w-]{20,})|(?<basicToken>[\w-]{23,28}\.[\w-]{6,7}\.[\w-]{27})/i`
 * Capture group 1 can be used to retrieve a token for a User that has Multi-Factor Authentication enabled. It is named `mfaToken`.
 * Capture group 2 can be used to retrieve a token for a User that doesn't have Multi-Factor Authentication enabled, or a Bot application. It is named `basicToken`.
 * For a valid token, either Capture group 1 or Capture group 2 will always be undefined, whereas the other group will then be defined and
 * contain the matched token.
 * You can use the name of the capture group to determine if the validated token was configured for a user with Multi-Factor Authentication, for a user without Multi-Factor Authentication, or for a bot application.
 * If both capture groups are undefined, then the token is invalid.
 */
export const TokenRegex = /(?<mfaToken>mfa\.[\w-]{20,})|(?<basicToken>[\w-]{23,28}\.[\w-]{6,7}\.[\w-]{27})/i;

/**
 * Regex that can capture the ID of a user in Discord user mentions
 *
 * `/^<@!?(?<id>\d{17,20})>$/`
 * Capture group 1 is the ID of the user. It is named `id`.
 */
export const UserOrMemberMentionRegex = /^<@!?(?<id>\d{17,20})>$/;

/**
 * Regex that matches any WebSocket URL starting with `ws` or `wss`
 *
 * `/^wss?:\/\//`
 * for regular HTTP URLs see {@link HttpUrlRegex}
 */
export const WebSocketUrlRegex = /^wss?:\/\//;

/**
 * Regex that captures the Webhook ID and token from a Discord Webhook URL.
 *
 * `/(?<url>^https:\/\/(?:(?:canary|ptb).)?discord(?:app)?.com\/api(?:\/v\d+)?\/webhooks\/(?<id>\d+)\/(?<token>[\w-]+)\/?$)/`
 * Capture group 1 is the full URL of the Discord Webhook. It is named `url`.
 * Capture group 2 is the ID of the Discord Webhook. It is named `id`.
 * Capture group 3 is the token of the Discord Webhook. It is named `token`.
 * for regular HTTP URLs see {@link HttpUrlRegex}
 */
export const WebhookRegex = /(?<url>^https:\/\/(?:(?:canary|ptb).)?discord(?:app)?.com\/api(?:\/v\d+)?\/webhooks\/(?<id>\d+)\/(?<token>[\w-]+)\/?$)/;

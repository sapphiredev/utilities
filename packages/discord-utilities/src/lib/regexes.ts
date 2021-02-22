import twemojiRegex from 'twemoji-parser/dist/lib/regex';

/**
 * Regex that can capture the ID in Discord Channel mentions
 * @raw `/^<#(?<id>\d{17,19})>$/`
 * @remark Capture group 1 is the ID of the channel. It is named `id`.
 */
export const ChannelMentionRegex = /^<#(?<id>\d{17,19})>$/;

/**
 * Regex that matches links on the known Discord host names
 * @raw `/(?<subdomain>\w+)\.?(?<hostname>dis(?:cord)?(?:app|merch|status)?)\.(?<tld>com|g(?:d|g|ift)|(?:de(?:sign|v))|media|new|store|net)/i`
 * @remark The regex is case insensitive
 * @remark Capture group 1 is the subdomain for this URL. It is named `subdomain`.
 * @remark Capture group 2 is the hostname for this URL, primarily `discord` but can also be `discordmerch`, `discordstatus`, `dis`, and `discordapp`. It is named `hostname`.
 * @remark Capture group 3 is the Top-Level Domain *without* `.`. It is named `tld`.
 */
export const DiscordHostnameRegex = /(?<subdomain>\w+)\.?(?<hostname>dis(?:cord)?(?:app|merch|status)?)\.(?<tld>com|g(?:d|g|ift)|(?:de(?:sign|v))|media|new|store|net)/i;

/**
 * Regex that can can capture the code of Discord invite links
 * @raw `/^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg\/|discord(?:app)?\.com\/invite\/)?(?<code>[\w\d-]{2,})$/i`
 * @remark Capture group 1 is the invite URL's unique code. It is named `code`.
 */
export const DiscordInviteLinkRegex = /^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg\/|discord(?:app)?\.com\/invite\/)?(?<code>[\w\d-]{2,})$/i;

/**
 * Regex that can capture the ID of any animated or non-animated custom Discord emoji
 * @raw `/^(?:<(?<animated>a)?:(?<name>\w{2,32}):)?(?<id>\d{17,21})>?$/`
 * @remark Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * @remark Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * @remark Capture group 3 is the ID of the emoji. It is named `id`.
 */
export const EmojiRegex = /^(?:<(?<animated>a)?:(?<name>\w{2,32}):)?(?<id>\d{17,21})>?$/;

/**
 * Regex that matches any animated or non-animated custom Discord emoji.
 * Unlike [[EmojiRegex]] It can be a substring of a larger string.
 * @raw `/<a?:\w{2,32}:\d{17,18}>/`
 */
export const FormattedCustomEmoji = /<a?:\w{2,32}:\d{17,18}>/;

/**
 * Regex that can capture any animated or non-animated custom Discord emoji.
 * Similar to [[FormattedCustomEmoji]] and unlike [[EmojiRegex]] can also be a substring of a larger string.
 * @raw `/(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,19})/`
 * @remark Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * @remark Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * @remark Capture group 3 is the ID of the emoji. It is named `id`.
 */
export const FormattedCustomEmojiWithGroups = /(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,19})/;

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
 * @raw `/(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,19})/`
 * @remark Capture group 1 can be used to determine whether the emoji is animated or not. It is named `animated`.
 * @remark Capture group 2 is the name of the emoji as it is typed in a message. It is named `name`.
 * @remark Capture group 3 is the ID of the emoji. It is named `id`.
 */
export const ParsedCustomEmojiWithGroups = /(?<animated>a?):(?<name>[^:]+):(?<id>\d{17,19})/;

/**
 * Regex that can capture the ID in Discord Role mentions
 * @raw `/^<@&(?<id>\d{17,19})>$/`
 * @remark Capture group 1 is the ID of the role. It is named `id`.
 */
export const RoleMentionRegex = /^<@&(?<id>\d{17,19})>$/;

/**
 * Regex that can capture any Discord Snowflake ID
 * @raw `/^(?<id>\d{17,19})$/`
 * @remark Capture group 1 is the Snowflake. It is named `id`.
 */
export const SnowflakeRegex = /^(?<id>\d{17,19})$/;

/**
 * Regex that can capture a Twemoji (Twitter Emoji)
 * @raw {@link https://github.com/twitter/twemoji-parser/blob/master/src/lib/regex.js See official source code}
 */
export const TwemojiRegex = twemojiRegex;

/**
 * Regex that can capture the ID of a user in Discord user mentions
 * @raw `/^<@!?(?<id>\d{17,19})>$/`
 * @remark Capture group 1 is the ID of the user. It is named `id`.
 */
export const UserOrMemberMentionRegex = /^<@!?(?<id>\d{17,19})>$/;

/**
 * Regex that matches any WebSocket URL starting with `ws` or `wss`
 * @raw `/^wss?:\/\//`
 * @remark for regular HTTP URLs see [[HttpUrlRegex]]
 */
export const WebSocketUrlRegex = /^wss?:\/\//;

/**
 * Regex that captures the Webhook ID and token from a Discord Webhook URL.
 * @raw `/(?<url>^https:\/\/(?:(?:canary|ptb).)?discordapp.com\/api\/webhooks\/(?<id>\d+)\/(?<token>[\w-]+)\/?$)/`
 * @remark Capture group 1 is the full URL of the Discord Webhook. It is named `url`.
 * @remark Capture group 2 is the ID of the Discord Webhook. It is named `id`.
 * @remark Capture group 3 is the token of the Discord Webhook. It is named `token`.
 * @remark for regular HTTP URLs see [[HttpUrlRegex]]
 */
export const WebhookRegex = /(?<url>^https:\/\/(?:(?:canary|ptb).)?discordapp.com\/api\/webhooks\/(?<id>\d+)\/(?<token>[\w-]+)\/?$)/;

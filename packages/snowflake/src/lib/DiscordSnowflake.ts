import { Snowflake } from './Snowflake';

/**
 * A class for parsing snowflake ids using Discord's snowflake epoch
 *
 * Which is 2015-01-01 at 00:00:00.000 UTC+0, {@linkplain https://discord.com/developers/docs/reference#snowflakes}
 */
export const DiscordSnowflake = new Snowflake(1420070400000n);

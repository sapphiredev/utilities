import { Snowflake } from './Snowflake';

/**
 * A class for parsing snowflake ids using Twitter's snowflake epoch
 *
 * Which is 2010-11-04 at 01:42:54.657 UTC+0, found in the archived snowflake repository {@linkplain https://github.com/twitter-archive/snowflake/blob/b3f6a3c6ca8e1b6847baa6ff42bf72201e2c2231/src/main/scala/com/twitter/service/snowflake/IdWorker.scala#L25}
 */
export const TwitterSnowflake = new Snowflake(1288834974657n);

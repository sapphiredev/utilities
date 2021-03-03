import baseConfig from '../../scripts/rollup.config';

export default baseConfig({ extraOptions: { external: ['@sapphire/discord-utilities', 'discord.js'] } });

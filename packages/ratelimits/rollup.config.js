import baseConfig from '../../scripts/rollup.config';

export default baseConfig({
	umdName: 'SapphireRatelimits',
	extraOptions: { external: ['@sapphire/time-utilities'] },
	umdGlobals: {
		'@sapphire/time-utilities': 'SapphireTimeUtilities'
	}
});

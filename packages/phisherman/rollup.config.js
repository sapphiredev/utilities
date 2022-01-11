import baseConfig from '../../scripts/rollup.config';

export default baseConfig({
	umdName: 'SapphirePhisherman',
	umdGlobals: {
		'SapphireFetch': 'window'
	},
	extraOptions: {
		external: ['@sapphire/fetch']
	}
});

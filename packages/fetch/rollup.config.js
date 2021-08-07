import baseConfig from '../../scripts/rollup.config';

export default baseConfig({
	umdName: 'SapphireFetch',
	umdGlobals: {
		'cross-fetch': 'window'
	},
	extraOptions: {
		external: ['cross-fetch']
	}
});

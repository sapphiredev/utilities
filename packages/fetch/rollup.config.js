import baseConfig from '../../scripts/rollup.config';

export default baseConfig({
	umdName: 'SapphireFetch',
	umdGlobals: {
		'cross-fetch': 'fetch'
	},
	extraOptions: {
		external: ['cross-fetch']
	}
});

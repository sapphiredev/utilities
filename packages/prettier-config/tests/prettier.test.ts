import prettierConfig from '../src/index.ts';

describe('Prettier Config', () => {
	test('should export rules', () => {
		expect(prettierConfig.useTabs).toBe(true);
		expect(prettierConfig).toMatchSnapshot();
	});
});

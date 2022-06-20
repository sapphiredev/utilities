// @ts-expect-error TS considers the src to not be a module because it uses module.exports but vitest transpiles it just fine for this
import prettierConfig from '../src';

describe('Prettier Config', () => {
	test('should export rules', () => {
		expect(prettierConfig.$schema).toBe('http://json.schemastore.org/prettierrc');
		expect(prettierConfig.useTabs).toBe(true);
		expect(prettierConfig).toMatchSnapshot();
	});
});

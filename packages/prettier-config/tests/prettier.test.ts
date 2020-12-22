// This has to be imported with require!
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prettierConfig = require('../src');

describe('Prettier Config', () => {
	test('should export rules', () => {
		expect(prettierConfig.$schema).toBe('http://json.schemastore.org/prettierrc');
		expect(prettierConfig.useTabs).toBe(true);
		expect(prettierConfig).toMatchSnapshot();
	});
});

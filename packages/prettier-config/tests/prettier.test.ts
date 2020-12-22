// This has to be imported with require!
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../src');

describe('Prettier Config', () => {
	test('should export rules', () => {
		expect(config.$schema).toBe('http://json.schemastore.org/prettierrc');
		expect(config.useTabs).toBe(true);
		expect(config).toMatchSnapshot();
	});
});

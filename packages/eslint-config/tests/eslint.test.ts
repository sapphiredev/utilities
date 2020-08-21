// This has to be imported with require!
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../src');

describe('ESLint Config', () => {
	test('should export rules', () => {
		expect(config.root).toBe(true);
		expect(config.parser).toBe('@typescript-eslint/parser');
		expect(config).toMatchSnapshot();
	});
});

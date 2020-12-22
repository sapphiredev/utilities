// This has to be imported with require!
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eslintConfig = require('../src');

describe('ESLint Config', () => {
	test('should export rules', () => {
		expect(eslintConfig.root).toBe(true);
		expect(eslintConfig.parser).toBe('@typescript-eslint/parser');
		expect(eslintConfig).toMatchSnapshot();
	});
});

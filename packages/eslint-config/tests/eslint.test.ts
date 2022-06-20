// @ts-expect-error TS considers the src to not be a module because it uses module.exports but vitest transpiles it just fine for this
import eslintConfig from '../src';

describe('ESLint Config', () => {
	test('should export rules', () => {
		expect(eslintConfig.root).toBe(true);
		expect(eslintConfig.parser).toBe('@typescript-eslint/parser');
		expect(eslintConfig).toMatchSnapshot();
	});
});

import eslintConfig from '../src';

describe('ESLint Config', () => {
	test('should export a flat config array', () => {
		expect(Array.isArray(eslintConfig)).toBe(true);
		expect(eslintConfig).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					rules: expect.objectContaining({
						'@typescript-eslint/consistent-type-definitions': 'error'
					})
				})
			])
		);
	});
});

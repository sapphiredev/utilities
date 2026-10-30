import eslintConfig from '../src';

describe('ESLint Config', () => {
	test('should export the expected flat config overrides', () => {
		expect(eslintConfig).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					ignores: expect.arrayContaining(['.yarn/**'])
				}),
				expect.objectContaining({
					rules: expect.objectContaining({
						'@typescript-eslint/consistent-type-definitions': 'off'
					})
				})
			])
		);
	});
});

import { testBuild } from '.';

describe('TSConfig Test Build', () => {
	test('should return param if instanceof string', () => {
		expect(testBuild('param')).toBe('param');
	});

	test('should return number + 5 is param instanceof number', () => {
		expect(testBuild(5)).toBe(10);
	});

	test('should return object if param instanceof object', () => {
		expect(testBuild({ param: 'value' })).toStrictEqual({ key: { param: 'value' } });
	});

	test('should fallback to array if param instance of none', () => {
		expect(testBuild()).toStrictEqual([undefined]);
	});
});

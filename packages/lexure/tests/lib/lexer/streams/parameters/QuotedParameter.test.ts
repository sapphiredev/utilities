import { QuotedParameter } from '../../../../../src';

describe('QuotedParameter', () => {
	const parameter = new QuotedParameter([' ', ' '], { value: 'Hello World', open: '"', close: '"' });

	test('GIVEN instance THEN all properties are well defined', () => {
		expect(parameter.value).toBe('Hello World');
		expect(parameter.open).toBe('"');
		expect(parameter.close).toBe('"');
		expect(parameter.raw).toBe('"Hello World"');
		expect(parameter.leading).toBe('  ');
	});
});

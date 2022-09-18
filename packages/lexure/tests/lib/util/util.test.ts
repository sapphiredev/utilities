import { join, joinRaw, QuotedParameter, WordParameter, type Parameter } from '../../../src';

describe('util', () => {
	describe('join', () => {
		test('GIVEN empty list THEN returns empty string', () => {
			const parameters: Parameter[] = [];

			expect(join(parameters)).toBe('');
		});

		test('GIVEN one WordParameter THEN returns `parameters[0].value`', () => {
			const parameters: Parameter[] = [new WordParameter([' '], { value: 'foo' })];

			expect(join(parameters)).toBe('foo');
		});

		test('GIVEN one QuotedParameter THEN returns `parameters[0].value`', () => {
			const parameters: Parameter[] = [new QuotedParameter([' '], { value: 'foo', open: '"', close: '"' })];

			expect(join(parameters)).toBe('foo');
		});

		test('GIVEN multiple WordParameter instances THEN returns values joined by leading', () => {
			const parameters: Parameter[] = [
				new WordParameter([' '], { value: 'foo' }),
				new WordParameter([' '], { value: 'bar' }),
				new WordParameter([' ', ' '], { value: 'baz' })
			];

			expect(join(parameters)).toBe('foo bar  baz');
		});

		test('GIVEN multiple QuotedParameter instances THEN returns values joined by leading', () => {
			const parameters: Parameter[] = [
				new QuotedParameter([' '], { value: 'foo', open: '"', close: '"' }),
				new QuotedParameter([' '], { value: 'bar', open: '"', close: '"' }),
				new QuotedParameter([' ', ' '], { value: 'baz', open: '"', close: '"' })
			];

			expect(join(parameters)).toBe('foo bar  baz');
		});
	});

	describe('joinRaw', () => {
		test('GIVEN empty list THEN returns empty string', () => {
			const parameters: Parameter[] = [];

			expect(joinRaw(parameters)).toBe('');
		});

		test('GIVEN one WordParameter THEN returns `parameters[0].raw`', () => {
			const parameters: Parameter[] = [new WordParameter([' '], { value: 'foo' })];

			expect(joinRaw(parameters)).toBe('foo');
		});

		test('GIVEN one QuotedParameter THEN returns `parameters[0].raw`', () => {
			const parameters: Parameter[] = [new QuotedParameter([' '], { value: 'foo', open: '"', close: '"' })];

			expect(joinRaw(parameters)).toBe('"foo"');
		});

		test('GIVEN multiple WordParameter instances THEN returns raw values joined by leading', () => {
			const parameters: Parameter[] = [
				new WordParameter([' '], { value: 'foo' }),
				new WordParameter([' '], { value: 'bar' }),
				new WordParameter([' ', ' '], { value: 'baz' })
			];

			expect(joinRaw(parameters)).toBe('foo bar  baz');
		});

		test('GIVEN multiple QuotedParameter instances THEN returns raw values joined by leading', () => {
			const parameters: Parameter[] = [
				new QuotedParameter([' '], { value: 'foo', open: '"', close: '"' }),
				new QuotedParameter([' '], { value: 'bar', open: '"', close: '"' }),
				new QuotedParameter([' ', ' '], { value: 'baz', open: '"', close: '"' })
			];

			expect(joinRaw(parameters)).toBe('"foo" "bar"  "baz"');
		});
	});
});

import { ArgumentStream, Lexer, Parser, PrefixedStrategy } from '../../src';

describe('ArgumentStream', () => {
	const parser = new Parser(new PrefixedStrategy(['--', '/'], ['=', ':']));
	const lexer = new Lexer({
		quotes: [
			['"', '"'],
			['“', '”'],
			['「', '」']
		]
	});

	describe('empty state', () => {
		const results = parser.run(lexer.run(''));
		const stream = new ArgumentStream(results);

		test('GIVEN empty string THEN yields initial state with correct values', () => {
			expect(stream.results).toBe(results);
			expect(stream.state).toStrictEqual({ used: new Set(), position: 0 });
			expect(stream.finished).toBe(true);
			expect(stream.length).toBe(0);
			expect(stream.remaining).toBe(0);
			expect(stream.used).toBe(0);
		});
	});
});

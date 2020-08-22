import { inlineCodeBlock } from '../src';

describe('inlineCodeblock', () => {
	test('GIVEN text THEN converts to inline codeblock', () => {
		expect(inlineCodeBlock('const sapphireProjectIsCool = true')).toEqual('`const sapphireProjectIsCool = true`');
	});
});

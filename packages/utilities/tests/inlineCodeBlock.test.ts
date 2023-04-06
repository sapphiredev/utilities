import { inlineCodeBlock } from '../src/index.js';

describe('inlineCodeblock', () => {
	test('GIVEN text THEN converts to inline codeblock', () => {
		expect(inlineCodeBlock('const sapphireCommunityIsCool = true')).toEqual('`const sapphireCommunityIsCool = true`');
	});
});

/* eslint-disable no-irregular-whitespace */
import { codeBlock } from '../src';

const zeroWidthSpace = String.fromCharCode(8203);

describe('codeBlock', () => {
	test('GIVEN expression w/o length THEN returns wrapped ZeroWidthSpace', () => {
		expect(codeBlock('md', '')).toStrictEqual(`\`\`\`${zeroWidthSpace}\`\`\``);
	});

	test('GIVEN expression w/ length THEN returns expressed wrapped in markdown', () => {
		expect(codeBlock('md', '# Header')).toStrictEqual(`\`\`\`md
# Header\`\`\``);
	});

	test('GIVEN expression w/ length w/ inner code block THEN returns expressed wrapped in markdown', () => {
		expect(
			codeBlock(
				'md',
				`
			# Header
			\`\`\`js
				if (sapphireProjectIsCool) return 'awesome!';
			\`\`\`
		`
			)
		).toStrictEqual(`\`\`\`md

			# Header
			\`​\`\`js
				if (sapphireProjectIsCool) return 'awesome!';
			\`\`\`
		\`\`\``);
	});

	test('GIVEN expression w/ length w/ inner inline code block THEN returns expressed wrapped in markdown', () => {
		expect(
			codeBlock(
				'md',
				`
			# Header
			\`const sapphireProjectIsCool = true\`
		`
			)
		).toStrictEqual(`\`\`\`md

			# Header
			\`const sapphireProjectIsCool = true\`
		\`\`\``);
	});

	test('GIVEN expression of non-string type THEN returns wrapped expression', () => {
		expect(codeBlock('md', 123456789)).toStrictEqual(`\`\`\`md
123456789\`\`\``);
	});

	test('GIVEN expression of falsey type THEN returns wrapped expression', () => {
		expect(codeBlock('md', false)).toStrictEqual(`\`\`\`md
${zeroWidthSpace}\`\`\``);
	});
});

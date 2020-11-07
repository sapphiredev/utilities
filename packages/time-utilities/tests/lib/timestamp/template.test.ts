import { Timestamp, TimestampTemplateEntry } from '../../../src';

function extractParsedTemplate(timestamp: Timestamp): TimestampTemplateEntry[] {
	return timestamp['template'];
}

describe('template', () => {
	test('GIVEN empty template THEN returns empty array', () => {
		const timestamp = new Timestamp('');
		const parsedTemplate = extractParsedTemplate(timestamp);
		expect(parsedTemplate).toStrictEqual([]);
	});

	test("GIVEN 'hh:mm:ss' THEN returns array with 2 literals and 3 variables", () => {
		const timestamp = new Timestamp('hh:mm:ss');
		const parsedTemplate = extractParsedTemplate(timestamp);
		expect(parsedTemplate).toStrictEqual([
			{
				content: null,
				type: 'hh'
			},
			{
				content: ':',
				type: 'literal'
			},
			{
				content: null,
				type: 'mm'
			},
			{
				content: ':',
				type: 'literal'
			},
			{
				content: null,
				type: 'ss'
			}
		]);
	});

	test("GIVEN 'hh[ hours, ]mm[ minutes]' THEN returns array with 2 literals and 2 variables", () => {
		const timestamp = new Timestamp('hh[ hours, ]mm[ minutes]');
		const parsedTemplate = extractParsedTemplate(timestamp);
		expect(parsedTemplate).toStrictEqual([
			{
				content: null,
				type: 'hh'
			},
			{
				content: ' hours, ',
				type: 'literal'
			},
			{
				content: null,
				type: 'mm'
			},
			{
				content: ' minutes',
				type: 'literal'
			}
		]);
	});

	test("GIVEN 'llllll' THEN returns array with 2 variables", () => {
		const timestamp = new Timestamp('llllll');
		const parsedTemplate = extractParsedTemplate(timestamp);
		expect(parsedTemplate).toStrictEqual([
			{
				content: null,
				type: 'llll'
			},
			{
				content: null,
				type: 'll'
			}
		]);
	});

	test("GIVEN 'llllll' and updating to 'llll' THEN returns updated templates", () => {
		const timestamp = new Timestamp('llllll');
		const parsedTemplate = extractParsedTemplate(timestamp);
		expect(parsedTemplate).toStrictEqual([
			{
				content: null,
				type: 'llll'
			},
			{
				content: null,
				type: 'll'
			}
		]);

		expect(timestamp.edit('llll')).toBe(timestamp);

		const editedParsedTemplate = extractParsedTemplate(timestamp);
		expect(editedParsedTemplate).toStrictEqual([
			{
				content: null,
				type: 'llll'
			}
		]);
	});

	// You'll probably wonder why did I put "kaira" as written in Japanese, but it's
	// because I couldn't think of characters that are guaranteed not to be
	// supported in the foreseeable future.
	test("GIVEN 'カイラ' THEN returns array with 1 literal", () => {
		const timestamp = new Timestamp('カイラ');
		const parsedTemplate = extractParsedTemplate(timestamp);
		expect(parsedTemplate).toStrictEqual([
			{
				content: 'カイラ',
				type: 'literal'
			}
		]);
	});

	test("GIVEN '][' THEN returns array with 2 literals", () => {
		const timestamp = new Timestamp('][');
		const parsedTemplate = extractParsedTemplate(timestamp);
		expect(parsedTemplate).toStrictEqual([
			{
				content: ']',
				type: 'literal'
			},
			{
				content: '[',
				type: 'literal'
			}
		]);
	});
});

import { toTitleCase } from '../src';

describe('toTitleCase', () => {
	test('GIVEN basic THEN returns expected', () => {
		const source = toTitleCase('something');
		const expected = 'Something';
		expect(source).toBe(expected);
	});

	test('GIVEN unicode THEN returns expected', () => {
		const source = toTitleCase('🎈something');
		const expected = '🎈Something';
		expect(source).toBe(expected);
	});

	test('GIVEN keyword THEN returns expected', () => {
		const source = toTitleCase('textchannel');
		const expected = 'TextChannel';
		expect(source).toBe(expected);
	});

	test('GIVEN variant THEN returns expected', () => {
		const source = toTitleCase('somethingspecial', { additionalVariants: { somethingspecial: 'SomethingSpecial' } });
		const expected = 'SomethingSpecial';
		expect(source).toBe(expected);
	});

	test('GIVEN keyword WITH variant THEN returns expected', () => {
		const source = toTitleCase('textchannel', { additionalVariants: { somethingspecial: 'SomethingSpecial' } });
		const expected = 'TextChannel';
		expect(source).toBe(expected);
	});

	test('GIVEN keyword WITH caseSensitive THEN returns expected', () => {
		const source = toTitleCase('textChannel', { caseSensitive: true });
		const expected = 'Textchannel';
		expect(source).toBe(expected);
	});

	test('GIVEN variant WITH caseSensitive THEN returns expected', () => {
		const source = toTitleCase('somethingSpecial', { additionalVariants: { somethingspecial: 'SomethingSpecial' }, caseSensitive: true });
		const expected = 'Somethingspecial';
		expect(source).toBe(expected);
	});
});

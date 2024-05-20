import { capitalizeFirstLetter } from '../src/lib/capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
	test('GIVEN single word THEN first letter is capitalized', () => {
		expect(capitalizeFirstLetter('hello')).toEqual('Hello');
	});

	test('GIVEN multi-word string THEN only first letter of first word is capitalized', () => {
		expect(capitalizeFirstLetter('hello world')).toEqual('Hello world');
	});

	test('GIVEN string starting with number THEN returns same string', () => {
		expect(capitalizeFirstLetter('1hello')).toEqual('1hello');
	});

	test('GIVEN string starting with special character THEN returns same string', () => {
		expect(capitalizeFirstLetter('$hello')).toEqual('$hello');
	});

	test('GIVEN empty string THEN returns empty string', () => {
		expect(capitalizeFirstLetter('')).toEqual('');
	});

	test('GIVEN string starting with capital letter THEN returns same string', () => {
		expect(capitalizeFirstLetter('Hello')).toEqual('Hello');
	});
});

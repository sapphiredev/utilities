import { URL } from 'node:url';
import { tryParseURL } from '../src';

describe('tryParseURL', () => {
	test('GIVEN valid URL THEN returns URL', () => {
		expect(tryParseURL('https://skyra.pw')).toStrictEqual(new URL('https://skyra.pw'));
	});

	test('GIVEN invalid url THEN returns null', () => {
		expect(tryParseURL('thisisnotaurl')).toBeNull();
	});
});

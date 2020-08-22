import { URL } from 'url';
import { parseURL } from '../src';

describe('parseURL', () => {
	test('GIVEN valid URL THEN returns URL', () => {
		expect(parseURL('https://skyra.pw')).toStrictEqual(new URL('https://skyra.pw'));
	});

	test('GIVEN invalid url THEN returns null', () => {
		expect(parseURL('thisisnotaurl')).toBeNull();
	});
});

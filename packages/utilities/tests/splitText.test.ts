import { splitText } from '../src';

describe('splitText', () => {
	test('GIVEN text without spaces THEN hard cuts off', () => {
		expect(splitText('thistexthasnospaces', 10)).toEqual('thistextha');
	});

	test('GIVEN text with spaces THEN cuts off on space', () => {
		expect(splitText('thistext hasnospaces', 10)).toEqual('thistext');
	});
});

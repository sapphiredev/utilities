import { cutText } from '../src';

describe('cutText', () => {
	test('GIVEN length much smaller than fist word THEN cuts up string', () => {
		expect(cutText('Lorem Ipsum', 5)).toEqual('Lo...');
	});

	test('GIVEN length 1 char smaller than first word length THEN cuts up string', () => {
		expect(cutText('Lorem Ipsum', 7)).toEqual('Lore...');
	});

	test('GIVEN length 1 longer than firs word THEN first word with ...', () => {
		expect(cutText('Lorem Ipsum', 9)).toEqual('Lorem...');
	});

	test('GIVEN length longer than total THEN returns unmodified', () => {
		expect(cutText('Lorem Ipsum', 30)).toEqual('Lorem Ipsum');
	});
});

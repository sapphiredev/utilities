import { cutText } from '../src';

describe('cutText', () => {
	test('GIVEN length much smaller than the first word THEN cuts up string', () => {
		expect(cutText('Lorem Ipsum', 2)).toEqual('L…');
	});

	test('GIVEN length 1 char smaller than the first word length THEN cuts up string', () => {
		expect(cutText('Lorem Ipsum', 5)).toEqual('Lore…');
	});

	test('GIVEN length 1 char longer than the first word THEN first word with …', () => {
		expect(cutText('Lorem Ipsum', 9)).toEqual('Lorem…');
	});

	test('GIVEN length longer than total THEN returns unmodified', () => {
		expect(cutText('Lorem Ipsum', 30)).toEqual('Lorem Ipsum');
	});

	test('GIVEN unicode characters that fit THEN returns the string as-is', () => {
		expect(cutText('🔥🔥', 2)).toEqual('🔥🔥');
	});

	test('GIVEN unicode characters THEN returns a correctly-formatted string', () => {
		expect(cutText('🔥🔥🔥', 2)).toEqual('🔥…');
	});

	test('GIVEN unicode characters THEN returns a correctly-formatted string', () => {
		expect(cutText('Hi Barbie!\nHi Ken!', 13)).toEqual('Hi Barbie!…');
	});

	test('GIVEN a family THEN it only lets the parents in', () => {
		expect(cutText('👨‍👨‍👧‍👧', 4)).toEqual('👨‍👨…');
	});

	test('GIVEN a family THEN it only shows the emoji if it fits', () => {
		expect(cutText('Hello 👨‍👨‍👧‍👧!', 10)).toEqual('Hello…');
	});
});

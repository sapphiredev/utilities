import { fromUTF16, toUTF16 } from '../../src';

describe('utilities', () => {
	describe('toUTF16', () => {
		test('GIVEN a buffer with a single value THEN it returns the correct string', () => {
			const buffer = new Uint16Array([0x1]);
			expect(toUTF16(buffer)).toBe('\u{1}');
		});
	});

	describe('fromUTF16', () => {
		test('GIVEN a string with a single character THEN it returns the correct buffer', () => {
			const buffer = fromUTF16('\u{1}');
			expect(buffer).toEqual(new Uint16Array([0x1]));
		});
	});
});

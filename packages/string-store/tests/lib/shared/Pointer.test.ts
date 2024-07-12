import { Pointer } from '../../../src';

describe('Pointer', () => {
	test('GIVEN a pointer THEN it has the correct initial properties', () => {
		const pointer = new Pointer();
		expect(pointer.value).toBe(0);
	});

	test('GIVEN a pointer with an added value THEN returns the correct values', () => {
		const pointer = new Pointer();
		pointer.add(5);
		expect(pointer.value).toBe(5);
	});

	test.each(['foo', () => {}, -1, 2147483648])('GIVEN a pointer with an invalid length value THEN throws', (value) => {
		const pointer = new Pointer();
		// @ts-expect-error Testing invalid input
		expect(() => pointer.add(value)).toThrowError('The pointer value cannot be an invalid length value');
	});

	describe('from', () => {
		test('GIVEN a pointer with a value THEN it returns a new instance with the same value', () => {
			const pointer = Pointer.from(5);
			expect(pointer.value).toBe(5);
		});

		test.each(['foo', () => {}, -1, 2147483648, 5.5])('GIVEN an invalid length value THEN throws', (value) => {
			// @ts-expect-error Testing invalid input
			expect(() => Pointer.from(value)).toThrowError('The pointer value cannot be an invalid length value');
		});
	});
});

import { Option } from '../src/index';

describe('Option', () => {
	describe('some', () => {
		test('GIVEN some THEN returns { isSome->truthy, isNone->falsy }', () => {
			const returnValue = Option.some(42);

			expect(returnValue.isSome()).toBeTruthy();
			expect(returnValue.isNone()).toBeFalsy();
		});
	});

	describe('none', () => {
		test('GIVEN none THEN returns { isSome->falsy, isNone->truthy }', () => {
			const returnValue = Option.none;

			expect(returnValue.isSome()).toBeFalsy();
			expect(returnValue.isNone()).toBeTruthy();
		});
	});

	describe('from', () => {
		test('GIVEN from(T) THEN returns { isSome->truthy, isNone->falsy }', () => {
			const returnValue = Option.from(42);

			expect(returnValue.isSome()).toBeTruthy();
			expect(returnValue.isNone()).toBeFalsy();
		});

		test('GIVEN from(Some(T)) THEN returns { isSome->truthy, isNone->falsy }', () => {
			const returnValue = Option.from(Option.some(42));

			expect(returnValue.isSome()).toBeTruthy();
			expect(returnValue.isNone()).toBeFalsy();
		});

		test('GIVEN from(null) WITH value as null THEN returns { isSome->truthy, isNone->falsy }', () => {
			const returnValue = Option.from(null);

			expect(returnValue.isSome()).toBeFalsy();
			expect(returnValue.isNone()).toBeTruthy();
		});

		test('GIVEN from(None) WITH value as isMaybe result THEN returns { isSome->truthy, isNone->falsy }', () => {
			const returnValue = Option.from(Option.none);

			expect(returnValue.isSome()).toBeFalsy();
			expect(returnValue.isNone()).toBeTruthy();
		});
	});
});

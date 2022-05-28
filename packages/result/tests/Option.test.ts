import { Option } from '../src/index';

describe('Option', () => {
	describe('prototype', () => {
		describe('isSome', () => {
			// TODO: Write tests
		});

		describe('isSomeAnd', () => {
			// TODO: Write tests
		});

		describe('isNone', () => {
			// TODO: Write tests
		});

		describe('expect', () => {
			// TODO: Write tests
		});

		describe('unwrap', () => {
			// TODO: Write tests
		});

		describe('unwrapOr', () => {
			// TODO: Write tests
		});

		describe('unwrapOrElse', () => {
			// TODO: Write tests
		});

		describe('map', () => {
			// TODO: Write tests
		});

		describe('mapOr', () => {
			// TODO: Write tests
		});

		describe('mapOrElse', () => {
			// TODO: Write tests
		});

		describe('inspect', () => {
			// TODO: Write tests
		});

		describe('okOr', () => {
			// TODO: Write tests
		});

		describe('okOrElse', () => {
			// TODO: Write tests
		});

		describe('iter', () => {
			// TODO: Write tests
		});

		describe('and', () => {
			// TODO: Write tests
		});

		describe('andThen', () => {
			// TODO: Write tests
		});

		describe('or', () => {
			// TODO: Write tests
		});

		describe('orElse', () => {
			// TODO: Write tests
		});

		describe('xor', () => {
			// TODO: Write tests
		});

		describe('filter', () => {
			// TODO: Write tests
		});

		describe('contains', () => {
			// TODO: Write tests
		});

		describe('zip', () => {
			// TODO: Write tests
		});

		describe('zipWith', () => {
			// TODO: Write tests
		});

		describe('unzip', () => {
			// TODO: Write tests
		});

		describe('transpose', () => {
			// TODO: Write tests
		});

		describe('flatten', () => {
			// TODO: Write tests
		});

		describe('eq', () => {
			// TODO: Write tests
		});

		describe('ne', () => {
			// TODO: Write tests
		});

		describe('match', () => {
			// TODO: Write tests
		});
	});

	describe('some', () => {
		test('GIVEN some THEN returns { isSome->truthy, isNone->falsy }', () => {
			const x = Option.some(42);

			expect(x.isSome()).toBeTruthy();
			expect(x.isNone()).toBeFalsy();
		});
	});

	describe('none', () => {
		test('GIVEN none THEN returns { isSome->falsy, isNone->truthy }', () => {
			const x = Option.none;

			expect(x.isSome()).toBeFalsy();
			expect(x.isNone()).toBeTruthy();
		});
	});

	describe('from', () => {
		test('GIVEN from(T) THEN returns { isSome->truthy, isNone->falsy }', () => {
			const x = Option.from(42);

			expect(x.isSome()).toBeTruthy();
			expect(x.isNone()).toBeFalsy();
		});

		test('GIVEN from(Some(T)) THEN returns { isSome->truthy, isNone->falsy }', () => {
			const x = Option.from(Option.some(42));

			expect(x.isSome()).toBeTruthy();
			expect(x.isNone()).toBeFalsy();
		});

		test('GIVEN from(null) WITH value as null THEN returns { isSome->truthy, isNone->falsy }', () => {
			const x = Option.from(null);

			expect(x.isSome()).toBeFalsy();
			expect(x.isNone()).toBeTruthy();
		});

		test('GIVEN from(None) WITH value as isMaybe result THEN returns { isSome->truthy, isNone->falsy }', () => {
			const x = Option.from(Option.none);

			expect(x.isSome()).toBeFalsy();
			expect(x.isNone()).toBeTruthy();
		});
	});
});

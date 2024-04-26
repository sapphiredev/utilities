import { enumToObject } from '../../src';

describe('utilities', () => {
	describe('enumToObject', () => {
		test('GIVEN an enum with number values THEN returns a 1-way object', () => {
			enum Test {
				A,
				B,
				C
			}

			interface Expects {
				A: Test.A;
				B: Test.B;
				C: Test.C;
			}

			expect<Expects>(enumToObject(Test)).toStrictEqual<Expects>({
				A: Test.A,
				B: Test.B,
				C: Test.C
			});
		});

		test('GIVEN an enum with string values THEN returns an identical object', () => {
			enum Test {
				A = 'a',
				B = 'b',
				C = 'c'
			}

			interface Expects {
				A: Test.A;
				B: Test.B;
				C: Test.C;
			}

			expect<Expects>(enumToObject(Test)).toStrictEqual<Expects>({
				A: Test.A,
				B: Test.B,
				C: Test.C
			});
		});
	});
});

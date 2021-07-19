import { EnumerableMethod } from '../../src';

describe('enumerable', () => {
	test('GIVEN enumerable=false THEN should not be enumerable', () => {
		class Sample {
			@EnumerableMethod(false)
			public getName() {
				return 'name';
			}
		}

		expect(Sample.prototype).toEqual({});
	});

	test('GIVEN enumerable=true THEN should be enumerable', () => {
		class AnotherSample {
			@EnumerableMethod(true)
			public getName() {
				return 'name';
			}
		}

		expect(AnotherSample.prototype).toEqual({ getName: expect.any(Function) });
	});
});

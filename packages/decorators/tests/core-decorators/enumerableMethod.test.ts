import { enumerableMethod } from '../../src';

describe('enumerable', () => {
	test('GIVEN enumerable=false THEN should not be enumerable', () => {
		class Sample {
			@enumerableMethod(false)
			public getName() {
				return 'name';
			}
		}

		expect(Sample.prototype).toEqual({});
	});

	test('GIVEN enumerable=true THEN should be enumerable', () => {
		class AnotherSample {
			@enumerableMethod(true)
			public getName() {
				return 'name';
			}
		}

		expect(AnotherSample.prototype).toEqual({ getName: expect.any(Function) });
	});
});

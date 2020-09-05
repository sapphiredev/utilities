import { enumerable } from '../../src';

describe('enumerable', () => {
	test('GIVEN enumerable=false THEN should not be enumerable', () => {
		class Sample {
			@enumerable(false)
			public name = 'name';
		}

		expect(Sample.prototype).toEqual({});
	});

	test('GIVEN enumerable=true THEN should be enumerable', () => {
		class AnotherSample {
			@enumerable(true)
			public name = 'name';
		}

		expect(AnotherSample.prototype).toEqual({ name: undefined });
	});
});

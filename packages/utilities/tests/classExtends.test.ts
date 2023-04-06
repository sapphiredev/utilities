import { classExtends } from '../src/index.js';

describe('classExtends', () => {
	class BaseClass {
		protected name = 'baseClass';
	}

	class ExtendedClass extends BaseClass {
		protected override name = 'extendedClass';
	}

	test('GIVEN class that extends base class THEN returns true', () => {
		expect(classExtends(ExtendedClass, BaseClass)).toBe(true);
	});

	test('GIVEN class that does not extend base class THEN returns false', () => {
		class NewClass {
			public name = 'newClass';
		}

		expect(classExtends(NewClass, BaseClass)).toBe(false);
	});
});

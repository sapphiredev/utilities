import { noop } from '../src';

describe('noop', () => {
	test('GIVEN noop THEN has undefined return type', () => {
		expect(noop()).toBeUndefined();
	});
});

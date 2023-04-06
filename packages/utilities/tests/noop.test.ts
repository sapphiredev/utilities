import { noop } from '../src/index.js';

describe('noop', () => {
	test('GIVEN noop THEN has undefined return type', () => {
		expect(noop()).toBeUndefined();
	});
});

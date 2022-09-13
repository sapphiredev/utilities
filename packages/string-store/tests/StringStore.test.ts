import { StringStore } from '../src';

describe('StringStore', () => {
	test('GIVEN empty store THEN size returns 0', () => {
		const store = new StringStore();

		expect(store.size).toBe(0);
	});
});

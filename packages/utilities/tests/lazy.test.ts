import { lazy } from '../src';

describe('lazy', () => {
	test('GIVEN string callback THEN returns the same', () => {
		const callback = vi.fn(() => 'Lorem Ipsum');

		const lazyStoredValue = lazy(callback);

		expect(lazyStoredValue()).toEqual('Lorem Ipsum');
	});

	test('GIVEN string callback with cached value THEN returns the same', () => {
		const callback = vi.fn(() => 'Lorem Ipsum');

		const lazyStoredValue = lazy(callback);

		lazyStoredValue();
		const cachedValue = lazyStoredValue();

		expect(callback).toHaveBeenCalledOnce();
		expect(cachedValue).toEqual('Lorem Ipsum');
	});
});

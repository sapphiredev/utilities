import { lazy } from '../src';

describe('lazy', () => {
	test('GIVEN string callback THEN returns the same', () => {
		const lazyStoredValue = lazy(() => 'Lorem Ipsum');
		expect(lazyStoredValue()).toEqual('Lorem Ipsum');
	});

	test('GIVEN string callback with cached value THEN returns the same', () => {
		const lazyStoredValue = lazy(() => 'Lorem Ipsum');
		lazyStoredValue();
		const cachedValue = lazyStoredValue();
		expect(cachedValue).toEqual('Lorem Ipsum');
	});
});

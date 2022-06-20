import { hasAtLeastOneKeyInMap } from '../src';

const mapWithKey = new Map([
	['one', 'one'],
	['two', 'two'],
	['three', 'three']
]);

const mapWithOutKey = new Map([
	['two', 'two'],
	['three', 'three']
]);

describe('hasAtLeastOneKeyInMap', () => {
	test('GIVEN map and array with key THEN return true', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['one'])).toBe(true);
	});

	test('GIVEN map and array without key THEN return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['four'])).toBe(false);
	});

	test('GIVEN map without key and array with key THEN return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithOutKey, ['one'])).toBe(false);
	});

	test('GIVEN map without key and array without key THEN return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['four'])).toBe(false);
	});
});

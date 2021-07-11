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
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['one'])).toBeTrue();
	});

	test('GIVEN map and array without key THEN return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['four'])).toBeFalse();
	});

	test('GIVEN map without key and array with key THEN return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithOutKey, ['one'])).toBeFalse();
	});

	test('GIVEN map without key and array without key THEN return false', () => {
		expect(hasAtLeastOneKeyInMap(mapWithKey, ['four'])).toBeFalse();
	});
});

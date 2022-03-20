import { cast } from '../src';

describe('cast', () => {
	test('GIVEN single generic type parameter THEN gives cast type back', () => {
		expect(cast<string>(5)).toEqual(5);
	});

	test('GIVEN two generic types parameters THEN gives cast type back', () => {
		expect(cast<string, string>('5')).toEqual('5');
	});

	test('GIVEN two generic types parameters WITH mismatch THEN gives cast type back', () => {
		// @ts-expect-error a mismatch case between second generic type and function value
		expect(cast<string, number>('5')).toEqual('5');
	});
});

import { cast } from '../src';

describe('cast', () => {
	test('GIVEN single generic type parameter THEN gives cast type back', () => {
		expect(cast<string>(5)).toEqual(5);
	});

	test('GIVEN two generic types parameters THEN gives cast type back', () => {
		expect(cast<string>('5')).toEqual('5');
	});
});

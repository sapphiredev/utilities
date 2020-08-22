import { roundNumber } from '../src';

describe('roundNumber', () => {
	test('GIVEN number without decimals THEN returns number', () => {
		expect(roundNumber(5)).toEqual(5);
	});

	test('GIVEN number with decimals that round down THEN returns floored number', () => {
		expect(roundNumber(5.3346353526)).toEqual(5);
	});

	test('GIVEN number with decimals that round up THEN returns floored number + 1', () => {
		expect(roundNumber(5.6556697864)).toEqual(6);
	});

	test('GIVEN number with positive exponent THEN returns exponent scaled number', () => {
		expect(roundNumber('10e5')).toEqual(1000000);
	});

	test('GIVEN number with negative exponent THEN returns 0', () => {
		expect(roundNumber('10e-5')).toEqual(0);
	});

	test('GIVEN number with negative exponent and many decimals THEN returns exponent scaled number', () => {
		expect(roundNumber('10e-5', 10)).toEqual(0.0001);
	});
});

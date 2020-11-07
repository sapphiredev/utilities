import { Timestamp } from '../../../src';

// Saturday 9th March 2019, at 0:00:00:000
const date = new Date(2019, 2, 9, 0, 0, 0, 0);

describe('Timestamp - Display Zeroes', () => {
	test("GIVEN 'H' THEN returns '0'", () => {
		const timestamp = new Timestamp('H');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('0');
	});

	test("GIVEN 'HH' THEN returns '00'", () => {
		const timestamp = new Timestamp('HH');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('00');
	});

	test("GIVEN 'h' THEN returns '12'", () => {
		const timestamp = new Timestamp('h');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('12');
	});

	test("GIVEN 'hh' THEN returns '12'", () => {
		const timestamp = new Timestamp('hh');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('12');
	});

	test("GIVEN 'a' THEN returns 'am'", () => {
		const timestamp = new Timestamp('a');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('am');
	});

	test("GIVEN 'A' THEN returns 'AM'", () => {
		const timestamp = new Timestamp('A');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('AM');
	});

	test("GIVEN 'T' THEN returns '12:00 AM'", () => {
		const timestamp = new Timestamp('T');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('12:00 AM');
	});

	test("GIVEN 't' THEN returns '12:00:00 am'", () => {
		const timestamp = new Timestamp('t');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('12:00:00 am');
	});

	test("GIVEN 'LLL' THEN returns 'March 09, 2019 12:00 AM'", () => {
		const timestamp = new Timestamp('LLL');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('March 09, 2019 12:00 AM');
	});

	test("GIVEN 'lll' THEN returns 'Mar 09, 2019 12:00 AM'", () => {
		const timestamp = new Timestamp('lll');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Mar 09, 2019 12:00 AM');
	});

	test("GIVEN 'LLLL' THEN returns 'Saturday, March 09, 2019 12:00 AM'", () => {
		const timestamp = new Timestamp('LLLL');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Saturday, March 09, 2019 12:00 AM');
	});

	test("GIVEN 'llll' THEN returns 'Sat Mar 09, 2019 12:00 AM'", () => {
		const timestamp = new Timestamp('llll');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Sat Mar 09, 2019 12:00 AM');
	});

	test("GIVEN 'LLLL' (number overload) THEN returns 'Saturday, March 09, 2019 12:00 AM'", () => {
		const timestamp = new Timestamp('LLLL');
		const formatted = timestamp.display(date.valueOf());
		expect(formatted).toBe('Saturday, March 09, 2019 12:00 AM');
	});

	test("GIVEN LLLL (string overload) THEN returns 'Saturday, March 09, 2019 12:00 AM'", () => {
		const timestamp = new Timestamp('LLLL');
		const formatted = timestamp.display(date.toUTCString());
		expect(formatted).toBe('Saturday, March 09, 2019 12:00 AM');
	});

	test("GIVEN 'hh:mm:ss' THEN returns '12:00:00'", () => {
		const timestamp = new Timestamp('hh:mm:ss');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('12:00:00');
	});

	test("GIVEN 'hh[ hours, ]mm[ minutes]' THEN returns '12 hours, 00 minutes'", () => {
		const timestamp = new Timestamp('hh[ hours, ]mm[ minutes]');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('12 hours, 00 minutes');
	});
});

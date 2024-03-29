import { Timestamp } from '../../src';

// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

describe('Timestamp - Display Afternoon', () => {
	test("GIVEN 'H' THEN returns '16'", () => {
		const timestamp = new Timestamp('H');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('16');
	});

	test("GIVEN 'HH' THEN returns '16'", () => {
		const timestamp = new Timestamp('HH');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('16');
	});

	test("GIVEN 'h' THEN returns '4'", () => {
		const timestamp = new Timestamp('h');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('4');
	});

	test("GIVEN 'hh' THEN returns '04'", () => {
		const timestamp = new Timestamp('hh');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('04');
	});

	test("GIVEN 'a' THEN returns 'pm'", () => {
		const timestamp = new Timestamp('a');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('pm');
	});

	test("GIVEN 'A' THEN returns 'PM'", () => {
		const timestamp = new Timestamp('A');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('PM');
	});

	test("GIVEN 'T' THEN returns '4:20 PM'", () => {
		const timestamp = new Timestamp('T');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('4:20 PM');
	});

	test("GIVEN 't' THEN returns '4:20:35 pm'", () => {
		const timestamp = new Timestamp('t');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('4:20:35 pm');
	});

	test("GIVEN 'LLL' THEN returns 'March 09, 2019 4:20 PM'", () => {
		const timestamp = new Timestamp('LLL');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('March 09, 2019 4:20 PM');
	});

	test("GIVEN 'lll' THEN returns 'Mar 09, 2019 4:20 PM'", () => {
		const timestamp = new Timestamp('lll');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Mar 09, 2019 4:20 PM');
	});

	test("GIVEN 'LLLL' THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const timestamp = new Timestamp('LLLL');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Saturday, March 09, 2019 4:20 PM');
	});

	test("GIVEN 'llll' THEN returns 'Sat Mar 09, 2019 4:20 PM'", () => {
		const timestamp = new Timestamp('llll');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Sat Mar 09, 2019 4:20 PM');
	});

	test("GIVEN 'LLLL' (number overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const timestamp = new Timestamp('LLLL');
		const formatted = timestamp.display(date.valueOf());
		expect(formatted).toBe('Saturday, March 09, 2019 4:20 PM');
	});

	test("GIVEN 'LLLL' (string overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const timestamp = new Timestamp('LLLL');
		const formatted = timestamp.display(date.toUTCString());
		expect(formatted).toBe('Saturday, March 09, 2019 4:20 PM');
	});

	test("GIVEN 'hh:mm:ss' THEN returns '04:20:35'", () => {
		const timestamp = new Timestamp('hh:mm:ss');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('04:20:35');
	});

	test("GIVEN 'hh[ hours, ]mm[ minutes]' THEN returns '04 hours, 20 minutes'", () => {
		const timestamp = new Timestamp('hh[ hours, ]mm[ minutes]');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('04 hours, 20 minutes');
	});
});

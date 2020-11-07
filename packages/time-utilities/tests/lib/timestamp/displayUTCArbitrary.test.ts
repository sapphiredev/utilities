import { Timestamp } from '../../../src';

// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

describe('Timestamp - Display UTC Arbitrary', () => {
	test("GIVEN arbitrary 'H:m' THEN returns 'hours:minutes'", () => {
		const formatted = Timestamp.displayUTCArbitrary('H:m', date);
		expect(formatted).toBe(`${date.getHours() - 1}:${date.getMinutes()}`);
	});

	test("GIVEN arbitrary 'LLLL' and date (date overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const formatted = Timestamp.displayUTCArbitrary('LLLL', date);
		expect(formatted).toBe('Saturday, March 09, 2019 3:20 PM');
	});

	test("GIVEN arbitrary 'LLLL' and date (number overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const formatted = Timestamp.displayUTCArbitrary('LLLL', date.valueOf());
		expect(formatted).toBe('Saturday, March 09, 2019 3:20 PM');
	});

	test("GIVEN arbitrary 'LLLL' and date (string overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const formatted = Timestamp.displayUTCArbitrary('LLLL', date.toUTCString());
		expect(formatted).toBe('Saturday, March 09, 2019 3:20 PM');
	});
});

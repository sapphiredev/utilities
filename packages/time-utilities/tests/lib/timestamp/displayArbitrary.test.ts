import { Timestamp } from '../../../src';

// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

describe('Timestamp - Display Arbitrary', () => {
	test("GIVEN arbitrary 'H:m' THEN returns 'hours:minutes'", () => {
		const formatted = Timestamp.displayArbitrary('H:m');
		const localDate = new Date();
		expect(formatted).toBe(`${localDate.getHours()}:${localDate.getMinutes()}`);
	});

	test("GIVEN arbitrary 'LLLL' and date (date overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const formatted = Timestamp.displayArbitrary('LLLL', date);
		expect(formatted).toBe('Saturday, March 09, 2019 4:20 PM');
	});

	test("GIVEN arbitrary 'LLLL' and date (number overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const formatted = Timestamp.displayArbitrary('LLLL', date.valueOf());
		expect(formatted).toBe('Saturday, March 09, 2019 4:20 PM');
	});

	test("GIVEN arbitrary 'LLLL' and date (string overload) THEN returns 'Saturday, March 09, 2019 4:20 PM'", () => {
		const formatted = Timestamp.displayArbitrary('LLLL', date.toUTCString());
		expect(formatted).toBe('Saturday, March 09, 2019 4:20 PM');
	});
});

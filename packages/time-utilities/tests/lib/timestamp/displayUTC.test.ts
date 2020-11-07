import { Timestamp } from '../../../src';

// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

describe('Timestamp - Display UTC', () => {
	test("GIVEN 'empty' string THEN 'returns empty string'", () => {
		const timestamp = new Timestamp('');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('');
	});

	test("GIVEN 'Y' THEN returns '19'", () => {
		const timestamp = new Timestamp('Y');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('19');
	});

	test("GIVEN 'YY' THEN returns '19'", () => {
		const timestamp = new Timestamp('YY');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('19');
	});

	test("GIVEN 'YYY' THEN returns '2019'", () => {
		const timestamp = new Timestamp('YYY');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('2019');
	});

	test("GIVEN 'YYYY' THEN returns '2019'", () => {
		const timestamp = new Timestamp('YYYY');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('2019');
	});

	test("GIVEN 'Q' THEN returns '1'", () => {
		const timestamp = new Timestamp('Q');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('1');
	});

	test("GIVEN 'M' THEN returns '3'", () => {
		const timestamp = new Timestamp('M');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('3');
	});

	test("GIVEN 'MM' THEN returns '03'", () => {
		const timestamp = new Timestamp('MM');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('03');
	});

	test("GIVEN 'MMM' THEN returns 'March'", () => {
		const timestamp = new Timestamp('MMM');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('March');
	});

	test("GIVEN 'MMMM' THEN returns 'March'", () => {
		const timestamp = new Timestamp('MMMM');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('March');
	});

	test("GIVEN 'D' THEN returns '9'", () => {
		const timestamp = new Timestamp('D');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('9');
	});

	test("GIVEN 'DD' THEN returns '09'", () => {
		const timestamp = new Timestamp('DD');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('09');
	});

	test("GIVEN 'DDD' THEN returns '68'", () => {
		const timestamp = new Timestamp('DDD');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('68');
	});

	test("GIVEN 'DDDD' THEN returns '68'", () => {
		const timestamp = new Timestamp('DDDD');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('68');
	});

	test("GIVEN 'd' THEN returns '9th'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('9th');
	});

	test("GIVEN 'dd' THEN returns 'Sa'", () => {
		const timestamp = new Timestamp('dd');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Sa');
	});

	test("GIVEN 'ddd' THEN returns 'Sat'", () => {
		const timestamp = new Timestamp('ddd');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Sat');
	});

	test("GIVEN 'dddd' THEN returns 'Saturday'", () => {
		const timestamp = new Timestamp('dddd');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Saturday');
	});

	test("GIVEN 'X' THEN returns the amount of seconds since EPOCH", () => {
		const timestamp = new Timestamp('X');
		const formatted = timestamp.display(date);
		expect(formatted).toBe((date.getTime() / 1000).toString());
	});

	test("GIVEN 'x' THEN returns the amount of milliseconds since EPOCH", () => {
		const timestamp = new Timestamp('x');
		const formatted = timestamp.display(date);
		expect(formatted).toBe(date.getTime().toString());
	});

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

	test("GIVEN 'm' THEN returns '20'", () => {
		const timestamp = new Timestamp('m');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('20');
	});

	test("GIVEN 'mm' THEN returns '20'", () => {
		const timestamp = new Timestamp('mm');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('20');
	});

	test("GIVEN 's' THEN returns '35'", () => {
		const timestamp = new Timestamp('s');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('35');
	});

	test("GIVEN 'ss' THEN returns '35'", () => {
		const timestamp = new Timestamp('ss');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('35');
	});

	test("GIVEN 'S' THEN returns '1'", () => {
		const timestamp = new Timestamp('S');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('1');
	});

	test("GIVEN 'SS' THEN returns '01'", () => {
		const timestamp = new Timestamp('SS');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('01');
	});

	test("GIVEN 'SSS' THEN returns '001'", () => {
		const timestamp = new Timestamp('SSS');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('001');
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

	test("GIVEN 'L' THEN returns '03/09/2019'", () => {
		const timestamp = new Timestamp('L');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('03/09/2019');
	});

	test("GIVEN 'l' THEN returns '3/09/2019'", () => {
		const timestamp = new Timestamp('l');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('3/09/2019');
	});

	test("GIVEN 'LL' THEN returns 'March 09, 2019'", () => {
		const timestamp = new Timestamp('LL');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('March 09, 2019');
	});

	test("GIVEN 'll' THEN returns 'Mar 09, 2019'", () => {
		const timestamp = new Timestamp('ll');
		const formatted = timestamp.display(date);
		expect(formatted).toBe('Mar 09, 2019');
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

	test("GIVEN 'Z' THEN returns the timezone offset", () => {
		const timestamp = new Timestamp('Z');
		const formatted = timestamp.display(date);

		const offset = date.getTimezoneOffset();
		const unsigned = offset >= 0;
		const absolute = Math.abs(offset);
		const expected = `${unsigned ? '+' : '-'}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
		expect(formatted).toBe(expected);
	});

	test("GIVEN 'ZZ' THEN returns the timezone offset", () => {
		const timestamp = new Timestamp('ZZ');
		const formatted = timestamp.display(date);

		const offset = date.getTimezoneOffset();
		const unsigned = offset >= 0;
		const absolute = Math.abs(offset);
		const expected = `${unsigned ? '+' : '-'}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
		expect(formatted).toBe(expected);
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

	test("GIVEN 'd' (day: 01) THEN RETURNS '1st'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 1, 16, 20, 35, 1));
		expect(formatted).toBe('1st');
	});

	test("GIVEN 'd' (day: 11) THEN RETURNS '11th'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 11, 16, 20, 35, 1));
		expect(formatted).toBe('11th');
	});

	test("GIVEN 'd' (day: 21) THEN RETURNS '21st'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 21, 16, 20, 35, 1));
		expect(formatted).toBe('21st');
	});

	test("GIVEN 'd' (day: 02) THEN RETURNS '2nd'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 2, 16, 20, 35, 1));
		expect(formatted).toBe('2nd');
	});

	test("GIVEN 'd' (day: 12) THEN RETURNS '12th'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 12, 16, 20, 35, 1));
		expect(formatted).toBe('12th');
	});

	test("GIVEN 'd' (day: 22) THEN RETURNS '22nd'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 22, 16, 20, 35, 1));
		expect(formatted).toBe('22nd');
	});

	test("GIVEN 'd' (day: 03) THEN RETURNS '3rd'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 3, 16, 20, 35, 1));
		expect(formatted).toBe('3rd');
	});

	test("GIVEN 'd' (day: 13) THEN RETURNS '13th'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 13, 16, 20, 35, 1));
		expect(formatted).toBe('13th');
	});

	test("GIVEN 'd' (day: 23) THEN RETURNS '23rd'", () => {
		const timestamp = new Timestamp('d');
		const formatted = timestamp.display(new Date(2019, 2, 23, 16, 20, 35, 1));
		expect(formatted).toBe('23rd');
	});

	test("GIVEN arbitrary 'H:m' casted to string THEN returns 'hours:minutes'", () => {
		const timestamp = new Timestamp('H:m');
		const localDate = new Date();
		expect(timestamp.toString()).toBe(`${localDate.getHours()}:${localDate.getMinutes()}`);
	});
});

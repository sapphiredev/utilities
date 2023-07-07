import { sleepSync } from '../src';

describe('sleepSync', () => {
	test('GIVEN a number of ms THEN return after that time', () => {
		const start = Date.now();
		sleepSync(50);
		expect(Date.now() - start).oneOf([50, 51]);
	});

	test('GIVEN a number of ms and a value THEN return after that time with the value', () => {
		const start = Date.now();
		const value = sleepSync(50, 'test');
		expect(Date.now() - start).oneOf([50, 51]);
		expect<string>(value).toBe('test');
	});
});

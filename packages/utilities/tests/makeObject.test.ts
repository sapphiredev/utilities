import { makeObject } from '../src';

describe('makeObject', () => {
	test('GIVEN basic THEN returns expected', () => {
		const made = makeObject('hello', 'world');
		expect(made).toEqual({ hello: 'world' });
	});

	test('GIVEN nested THEN returns expected', () => {
		const made = makeObject('he.llo', 'world');
		expect(made).toEqual({ he: { llo: 'world' } });
	});

	test('GIVEN existing THEN returns expected', () => {
		const made = makeObject('hello', 'world', { he: { llo: 'world' } });
		expect(made).toEqual({ he: { llo: 'world' }, hello: 'world' });
	});

	test('GIVEN existing-nested THEN returns expected', () => {
		const made = makeObject('he.wor', 'ld', { he: { llo: 'world' } });
		expect(made).toEqual({ he: { llo: 'world', wor: 'ld' } });
	});
});

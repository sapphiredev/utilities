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

	test.each(['__proto__.polluted', 'constructor.prototype.polluted', 'safe.prototype.polluted'])(
		'GIVEN path containing reserved segment %s THEN throws without polluting prototypes',
		(path) => {
			const object = {};

			expect(() => makeObject(path, true, object)).toThrowError(new TypeError('path cannot contain __proto__, constructor, or prototype'));
			expect(Object.prototype).not.toHaveProperty('polluted');
			expect(object).toEqual({});
		}
	);

	test('GIVEN inherited path segment THEN creates an own object', () => {
		const made = makeObject('toString.polluted', true);

		expect(made).toEqual({ toString: { polluted: true } });
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(Object.prototype.toString).not.toHaveProperty('polluted');
	});
});

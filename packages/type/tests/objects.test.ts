import { Type } from '../src';

describe('Objects', () => {
	test('object(generic)', () => {
		expect(new Type({}).toString()).toBe('Record');
	});

	test('object(null)', () => {
		expect(new Type(null).toString()).toBe('null');
	});

	test('object(custom)', () => {
		// eslint-disable-next-line @typescript-eslint/no-extraneous-class
		class Foo {}
		expect(new Type(new Foo()).toString()).toBe('Foo');
	});

	test('object(types)', () => {
		expect(new Type({ foo: 'bar', baz: 2, hello: true }).toString()).toBe('Record<string, boolean | number | string>');
	});

	test('object(recursive)', () => {
		expect(new Type({ foo: 'bar', hello: { baz: 'world' } }).toString()).toBe('Record<string, Record<string, string> | string>');
	});
});

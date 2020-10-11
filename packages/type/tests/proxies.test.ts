import { Type } from '../src';

describe('Proxies', () => {
	test('proxy(object)', () => {
		const proxy = new Proxy({}, {});
		expect(new Type(proxy).toString()).toBe('Proxy<Record>');
	});

	test('proxy(function)', () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const proxy = new Proxy(() => {}, {});
		expect(new Type(proxy).toString()).toBe('Proxy<Function(0-arity)>');
	});
});

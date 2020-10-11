import { Type } from '../src';

describe('Functions', () => {
	test('function(empty)', (): void => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		expect(new Type(() => {}).toString()).toBe('Function(0-arity)');
	});

	test('function(two args)', (): void => {
		expect(new Type((a: number, b: number) => a + b).toString()).toBe('Function(2-arity)');
	});
});

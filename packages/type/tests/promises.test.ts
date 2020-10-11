import { Type } from '../src';

describe('Promises', () => {
	test('promise(resolve)', () => {
		const resolves = () => Promise.resolve(null);

		expect(new Type(resolves()).toString()).toBe('Promise<null>');
	});
});

import { noop } from '../src';

describe('noop', () => {
	test('GIVEN noop THEN has undefined return type', () => {
		const instance = { noop };
		const spy = vi.spyOn(instance, 'noop');

		instance.noop();
		expect(spy).toHaveReturnedWith(undefined);
	});
});

import { pickRandom } from '../src';

describe('pickRandom', () => {
	test('GIVEN array THEN picks random element', () => {
		const array = ['a', 'b', 'c'];
		expect(array).toContain(pickRandom(array));
	});
});

import { Option } from '@sapphire/result';
import { EmptyStrategy, type IUnorderedStrategy } from '../../../../src';

describe('EmptyStrategy', () => {
	const strategy: IUnorderedStrategy = new EmptyStrategy();

	describe('matchFlag', () => {
		test('GIVEN any value THEN returns none', () => {
			expect(strategy.matchFlag('foo')).toEqual(Option.none);
		});
	});

	describe('matchOption', () => {
		test('GIVEN any value THEN returns none', () => {
			expect(strategy.matchOption('foo')).toEqual(Option.none);
		});
	});
});

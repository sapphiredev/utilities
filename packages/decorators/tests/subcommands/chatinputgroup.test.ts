import { ChatInputGroupSubcommand } from '../../src';

describe('Tests for ChatInput Subcommand Groups', () => {
	test('GIVEN a group containing single subcommand THEN map it', () => {
		class Test {
			@ChatInputGroupSubcommand('test', 'hello')
			public hello() {
				return 'Hello';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'group',
				entries: [
					{
						name: 'hello',
						chatInputRun: 'hello'
					}
				]
			}
		]);
	});

	test('GIVEN a group containing multiple subcommands THEN still map it', () => {
		class Test {
			@ChatInputGroupSubcommand('test', 'hello')
			public hello() {
				return 'Hello';
			}

			@ChatInputGroupSubcommand('test', 'world')
			public world() {
				return 'World';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'group',
				entries: [
					{
						name: 'hello',
						chatInputRun: 'hello'
					},
					{
						name: 'world',
						chatInputRun: 'world'
					}
				]
			}
		]);
	});

	test('GIVEN a subcommand inside group that already exists THEN override it', () => {
		class Test {
			@ChatInputGroupSubcommand('test', 'hello')
			public hello() {
				return 'Hello';
			}

			@ChatInputGroupSubcommand('test', 'hello')
			public world() {
				return 'World';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'group',
				entries: [
					{
						name: 'hello',
						chatInputRun: 'world'
					}
				]
			}
		]);
	});
});

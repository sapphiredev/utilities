import { MessageGroupSubcommand } from '../../src';

describe('Tests for Message Subcommand Groups', () => {
	test('GIVEN a group containing single subcommand THEN map it', () => {
		class Test {
			@MessageGroupSubcommand('test', 'hello')
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
						messageRun: 'hello'
					}
				]
			}
		]);
	});

	test('GIVEN a group containing multiple subcommands THEN still map it', () => {
		class Test {
			@MessageGroupSubcommand('test', 'hello')
			public hello() {
				return 'Hello';
			}

			@MessageGroupSubcommand('test', 'world')
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
						messageRun: 'hello'
					},
					{
						name: 'world',
						messageRun: 'world'
					}
				]
			}
		]);
	});

	test('GIVEN a subcommand inside group that already exists THEN override it', () => {
		class Test {
			@MessageGroupSubcommand('test', 'hello')
			public hello() {
				return 'Hello';
			}

			@MessageGroupSubcommand('test', 'hello')
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
						messageRun: 'world'
					}
				]
			}
		]);
	});
});

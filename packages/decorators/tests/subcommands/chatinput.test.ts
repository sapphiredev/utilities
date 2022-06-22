import { ChatInputSubcommand } from '../../src';

describe('Test if chatinput subcommands do get mapped', () => {
	test('GIVEN single subcommand THEN map it', () => {
		class Test {
			@ChatInputSubcommand('test')
			public hello() {
				return 'Hello';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'method',
				chatInputRun: 'hello'
			}
		]);
	});

	test('GIVEN multiple subcommands THEN map them', () => {
		class Test {
			@ChatInputSubcommand('test')
			public hello() {
				return 'Hello';
			}

			@ChatInputSubcommand('bye')
			public bye() {
				return 'Bye';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'method',
				chatInputRun: 'hello'
			},
			{
				name: 'bye',
				type: 'method',
				chatInputRun: 'bye'
			}
		]);
	});

	test('GIVEN existing subcommand THEN override it', () => {
		class Test {
			@ChatInputSubcommand('test')
			public hello() {
				return 'Hello';
			}

			@ChatInputSubcommand('test')
			public bye() {
				return 'Bye';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'method',
				chatInputRun: 'bye'
			}
		]);
	});
});

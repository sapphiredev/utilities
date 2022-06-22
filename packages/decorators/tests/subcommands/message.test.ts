import { MessageSubcommand } from '../../src';

describe('Test if message subcommands do get mapped', () => {
	test('GIVEN single subcommand THEN map it', () => {
		class Test {
			@MessageSubcommand('test')
			public hello() {
				return 'Hello';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'method',
				messageRun: 'hello'
			}
		]);
	});

	test('GIVEN multiple subcommands THEN map them', () => {
		class Test {
			@MessageSubcommand('test')
			public hello() {
				return 'Hello';
			}

			@MessageSubcommand('bye')
			public bye() {
				return 'Bye';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'method',
				messageRun: 'hello'
			},
			{
				name: 'bye',
				type: 'method',
				messageRun: 'bye'
			}
		]);
	});

	test('GIVEN existing subcommand THEN override it', () => {
		class Test {
			@MessageSubcommand('test')
			public hello() {
				return 'Hello';
			}

			@MessageSubcommand('test')
			public bye() {
				return 'Bye';
			}
		}

		const instance = new Test();
		expect(Reflect.get(instance, 'subcommandMappings')).toStrictEqual([
			{
				name: 'test',
				type: 'method',
				messageRun: 'bye'
			}
		]);
	});
});

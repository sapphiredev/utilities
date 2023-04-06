import { Command, type CommandOptions, CommandStore, container } from '@sapphire/framework';
import { ApplyOptions } from '../../src';

describe('ApplyOptions', () => {
	beforeAll(() => {
		Reflect.set(container, 'client', { options: {} });
	});

	test('GIVEN options object THEN sets options', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			description: 'test description',
			fullCategory: ['One', 'Two']
		})
		class TestPiece extends Command {
			public getName() {
				return this.name;
			}

			public override async messageRun() {
				// noop
			}
		}

		const instance = new TestPiece(
			{
				name: 'something',
				path: __filename,
				root: __dirname,
				store: new CommandStore()
			},
			{ name: 'test' }
		);

		expect(instance.name).toBe('test');
		expect(instance.description).toBe('test description');
		expect(Reflect.get(instance.constructor.prototype, 'getName')).toBeDefined();
	});

	test('GIVEN options w/o defaults THEN sets options w/ baseOptions = {}', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			description: 'test description',
			fullCategory: ['One', 'Two']
		})
		class TestPiece extends Command {
			public getName() {
				return this.name;
			}

			public override async messageRun() {
				// noop
			}
		}

		const instance = new TestPiece({
			name: 'something',
			path: __filename,
			root: __dirname,
			store: new CommandStore()
		});

		expect(instance.name).toBe('test');
		expect(instance.description).toBe('test description');
		expect(Reflect.get(instance.constructor.prototype, 'getName')).toBeDefined();
	});

	test('GIVEN options as function THEN sets options', () => {
		@ApplyOptions<CommandOptions>(() => ({
			name: '123456789',
			description: 'test description',
			fullCategory: ['One', 'Two']
		}))
		class TestPiece extends Command {
			public getName() {
				return this.name;
			}

			public override async messageRun() {
				// noop
			}
		}

		const instance = new TestPiece(
			{
				name: 'something',
				path: __filename,
				root: __dirname,
				store: new CommandStore()
			},
			{ name: 'test' }
		);

		expect(instance.name).toBe('123456789');
		expect(instance.description).toBe('test description');
		expect(Reflect.get(instance.constructor.prototype, 'getName')).toBeDefined();
	});
});

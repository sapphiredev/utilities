import { Command, CommandOptions, CommandStore } from '@sapphire/framework';
import { ApplyOptions } from '../../src/core-decorators';
import { client } from '../mocks/MockInstances';

describe('ApplyOptions', () => {
	test('GIVEN options object THEN sets options', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			description: 'test description'
		})
		class TestPiece extends Command {
			public getName() {
				return this.name;
			}

			public async run() {
				// noop
			}
		}

		// @ts-expect-error Access to the constructor should be bypassed
		const instance = new TestPiece(
			{
				name: 'something',
				path: __filename,
				extras: {},
				store: new CommandStore(client)
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
			description: 'test description'
		})
		class TestPiece extends Command {
			public getName() {
				return this.name;
			}

			public async run() {
				// noop
			}
		}

		// @ts-expect-error Access to the constructor should be bypassed
		const instance = new TestPiece({
			name: 'something',
			path: __filename,
			extras: {},
			store: new CommandStore(client)
		});

		expect(instance.name).toBe('test');
		expect(instance.description).toBe('test description');
		expect(Reflect.get(instance.constructor.prototype, 'getName')).toBeDefined();
	});

	test('GIVEN options as function THEN sets options', () => {
		@ApplyOptions<CommandOptions>(() => ({
			name: client.id!,
			description: 'test description'
		}))
		class TestPiece extends Command {
			public getName() {
				return this.name;
			}

			public async run() {
				// noop
			}
		}

		// @ts-expect-error Access to the constructor should be bypassed
		const instance = new TestPiece(
			{
				name: 'something',
				path: __filename,
				extras: {},
				store: new CommandStore(client)
			},
			{ name: 'test' }
		);

		expect(instance.name).toBe('123456789');
		expect(instance.description).toBe('test description');
		expect(Reflect.get(instance.constructor.prototype, 'getName')).toBeDefined();
	});
});

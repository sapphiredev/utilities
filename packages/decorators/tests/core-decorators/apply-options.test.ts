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
});

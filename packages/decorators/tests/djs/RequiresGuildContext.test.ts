import { RequiresGuildContext } from '../../src';

describe('RequiresGuildContext', () => {
	interface Message {
		guild: { name: string } | null;

		inGuild(): boolean;
	}

	test('GIVEN no guild THEN returns fallback', async () => {
		class Test {
			@RequiresGuildContext(() => 'Fallback!')
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: null, inGuild: () => false });
		expect(result).toBe('Fallback!');
	});

	test('GIVEN guild THEN returns guild name', async () => {
		class Test {
			@RequiresGuildContext(() => 'Default')
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: { name: 'World!' }, inGuild: () => true });
		expect(result).toBe('World!');
	});

	test('GIVEN no fallback AND no guild THEN returns undefined', async () => {
		class Test {
			@RequiresGuildContext()
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: null, inGuild: () => false });
		expect(result).toBeUndefined();
	});
});

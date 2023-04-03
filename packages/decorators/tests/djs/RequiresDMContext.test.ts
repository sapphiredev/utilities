import { RequiresDMContext } from '../../dist';

describe('RequiresDMContext', () => {
	interface Message {
		guild: { name: string } | null;
		inGuild(): boolean;
	}

	test('GIVEN guild THEN returns value', async () => {
		class Test {
			@RequiresDMContext(() => Promise.resolve('Default'))
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: null, inGuild: () => true });
		expect(result).toBeUndefined();
	});

	test.only('GIVEN no guild THEN returns fallback', async () => {
		class Test {
			@RequiresDMContext(() => 'Fallback!')
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({
			guild: { name: 'World!' },
			inGuild: () => {
				return false;
			}
		});
		expect(result).toBe('Fallback!');
	});

	test('GIVEN no fallback AND no guild THEN returns undefined', async () => {
		class Test {
			@RequiresDMContext()
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: { name: 'World!' }, inGuild: () => false });
		expect(result).toBeUndefined();
	});
});

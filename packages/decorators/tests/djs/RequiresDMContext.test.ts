import { RequiresDMContext } from '../../src';

describe('RequiresDMContext', () => {
	interface Message {
		guild: { name: string } | null;
	}

	test('GIVEN guild THEN returns value', async () => {
		class Test {
			@RequiresDMContext(() => 'Default')
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: null });
		expect(result).toBeUndefined();
	});

	test('GIVEN no guild THEN returns fallback', async () => {
		class Test {
			@RequiresDMContext(() => 'Fallback!')
			public getValue(message: Message) {
				return Promise.resolve(message.guild?.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: { name: 'World!' } });
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
		const result = await instance.getValue({ guild: { name: 'World!' } });
		expect(result).toBeUndefined();
	});
});

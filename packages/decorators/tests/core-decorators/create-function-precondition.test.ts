import { createFunctionPrecondition, FunctionFallback } from '../../src';

describe('createFunctionPrecondition', () => {
	interface Message {
		guild: { name: string } | null;
	}

	function requiresGuildContext(fallback: FunctionFallback = (): void => undefined): MethodDecorator {
		return createFunctionPrecondition((message: Message) => message.guild !== null, fallback);
	}

	test('GIVEN false return THEN calls callback', async () => {
		class Test {
			@requiresGuildContext(() => 'Default')
			public getValue(message: Message) {
				return Promise.resolve(message.guild!.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: null });
		expect(result).toBe('Default');
	});

	test('GIVEN true return THEN calls function', async () => {
		class Test {
			@requiresGuildContext(() => 'Default')
			public getValue(message: Message) {
				return Promise.resolve(message.guild!.name);
			}
		}

		const instance = new Test();
		const result = await instance.getValue({ guild: { name: 'World!' } });
		expect(result).toBe('World!');
	});
});

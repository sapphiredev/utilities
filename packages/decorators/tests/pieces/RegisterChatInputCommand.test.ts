import {
	Command,
	CommandStore,
	container,
	type ApplicationCommandRegistry,
	type InternalRegistryAPIType,
	type RegisterBehavior
} from '@sapphire/framework';
import {
	ApplicationCommandOptionType,
	type APIApplicationCommandIntegerOption,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import { RegisterChatInputCommand } from '../../src';

describe('RegisterChatInputCommand', () => {
	beforeAll(() => {
		Reflect.set(container, 'client', { options: {} });
	});

	test('GIVEN options object THEN sets options', async () => {
		@RegisterChatInputCommand<TestPiece>((builder, command) =>
			builder
				.setName(command.name)
				.setDescription(command.description)
				.addIntegerOption((builder) =>
					builder //
						.setName('int')
						.setDescription('int')
						.setMaxValue(command.maxInteger)
						.setMinValue(command.minInteger)
				)
		)
		class TestPiece extends Command {
			public readonly maxInteger = 10;
			public readonly minInteger = 1;
		}

		const instance = new TestPiece(
			{
				name: 'test',
				path: __filename,
				root: __dirname,
				store: new CommandStore()
			},
			{ name: 'test', description: 'test description' }
		);
		await instance.registerApplicationCommands!(instance.applicationCommandRegistry);
		const apiCalls = instance.applicationCommandRegistry['apiCalls'] as InternalAPICall[];
		const apiCall = apiCalls[0];

		expect(instance.applicationCommandRegistry.commandName).toBe('test');
		expect(apiCall.builtData.name).toBe('test');
		expect(apiCall.builtData.description).toBe('test description');
		expect(apiCall.builtData.options![0].type).toBe(ApplicationCommandOptionType.Integer);
		expect((apiCall.builtData.options![0] as APIApplicationCommandIntegerOption).min_value).toBe(1);
		expect((apiCall.builtData.options![0] as APIApplicationCommandIntegerOption).max_value).toBe(10);
	});

	test('GIVEN options & registry options object THEN sets options & registry options', async () => {
		@RegisterChatInputCommand<TestPiece>(
			(builder, command) =>
				builder
					.setName(command.name)
					.setDescription(command.description)
					.addIntegerOption((builder) =>
						builder //
							.setName('int')
							.setDescription('int')
							.setMaxValue(command.maxInteger)
							.setMinValue(command.minInteger)
					),
			{
				idHints: ['737141877803057244'],
				guildIds: ['737141877803057244']
			}
		)
		class TestPiece extends Command {
			public readonly maxInteger = 10;
			public readonly minInteger = 1;
		}

		const instance = new TestPiece(
			{
				name: 'test-registry',
				path: __filename,
				root: __dirname,
				store: new CommandStore()
			},
			{ name: 'test-registry', description: 'test description' }
		);
		await instance.registerApplicationCommands!(instance.applicationCommandRegistry);
		const apiCalls = instance.applicationCommandRegistry['apiCalls'] as InternalAPICall[];
		const apiCall = apiCalls[0];

		expect(instance.applicationCommandRegistry.commandName).toBe('test-registry');
		expect(apiCall.builtData.name).toBe('test-registry');
		expect(apiCall.builtData.description).toBe('test description');
		expect(apiCall.builtData.options![0].type).toBe(ApplicationCommandOptionType.Integer);
		expect((apiCall.builtData.options![0] as APIApplicationCommandIntegerOption).min_value).toBe(1);
		expect((apiCall.builtData.options![0] as APIApplicationCommandIntegerOption).max_value).toBe(10);
		expect(apiCall.registerOptions.guildIds).toEqual(['737141877803057244']);
		expect(apiCall.registerOptions.idHints).toEqual(['737141877803057244']);
	});
});

type InternalRegisterOptions = Omit<ApplicationCommandRegistry.RegisterOptions, 'behaviorWhenNotIdentical'> & {
	behaviorWhenNotIdentical?: RegisterBehavior;
};

interface InternalAPICall {
	builtData: RESTPostAPIChatInputApplicationCommandsJSONBody;
	registerOptions: InternalRegisterOptions;
	type: InternalRegistryAPIType.ChatInput;
}

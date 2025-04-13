import {
	Command,
	CommandStore,
	container,
	InternalRegistryAPIType,
	type ApplicationCommandRegistry,
	type RegisterBehavior
} from '@sapphire/framework';
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type APIApplicationCommandIntegerOption,
	type RESTPostAPIChatInputApplicationCommandsJSONBody,
	type RESTPostAPIContextMenuApplicationCommandsJSONBody
} from 'discord.js';
import { RegisterChatInputCommand, RegisterMessageContextMenuCommand, RegisterUserContextMenuCommand } from '../../src';

describe('RegisterALLCommand', () => {
	beforeAll(() => {
		Reflect.set(container, 'client', { options: {} });
	});

	test('GIVEN options with 3 decorators THEN sets options', async () => {
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
		@RegisterMessageContextMenuCommand((builder) =>
			builder //
				.setName('Test Message')
				.setContexts(InteractionContextType.Guild)
				.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
		)
		@RegisterUserContextMenuCommand((builder) =>
			builder //
				.setName('Test User')
				.setContexts(InteractionContextType.Guild)
				.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
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
		const chatInput = apiCalls[2] as Omit<InternalAPICall, 'builtData'> & { builtData: RESTPostAPIChatInputApplicationCommandsJSONBody };
		const messageContext = apiCalls[1] as Omit<InternalAPICall, 'builtData'> & { builtData: RESTPostAPIContextMenuApplicationCommandsJSONBody };
		const userContext = apiCalls[0] as Omit<InternalAPICall, 'builtData'> & { builtData: RESTPostAPIContextMenuApplicationCommandsJSONBody };

		expect(instance.applicationCommandRegistry.commandName).toBe('test');

		// chat input
		expect(chatInput.builtData.name).toBe('test');
		expect(chatInput.builtData.description).toBe('test description');
		expect(chatInput.builtData.type).toBe(ApplicationCommandType.ChatInput);
		expect(chatInput.builtData.options![0].type).toBe(ApplicationCommandOptionType.Integer);
		expect((chatInput.builtData.options![0] as APIApplicationCommandIntegerOption).min_value).toBe(1);
		expect((chatInput.builtData.options![0] as APIApplicationCommandIntegerOption).max_value).toBe(10);

		// message context
		expect(messageContext.builtData.name).toBe('Test Message');
		expect(messageContext.type).toBe(InternalRegistryAPIType.ContextMenu);
		expect(messageContext.builtData.type).toBe(ApplicationCommandType.Message);
		expect(messageContext.builtData.contexts).toEqual([0]);
		expect(messageContext.builtData.integration_types).toEqual([0]);

		// user context
		expect(userContext.builtData.name).toBe('Test User');
		expect(userContext.type).toBe(InternalRegistryAPIType.ContextMenu);
		expect(userContext.builtData.type).toBe(ApplicationCommandType.User);
		expect(userContext.builtData.contexts).toEqual([0]);
		expect(userContext.builtData.integration_types).toEqual([0]);
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
				idHints: ['7371418778030572441'],
				guildIds: ['737141877803057244']
			}
		)
		@RegisterMessageContextMenuCommand(
			(builder) =>
				builder //
					.setName('Test Message')
					.setContexts(InteractionContextType.Guild)
					.setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
			{
				idHints: ['7371418778030572442'],
				guildIds: ['737141877803057244']
			}
		)
		@RegisterUserContextMenuCommand(
			(builder) =>
				builder //
					.setName('Test User')
					.setContexts(InteractionContextType.Guild)
					.setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
			{
				idHints: ['7371418778030572443'],
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
		const chatInput = apiCalls[2] as Omit<InternalAPICall, 'builtData'> & { builtData: RESTPostAPIChatInputApplicationCommandsJSONBody };
		const messageContext = apiCalls[1] as Omit<InternalAPICall, 'builtData'> & { builtData: RESTPostAPIContextMenuApplicationCommandsJSONBody };
		const userContext = apiCalls[0] as Omit<InternalAPICall, 'builtData'> & { builtData: RESTPostAPIContextMenuApplicationCommandsJSONBody };

		expect(instance.applicationCommandRegistry.commandName).toBe('test-registry');

		// chat input
		expect(chatInput.builtData.name).toBe('test-registry');
		expect(chatInput.builtData.description).toBe('test description');
		expect(chatInput.type).toBe(InternalRegistryAPIType.ChatInput);
		expect(chatInput.builtData.options![0].type).toBe(ApplicationCommandOptionType.Integer);
		expect((chatInput.builtData.options![0] as APIApplicationCommandIntegerOption).min_value).toBe(1);
		expect((chatInput.builtData.options![0] as APIApplicationCommandIntegerOption).max_value).toBe(10);
		expect(chatInput.registerOptions.idHints).toEqual(['7371418778030572441']);
		expect(chatInput.registerOptions.guildIds).toEqual(['737141877803057244']);

		// message context
		expect(messageContext.builtData.name).toBe('Test Message');
		expect(messageContext.type).toBe(InternalRegistryAPIType.ContextMenu);
		expect(messageContext.builtData.type).toBe(ApplicationCommandType.Message);
		expect(messageContext.builtData.contexts).toEqual([0]);
		expect(messageContext.builtData.integration_types).toEqual([0]);
		expect(messageContext.registerOptions.idHints).toEqual(['7371418778030572442']);
		expect(messageContext.registerOptions.guildIds).toEqual(['737141877803057244']);

		// user context
		expect(userContext.builtData.name).toBe('Test User');
		expect(userContext.type).toBe(InternalRegistryAPIType.ContextMenu);
		expect(userContext.builtData.type).toBe(ApplicationCommandType.User);
		expect(userContext.builtData.contexts).toEqual([0]);
		expect(userContext.builtData.integration_types).toEqual([0]);
		expect(userContext.registerOptions.idHints).toEqual(['7371418778030572443']);
		expect(userContext.registerOptions.guildIds).toEqual(['737141877803057244']);
	});
});

type InternalRegisterOptions = Omit<ApplicationCommandRegistry.RegisterOptions, 'behaviorWhenNotIdentical'> & {
	behaviorWhenNotIdentical?: RegisterBehavior;
};

export type InternalAPICall =
	| {
			builtData: RESTPostAPIChatInputApplicationCommandsJSONBody;
			registerOptions: InternalRegisterOptions;
			type: InternalRegistryAPIType.ChatInput;
	  }
	| {
			builtData: RESTPostAPIContextMenuApplicationCommandsJSONBody;
			registerOptions: InternalRegisterOptions;
			type: InternalRegistryAPIType.ContextMenu;
	  };

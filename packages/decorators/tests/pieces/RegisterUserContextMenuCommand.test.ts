import {
	Command,
	CommandStore,
	container,
	InternalRegistryAPIType,
	type ApplicationCommandRegistry,
	type RegisterBehavior
} from '@sapphire/framework';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import { RegisterUserContextMenuCommand } from '../../src';

describe('RegisterUserContextMenuCommand', () => {
	beforeAll(() => {
		Reflect.set(container, 'client', { options: {} });
	});

	test('GIVEN options object THEN sets options', async () => {
		@RegisterUserContextMenuCommand((builder, command) =>
			builder //
				.setName(command.name)
				.setContexts(InteractionContextType.Guild)
				.setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
		)
		class TestPiece extends Command {}

		const instance = new TestPiece(
			{
				name: 'test',
				path: __filename,
				root: __dirname,
				store: new CommandStore()
			},
			{ name: 'test' }
		);

		await instance.registerApplicationCommands!(instance.applicationCommandRegistry);
		const apiCalls = instance.applicationCommandRegistry['apiCalls'] as InternalAPICall[];
		const apiCall = apiCalls[0];

		expect(instance.applicationCommandRegistry.commandName).toBe('test');
		expect(apiCall.builtData.name).toBe('test');
		expect(apiCall.type).toBe(InternalRegistryAPIType.ContextMenu);
		expect(apiCall.builtData.type).toBe(ApplicationCommandType.User);
		expect(apiCall.builtData.contexts).toEqual([0]);
		expect(apiCall.builtData.integration_types).toEqual([0]);
	});

	test('GIVEN options & registry options object THEN sets options & registry options', async () => {
		@RegisterUserContextMenuCommand(
			(builder, command) =>
				builder //
					.setName(command.name)
					.setContexts(InteractionContextType.Guild)
					.setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
			{
				idHints: ['737141877803057244'],
				guildIds: ['737141877803057244']
			}
		)
		class TestPiece extends Command {}

		const instance = new TestPiece(
			{
				name: 'test-registry',
				path: __filename,
				root: __dirname,
				store: new CommandStore()
			},
			{ name: 'test-registry' }
		);

		await instance.registerApplicationCommands!(instance.applicationCommandRegistry);
		const apiCalls = instance.applicationCommandRegistry['apiCalls'] as InternalAPICall[];
		const apiCall = apiCalls[0];

		expect(instance.applicationCommandRegistry.commandName).toBe('test-registry');
		expect(apiCall.builtData.name).toBe('test-registry');
		expect(apiCall.type).toBe(InternalRegistryAPIType.ContextMenu);
		expect(apiCall.builtData.type).toBe(ApplicationCommandType.User);
		expect(apiCall.builtData.contexts).toEqual([0]);
		expect(apiCall.builtData.integration_types).toEqual([0]);
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

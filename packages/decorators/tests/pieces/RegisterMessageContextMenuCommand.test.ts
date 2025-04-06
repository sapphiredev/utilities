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
import { RegisterMessageContextMenuCommand } from '../../src';

describe('RegisterMessageContextMenuCommand', () => {
	beforeAll(() => {
		Reflect.set(container, 'client', { options: {} });
	});

	test('GIVEN options object THEN sets options', async () => {
		@RegisterMessageContextMenuCommand((builder, command) =>
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
		expect(apiCall.builtData.type).toBe(ApplicationCommandType.Message);
		expect(apiCall.builtData.contexts).toMatchObject([0]);
		expect(apiCall.builtData.integration_types).toMatchObject([0]);
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

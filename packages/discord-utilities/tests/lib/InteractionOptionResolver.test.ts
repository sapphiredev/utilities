import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionType,
	type APIApplicationCommandInteraction,
	type APIAttachment,
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionDataResolvedChannel,
	type APIMessage,
	type APIRole,
	type APIUser
} from 'discord-api-types/v10';
import { InteractionOptionResolver } from '../../src';

describe('chat input interaction', () => {
	test('it can resolve basic options of all types', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommand,
			data: {
				options: [
					{
						name: 'string',
						type: ApplicationCommandOptionType.String,
						value: 'foo'
					},
					{
						name: 'integer',
						type: ApplicationCommandOptionType.Integer,
						value: 1
					},
					{
						name: 'boolean',
						type: ApplicationCommandOptionType.Boolean,
						value: true
					},
					{
						name: 'user',
						type: ApplicationCommandOptionType.User,
						value: '123'
					},
					{
						name: 'channel',
						type: ApplicationCommandOptionType.Channel,
						value: '456'
					},
					{
						name: 'role',
						type: ApplicationCommandOptionType.Role,
						value: '789'
					},
					{
						name: 'mentionable',
						type: ApplicationCommandOptionType.Mentionable,
						value: '123456'
					},
					{
						name: 'number',
						type: ApplicationCommandOptionType.Number,
						value: 1.5
					},
					{
						name: 'attachment',
						type: ApplicationCommandOptionType.Attachment,
						value: '123456789'
					}
				],
				resolved: {
					users: {
						'123': {
							id: '123'
						} as APIUser,
						'123456': {
							id: '123456'
						} as APIUser
					},
					channels: {
						'456': {
							id: '456'
						} as APIInteractionDataResolvedChannel
					},
					roles: {
						'789': {
							id: '789'
						} as APIRole
					},
					attachments: {
						'123456789': {
							id: '123456789'
						} as APIAttachment
					}
				}
			}
		} as unknown as APIChatInputApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(resolver.getString('string')).toBe('foo');
		expect(resolver.getInteger('integer')).toBe(1);
		expect(resolver.getBoolean('boolean')).toBe(true);
		expect(resolver.getUser('user')?.id).toBe('123');
		expect(resolver.getChannel('channel')?.id).toBe('456');
		expect(resolver.getRole('role')?.id).toBe('789');
		expect((resolver.getMentionable('mentionable') as APIUser | null)?.id).toBe('123456');
		expect(resolver.getNumber('number')).toBe(1.5);
		expect(resolver.getAttachment('attachment')?.id).toBe('123456789');
	});

	test('it can resolve subcommand options', () => {
		const mockInteraction = {
			data: {
				options: [
					{
						name: 'subcommand-group',
						type: ApplicationCommandOptionType.SubcommandGroup,
						options: [
							{
								name: 'subcommand',
								type: ApplicationCommandOptionType.Subcommand,
								options: [
									{
										name: 'string',
										type: ApplicationCommandOptionType.String,
										value: 'foo'
									}
								]
							}
						]
					}
				]
			}
		} as unknown as APIChatInputApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(resolver.getSubcommandGroup()).toBe('subcommand-group');
		expect(resolver.getSubcommand()).toBe('subcommand');
		expect(resolver.getString('string')).toBe('foo');
	});

	test('it throws if an option is not present and required is true', () => {
		const mockInteraction = {
			data: {
				options: []
			}
		} as unknown as APIChatInputApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(() => resolver.getString('string', true)).toThrow();
	});

	test("it throws if there's a type miss-match", () => {
		const mockInteraction = {
			data: {
				options: [
					{
						name: 'string',
						type: ApplicationCommandOptionType.String,
						value: 'foo'
					}
				]
			}
		} as unknown as APIChatInputApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);
		expect(() => resolver.getInteger('string')).toThrow();
	});
});

describe('user context menu', () => {
	test('it can resolve the target', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommand,
			data: {
				target_id: '123',
				type: ApplicationCommandType.User,
				resolved: {
					users: {
						'123': {
							id: '123'
						} as APIUser
					}
				}
			}
		} as unknown as APIApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(resolver.getTargetUser().id).toBe('123');
	});

	test('it throws if the interaction is not a user context menu', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommand,
			data: {
				type: ApplicationCommandType.ChatInput
			}
		} as unknown as APIApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(() => resolver.getTargetUser()).toThrow();
	});
});

describe('message context menu', () => {
	test('it can resolve the target', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommand,
			data: {
				target_id: '123',
				type: ApplicationCommandType.Message,
				resolved: {
					messages: {
						'123': {
							id: '123'
						} as APIMessage
					}
				}
			}
		} as unknown as APIApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(resolver.getTargetMessage().id).toBe('123');
	});

	test('it throws if the interaction is not a message context menu', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommand,
			data: {
				type: ApplicationCommandType.User
			}
		} as unknown as APIApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(() => resolver.getTargetMessage()).toThrow();
	});
});

describe('autocomplete', () => {
	test('it can resolve the focused option', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommandAutocomplete,
			data: {
				options: [
					{
						name: 'string',
						type: ApplicationCommandOptionType.String,
						value: 'foo',
						focused: true
					}
				]
			}
		} as unknown as APIApplicationCommandInteraction;

		const resolver = new InteractionOptionResolver(mockInteraction);

		expect(resolver.getFocusedOption().value).toEqual('foo');
	});
});

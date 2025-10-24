import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ComponentType,
	InteractionType,
	type APIApplicationCommandAutocompleteInteraction,
	type APIAttachment,
	type APIChatInputApplicationCommandInteraction,
	type APIContextMenuInteraction,
	type APIInteractionDataResolvedChannel,
	type APIMessage,
	type APIModalSubmitInteraction,
	type APIRole,
	type APIUser
} from 'discord-api-types/v10';
import {
	AutocompleteInteractionOptionResolver,
	ChatInputInteractionOptionResolver,
	ContextMenuInteractionOptionResolver,
	ModalInteractionOptionResolver
} from '../../src';

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

		const resolver = new ChatInputInteractionOptionResolver(mockInteraction);

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

		const resolver = new ChatInputInteractionOptionResolver(mockInteraction);

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

		const resolver = new ChatInputInteractionOptionResolver(mockInteraction);

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

		const resolver = new ChatInputInteractionOptionResolver(mockInteraction);
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
		} as unknown as APIContextMenuInteraction;

		const resolver = new ContextMenuInteractionOptionResolver(mockInteraction);

		expect(resolver.getTargetUser().id).toBe('123');
	});

	test('it throws if the interaction is not a user context menu', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommand,
			data: {
				type: ApplicationCommandType.ChatInput
			}
		} as unknown as APIContextMenuInteraction;

		const resolver = new ContextMenuInteractionOptionResolver(mockInteraction);

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
		} as unknown as APIContextMenuInteraction;

		const resolver = new ContextMenuInteractionOptionResolver(mockInteraction);

		expect(resolver.getTargetMessage().id).toBe('123');
	});

	test('it throws if the interaction is not a message context menu', () => {
		const mockInteraction = {
			type: InteractionType.ApplicationCommand,
			data: {
				type: ApplicationCommandType.User
			}
		} as unknown as APIContextMenuInteraction;

		const resolver = new ContextMenuInteractionOptionResolver(mockInteraction);

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
		} as unknown as APIApplicationCommandAutocompleteInteraction;

		const resolver = new AutocompleteInteractionOptionResolver(mockInteraction);

		expect(resolver.getFocusedOption().value).toEqual('foo');
	});
});

describe('modal submit', () => {
	test('it can resolve a text input', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.TextInput,
								custom_id: 'text-input',
								value: 'Hello World'
							}
						]
					}
				]
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		expect(resolver.getTextInput('text-input')).toBe('Hello World');
	});

	test('it can resolve selected strings', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.StringSelect,
								custom_id: 'string-select',
								values: ['option1', 'option2']
							}
						]
					}
				]
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		expect(resolver.getSelectedStrings('string-select')).toEqual(['option1', 'option2']);
	});

	test('it can resolve selected users', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.UserSelect,
								custom_id: 'user-select',
								values: ['123', '456']
							}
						]
					}
				],
				resolved: {
					users: {
						'123': {
							id: '123'
						} as APIUser,
						'456': {
							id: '456'
						} as APIUser
					}
				}
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		const users = resolver.getSelectedUsers('user-select');
		expect(users).toHaveLength(2);
		expect(users[0]?.id).toBe('123');
		expect(users[1]?.id).toBe('456');
	});

	test('it can resolve selected roles', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.RoleSelect,
								custom_id: 'role-select',
								values: ['789']
							}
						]
					}
				],
				resolved: {
					roles: {
						'789': {
							id: '789'
						} as APIRole
					}
				}
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		const roles = resolver.getSelectedRoles('role-select');
		expect(roles).toHaveLength(1);
		expect(roles[0]?.id).toBe('789');
	});

	test('it can resolve selected channels', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.ChannelSelect,
								custom_id: 'channel-select',
								values: ['456']
							}
						]
					}
				],
				resolved: {
					channels: {
						'456': {
							id: '456'
						} as APIInteractionDataResolvedChannel
					}
				}
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		const channels = resolver.getSelectedChannels('channel-select');
		expect(channels).toHaveLength(1);
		expect(channels[0]?.id).toBe('456');
	});

	test('it can resolve attachments', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.FileUpload,
								custom_id: 'file-upload',
								values: ['123456789']
							}
						]
					}
				],
				resolved: {
					attachments: {
						'123456789': {
							id: '123456789',
							filename: 'test.png',
							url: 'https://example.com/test.png'
						} as APIAttachment
					}
				}
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		const attachments = resolver.getAttachments('file-upload');
		expect(attachments).toHaveLength(1);
		expect(attachments[0]?.id).toBe('123456789');
	});

	test('it can resolve selected mentionables (users)', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.MentionableSelect,
								custom_id: 'mentionable-select',
								values: ['123']
							}
						]
					}
				],
				resolved: {
					users: {
						'123': {
							id: '123'
						} as APIUser
					}
				}
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		const mentionables = resolver.getSelectedMentionables('mentionable-select');
		expect(mentionables).toHaveLength(1);
		expect(mentionables[0]?.id).toBe('123');
	});

	test('it can resolve selected mentionables (roles)', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.MentionableSelect,
								custom_id: 'mentionable-select',
								values: ['789']
							}
						]
					}
				],
				resolved: {
					roles: {
						'789': {
							id: '789'
						} as APIRole
					}
				}
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		const mentionables = resolver.getSelectedMentionables('mentionable-select');
		expect(mentionables).toHaveLength(1);
		expect(mentionables[0]?.id).toBe('789');
	});

	test('it throws if a component is not found', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: []
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		expect(() => resolver.get('nonexistent')).toThrow();
	});

	test('it throws if there is a type mismatch', () => {
		const mockInteraction = {
			type: InteractionType.ModalSubmit,
			data: {
				custom_id: 'test-modal',
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.TextInput,
								custom_id: 'text-input',
								value: 'Hello World'
							}
						]
					}
				]
			}
		} as unknown as APIModalSubmitInteraction;

		const resolver = new ModalInteractionOptionResolver(mockInteraction);

		expect(() => resolver.getSelectedStrings('text-input')).toThrow();
	});
});

import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	InteractionType,
	type APIApplicationCommandAutocompleteInteraction,
	type APIApplicationCommandInteraction,
	type APIApplicationCommandInteractionDataBasicOption,
	type APIApplicationCommandInteractionDataIntegerOption,
	type APIApplicationCommandInteractionDataNumberOption,
	type APIApplicationCommandInteractionDataOption,
	type APIApplicationCommandInteractionDataStringOption,
	type APIAttachment,
	type APIInteractionDataResolved,
	type APIInteractionDataResolvedChannel,
	type APIInteractionDataResolvedGuildMember,
	type APIMessage,
	type APIMessageApplicationCommandInteractionDataResolved,
	type APIModalSubmitInteraction,
	type APIRole,
	type APIUser,
	type APIUserInteractionDataResolved
} from 'discord-api-types/v10';
import type { RequiredIf } from './_utils';

/**
 * Utility class for resolving command interaction options while working with the raw API.
 * Based on {@linkplain https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/structures/CommandInteractionOptionResolver.js}
 */
export class InteractionOptionResolver {
	private readonly interaction: APIApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction | APIModalSubmitInteraction;

	/**
	 * The interaction options array
	 */
	private readonly data: APIApplicationCommandInteractionDataOption[] | null = null;

	/**
	 * The interaction resolved data
	 */
	private readonly resolved:
		| APIInteractionDataResolved
		| APIUserInteractionDataResolved
		| APIMessageApplicationCommandInteractionDataResolved
		| null = null;

	/**
	 * Bottom-level options for the interaction
	 * If there is a subcommand (or subcommand and group), this represents the options for the subcommand.
	 */
	private readonly hoistedOptions: APIApplicationCommandInteractionDataOption[] | null = null;

	/**
	 * The name of the subcommand group
	 */
	private readonly group: string | null = null;

	/**
	 * The name of the subcommand
	 */
	private readonly subcommand: string | null = null;

	public constructor(interaction: APIApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction | APIModalSubmitInteraction) {
		this.interaction = interaction;

		this.data = 'options' in interaction.data ? (interaction.data.options ?? null) : null;

		this.resolved = 'resolved' in interaction.data ? (interaction.data.resolved ?? null) : null;

		this.hoistedOptions = this.data;

		// Hoist subcommand group if present
		if (this.hoistedOptions?.[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
			this.group = this.hoistedOptions[0].name;
			this.hoistedOptions = this.hoistedOptions[0].options ?? [];
		}

		// Hoist subcommand if present
		if (this.hoistedOptions?.[0]?.type === ApplicationCommandOptionType.Subcommand) {
			this.subcommand = this.hoistedOptions[0].name;
			this.hoistedOptions = this.hoistedOptions[0].options ?? [];
		}
	}

	/**
	 * Gets an option by its name
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public get<const Required extends boolean = false>(
		name: string,
		required?: Required
	): RequiredIf<Required, APIApplicationCommandInteractionDataOption>;

	public get(name: string, required = false): APIApplicationCommandInteractionDataOption | null {
		const option = this.hoistedOptions?.find((opt) => opt.name === name);
		if (!option) {
			if (required) {
				throw new Error(`Missing required option "${name}"`);
			}

			return null;
		}

		return option;
	}

	/**
	 * Gets the selected subcommand
	 * @param required Whether to throw an error if there is no subcommand
	 */
	public getSubcommand<const Required extends boolean = false>(required?: Required): RequiredIf<Required, string>;
	public getSubcommand(required = true): string | null {
		if (required && !this.subcommand) {
			throw new Error('A subcommand was not selected');
		}

		return this.subcommand;
	}

	/**
	 * Gets the selected subcommand group
	 * @param required Whether to throw an error if there is no subcommand group
	 */
	public getSubcommandGroup<const Required extends boolean = false>(required?: Required): RequiredIf<Required, string>;
	public getSubcommandGroup(required = true): string | null {
		if (required && !this.group) {
			throw new Error('A subcommand group was not selected');
		}

		return this.group;
	}

	/**
	 * Gets a boolean option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getBoolean<const Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, boolean>;
	public getBoolean(name: string, required = false): boolean | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Boolean, required);
		return option?.value ?? null;
	}

	/**
	 * Gets a channel option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getChannel<const Required extends boolean = false>(
		name: string,
		required?: Required
	): RequiredIf<Required, APIInteractionDataResolvedChannel>;

	public getChannel(name: string, required = false): APIInteractionDataResolvedChannel | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Channel, required);
		return option && this.resolved && 'channels' in this.resolved ? (this.resolved.channels?.[option.value] ?? null) : null;
	}

	/**
	 * Gets a string option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getString<const Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, string>;
	public getString(name: string, required = false): string | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.String, required);
		return option?.value ?? null;
	}

	/**
	 * Gets an integer option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getInteger<const Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, number>;
	public getInteger(name: string, required = false): number | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Integer, required);
		return option?.value ?? null;
	}

	/**
	 * Gets a number option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getNumber<const Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, number>;
	public getNumber(name: string, required = false): number | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Number, required);
		return option?.value ?? null;
	}

	/**
	 * Gets a user option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getUser<const Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIUser>;
	public getUser(name: string, required = false): APIUser | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.User, required);
		return option && this.resolved && 'users' in this.resolved ? (this.resolved.users?.[option.value] ?? null) : null;
	}

	/**
	 * Gets a member option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getMember<const Required extends boolean = false>(
		name: string,
		required?: Required
	): RequiredIf<Required, APIInteractionDataResolvedGuildMember>;

	public getMember(name: string, required = false): APIInteractionDataResolvedGuildMember | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.User, required);
		return option && this.resolved && 'members' in this.resolved ? (this.resolved.members?.[option.value] ?? null) : null;
	}

	/**
	 * Gets a role option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getRole<const Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIRole>;
	public getRole(name: string, required = false): APIRole | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Role, required);
		return option && this.resolved && 'roles' in this.resolved ? (this.resolved.roles?.[option.value] ?? null) : null;
	}

	/**
	 * Gets an attachment option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getAttachment<const Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIAttachment>;
	public getAttachment(name: string, required = false): APIAttachment | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Attachment, required);
		return option && this.resolved && 'attachments' in this.resolved ? (this.resolved.attachments?.[option.value] ?? null) : null;
	}

	/**
	 * Gets a mentionable option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getMentionable<const Required extends boolean = false>(
		name: string,
		required?: Required
	): RequiredIf<Required, APIUser | APIInteractionDataResolvedGuildMember | APIRole>;

	public getMentionable(name: string, required = false): APIUser | APIInteractionDataResolvedGuildMember | APIRole | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Mentionable, required);

		if (!option || !this.resolved) {
			return null;
		}

		if ('members' in this.resolved && this.resolved.members && option.value in this.resolved.members) {
			return this.resolved.members[option.value] ?? null;
		}

		if ('users' in this.resolved && this.resolved.users && option.value in this.resolved.users) {
			return this.resolved.users[option.value] ?? null;
		}

		if ('roles' in this.resolved && this.resolved.roles && option.value in this.resolved.roles) {
			return this.resolved.roles[option.value] ?? null;
		}

		return null;
	}

	/**
	 * Gets the target user for a context menu interaction
	 */
	public getTargetUser(): APIUser {
		if (this.interaction.type !== InteractionType.ApplicationCommand || this.interaction.data.type !== ApplicationCommandType.User) {
			throw new Error('This method can only be used on user context menu interactions');
		}

		return (this.resolved as APIUserInteractionDataResolved).users[this.interaction.data.target_id];
	}

	/**
	 * Gets the target member for a context menu interaction
	 * @param required Whether to throw an error if the member data is not present
	 */
	public getTargetMember<const Required extends boolean = false>(required?: Required): RequiredIf<Required, APIInteractionDataResolvedGuildMember>;
	public getTargetMember(required = false): APIInteractionDataResolvedGuildMember | null {
		if (this.interaction.type !== InteractionType.ApplicationCommand || this.interaction.data.type !== ApplicationCommandType.User) {
			throw new Error('This method can only be used on user context menu interactions');
		}

		const member = (this.resolved as APIUserInteractionDataResolved).members?.[this.interaction.data.target_id] ?? null;

		if (!member && required) {
			throw new Error('Member data is not present');
		}

		return member;
	}

	/**
	 * Gets the target message for a context menu interaction
	 */
	public getTargetMessage(): APIMessage {
		if (this.interaction.type !== InteractionType.ApplicationCommand || this.interaction.data.type !== ApplicationCommandType.Message) {
			throw new Error('This method can only be used on message context menu interactions');
		}

		return (this.resolved as APIMessageApplicationCommandInteractionDataResolved).messages[this.interaction.data.target_id];
	}

	/**
	 * Gets the focused option for an autocomplete interaction
	 */
	public getFocusedOption() {
		if (this.interaction.type !== InteractionType.ApplicationCommandAutocomplete) {
			throw new Error('This method can only be used on autocomplete interactions');
		}

		const focusedOption = this.hoistedOptions?.find((option) => 'focused' in option && option.focused) as
			| APIApplicationCommandInteractionDataStringOption
			| APIApplicationCommandInteractionDataIntegerOption
			| APIApplicationCommandInteractionDataNumberOption
			| undefined;

		// Considering the earlier check, this should be impossible, but it's here for good measure
		if (!focusedOption) {
			throw new Error('No focused option for autocomplete interaction');
		}

		const { focused, ...option } = focusedOption;

		return option;
	}

	private getTypedOption<Option extends BasicApplicationCommandOptionType, const Required extends boolean = false>(
		name: string,
		type: Option,
		required: Required
	): RequiredIf<Required, TypeToOptionMap[Option]>;

	private getTypedOption<Option extends BasicApplicationCommandOptionType>(
		name: string,
		type: Option,
		required: boolean
	): TypeToOptionMap[Option] | null {
		const option = this.get(name, required);
		if (!option) {
			return null;
		} else if (option.type !== type) {
			throw new Error(`Option with name "${name}" is not of the correct type`);
		}

		return option as TypeToOptionMap[Option];
	}
}

type BasicApplicationCommandOptionType = APIApplicationCommandInteractionDataBasicOption['type'];

// This extra type is required because apparently just inlining what `_TypeToOptionMap` does into `TypeToOptionMap` does not behave the same
type _TypeToOptionMap = {
	[Option in BasicApplicationCommandOptionType]: APIApplicationCommandInteractionDataBasicOption & { type: Option };
};

type TypeToOptionMap = {
	[Option in keyof _TypeToOptionMap]: _TypeToOptionMap[Option];
};

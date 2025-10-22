import {
	ApplicationCommandOptionType,
	type APIApplicationCommandInteractionDataOption,
	type APIAttachment,
	type APIChatInputApplicationCommandInteraction,
	type APIInteractionDataResolved,
	type APIInteractionDataResolvedChannel,
	type APIInteractionDataResolvedGuildMember,
	type APIRole,
	type APIUser
} from 'discord-api-types/v10';
import type { BasicApplicationCommandOptionType, RequiredIf, TypeToOptionMap } from './util';

/**
 * Utility class for resolving command (application command) interaction options while working with the raw API.
 * Based on {@linkplain https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/structures/CommandInteractionOptionResolver.js}
 */
export class ChatInputInteractionOptionResolver {
	/**
	 * The interaction options array
	 */
	private readonly data: APIApplicationCommandInteractionDataOption[] | null = null;

	/**
	 * The interaction resolved data
	 */
	private readonly resolved: APIInteractionDataResolved | null = null;

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

	public constructor(interaction: APIChatInputApplicationCommandInteraction) {
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
	public get<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIApplicationCommandInteractionDataOption>;
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
	public getSubcommand<Required extends boolean = false>(required?: Required): RequiredIf<Required, string>;
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
	public getSubcommandGroup<Required extends boolean = false>(required?: Required): RequiredIf<Required, string>;
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
	public getBoolean<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, boolean>;
	public getBoolean(name: string, required = false): boolean | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Boolean, required);
		return option?.value ?? null;
	}

	/**
	 * Gets a channel option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getChannel<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIInteractionDataResolvedChannel>;
	public getChannel(name: string, required = false): APIInteractionDataResolvedChannel | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Channel, required);
		return option && this.resolved && 'channels' in this.resolved ? (this.resolved.channels?.[option.value] ?? null) : null;
	}

	/**
	 * Gets a string option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getString<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, string>;
	public getString(name: string, required = false): string | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.String, required);
		return option?.value ?? null;
	}

	/**
	 * Gets an integer option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getInteger<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, number>;
	public getInteger(name: string, required = false): number | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Integer, required);
		return (option?.value as number | null) ?? null;
	}

	/**
	 * Gets a number option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getNumber<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, number>;
	public getNumber(name: string, required = false): number | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Number, required);
		return (option?.value as number | null) ?? null;
	}

	/**
	 * Gets a user option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getUser<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIUser>;
	public getUser(name: string, required = false): APIUser | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.User, required);
		return option?.value ? this.resolved!.users![option.value] : null;
	}

	/**
	 * Gets a member option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getMember<Required extends boolean = false>(
		name: string,
		required?: Required
	): RequiredIf<Required, APIInteractionDataResolvedGuildMember>;

	public getMember(name: string, required = false): APIInteractionDataResolvedGuildMember | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.User, required);
		return option?.value ? this.resolved!.members![option.value] : null;
	}

	/**
	 * Gets a role option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getRole<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIRole>;
	public getRole(name: string, required = false): APIRole | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Role, required);
		return option?.value ? this.resolved!.roles![option.value] : null;
	}

	/**
	 * Gets an attachment option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getAttachment<Required extends boolean = false>(name: string, required?: Required): RequiredIf<Required, APIAttachment>;
	public getAttachment(name: string, required = false): APIAttachment | null {
		const option = this.getTypedOption(name, ApplicationCommandOptionType.Attachment, required);
		return option?.value ? this.resolved!.attachments![option.value] : null;
	}

	/**
	 * Gets a mentionable option
	 * @param name The name of the option
	 * @param required Whether to throw an error if the option is not found
	 */
	public getMentionable<Required extends boolean = false>(
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

	private getTypedOption<Option extends BasicApplicationCommandOptionType, Required extends boolean = false>(
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

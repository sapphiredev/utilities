import {
	ApplicationCommandOptionType,
	InteractionType,
	type APIApplicationCommandAutocompleteInteraction,
	type APIApplicationCommandInteractionDataIntegerOption,
	type APIApplicationCommandInteractionDataNumberOption,
	type APIApplicationCommandInteractionDataOption,
	type APIApplicationCommandInteractionDataStringOption
} from 'discord-api-types/v10';
import type { RequiredIf } from './util';

/**
 * Utility class for resolving command interaction options while working with the raw API.
 * Based on {@linkplain https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/structures/CommandInteractionOptionResolver.js}
 */
export class AutocompleteInteractionOptionResolver {
	private readonly interaction: APIApplicationCommandAutocompleteInteraction;

	/**
	 * The interaction options array
	 */
	private readonly data: APIApplicationCommandInteractionDataOption[] | null = null;

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

	public constructor(interaction: APIApplicationCommandAutocompleteInteraction) {
		this.interaction = interaction;

		this.data = 'options' in interaction.data ? (interaction.data.options ?? null) : null;

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
}

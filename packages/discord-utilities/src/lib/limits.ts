/**
 * Namespace containing limits related to Discord channels.
 */
export const ChannelLimits = {
	/**
	 * Maximum characters allowed in a channel description.
	 */
	MaximumDescriptionLength: 1024,

	/**
	 * Maximum characters allowed in a channel name.
	 */
	MaximumNameLength: 100,

	/**
	 * Maximum viewers allowed per screen share.
	 * @deprecated Use `VoiceChannelLimits.MaximumViewersPerScreenShare` instead.
	 */
	MaximumViewersPerScreenShare: 50
} as const;

/**
 * Namespace containing limits related to Discord voice channels.
 */
export const VoiceChannelLimits = {
	/**
	 * Maximum viewers allowed per screen share.
	 */
	MaximumViewersPerScreenShare: 50,

	/**
	 * Maximum user limit of voice channel.
	 */
	MaximumUserLimit: 99
};

/**
 * Namespace containing limits related to Discord stage channels.
 */
export const StageChannelLimits = {
	/**
	 * Maximum user limit of stage channel.
	 */
	MaximumUserLimit: 250
};

/**
 * Namespace containing limits related to Discord text channels.
 */
export const TextChannelLimits = {
	/**
	 * Maximum pins allowed in a text channel.
	 */
	MaximumMessagePins: 50
} as const;

/**
 * Namespace containing limits related to Discord threads.
 */
export const ThreadLimits = {
	/**
	 * Minimum number of threads to return from the threads API.
	 */
	MinimumThreadsToFetch: 1,

	/**
	 * Maximum number of threads to return from the threads API.
	 */
	MaximumThreadsToFetch: 100
} as const;

/**
 * Namespace containing limits related to Discord embeds.
 */
export const EmbedLimits = {
	/**
	 * Maximum characters allowed in the author field of an embed.
	 */
	MaximumAuthorNameLength: 256,

	/**
	 * Maximum characters allowed in an embed description.
	 */
	MaximumDescriptionLength: 4096,

	/**
	 * Maximum characters allowed in the name of a field in an embed.
	 */
	MaximumFieldNameLength: 256,

	/**
	 * Maximum fields allowed in an embed.
	 */
	MaximumFields: 25,

	/**
	 * Maximum characters allowed in the value of a field in an embed.
	 */
	MaximumFieldValueLength: 1024,

	/**
	 * Maximum characters allowed in a footer of an embed.
	 */
	MaximumFooterLength: 2048,

	/**
	 * Maximum characters allowed in the title of an embed.
	 */
	MaximumTitleLength: 256,

	/**
	 * Maximum characters allowed in an embed, in total.
	 */
	MaximumTotalCharacters: 6000
} as const;

/**
 * Namespace containing limits related to Discord emojis.
 */
export const EmojiLimits = {
	/**
	 * Maximum characters allowed in a custom guild emoji.
	 */
	MaximumEmojiNameLength: 32,

	/**
	 * Maximum size allowed for a custom guild emoji.
	 * Size is in bytes, and corresponds to 256KB.
	 */
	MaximumEmojiSize: 256_000
} as const;

/**
 * Namespace containing limits related to Discord guilds.
 */
export const GuildLimits = {
	/**
	 * Maximum channels allowed per guild, including category channels.
	 */
	MaximumChannels: 500,

	/**
	 * Maximum roles allowed in a guild.
	 */
	MaximumRoles: 250,

	/**
	 * Maximum scheduled or active events allowed in a guild.
	 */
	MaximumScheduledOrActiveEvents: 100,

	/**
	 * Minimum number of user guilds to return from the user guilds API.
	 */
	MinimumUserGuildsToFetch: 1,

	/**
	 * Maximum number of user guilds to return from the user guilds API.
	 */
	MaximumUserGuildsToFetch: 200
} as const;

/**
 * Namespace containing limits related to Discord guild scheduled events.
 */
export const GuildScheduledEventLimits = {
	/**
	 * Maximum number of users to return from the guild scheduled event users API.
	 */
	MaximumUsersToFetch: 100
} as const;

/**
 * Namespace containing limits related to Discord guild members.
 */
export const GuildMemberLimits = {
	/**
	 * Maximum characters allowed in the display name of a guild member.
	 */
	MaximumDisplayNameLength: 32,

	/**
	 * Minimum number of members to return from the guild members API.
	 */
	MinimumMembersToFetch: 1,

	/**
	 * Maximum number of members to return from the guild members API.
	 */
	MaximumMembersToFetch: 1000
} as const;

/**
 * Namespace containing limits related to Discord guild bans.
 */
export const GuildBansLimits = {
	/**
	 * Minimum number of bans to return from the guild bans API.
	 */
	MinimumBansToFetch: 1,

	/**
	 * Maximum number of bans to return from the guild bans API.
	 */
	MaximumBansToFetch: 1000
} as const;

/**
 * Namespace containing limits related to Discord interactions.
 */
export const InteractionLimits = {
	/**
	 * Maximum buttons allowed in a single action row.
	 */
	MaximumButtonsPerActionRow: 5,

	/**
	 * Maximum select menus allowed in a single action row.
	 */
	MaximumSelectMenusPerActionRow: 1,

	/**
	 * Maximum text inputs allowed in a single action row.
	 */
	MaximumTextInputsPerActionRow: 1,

	/**
	 * Maximum options allowed in a single select menu.
	 */
	MaximumOptionsInSelectMenus: 25
} as const;

/**
 * Namespace containing limits related to Discord application commands (slash commands).
 */
export const ApplicationCommandLimits = {
	/**
	 * Maximum characters allowed in an application command name.
	 */
	MaximumNameCharacters: 32,

	/**
	 * Maximum characters allowed in an application command description.
	 */
	MaximumDescriptionCharacters: 100,

	/**
	 * Maximum options allowed in an application command.
	 */
	MaximumOptionsLength: 25,

	/**
	 * Maximum combined characters allowed in the name, description, and value properties of an application command, its options (including subcommands and groups), and choices.
	 */
	MaximumCombinedCharacters: 4000
} as const;

/**
 * Namespace containing limits related to Choices of Discord Application Commands.
 */
export const ApplicationCommandOptionLimits = {
	/**
	 * Maximum characters allowed in the name of an option of an application command.
	 */
	MaximumNameCharacters: 32,

	/**
	 * Maximum characters allowed in the description of an option of an application command.
	 */
	MaximumDescriptionCharacters: 100,

	/**
	 * Maximum length of choices allowed in the option of an application command.
	 */
	MaximumChoicesLength: 25,

	/**
	 * Maximum length of string allowed in the string option of an application command.
	 */
	MaximumStringLength: 6000
} as const;

/**
 * Namespace containing limits related to Permissions of Discord Application Commands.
 */
export const ApplicationCommandPermissionLimits = {
	/**
	 * Maximum length of permissions allowed in the option of an application command.
	 */
	MaximumPermissionsLength: 100
} as const;

/**
 * Namespace containing limits related to Message Buttons.
 */
export const ButtonLimits = {
	/**
	 * Maximum characters allowed in a button label.
	 */
	MaximumLabelCharacters: 80,

	/**
	 * Maximum characters allowed in a button custom ID.
	 */
	MaximumCustomIdCharacters: 100
} as const;

/**
 * Namespace containing limits related to Select Menus.
 */
export const SelectMenuLimits = {
	/**
	 * Maximum characters allowed in a select menu custom ID.
	 */
	MaximumCustomIdCharacters: 100,

	/**
	 * Maximum amount of options allowed in a select menu.
	 */
	MaximumOptionsLength: 25,

	/**
	 * Maximum characters allowed in a select menu placeholder.
	 */
	MaximumPlaceholderCharacters: 150,

	/**
	 * Maximum "minimum" values allowed in a select menu.
	 */
	MaximumMinValuesSize: 25,

	/**
	 * Maximum "maximum" values allowed in a select menu.
	 */
	MaximumMaxValuesSize: 25,

	/**
	 * Maximum characters allowed in a select menu option's name.
	 */
	MaximumLengthOfNameOfOption: 100,

	/**
	 * Maximum characters allowed in a select menu option's description.
	 */
	MaximumLengthOfDescriptionOfOption: 100,

	/**
	 * Maximum characters allowed in a select menu option's value.
	 */
	MaximumLengthOfValueOfOption: 100
} as const;

/**
 * Namespace containing limits related to Discord messages.
 */
export const MessageLimits = {
	/**
	 * Maximum embeds allowed in a single message.
	 */
	MaximumEmbeds: 10,

	/**
	 * Maximum action rows allowed in a single message.
	 */
	MaximumActionRows: 5,

	/**
	 * Maximum characters allowed in a single message for a user.
	 */
	MaximumLength: 2000,

	/**
	 * Maximum characters allowed in a single message for a nitro user.
	 */
	MaximumNitroLength: 4000,

	/**
	 * Maximum numbers of reactions allowed for a message.
	 */
	MaximumReactions: 20,

	/**
	 * Maximum upload size for a free user in a guild of tier 1 or below, or in DMs.
	 * Size is in bytes, and corresponds to 25MB.
	 */
	MaximumUploadSize: 25_000_000,

	/**
	 * Maximum upload size for a Nitro Basic user, in any guild or in DMs.
	 * Size is in bytes, and corresponds to 50MB.
	 */
	MaximumNitroBasicUploadSize: 50_000_000,

	/**
	 * Maximum upload size for a Nitro user, in any guild or in DMs.
	 * Size is in bytes, and corresponds to 500MB.
	 */
	MaximumNitroUploadSize: 500_000_000,

	/**
	 * Maximum upload size for a free user for all different boost levels available in a guild.
	 * Sizes are in bytes, and correspond to 25MB, 25MB, 50MB, and 100MB.
	 */
	MaximumUploadSizeInGuild: [25_000_000, 25_000_000, 50_000_000, 100_000_000],

	/**
	 * Minimum number of messages to return from the channel messages API.
	 */
	MinimumMessagesToFetch: 1,

	/**
	 * Maximum number of messages to return from the channel messages API.
	 */
	MaximumMessagesToFetch: 100,

	/**
	 * Maximum request size when sending a messages.
	 * Size is in bytes, and corresponds to 25MB.
	 */
	MaximumRequestSize: 25_000_000,

	/**
	 * Minimum number of messages to delete in a single bulk delete request.
	 */
	MinimumMessagesToBulkDelete: 2,

	/**
	 * Maximum number of messages to delete in a single bulk delete request.
	 */
	MaximumMessagesToBulkDelete: 100
} as const;

/**
 * Namespace containing limits related to Discord message reactions.
 */
export const ReactionLimits = {
	/**
	 * Minimum number of reactions to fetch from the message reactions API.
	 */
	MinimumReactionToFetch: 1,

	/**
	 * Maximum number of reactions to fetch from the message reactions API.
	 */
	MaximumReactionsToFetch: 100
};

/**
 * Namespace containing limits related to built-in moderation features.
 */
export const ModerationLimits = {
	/**
	 * Maximum duration of a guild timeout, in seconds (corresponds to 28 days).
	 */
	MaximumTimeoutDuration: 2_419_200
} as const;

/**
 * Namespace containing limits related to Discord roles.
 */
export const RoleLimits = {
	/**
	 * Maximum characters allowed in a role name.
	 */
	MaximumNameLength: 100
} as const;

/**
 * Namespace containing limits related to Discord users and Direct Messages.
 */
export const UserLimits = {
	/**
	 * Maximum numbers of users in a DM group.
	 */
	MaximumUsersPerDMGroup: 10,

	/**
	 * Maximum characters allowed in a user's biography (the "About Me" section).
	 */
	MaximumBiographyLength: 190
} as const;

/**
 * Namespace container limits related to Discord autocomplete interactions.
 */
export const AutoCompleteLimits = {
	/**
	 * Maximum options allowed in a single autocomplete response.
	 */
	MaximumAmountOfOptions: 25,

	/**
	 * Maximum characters allowed in a select menu option's name.
	 */
	MaximumLengthOfNameOfOption: 100
} as const;

/**
 * Namespace containing limits related to Discord Modals.
 */
export const ModalLimits = {
	/**
	 * Maximum characters allowed in a modal custom ID.
	 */
	MaximumCustomIdCharacters: 100,

	/**
	 * Maximum characters allowed in a modal title.
	 */
	MaximumTitleCharacters: 45,

	/**
	 * Maximum components allowed in a modal.
	 */
	MaximumComponents: 5
} as const;

/**
 * Namespace containing limits related to Discord Modal Text Input component.
 */
export const TextInputLimits = {
	/**
	 * Maximum characters allowed in a text input custom ID.
	 */
	MaximumCustomIdCharacters: 100,

	/**
	 * Maximum characters allowed in a text input label.
	 */
	MaximumLabelCharacters: 45,

	/**
	 * Maximum characters allowed in a text input placeholder.
	 */
	MaximumPlaceholderCharacters: 100,

	/**
	 * Maximum characters allowed in a text input value.
	 */
	MaximumValueCharacters: 4000
} as const;

/**
 * Namespace containing limits related to Discord Application Role Connections.
 */
export const ApplicationRoleConnectionLimits = {
	/**
	 * Maximum application role connection metadata records an application can have.
	 */
	MaximumMetadataRecords: 5,

	/**
	 * Maximum characters allowed in metadata values.
	 */
	MaximumMetadataValueLength: 100,

	/**
	 * Maximum characters allowed in a platform name.
	 */
	MaximumPlatformNameLength: 50,

	/**
	 * Maximum characters allowed in a platform username.
	 */
	MaximumPlatformUsernameLength: 100
} as const;

/**
 * Namespace containing limits related to Discord Guild Audit Logs.
 */
export const GuildAuditLogsLimits = {
	/**
	 * Minimum number of entries to return from the guild audit log API.
	 */
	MinimumEntriesToFetch: 1,

	/**
	 * Maximum number of entries to return from the guild audit log API.
	 */
	MaximumEntriesToFetch: 100
} as const;

/**
 * Namespace containing limits related to Discord Auto Moderation Rules.
 */
export const AutoModerationRuleLimits = {
	/**
	 * Maximum number of exempt roles a rule can have.
	 */
	MaximumExemptRoles: 20,

	/**
	 * Maximum number of exempt channels a rule can have.
	 */
	MaximumExemptChannels: 50
} as const;

/**
 * Namespace containing limits related to Discord Auto Moderation Triggers.
 */
export const TriggerTypeLimits = {
	/**
	 * Maximum number of keyword triggers a guild can have.
	 */
	MaximumKeywordTriggersPerGuild: 6,

	/**
	 * Maximum number of mention spam triggers a guild can have.
	 */
	MaximumSpamTriggersPerGuild: 1,

	/**
	 * Maximum number of keyword triggers a channel can have.
	 */
	MaximumKeywordPresetTriggersPerChannel: 1,

	/**
	 * Maximum number of mention spam triggers a channel can have.
	 */
	MaximumMentionSpamTriggersPerChannel: 1
} as const;

/**
 * Namespace containing limits related to Discord Auto Moderation Trigger Metadata.
 */
export const TriggerMetadataLimits = {
	/**
	 * Maximum number of substrings which will be searched for in content.
	 */
	MaximumKeywordFilters: 1000,

	/**
	 * Maximum number of characters allowed in a keyword filter.
	 */
	MaximumKeywordFilterLength: 60,

	/**
	 * Maximum number of regular expression patterns which will be matched against content.
	 */
	MaximumRegexPatterns: 10,

	/**
	 * Maximum number of characters allowed in a regular expression pattern.
	 */
	MaximumCharactersPerRegexPattern: 260,

	/**
	 * Maximum number of substrings which should not trigger the keyword rule.
	 */
	MaximumKeywordAllowListLength: 100,

	/**
	 * Maximum characters per keyword that should not trigger the keyword rule.
	 */
	MaximumKeywordAllowListKeywordLength: 60,

	/**
	 * Maximum characters per keyword should not trigger the keyword preset rule.
	 */
	MaximumKeywordPresetAllowListKeywordPresetLength: 60,

	/**
	 * Maximum number of substrings which should not trigger the keyword preset rule.
	 */
	MaximumKeywordPresetAllowListLength: 1000,

	/**
	 * Maximum number of unique role and user mentions allowed per message.
	 */
	MaximumMentionSpamTotalMentions: 50
} as const;

/**
 * Namespace containing limits related to Discord Auto Moderation Action Metadata.
 */
export const ActionMetadataLimits = {
	/**
	 * Maximum timeout duration in seconds.
	 */
	MaximumTimeoutDurationSeconds: 2_419_200,

	/**
	 * Maximum number of characters allowed in a custom block message.
	 */
	MaximumCustomBlockMessageLength: 150
} as const;

/**
 * Namespace containing limits related to Discord Message Allowed Mentions.
 */
export const AllowedMentionsLimits = {
	/**
	 * Maximum number of users allowed in an allowed mentions object.
	 */
	MaximumUsers: 100,

	/**
	 * Maximum number of roles allowed in an allowed mentions object.
	 */
	MaximumRoles: 100
} as const;

/**
 * Namespace containing limits related to Discord Channel Invites.
 */
export const ChannelInviteLimits = {
	/**
	 * Maximum age of an invite in seconds.
	 */
	MaximumAgeSeconds: 604_800,

	/**
	 * Maximum number of uses allowed for an invite.
	 */
	MaximumUses: 100
} as const;

/**
 * Namespace containing limits related to Discord Guild Integrations.
 */
export const GuildIntegrationLimits = {
	/**
	 * Maximum number of integrations returned from the guild integrations API. Needs a more description name than "MaximumIntegrations".
	 */
	MaximumIntegrationsToFetch: 50
} as const;

/**
 * Namespace containing limits related to Discord Stickers.
 */
export const StickerLimits = {
	/**
	 * Maximum number of characters allowed in the autocomplete/suggestion tags for the sticker.
	 */
	MaximumTagsLength: 200,

	/**
	 * Maximum size allowed for a sticker.
	 * Size is in bytes, and corresponds to 512KB.
	 */
	MaximumStickerSize: 512_000
};

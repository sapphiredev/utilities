import type { APIApplicationCommandInteractionDataBasicOption, ModalSubmitComponent } from 'discord-api-types/v10';

export type If<Value extends boolean, TrueResult, FalseResult> = Value extends true
	? TrueResult
	: Value extends false
		? FalseResult
		: FalseResult | TrueResult;

export type RequiredIf<Value extends boolean, ValueType, FallbackType = null> = If<Value, ValueType, FallbackType | ValueType>;

export type BasicApplicationCommandOptionType = APIApplicationCommandInteractionDataBasicOption['type'];

// This extra type is required because apparently just inlining what `_TypeToOptionMap` does into `TypeToOptionMap` does not behave the same
type _TypeToOptionMap = {
	[Option in BasicApplicationCommandOptionType]: APIApplicationCommandInteractionDataBasicOption & { type: Option };
};

export type TypeToOptionMap = {
	[Option in keyof _TypeToOptionMap]: _TypeToOptionMap[Option];
};

export type ModalComponentType = ModalSubmitComponent['type'];

type _TypeToModalComponentMap = {
	[Component in ModalComponentType]: ModalSubmitComponent & { type: Component };
};

export type TypeToModalComponentMap = {
	[Component in keyof _TypeToModalComponentMap]: _TypeToModalComponentMap[Component];
};

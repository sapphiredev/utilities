type If<Value extends boolean, TrueResult, FalseResult> = Value extends true
	? TrueResult
	: Value extends false
		? FalseResult
		: TrueResult | FalseResult;

export type RequiredIf<Value extends boolean, ValueType, FallbackType = null> = If<Value, ValueType, ValueType | FallbackType>;

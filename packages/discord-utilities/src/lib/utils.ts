export type If<Value extends boolean, TrueResult, FalseResult = null> = Value extends true
	? TrueResult
	: Value extends false
		? TrueResult | FalseResult
		: TrueResult;

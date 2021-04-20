export class ValidationError extends Error {
	public constructor(public key: ValidationKeys, message: string) {
		super(ValidationError.resolveMessage(key, message));
	}

	private static resolveMessage(key: ValidationKeys, extraMessage: string): string {
		switch (key) {
			case ValidationKeys.Title:
				return `Title Validation Error: ${extraMessage}`;
			case ValidationKeys.Field: return `Field Validation Error: ${extraMessage}`;
		}
	}
}

export const enum ValidationKeys {
	Title,
	Field
}

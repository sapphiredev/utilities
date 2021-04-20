export class ValidationError extends Error {
	public constructor(public key: ValidationKeys, message: string) {
		super(ValidationError.resolveMessage(key, message));
	}

	private static resolveMessage(key: ValidationKeys, extraMessage: string): string {
		switch (key) {
			case ValidationKeys.Title:
				return `Title Validation Error: ${extraMessage}`;
			case ValidationKeys.Field:
				return `Field Validation Error: ${extraMessage}`;
			case ValidationKeys.Footer:
				return `Footer Validation Error: ${extraMessage}`;
			case ValidationKeys.Timestamp:
				return `Timestamp Validation Error: ${extraMessage}`;
			case ValidationKeys.Description:
				return `Description Validation Error: ${extraMessage}`;
			case ValidationKeys.Image:
				return `Image Validation Error: ${extraMessage}`;
			case ValidationKeys.Thumbnail:
				return `Thumbnail Validation Error: ${extraMessage}`;
			case ValidationKeys.Author:
				return `Author Validation Error: ${extraMessage}`;
		}
	}
}

export const enum ValidationKeys {
	Title,
	Field,
	Footer,
	Timestamp,
	Description,
	Image,
	Thumbnail,
	Author
}

export class OptionError extends Error {
	public override get name(): string {
		return this.constructor.name;
	}
}

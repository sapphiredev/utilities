export class ResultError<E> extends Error {
	public readonly value: E;

	public constructor(message: string, value: E) {
		super(message);
		this.value = value;
	}

	public override get name(): string {
		return this.constructor.name;
	}
}

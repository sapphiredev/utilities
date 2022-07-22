export abstract class BaseParameter {
	public readonly separators: readonly string[];

	public constructor(separators: readonly string[]) {
		this.separators = separators;
	}

	public get leading(): string {
		return this.separators.join('');
	}

	public abstract get raw(): string;
}

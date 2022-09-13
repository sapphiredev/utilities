import type { IType } from './IType';

export const Snowflake: IType<Snowflake.Input | Snowflake.Output, Snowflake.Output> = {
	size: 64,
	deserialize(buffer) {
		return String(buffer.readB64()) as Snowflake.Output;
	},
	serialize(buffer, value) {
		buffer.writeB64(BigInt(value));
	}
};

export namespace Snowflake {
	export type Output = `${bigint}`;
	export type Input = `${bigint}` | bigint;
}

import type { IType } from './IType';

export const Boolean: IType<Boolean.Type> = {
	size: 1,
	deserialize(buffer) {
		return buffer.readU1() === 1;
	},
	serialize(buffer, value) {
		buffer.writeU1(value ? 1 : 0);
	}
};

export namespace Boolean {
	export type Type = boolean;
}

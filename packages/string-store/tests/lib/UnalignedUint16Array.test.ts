import { UnalignedUint16Array } from '../../src';

describe('UnalignedUint16Array', () => {
	test('GIVEN a new instance THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		expect(buffer.maxLength).toBe(10);
		expect(buffer.maxBitLength).toBe(160);
		expect(buffer.length).toBe(0);
		expect(buffer.bitLength).toBe(0);
		expect(buffer.toArray()).toEqual(new Uint16Array(0));
		expect(buffer.toString()).toBe('');
	});

	test('GIVEN an instance with a bit written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeBit(1);
		expect(buffer.length).toBe(1);
		expect(buffer.bitLength).toBe(1);
		expect(buffer.toArray()).toEqual(new Uint16Array([1]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readBit(0)).toBe(1);
	});

	test('GIVEN an instance with a 2-bit integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeInt2(3);
		expect(buffer.length).toBe(1);
		expect(buffer.bitLength).toBe(2);
		expect(buffer.toArray()).toEqual(new Uint16Array([3]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readInt2(0)).toBe(-1);
		expect(buffer.readUint2(0)).toBe(3);
	});

	test('GIVEN an instance with a 4-bit integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeInt4(15);
		expect(buffer.length).toBe(1);
		expect(buffer.bitLength).toBe(4);
		expect(buffer.toArray()).toEqual(new Uint16Array([15]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readInt4(0)).toBe(-1);
		expect(buffer.readUint4(0)).toBe(15);
	});

	test('GIVEN an instance with an 8-bit integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeInt8(255);
		expect(buffer.length).toBe(1);
		expect(buffer.bitLength).toBe(8);
		expect(buffer.toArray()).toEqual(new Uint16Array([255]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readInt8(0)).toBe(-1);
		expect(buffer.readUint8(0)).toBe(255);
	});

	test('GIVEN an instance with a 16-bit integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeInt16(65535);
		expect(buffer.length).toBe(1);
		expect(buffer.bitLength).toBe(16);
		expect(buffer.toArray()).toEqual(new Uint16Array([65535]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readInt16(0)).toBe(-1);
		expect(buffer.readUint16(0)).toBe(65535);
	});

	test('GIVEN an instance with a 32-bit integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeInt32(4294967295);
		expect(buffer.length).toBe(2);
		expect(buffer.bitLength).toBe(32);
		expect(buffer.toArray()).toEqual(new Uint16Array([65535, 65535]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readInt32(0)).toBe(-1);
		expect(buffer.readUint32(0)).toBe(4294967295);
	});

	test('GIVEN an instance with a 64-bit integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeInt64(3058204829589);
		expect(buffer.length).toBe(4);
		expect(buffer.bitLength).toBe(64);
		expect(buffer.toArray()).toEqual(new Uint16Array([26517, 2870, 712, 0]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readInt64(0)).toBe(3058204829589);
		expect(buffer.readUint64(0)).toBe(3058204829589);
	});

	test('GIVEN an instance with a 32-bit big integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeBigInt32(4294967295n);
		expect(buffer.length).toBe(2);
		expect(buffer.bitLength).toBe(32);
		expect(buffer.toArray()).toEqual(new Uint16Array([65535, 65535]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readBigInt32(0)).toBe(-1n);
		expect(buffer.readBigUint32(0)).toBe(4294967295n);
	});

	test('GIVEN an instance with a 64-bit big integer written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeBigInt64(18446744073709551615n);
		expect(buffer.length).toBe(4);
		expect(buffer.bitLength).toBe(64);
		expect(buffer.toArray()).toEqual(new Uint16Array([65535, 65535, 65535, 65535]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readBigInt64(0)).toBe(-1n);
		expect(buffer.readBigUint64(0)).toBe(18446744073709551615n);
	});

	test('GIVEN an instance with a 32-bit float written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeFloat32(0.5);
		expect(buffer.length).toBe(2);
		expect(buffer.bitLength).toBe(32);
		expect(buffer.toArray()).toEqual(new Uint16Array([0, 16128]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readFloat32(0)).toBe(0.5);
	});

	test('GIVEN an instance with a 64-bit float written THEN it has the correct properties', () => {
		const buffer = new UnalignedUint16Array(10);
		buffer.writeFloat64(0.5);
		expect(buffer.length).toBe(4);
		expect(buffer.bitLength).toBe(64);
		expect(buffer.toArray()).toEqual(new Uint16Array([0, 0, 0, 16352]));

		// Verify that the data can be deserialized correctly
		expect(buffer.readFloat64(0)).toBe(0.5);
	});

	test('GIVEN an instance with insufficient space (write bit by bit) THEN it throws', () => {
		const buffer = new UnalignedUint16Array(1);
		buffer.writeInt16(1);
		expect(() => buffer.writeBit(1)).toThrowError('The buffer is full');
	});

	test('GIVEN an instance with insufficient space (write word by word) THEN it throws', () => {
		const buffer = new UnalignedUint16Array(1);
		expect(() => buffer.writeInt32(1)).toThrowError('The buffer is full');
	});

	test('GIVEN an instance from invalid codepoints THEN it throws', () => {
		expect(() => UnalignedUint16Array.from("hello")).toThrowError('Codepoint 104 is out of range');
	});
});

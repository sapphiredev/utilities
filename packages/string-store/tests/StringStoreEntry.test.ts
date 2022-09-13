import { Types } from '../src';
import { AlignedReader } from '../src/lib/data/reader/AlignedReader';
import { StringStoreEntry } from '../src/lib/StringStoreEntry';

describe('StringStoreEntry', () => {
	test('GIVEN empty entry THEN size returns 0', () => {
		const store = new StringStoreEntry(0, 'test');

		expect(store.id).toBe(0);
		expect(store.name).toBe('test');
		expect(store.size).toBe(0);
	});

	test('GIVEN entry with one field THEN returns typed object', () => {
		const store = new StringStoreEntry(0, 'test').add('user', Types.Snowflake);
		const reader = new AlignedReader('\x03\x00\x82\x7a\x45\xe9\x5b\x03');

		expect(store.size).toBe(64);
		expect(store.deserialize(reader)).toStrictEqual({ type: 'test', user: '242043489611808771' });
	});
});

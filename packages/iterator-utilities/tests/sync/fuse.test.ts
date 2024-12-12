import { fuse } from '../../src';

describe('fuse', () => {
	function makeAlternatingIterable(): Iterator<number> {
		let state = 0;
		return {
			next() {
				const value = state;
				state += 1;
				return value % 2 === 0 //
					? { done: false, value }
					: { done: true, value: undefined };
			}
		};
	}

	test('GIVEN given an alternating iterator THEN returns a non-alternating iterator', () => {
		const iterable = makeAlternatingIterable();

		// We can see our iterator going back and forth
		expect(iterable.next()).toEqual({ done: false, value: 0 });
		expect(iterable.next()).toEqual({ done: true, value: undefined });
		expect(iterable.next()).toEqual({ done: false, value: 2 });
		expect(iterable.next()).toEqual({ done: true, value: undefined });

		const fused = fuse(iterable);

		expect(fused.next()).toEqual({ done: false, value: 4 });
		expect(fused.next()).toEqual({ done: true, value: undefined });

		// It will always return a `done` result after the first time
		expect(fused.next()).toEqual({ done: true, value: undefined });
		expect(fused.next()).toEqual({ done: true, value: undefined });
		expect(fused.next()).toEqual({ done: true, value: undefined });
	});
});

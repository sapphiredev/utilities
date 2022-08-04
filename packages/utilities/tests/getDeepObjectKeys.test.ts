import { getDeepObjectKeys, GetDeepObjectKeysOptions, NonNullObject } from '../src';

describe('getDeepObjectKeys', () => {
	const scenarios: Scenario[] = [
		[{ a: 1, b: 2 }, {}, ['a', 'b']],
		[{ a: { b: 1, c: 2 }, d: 3 }, {}, ['a.b', 'a.c', 'd']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }] }, {}, ['a.0.b', 'a.0.c', 'a.1.d']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }] }, { arrayKeysDottedIndex: false }, ['a[0]b', 'a[0]c', 'a[1]d']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }] }, { arrayKeysDottedIndex: true }, ['a.0.b', 'a.0.c', 'a.1.d']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }], e: 4, f: { g: { h: { i: { j: { k: 5 } } } } } }, {}, ['a.0.b', 'a.0.c', 'a.1.d', 'e', 'f.g.h.i.j.k']]
	];

	test.each(scenarios)('GIVEN %j with %j THEN keys should equal %j', (inputObj, options, outputStrings) => {
		expect(getDeepObjectKeys(inputObj, options)).toEqual(outputStrings);
	});
});

type Scenario = [NonNullObject, GetDeepObjectKeysOptions, string[]];

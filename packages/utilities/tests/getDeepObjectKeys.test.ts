import { getDeepObjectKeys, type GetDeepObjectKeysOptions, type NonNullObject } from '../src';

describe('getDeepObjectKeys', () => {
	const scenarios: Scenario[] = [
		[{ a: 1, b: 2 }, {}, ['a', 'b']],
		[{ a: [[]] }, {}, []],
		[{ a: [[{ b: 0 }]] }, {}, ['a.0.0.b']],
		[{ id: { number: '123', dates: [new Date('12-12-2022'), new Date()] } }, {}, ['id.number', 'id.dates.0', 'id.dates.1']],
		[{ a: { b: 1, c: 2 }, d: 3 }, {}, ['a.b', 'a.c', 'd']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }] }, {}, ['a.0.b', 'a.0.c', 'a.1.d']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }] }, { arrayKeysIndexStyle: 'braces' }, ['a[0]b', 'a[0]c', 'a[1]d']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }] }, { arrayKeysIndexStyle: 'braces-with-dot' }, ['a[0].b', 'a[0].c', 'a[1].d']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }] }, { arrayKeysIndexStyle: 'dotted' }, ['a.0.b', 'a.0.c', 'a.1.d']],
		[{ a: [{ b: 1, c: 2 }, { d: 3 }], e: 4, f: { g: { h: { i: { j: { k: 5 } } } } } }, {}, ['a.0.b', 'a.0.c', 'a.1.d', 'e', 'f.g.h.i.j.k']]
	];

	test.each(scenarios)('GIVEN %j with %j THEN keys should equal %j', (inputObj, options, outputStrings) => {
		expect(getDeepObjectKeys(inputObj, options)).toEqual(outputStrings);
	});
});

type Scenario = [NonNullObject, GetDeepObjectKeysOptions, string[]];

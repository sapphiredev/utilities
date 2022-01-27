import { maybe, isSome, isNone, some, none, isMaybe } from "../src/index"

describe("Maybe", () => {
	test("some", () => {
		const returnValue = some(42);

		expect(isSome(returnValue)).toBeTruthy();
		expect(isNone(returnValue)).toBeFalsy();
	})

	test("none", () => {
		const returnValue = none();

		expect(isSome(returnValue)).toBeFalsy();
		expect(isNone(returnValue)).toBeTruthy();
	})

	test("maybe", () => {
		const returnValue = maybe(42);

		expect(isMaybe(returnValue)).toBeTruthy();
	})
})
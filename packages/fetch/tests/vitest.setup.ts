const originalGlobalFetch = globalThis.fetch;

globalThis.fetch = undefined!;

afterAll(() => {
	if (originalGlobalFetch) {
		globalThis.fetch = originalGlobalFetch;
	}
});

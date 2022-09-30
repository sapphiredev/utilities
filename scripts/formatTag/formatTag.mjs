export function formatTag(tag) {
	const parsed = /(^@.*\/(?<package>.*)@v?)?(?<semver>\d+.\d+.\d+)-?.*/.exec(tag);

	if (parsed?.groups) {
		return {
			package: parsed.groups.package,
			semver: parsed.groups.semver
		};
	}

	return null;
}

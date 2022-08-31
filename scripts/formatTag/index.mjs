import { getInput, setOutput } from '@actions/core';
import { formatTag } from './formatTag.mjs';

const tag = getInput('tag', { required: true });
const parsed = formatTag(tag);

if (parsed) {
	setOutput('package', parsed.package);
	setOutput('semver', parsed.semver);
}

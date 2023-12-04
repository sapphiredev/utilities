import { Options } from 'tsup';
import { createTsupConfig } from '../../scripts/tsup.config';

const options: Options = {
	sourcemap: false,
	dts: false
};

export default createTsupConfig({
	cjsOptions: options,
	esmOptions: options,
	iifeOptions: { disabled: true }
});

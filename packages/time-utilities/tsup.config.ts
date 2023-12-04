import type { Options } from 'tsup';
import { createTsupConfig } from '../../scripts/tsup.config';

const options: Options = { target: 'es2020' };

export default createTsupConfig({
	cjsOptions: options,
	esmOptions: options,
	iifeOptions: { ...options, globalName: 'SapphireTimeUtilities' }
});

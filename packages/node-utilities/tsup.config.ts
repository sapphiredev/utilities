import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({ target: 'es2019', format: ['cjs', 'esm'] });

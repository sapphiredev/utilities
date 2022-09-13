import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({ format: ['esm', 'cjs'] });

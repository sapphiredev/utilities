import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({ format: ['cjs'], sourcemap: false, dts: false });

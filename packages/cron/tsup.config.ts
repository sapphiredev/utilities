import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({ globalName: 'SapphireCron', target: 'es2020' });

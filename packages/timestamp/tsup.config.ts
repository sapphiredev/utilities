import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({ globalName: 'SapphireTimestamp', target: 'es2020' });

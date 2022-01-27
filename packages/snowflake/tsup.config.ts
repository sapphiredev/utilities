import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({ globalName: 'SapphireSnowflake', target: 'es2020' });

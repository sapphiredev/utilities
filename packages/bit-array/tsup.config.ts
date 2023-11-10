import { createTsupConfig } from '../../scripts/tsup.config';

export default createTsupConfig({ globalName: 'SapphireAsyncQueue', target: 'es2020' });

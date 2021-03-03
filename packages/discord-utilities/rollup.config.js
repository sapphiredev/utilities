import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import baseConfig from '../../scripts/rollup.config';

export default baseConfig({ umdName: 'SapphireDiscordUtilities', plugins: [resolve(), commonjs()] });

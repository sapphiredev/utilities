import { createVitestConfig } from '../../scripts/vitest.config';

export default createVitestConfig({
	test: { coverage: { exclude: ['src/lib/buffer/DuplexBuffer.ts', 'src/lib/types/base/IType.ts'] } }
});

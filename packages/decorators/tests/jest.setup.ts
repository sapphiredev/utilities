import type { SapphireClient } from '@sapphire/framework';
import { client } from './mocks/MockInstances';

afterAll(() => {
	(client as SapphireClient).destroy();
});

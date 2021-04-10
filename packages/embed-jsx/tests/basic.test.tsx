import { MessageEmbed } from 'discord.js';
import {EmbedJsx} from '../src';

describe('basic test', () => {
	test('returns a basic embed', () => {
		const embed = <embed></embed>;
		expect(embed).toStrictEqual(new MessageEmbed());
		expect(embed).toMatchSnapshot();
	})
})

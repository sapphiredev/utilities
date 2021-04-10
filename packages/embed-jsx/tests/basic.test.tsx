import { MessageEmbed } from 'discord.js';
import { EmbedJsx } from '../src';

test('returns a basic embed', () => {
	const embed = <embed></embed>
	expect(embed).toStrictEqual(new MessageEmbed());
	expect(embed).toMatchSnapshot();
})

test('returns an embed with options', () => {
	const embed: MessageEmbed = <embed color="RED"></embed>;
	expect(embed).toStrictEqual(new MessageEmbed({ color: "RED" }));
	expect(embed).toMatchSnapshot();
})

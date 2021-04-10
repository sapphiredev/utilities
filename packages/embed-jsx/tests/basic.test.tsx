import { MessageEmbed } from 'discord.js';
import { EmbedJsx } from '../src';

test('returns a basic embed', () => {
	const embed = <embed></embed>
	expect(embed).toStrictEqual(new MessageEmbed());
	expect(embed).toMatchSnapshot();
});

test('returns an embed with options', () => {
	const embed: MessageEmbed = <embed color="RED"></embed>;
	expect(embed).toStrictEqual(new MessageEmbed({ color: "RED" }));
	expect(embed).toMatchSnapshot();
});

test('return an embed with a title', () => {
	const embed = <embed>
		<title>This is the title</title>
	</embed>;
	const expected = new MessageEmbed().setTitle('This is the title');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
})

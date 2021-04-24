import { MessageEmbed } from 'discord.js';
import { EmbedJsx } from '../src';

test('returns a basic embed', () => {
	const embed = <embed></embed>;
	expect(embed).toStrictEqual(new MessageEmbed());
	expect(embed).toMatchSnapshot();
});

test('returns an embed with options', () => {
	const embed: MessageEmbed = <embed color="RED"></embed>;
	expect(embed).toStrictEqual(new MessageEmbed({ color: 'RED' }));
	expect(embed).toMatchSnapshot();
});

test('return an embed with a title', () => {
	const embed = (
		<embed>
			<title>This is the title</title>
		</embed>
	);
	const expected = new MessageEmbed().setTitle('This is the title');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with a title and url', () => {
	const embed = (
		<embed>
			<title url="https://www.github.com/">GitHub</title>
		</embed>
	);
	const expected = new MessageEmbed().setTitle('GitHub').setURL('https://www.github.com/');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with fields', () => {
	const embed = (
		<embed>
			<field>Hey</field>
			<field name="Title">Hello</field>
			<field name="Inline" inline>
				Hey there
			</field>
		</embed>
	);
	const expected = new MessageEmbed().addFields(
		{ name: '\u200B', value: 'Hey' },
		{ name: 'Title', value: 'Hello' },
		{ name: 'Inline', value: 'Hey there', inline: true }
	);
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with a footer', () => {
	const embed = (
		<embed>
			<footer>Hey there</footer>
		</embed>
	);
	const expected = new MessageEmbed().setFooter('Hey there');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with a timestamp', () => {
	const embed = (
		<embed>
			<timestamp>{new Date(10)}</timestamp>
		</embed>
	);
	const expected = new MessageEmbed().setTimestamp(new Date(10));
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with a description', () => {
	const embed = (
		<embed>
			<description>Hello!</description>
		</embed>
	);
	const expected = new MessageEmbed().setDescription('Hello!');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with an image', () => {
	const embed = (
		<embed>
			<image url="https://www.google.com/" />
		</embed>
	);
	const expected = new MessageEmbed().setImage('https://www.google.com/');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with a thumbnail', () => {
	const embed = (
		<embed>
			<thumbnail url="https://www.google.com/" />
		</embed>
	);
	const expected = new MessageEmbed().setThumbnail('https://www.google.com/');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

test('return an embed with an author', () => {
	const embed = (
		<embed>
			<author>Hi mom!</author>
		</embed>
	);
	const expected = new MessageEmbed().setAuthor('Hi mom!');
	expect(embed).toStrictEqual(expected);
	expect(embed).toMatchSnapshot();
});

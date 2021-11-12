import { ColorResolvable, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import {
	validateAuthorData,
	validateDescriptionData,
	validateFieldData,
	validateFooterData,
	validateImageData,
	validateTimestampData,
	validateTitleData
} from './utils';

const EMBED_TYPES = ['embed', 'title', 'field', 'timestamp', 'footer', 'description', 'image', 'thumbnail', 'author'] as const;

type EmbedInformation =
	| TitleInformation
	| FieldInformation
	| TimestampInformation
	| FooterInformation
	| DescriptionInformation
	| ThumbnailInformation
	| ImageInformation
	| AuthorInformation;

type EmbedData = TitleData | FieldData | TimestampData | FooterData | DescriptionData | ImageData | EmptyData | ThumbnailData | AuthorData;

const enum TsxTypes {
	Title,
	Description,
	Thumbnail,
	Field,
	Timestamp,
	Footer,
	Image,
	Empty,
	Author
}

// Received types
export type TitleInformation = [{ url: string } | null, string];
export type DescriptionInformation = [null, string];
export type FieldInformation = [{ name?: string; inline?: boolean } | null, string];
export type TimestampInformation = [null, number | string | Date | null];
export type FooterInformation = [null | { iconURL?: string }, string];
export type EmbedInitialInformation = [{ color: ColorResolvable } | null, ...EmbedData[]];
export type ImageInformation = [{ url: string }, null];
export type ThumbnailInformation = [{ url: string }, null];
export type AuthorInformation = [{ url?: string; iconURL?: string } | null, string];

// Returned types
type TitleData = [TsxTypes.Title, string, string?];
type DescriptionData = [TsxTypes.Description, string];
type FieldData = [TsxTypes.Field, string, string, boolean];
type TimestampData = [TsxTypes.Timestamp, Date];
type FooterData = [TsxTypes.Footer, string, string?];
type ImageData = [TsxTypes.Image, string];
type ThumbnailData = [TsxTypes.Thumbnail, string];
type EmptyData = [TsxTypes.Empty];
type AuthorData = [TsxTypes.Author, string, string?, string?];

/**
 * The namespace to import for embed-jsx
 *
 * @example
 * ```typescriptreact
 * import { EmbedJsx } from '@sapphire/embed-jsx';
 *
 * const embed = (
 *   <embed color="RED">
 * 	   <title>New Embed</title>
 * 	   <description>Hello!</description>
 *   </embed>
 * )
 * ```
 */
export namespace EmbedJsx {
	/**
	 * The behind the scenes function that TS uses to turn JSX into proper JS
	 * @param type The embed type being created
	 * @param data The data emitted along with
	 * @returns The embed defined with jsx
	 */
	export function make(type: typeof EMBED_TYPES[number], ...data: EmbedInformation | EmbedInitialInformation): EmbedData | MessageEmbed {
		type = type.toLowerCase() as typeof EMBED_TYPES[number];
		if (!EMBED_TYPES.includes(type)) throw new TypeError(`Invalid type passed, expected one of ${EMBED_TYPES.join(', ')}; got: ${type}`);
		switch (type) {
			case 'embed': {
				const info = data as EmbedInitialInformation;
				let embed = new MessageEmbed((info.shift() as MessageEmbedOptions) ?? {});
				for (const value of info) {
					embed = resolveData((value as EmbedData) ?? [TsxTypes.Empty], embed);
				}
				return embed;
			}
			case 'title': {
				validateTitleData(data);
				return [TsxTypes.Title, data[1], data[0]?.url];
			}
			case 'field': {
				validateFieldData(data);
				return [TsxTypes.Field, data[0]?.name ?? '\u200B', data[1], data[0]?.inline ?? false];
			}
			case 'footer': {
				validateFooterData(data);
				return [TsxTypes.Footer, data[1], data[0]?.iconURL];
			}
			case 'timestamp': {
				validateTimestampData(data);
				return [TsxTypes.Timestamp, new Date(data[1] ?? Date.now())];
			}
			case 'description': {
				validateDescriptionData(data);
				return [TsxTypes.Description, data[1]];
			}
			case 'image': {
				validateImageData(data, 'image');
				return [TsxTypes.Image, data[0].url];
			}
			case 'thumbnail': {
				validateImageData(data, 'thumbnail');
				return [TsxTypes.Thumbnail, data[0].url];
			}
			case 'author': {
				validateAuthorData(data);
				return [TsxTypes.Author, data[1], data[0]?.iconURL, data[0]?.url];
			}
		}
	}

	function resolveData(data: EmbedData, embed: MessageEmbed): MessageEmbed {
		switch (data[0]) {
			case TsxTypes.Title: {
				embed.setTitle(data[1]);
				if (typeof data[2] !== 'undefined') embed.setURL(data[2]);
				return embed;
			}
			case TsxTypes.Description: {
				return embed.setDescription(data[1]);
			}
			case TsxTypes.Field: {
				return embed.addField(data[1], data[2], data[3]);
			}
			case TsxTypes.Footer: {
				return embed.setFooter(data[1], data[2]);
			}
			case TsxTypes.Timestamp: {
				return embed.setTimestamp(data[1]);
			}
			case TsxTypes.Image: {
				return embed.setImage(data[1]);
			}
			case TsxTypes.Thumbnail: {
				return embed.setThumbnail(data[1]);
			}
			case TsxTypes.Author: {
				return embed.setAuthor(data[1], data[2], data[3]);
			}
			case TsxTypes.Empty: {
				/* istanbul ignore next */
				return embed;
			}
		}
	}
}

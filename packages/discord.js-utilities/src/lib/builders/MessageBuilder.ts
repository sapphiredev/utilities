import type { MessageEmbed, MessageMentionOptions, MessageOptions } from 'discord.js';

/**
 * Exclude null and undefined from T
 */
type Defined<T> = T extends undefined ? never : T;

export type MessageBuilderFileResolvable = Defined<MessageOptions['files']>[number];
export type MessageBuilderCodeResolvable = Defined<MessageOptions['code']>;
export type MessageBuilderSplitResolvable = Defined<MessageOptions['split']>;
export type MessageBuilderResolvable = Omit<MessageOptions, 'embed' | 'disableMentions' | 'reply'> & { embed?: MessageEmbed };

/**
 * A message builder class, it implements the {@link https://discord.js.org/#/docs/main/stable/typedef/MessageOptions MessageOptions}
 * interface.
 */
export class MessageBuilder implements MessageOptions {
	/**
	 * Whether or not the message should be spoken aloud.
	 * @default false
	 */
	public tts?: boolean;

	/**
	 * The nonce for the message.
	 * @default ''
	 */
	public nonce?: string;

	/**
	 * The content for the message. If set to undefined and the builder is used to edit, the content will not be
	 * replaced.
	 */
	public content?: string;

	/**
	 * An embed for the message. If set to undefined and the builder is used to edit, the embed will not be replaced.
	 */
	public embed?: MessageEmbed;

	/**
	 * Which mentions should be parsed from the message content.
	 */
	public allowedMentions?: MessageMentionOptions;

	/**
	 * Files to send with the message. This should not be set when editing a message, as Discord does not support
	 * editing file attachments.
	 */
	public files?: MessageBuilderFileResolvable[];

	/**
	 * Language for optional codeblock formatting to apply.
	 */
	public code?: MessageBuilderCodeResolvable;

	/**
	 * Whether or not the message should be split into multiple messages if it exceeds the character limit. If an object
	 * is provided, these are the options for splitting the message.
	 */
	public split?: MessageBuilderSplitResolvable;

	public constructor(options?: MessageBuilderResolvable) {
		this.tts = options?.tts ?? MessageBuilder.defaults.tts;
		this.nonce = options?.nonce ?? MessageBuilder.defaults.nonce;
		this.content = options?.content ?? MessageBuilder.defaults.content;
		this.embed = options?.embed ?? MessageBuilder.defaults.embed;
		this.allowedMentions = options?.allowedMentions ?? MessageBuilder.defaults.allowedMentions;
		this.files = options?.files ?? MessageBuilder.defaults.files;
		this.code = options?.code ?? MessageBuilder.defaults.code;
		this.split = options?.split ?? MessageBuilder.defaults.split;
	}

	/**
	 * Sets the value for the [[MessageBuilder.tts]] field.
	 * @param tts Whether or not the message should be spoken aloud.
	 */
	public setTTS(tts?: boolean): this {
		this.tts = tts;
		return this;
	}

	/**
	 * Sets the value for the [[MessageBuilder.nonce]] field.
	 * @param nonce The nonce for the message.
	 */
	public setNonce(nonce?: string): this {
		this.nonce = nonce;
		return this;
	}

	/**
	 * Sets the value for the [[MessageBuilder.content]] field.
	 * @param content The content for the message. If set to undefined and the builder is used to edit, the content will
	 * not be replaced.
	 */
	public setContent(content?: string): this {
		this.content = content;
		return this;
	}

	/**
	 * Sets the value for the [[MessageBuilder.embed]] field.
	 * @param embed An embed for the message. If set to undefined and the builder is used to edit, the embed will not be
	 * replaced.
	 */
	public setEmbed(embed?: MessageEmbed): this {
		this.embed = embed;
		return this;
	}

	/**
	 * Sets the value for the [[MessageBuilder.allowedMentions]] field.
	 * @param allowedMentions Which mentions should be parsed from the message content.
	 */
	public setAllowedMentions(allowedMentions?: MessageMentionOptions): this {
		this.allowedMentions = allowedMentions;
		return this;
	}

	/**
	 * Adds a new value for the [[MessageBuilder.files]] field array.
	 * @param file The file to add to the [[MessageBuilder.files]] field array.
	 */
	public addFile(file: MessageBuilderFileResolvable): this {
		this.files = this.files?.concat(file) ?? [file];
		return this;
	}

	/**
	 * Sets a single value for the [[MessageBuilder.files]] field array.
	 * @param file The file to send with the message. This should not be set when editing a message, as Discord does not
	 * support editing file attachments.
	 */
	public setFile(file: MessageBuilderFileResolvable): this {
		this.files = [file];
		return this;
	}

	/**
	 * Sets the value for the [[MessageBuilder.files]] field.
	 * @param files The files to send with the message. This should not be set when editing a message, as Discord does
	 * not support editing file attachments.
	 */
	public setFiles(files?: MessageBuilderFileResolvable[]): this {
		this.files = files;
		return this;
	}

	/**
	 * Sets the value for the [[MessageBuilder.code]] field.
	 * @param code Language for optional codeblock formatting to apply.
	 */
	public setCode(code?: MessageBuilderCodeResolvable): this {
		this.code = code;
		return this;
	}

	/**
	 * Sets the value for the [[MessageBuilder.split]] field.
	 * @param split Whether or not the message should be split into multiple messages if it exceeds the character limit.
	 * If an object is provided, these are the options for splitting the message.
	 */
	public setSplit(split?: MessageBuilderSplitResolvable): this {
		this.split = split;
		return this;
	}

	/**
	 * The default values for all MessageBuilder instances.
	 */
	public static defaults: MessageBuilderResolvable = {};
}

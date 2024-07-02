import type { PaginatedMessageMessageOptionsUnion, PaginatedMessageOptions } from './PaginatedMessageTypes';
import { defaultActions } from './constants';

/**
 * This is a {@link PaginatedMessage}, a utility to paginate messages (usually embeds).
 * You must either use this class directly or extend it.
 *
 * @remark Please note that for {@link PaginatedMessage} to work in DMs to your client, you need to add the `'CHANNEL'` partial to your `client.options.partials`.
 * Message based commands can always be used in DMs, whereas Chat Input interactions can only be used in DMs when they are registered globally.
 *
 * {@link PaginatedMessage} uses {@linkplain https://discord.js.org/docs/packages/discord.js/main/MessageComponent:TypeAlias MessageComponent} buttons that perform the specified action when clicked.
 * You can either use your own actions or the {@link PaginatedMessage.defaultActions}.
 * {@link PaginatedMessage.defaultActions} is also static so you can modify these directly.
 *
 * {@link PaginatedMessage} also uses pages via {@linkplain https://discord.js.org/docs/packages/discord.js/main/Message:Class Messages}.
 *
 * @example
 * ```typescript
 * const myPaginatedMessage = new PaginatedMessage();
 * // Once you have an instance of PaginatedMessage you can call various methods on it to add pages to it.
 * // For more details see each method's documentation.
 *
 * myPaginatedMessage.addPageEmbed((embed) => {
 *		embed
 *			.setColor('#FF0000')
 *			.setDescription('example description');
 *
 *		return embed;
 * });
 *
 * myPaginatedMessage.addPageBuilder((builder) => {
 *		const embed = new EmbedBuilder()
 *			.setColor('#FF0000')
 *			.setDescription('example description');
 *
 *		return builder
 *			.setContent('example content')
 *			.setEmbeds([embed]);
 * });
 *
 * myPaginatedMessage.addPageContent('Example');
 *
 * myPaginatedMessage.run(message)
 * ```
 *
 * @remark You can also provide a EmbedBuilder template. This will be applied to every page.
 * If a page itself has an embed then the two will be merged, with the content of
 * the page's embed taking priority over the template.
 *
 * Furthermore, if the template has a footer then it will be applied _after_ the page index part of the footer
 * with a space preceding the template. For example, when setting `- Powered by Sapphire Framework`
 * the resulting footer will be `1/2 - Powered by Sapphire Framework`
 * @example
 * ```typescript
 * const myPaginatedMessage = new PaginatedMessage({
 * 	template: new EmbedBuilder().setColor('#FF0000').setFooter('- Powered by Sapphire framework')
 * });
 * ```
 *
 * @remark To utilize actions you can implement IPaginatedMessageAction into a class.
 * @example
 * ```typescript
 * class ForwardAction implements IPaginatedMessageAction {
 *   public id = '▶️';
 *
 *   public run({ handler }) {
 *     if (handler.index !== handler.pages.length - 1) ++handler.index;
 *   }
 * }
 *
 * // You can also give the object directly.
 *
 * const StopAction: IPaginatedMessageAction = {
 *   customId: 'CustomStopAction',
 *   run: ({ collector }) => {
 *     collector.stop();
 *   }
 * }
 * ```
 */
export class PaginatedMessage {
	// #region public class properties
	/**
	 * The template for this {@link PaginatedMessage}.
	 * You can use templates to set defaults that will apply to each and every page in the {@link PaginatedMessage}
	 */
	public readonly template: PaginatedMessageMessageOptionsUnion;

	/**
	 * The amount of milliseconds to idle before the paginator is closed.
	 * @default 14.5 minutes
	 * @remark This is to ensure it is a bit before interactions expire.
	 */
	public readonly timeUntilExpire: number;

	/**
	 * A template string that can be used for the footer. Several variables are available that will be replaced:
	 *
	 * - `{{currentPage}}` - The current page index.
	 * - `{{totalPages}}` - The total number of pages.
	 * - `{{separatorBetweenCurrentAndTotalPages}}` - The separator between the current page and the total number of pages.
	 * - `{{pageIndexPrefix}}` - The prefix to display before the current page number.
	 * - `{{embedFooterSeparator}}` - The separator to display between the embed footer and the page index (defaults to `•`).
	 *
	 * @remark The default for `{{separatorBetweenCurrentAndTotalPages}}` is ` / `. (A forward slash wrapped with a space before and after it)
	 *
	 * @default '{{currentPage}}{{separatorBetweenCurrentAndTotalPages}}{{totalPages}}'
	 */
	public readonly footerTemplate: string;

	/**
	 * Whether to restrict the paginated message to 25 pages.
	 * This is to ensure that all pages fit within 1 `StringSelectMenu` component.
	 *
	 * @default true
	 */
	public readonly restrictTo25Pages: boolean;
	// #endregion

	// #region protected class properties
	/**
	 * Data for the paginated message.
	 */
	protected readonly paginatedMessageData: Omit<PaginatedMessageMessageOptionsUnion, 'components'> | null = null;
	// #endregion

	/**
	 * Constructor for the {@link PaginatedMessage} class
	 * @param __namedParameters The {@link PaginatedMessageOptions} for this instance of the {@link PaginatedMessage} class
	 */
	public constructor({
		pages,
		actions,
		template,
		footerTemplate,
		timeUntilExpire,
		restrictTo25Pages,
		paginatedMessageData = null
	}: PaginatedMessageOptions = {}) {
		if (pages) this.addPages(pages);

		this.addActions(actions ?? defaultActions);

		this.template = PaginatedMessage.resolveTemplate(template);

		this.footerTemplate = footerTemplate ?? '{{currentPage}}{{separatorBetweenCurrentAndTotalPages}}{{totalPages}}';
		this.paginatedMessageData = paginatedMessageData;
		this.timeUntilExpire = timeUntilExpire ?? 1000 * 60 * 14.5;
		this.restrictTo25Pages = restrictTo25Pages ?? true;
	}
}

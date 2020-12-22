export type PrettierSchema = OptionsDefinition & OverridesDefinition;

interface OptionsDefinition {
	/**
	 * The JSON schema key to adopt
	 */
	$schema?: 'http://json.schemastore.org/prettierrc';
	/**
	 * Include parentheses around a sole arrow function parameter.
	 */
	arrowParens?: 'always' | 'avoid';
	/**
	 * Print spaces between brackets.
	 */
	bracketSpacing?: boolean;
	/**
	 * Print (to stderr) where a cursor at the given position would move to after formatting. This option cannot be used with --range-start and --range-end.
	 */
	cursorOffset?: number;
	/**
	 * Control how Prettier formats quoted code embedded in the file.
	 */
	embeddedLanguageFormatting?: 'auto' | 'off';
	/**
	 * Which end of line characters to apply.
	 */
	endOfLine?: 'lf' | 'crlf' | 'cr' | 'auto';
	/**
	 * Specify the input filepath. This will be used to do parser inference.
	 */
	filepath?: string;
	/**
	 * How to handle whitespaces in HTML.
	 */
	htmlWhitespaceSensitivity?: 'css' | 'strict' | 'ignore';
	/**
	 * Insert @format pragma into file's first docblock comment.
	 */
	insertPragma?: boolean;
	/**
	 * Put > on the last line instead of at a new line.
	 */
	jsxBracketSameLine?: boolean;
	/**
	 * Use single quotes in JSX.
	 */
	jsxSingleQuote?: boolean;
	/**
	 * Which parser to use.
	 */
	parser?:
		| 'flow'
		| 'babel'
		| 'babel-flow'
		| 'babel-ts'
		| 'typescript'
		| 'css'
		| 'less'
		| 'scss'
		| 'json'
		| 'json5'
		| 'json-stringify'
		| 'graphql'
		| 'markdown'
		| 'mdx'
		| 'vue'
		| 'yaml'
		| 'html'
		| 'angular'
		| 'lwc';
	/**
	 * Custom directory that contains prettier plugins in node_modules subdirectory. Overrides default behavior when plugins are searched relatively to the location of Prettier. Multiple values are accepted.
	 */
	pluginSearchDirs?: string[];
	/**
	 * Add a plugin. Multiple plugins can be passed as separate `--plugin`s.
	 */
	plugins?: string[];
	/**
	 * The line length where Prettier will try wrap.
	 */
	printWidth?: number;
	/**
	 * How to wrap prose.
	 */
	proseWrap?: 'always' | 'never' | 'preserve';
	/**
	 * Change when properties in objects are quoted.
	 */
	quoteProps?: 'as-needed' | 'consistent' | 'preserve';
	/**
	 * Format code ending at a given character offset (exclusive). The range will extend forwards to the end of the selected statement. This option cannot be used with --cursor-offset.
	 */
	rangeEnd?: number;
	/**
	 * Format code starting at a given character offset. The range will extend backwards to the start of the first line containing the selected statement. This option cannot be used with --cursor-offset.
	 */
	rangeStart?: number;
	/**
	 * Require either '@prettier' or '@format' to be present in the file's first docblock comment in order for it to be formatted.
	 */
	requirePragma?: boolean;
	/**
	 * Print semicolons.
	 */
	semi?: boolean;
	/**
	 * Use single quotes instead of double quotes.
	 */
	singleQuote?: boolean;
	/**
	 * Number of spaces per indentation level.
	 */
	tabWidth?: number;
	/**
	 * Print trailing commas wherever possible when multi-line.
	 */
	trailingComma?: 'es5' | 'none' | 'all';
	/**
	 * Indent with tabs instead of spaces.
	 */
	useTabs?: boolean;
	/**
	 * Indent script and style tags in Vue files.
	 */
	vueIndentScriptAndStyle?: boolean;
}

interface OverridesDefinition {
	/**
	 * Provide a list of patterns to override prettier configuration.
	 */
	overrides?: {
		/**
		 * Include these files in this override.
		 */
		files: string | string[];
		/**
		 * Exclude these files from this override.
		 */
		excludeFiles?: string | string[];
		/**
		 * The options to apply for this override.
		 */
		options: OptionsDefinition;
	}[];
}

/**
 * Default ESLint configuration for Sapphire Projects
 * @example
 * ```json
 * {
 *   "extends": "@sapphire"
 * }
 * ```
 */
export const config = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		extraFileExtensions: ['.mjs'],
		project: './tsconfig.eslint.json',
		sourceType: 'module',
		ecmaVersion: 2020
	},
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
	env: {
		node: true,
		es6: true,
		es2017: true,
		es2020: true,
		jest: true,
		browser: true,
		commonjs: true
	},
	rules: {
		'for-direction': 'off',
		'getter-return': 'off',
		'no-await-in-loop': 'off',
		'no-compare-neg-zero': 'error',
		'no-cond-assign': 'warn',
		'no-console': 'off',
		'no-constant-condition': 'off',
		'no-control-regex': 'off',
		'no-debugger': 'error',
		'no-dupe-args': 'error',
		'no-dupe-keys': 'error',
		'no-duplicate-case': 'error',
		'no-empty': 'off',
		'no-empty-character-class': 'error',
		'no-ex-assign': 'off',
		'no-extra-boolean-cast': 'off',
		'no-extra-parens': 'off',
		'no-extra-semi': 'off',
		'no-func-assign': 'off',
		'no-inner-declarations': 'off',
		'no-invalid-regexp': 'warn',
		'no-irregular-whitespace': [
			'error',
			{
				skipStrings: true,
				skipComments: true,
				skipRegExps: true,
				skipTemplates: true
			}
		],
		'no-obj-calls': 'warn',
		'no-prototype-builtins': 'off',
		'no-regex-spaces': 'warn',
		'no-sparse-arrays': 'warn',
		'no-template-curly-in-string': 'error',
		'no-unexpected-multiline': 'error',
		'no-unreachable': 'warn',
		'no-unsafe-finally': 'warn',
		'no-unsafe-negation': 'error',
		'use-isnan': 'error',
		'valid-jsdoc': 'off',
		'valid-typeof': 'error',
		'accessor-pairs': 'off',
		'array-callback-return': 'error',
		'block-scoped-var': 'error',
		'class-methods-use-this': 'off',
		complexity: 'off',
		'consistent-return': 'off',
		curly: ['error', 'multi-line', 'consistent'],
		'default-case': 'off',
		'dot-location': ['error', 'property'],
		'dot-notation': 'off',
		eqeqeq: ['error', 'smart'],
		'guard-for-in': 'warn',
		'no-alert': 'error',
		'no-caller': 'error',
		'no-case-declarations': 'error',
		'no-div-regex': 'off',
		'no-else-return': 'warn',
		'no-empty-function': 'off',
		'no-empty-pattern': 'off',
		'no-eq-null': 'warn',
		'no-eval': 'warn',
		'no-extend-native': 'warn',
		'no-extra-bind': 'off',
		'no-extra-label': 'warn',
		'no-fallthrough': 'off',
		'no-floating-decimal': 'error',
		'no-global-assign': 'off',
		'no-implicit-coercion': 'error',
		'no-implicit-globals': 'off',
		'no-implied-eval': 'off',
		'no-invalid-this': 'off',
		'no-iterator': 'off',
		'no-labels': 'off',
		'no-lone-blocks': 'off',
		'no-loop-func': 'off',
		'no-magic-numbers': 'off',
		'no-multi-spaces': ['error', { ignoreEOLComments: true }],
		'no-multi-str': 'error',
		'no-new': 'off',
		'no-new-func': 'warn',
		'no-new-wrappers': 'warn',
		'no-octal': 'error',
		'no-octal-escape': 'error',
		'no-param-reassign': 'off',
		'no-proto': 'off',
		'no-redeclare': 'error',
		'no-restricted-properties': 'off',
		'no-return-assign': 'off',
		'no-return-await': 'warn',
		'no-script-url': 'off',
		'no-self-assign': 'error',
		'no-self-compare': 'warn',
		'no-sequences': 'error',
		'no-throw-literal': 'off',
		'no-unmodified-loop-condition': 'off',
		'no-unused-expressions': 'off',
		'no-unused-labels': 'error',
		'no-useless-call': 'off',
		'no-useless-concat': 'warn',
		'no-useless-escape': 'off',
		'no-useless-return': 'warn',
		'no-void': 'off',
		'no-warning-comments': 'off',
		'no-with': 'error',
		'prefer-promise-reject-errors': 'error',
		radix: 'error',
		'require-await': 'off',
		'vars-on-top': 'off',
		'wrap-iife': ['error', 'inside'],
		yoda: 'error',
		strict: ['error', 'never'],
		'init-declarations': 'off',
		'no-catch-shadow': 'error',
		'no-delete-var': 'error',
		'no-label-var': 'error',
		'no-restricted-globals': 'off',
		'no-shadow': 'off',
		'no-shadow-restricted-names': 'error',
		'no-undef': 'error',
		'no-undef-init': 'off',
		'no-undefined': 'off',
		'no-unused-vars': 'off',
		'no-use-before-define': 'off',
		'callback-return': 'off',
		'global-require': 'off',
		'handle-callback-err': 'off',
		'no-buffer-constructor': 'error',
		'no-mixed-requires': 'error',
		'no-new-require': 'error',
		'no-path-concat': 'warn',
		'no-process-env': 'off',
		'no-process-exit': 'off',
		'no-restricted-modules': 'off',
		'no-sync': 'off',
		'array-bracket-newline': ['error', 'consistent'],
		'array-bracket-spacing': [
			'error',
			'never',
			{
				singleValue: false,
				objectsInArrays: false,
				arraysInArrays: false
			}
		],
		'array-element-newline': 'off',
		'block-spacing': ['error', 'always'],
		'brace-style': ['error', '1tbs', { allowSingleLine: true }],
		'capitalized-comments': 'off',
		'comma-dangle': ['error', 'never'],
		'comma-spacing': 'off',
		'comma-style': ['error', 'last'],
		'computed-property-spacing': ['error', 'never'],
		'consistent-this': ['error', 'self'],
		'eol-last': ['error', 'always'],
		'func-call-spacing': ['error', 'never'],
		'func-name-matching': ['warn', 'always'],
		'func-names': ['warn', 'as-needed'],
		'func-style': 'off',
		'function-paren-newline': ['error', 'consistent'],
		'id-blacklist': 'off',
		'id-length': 'off',
		'id-match': 'off',
		indent: 'off',
		'jsx-quotes': ['error', 'prefer-double'],
		'key-spacing': [
			'error',
			{
				beforeColon: false,
				afterColon: true,
				mode: 'strict'
			}
		],
		'keyword-spacing': 'off',
		'line-comment-position': 'off',
		'linebreak-style': ['error', 'unix'],
		'lines-around-comment': 'off',
		'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
		'max-depth': 'off',
		'max-len': 'off',
		'max-lines': 'off',
		'max-nested-callbacks': 'off',
		'max-params': 'off',
		'max-statements': 'off',
		'max-statements-per-line': ['error', { max: 1 }],
		'multiline-comment-style': 'off',
		'multiline-ternary': ['error', 'always-multiline'],
		'new-cap': 'off',
		'new-parens': 'error',
		'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
		'no-array-constructor': 'off',
		'no-bitwise': 'off',
		'no-inline-comments': 'off',
		'no-lonely-if': 'error',
		'no-mixed-operators': 'error',
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		'no-multi-assign': 'warn',
		'no-multiple-empty-lines': 'error',
		'no-negated-condition': 'warn',
		'no-nested-ternary': 'off',
		'no-new-object': 'error',
		'no-plusplus': 'off',
		'no-restricted-syntax': 'off',
		'no-tabs': 'off',
		'no-ternary': 'off',
		'no-trailing-spaces': 'error',
		'no-underscore-dangle': 'off',
		'no-unneeded-ternary': 'off',
		'no-whitespace-before-property': 'error',
		'nonblock-statement-body-position': 'off',
		'object-curly-newline': ['error', { multiline: true, consistent: true }],
		'object-curly-spacing': ['error', 'always'],
		'object-property-newline': 'off',
		'one-var': ['error', 'never'],
		'one-var-declaration-per-line': 'off',
		'operator-assignment': ['error', 'always'],
		'operator-linebreak': [
			'error',
			'before',
			{
				overrides: {
					'+': 'after',
					'-': 'after'
				}
			}
		],
		'padded-blocks': ['error', { classes: 'always' }],
		'padding-line-between-statements': 'off',
		'quote-props': [
			'error',
			'consistent-as-needed',
			{
				keywords: true,
				unnecessary: true,
				numbers: false
			}
		],
		quotes: [
			'error',
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true
			}
		],
		'require-jsdoc': 'off',
		semi: 'off',
		'semi-spacing': [
			'error',
			{
				before: false,
				after: true
			}
		],
		'semi-style': ['error', 'last'],
		'sort-keys': 'off',
		'sort-vars': 'off',
		'space-before-blocks': ['error', 'always'],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always'
			}
		],
		'space-in-parens': ['error', 'never'],
		'space-infix-ops': ['error', { int32Hint: true }],
		'space-unary-ops': [
			'error',
			{
				words: true,
				nonwords: false
			}
		],
		'spaced-comment': ['error', 'always'],
		'switch-colon-spacing': [
			'error',
			{
				after: true,
				before: false
			}
		],
		'template-tag-spacing': ['error', 'never'],
		'unicode-bom': ['error', 'never'],
		'wrap-regex': 'off',
		'arrow-body-style': ['error', 'as-needed'],
		'arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
		'arrow-spacing': [
			'error',
			{
				before: true,
				after: true
			}
		],
		'constructor-super': 'error',
		'generator-star-spacing': ['error', 'before'],
		'no-class-assign': 'warn',
		'no-confusing-arrow': 'off',
		'no-const-assign': 'error',
		'no-dupe-class-members': 'off',
		'no-duplicate-imports': ['error', { includeExports: false }],
		'no-new-symbol': 'warn',
		'no-restricted-imports': 'off',
		'no-this-before-super': 'error',
		'no-useless-computed-key': 'error',
		'no-useless-constructor': 'off',
		'no-useless-rename': 'error',
		'no-var': 'error',
		'object-shorthand': ['error', 'always'],
		'prefer-arrow-callback': 'error',
		'prefer-const': ['error', { destructuring: 'all' }],
		'prefer-destructuring': [
			'error',
			{
				VariableDeclarator: {
					array: false,
					object: true
				},
				AssignmentExpression: {
					array: true,
					object: false
				}
			}
		],
		'prefer-numeric-literals': 'off',
		'prefer-rest-params': 'warn',
		'prefer-spread': 'error',
		'prefer-template': 'warn',
		'require-yield': 'warn',
		'rest-spread-spacing': ['error', 'never'],
		'sort-imports': 'off',
		'symbol-description': 'warn',
		'template-curly-spacing': ['error', 'never'],
		'yield-star-spacing': ['error', 'before'],
		'@typescript-eslint/no-invalid-void-type': 'error',
		'@typescript-eslint/dot-notation': [
			'error',
			{
				allowKeywords: true,
				allowPattern: '(^[A-Z])|(^[a-z]+(_[a-z]+)+$)',
				allowPrivateClassPropertyAccess: true
			}
		],
		'@typescript-eslint/keyword-spacing': ['error', { before: true, after: true }],
		'@typescript-eslint/init-declarations': 'error',
		'@typescript-eslint/prefer-reduce-type-parameter': 'error',
		'@typescript-eslint/class-literal-property-style': 'error',
		'@typescript-eslint/no-base-to-string': 'error',
		'@typescript-eslint/switch-exhaustiveness-check': 'warn',
		'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
		'@typescript-eslint/no-dupe-class-members': 'error',
		'@typescript-eslint/prefer-as-const': 'error',
		'@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
		'@typescript-eslint/no-extra-non-null-assertion': 'error',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'default',
				format: ['camelCase'],
				leadingUnderscore: 'forbid',
				trailingUnderscore: 'forbid',
				// Ignore the 2 parameters that cannot be camelcased in this selfsame file
				filter: { regex: '^(?:VariableDeclarator|AssignmentExpression)$', match: false }
			},
			{
				selector: 'parameter',
				format: ['camelCase'],
				leadingUnderscore: 'allow'
			},
			{
				selector: 'property',
				modifiers: ['readonly'],
				format: ['camelCase']
			},
			{ selector: 'enumMember', format: ['PascalCase'] },
			{ selector: 'typeLike', format: ['PascalCase'] }
		],
		'@typescript-eslint/default-param-last': 'error',
		'@typescript-eslint/no-extra-semi': 'error',
		'@typescript-eslint/no-throw-literal': 'error',
		'@typescript-eslint/no-implied-eval': 'error',
		'@typescript-eslint/no-invalid-this': 'error',
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/await-thenable': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'error',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/member-ordering': [
			'error',
			{
				default: [
					'signature',
					'public-instance-field',
					'protected-instance-field',
					'private-instance-field',
					'instance-field',
					'public-constructor',
					'protected-constructor',
					'private-constructor',
					'constructor',
					'public-instance-method',
					'protected-instance-method',
					'private-instance-method',
					'instance-method',
					'public-static-field',
					'protected-static-field',
					'private-static-field',
					'static-field',
					'public-static-method',
					'protected-static-method',
					'private-static-method',
					'static-method'
				]
			}
		],
		'@typescript-eslint/require-await': 'error',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/unbound-method': 'error',
		'@typescript-eslint/prefer-includes': 'error',
		'@typescript-eslint/prefer-string-starts-ends-with': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/no-unnecessary-qualifier': 'error',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-extraneous-class': 'error',
		'@typescript-eslint/no-for-in-array': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-useless-constructor': 'error',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/consistent-type-definitions': 'error',
		'@typescript-eslint/promise-function-async': 'off',
		'@typescript-eslint/restrict-plus-operands': 'error',
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/unified-signatures': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-use-before-define': ['error', { typedefs: false, functions: false }],
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: { delimiter: 'semi', requireLast: true },
				singleline: { delimiter: 'semi', requireLast: false }
			}
		],
		'@typescript-eslint/no-extra-parens': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/semi': 'error',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{
				'ts-expect-error': 'allow-with-description',
				'ts-ignore': 'allow-with-description',
				'ts-nocheck': true,
				'ts-check': true,
				minimumDescriptionLength: 3
			}
		]
	}
};

module.exports = config;
export default config;

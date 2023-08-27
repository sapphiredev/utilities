# Migration guide for @sapphire/ts-config v4.x to v5.x

Between major version 4 and 5 of `@sapphire/ts-config`, the package has been rewritten to fully leverage that TypeScript's `extends` feature now supports an array of config files.

The following configs have been removed:

-   `@sapphire/ts-config/extra-strict-without-decorators`
-   `@sapphire/ts-config/without-decorators`

The following changes have been applied to the base config:

-   `experimentalDecorators` is now `false` by default
-   `emitDecoratorMetadata` is now `false` by default
-   `verbatimModuleSyntax` is now `false` by default. It gets set to true by `@sapphire/ts-config/verbatim`.
    -   Note that you should not enable `@sapphire/ts-config/verbatim` without also setting `"type"` in `package.json`
        to either `"commonjs"` or `"module"`

The following configs have been added:

-   `@sapphire/ts-config/extra-strict`
-   `@sapphire/ts-config/decorators`
-   `@sapphire/ts-config/base` -> This is identical to `@sapphire/ts-config`
-   `@sapphire/ts-config/verbatim`
-   `@sapphire/ts-config/bundler`

In order to achieve the following old configs you now need to use:

| Old config                                              | New config                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `"@sapphire/ts-config"`                                 | `["@sapphire/ts-config", "@sapphire/ts-config/decorators", "@sapphire/ts-config/verbatim"]`                                     |
| `"@sapphire/ts-config/extra-strict"`                    | `["@sapphire/ts-config", "@sapphire/ts-config/extra-strict", "@sapphire/ts-config/decorators", "@sapphire/ts-config/verbatim"]` |
| `"@sapphire/ts-config/extra-strict-without-decorators"` | `["@sapphire/ts-config", "@sapphire/ts-config/extra-strict", "@sapphire/ts-config/verbatim"]`                                   |
| `"@sapphire/ts-config/without-decorators"`              | `["@sapphire/ts-config", "@sapphire/ts-config/verbatim"]`                                                                       |

An example of a CJS project with extra-strict and no decorators would therefore be:

```json
{
	"extends": ["@sapphire/ts-config", "@sapphire/ts-config/extra-strict", "@sapphire/ts-config/verbatim"]
}
```

and in your package.json make sure you add:

```json
{
	"type": "commonjs"
}
```

And similarly an example of an ESM project with extra-strict and no decorators would therefore be:

```json
{
	"extends": ["@sapphire/ts-config", "@sapphire/ts-config/extra-strict", "@sapphire/ts-config/verbatim"]
}
```

and in your package.json make sure you add:

```json
{
	"type": "module"
}
```

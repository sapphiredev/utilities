# Migration guide for @sapphire/ts-config v4.x to v5.x

Between major version 4 and 5 of `@sapphire/ts-config`, the package has been rewritten to fully leverage that TypeScript's `extends` feature now supports an array of config files.

The following configs have been removed:

-   `@sapphire/ts-config/extra-strict-without-decorators`
-   `@sapphire/ts-config/without-decorators`

The following changes have been applied to the base config:

-   `experimentalDecorators` is now `false` by default
-   `emitDecoratorMetadata` is now `false` by default
-   `verbatimModuleSyntax` is now `false` by default. It gets set to true alongside `@sapphire/ts-config/esm`, this is because `verbatimModuleSyntax` doesn't work well together with CJS projects.

The following configs have been added:

-   `@sapphire/ts-config/extra-strict`
-   `@sapphire/ts-config/decorators`
-   `@sapphire/ts-config/base` -> This is identical to `@sapphire/ts-config`
-   `@sapphire/ts-config/cjs`
-   `@sapphire/ts-config/esm`

In order to achieve the following old configs you now need to use:

| Old config                                              | New config                                                                                      |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `"@sapphire/ts-config"`                                 | `["@sapphire/ts-config", "@sapphire/ts-config/decorators"]`                                     |
| `"@sapphire/ts-config/extra-strict"`                    | `["@sapphire/ts-config", "@sapphire/ts-config/extra-strict", "@sapphire/ts-config/decorators"]` |
| `"@sapphire/ts-config/extra-strict-without-decorators"` | `["@sapphire/ts-config", "@sapphire/ts-config/extra-strict"]`                                   |
| `"@sapphire/ts-config/without-decorators"`              | `["@sapphire/ts-config"]`                                                                       |

Then you also have to choose either the CJS or ESM config with `@sapphire/ts-config/cjs` or `@sapphire/ts-config/esm` respectively.

An example of a CJS project with extra-strict and no decorators would therefore be:

```json
{
	"extends": ["@sapphire/ts-config", "@sapphire/ts-config/cjs", "@sapphire/ts-config/extra-strict"]
}
```

<div style="text-align:center;"><h1>@sapphire/eslint-config</h1>
<h3>Shareable ESLint configuration for all Sapphire Projects repositories</h3></div>

[![GitHub](https://img.shields.io/github/license/sapphire-project/utilities)](https://github.com/sapphire-project/utilities/blob/main/LICENSE.md)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/sapphire-project/utilities.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sapphire-project/utilities/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/sapphire-project/utilities.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sapphire-project/utilities/context:javascript)
[![Coverage Status](https://coveralls.io/repos/github/sapphire-project/utilities/badge.svg?branch=main)](https://coveralls.io/github/sapphire-project/utilities?branch=main)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/eslint-config?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/eslint-config)
[![npm](https://img.shields.io/npm/v/@sapphire/eslint-config?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/eslint-config)
[![Depfu](https://badges.depfu.com/badges/utilities/count.svg)](https://depfu.com/github/sapphire-project/utilities?project_id=utilities)

## Installation

**First install the Peer Dependencies**
```sh
yarn add -D typescript
```

**Then install `@sapphire/eslint-config`**
```sh
yarn add -D @sapphire/eslint-config
```

---

## Usage

Add the ESLint config to your `package.json`:

```json
{
	"name": "my-project",
	"eslintConfig": {
		"extends": "@sapphire"
	}
}
```

Or to `eslintrc.js` / `eslintrc.json`:

```json
{
	"extends": "@sapphire"
}
```

Create `tsconfig.eslint.json` next to the eslint config file, for example with content:

```json
{
	"extends": "./tsconfig.json",
	"include": ["src", "test"]
}
```

## API Documentation

For the full API documentation please refer to [the TypeDoc generated documentation](https://sapphire-project.github.io/utilities)

## Buy us some doughnuts

Sapphire Project is open source and always will be, even if we don't get donations. That said, we know there are amazing people who
may still want to donate just to show their appreciation. Thanks you very much in advance!

We accept donations through Open Collective, Ko-fi, Paypal, Patreon and GitHub Sponsorships. You can use the buttoms below to donate through your method of choice.

|   Donate With   |                                             Address                                              |
| :-------------: | :----------------------------------------------------------------------------------------------: |
| Open Collective |                    [Click Here](https://opencollective.com/sapphire-project)                     |
|      Ko-fi      |                         [Click Here](https://ko-fi.com/sapphireproject)                          |
|     Patreon     |                      [Click Here](https://www.patreon.com/sapphire_project)                      |
|     PayPal      | [Click Here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SP738BQTQQYZY) |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://favware.tech/"><img src="https://avatars3.githubusercontent.com/u/4019718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeroen Claassens</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=Favna" title="Code">💻</a> <a href="#infra-Favna" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#projectManagement-Favna" title="Project Management">📆</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

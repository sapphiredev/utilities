<div align="center">

![Sapphire Logo](https://cdn.skyra.pw/gh-assets/sapphire.png)

# @sapphire/event-iterator

**Turns event emitter events into async iterators.**

[![GitHub](https://img.shields.io/github/license/sapphire-community/utilities)](https://github.com/sapphire-community/utilities/blob/main/LICENSE.md)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/sapphire-community/utilities.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sapphire-community/utilities/alerts/)
[![Language grade: JavaScript/TypeScript](https://img.shields.io/lgtm/grade/javascript/g/sapphire-community/utilities.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sapphire-community/utilities/context:javascript)
[![Coverage Status](https://coveralls.io/repos/github/sapphire-community/utilities/badge.svg?branch=main)](https://coveralls.io/github/sapphire-community/utilities?branch=main)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/event-iterator?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/event-iterator)
[![npm](https://img.shields.io/npm/v/@sapphire/event-iterator?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/event-iterator)
[![Depfu](https://badges.depfu.com/badges/ec42ff3d6bae55eee1de4749960852b3/count.svg)](https://depfu.com/github/sapphire-community/utilities?project_id=15195)

</div>

**Table of Contents**

-   [Description](#description)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Basic Usage](#basic-usage)
-   [API Documentation](#api-documentation)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-%E2%9C%A8)

## Description

There is often a need to have async iterators with fine control, timeouts, limits, filter, and so on, this package exists to satisfy those needs. By implementing an [async iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) which can be used with [`for await...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loops.

## Features

-   Written in TypeScript
-   Bundled with Rollup so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

```sh
yarn add @sapphire/event-iterator
# npm install @sapphire/event-iterator
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { EventIterator } = require('@sapphire/event-iterator')` equals `import { EventIterator } from '@sapphire/event-iterator'`.

### Basic Usage

```ts
// Import the EventIterator class
const { EventIterator } = require('@sapphire/event-iterator');

// Define an event iterator with a limit of 2 entries
const iterator = new EventIterator(emitter, 'message', { limit: 2 });

emitter.emit('message', { id: 'foo' });
emitter.emit('message', { id: 'bar' });
emitter.emit('message', { id: 'baz' });

for await (const message of iterator) {
	console.log(message);
	// Logs: { id: 'foo' }
	// Logs: { id: 'bar' }
}

// The iterator ended at second item, { id: 'baz' } is not collected due to the specified limit.
```

---

## API Documentation

For the full API documentation please refer to the TypeDoc generated [documentation](https://sapphire-community.github.io/utilities/modules/_sapphire_event_iterator.html).

## Buy us some doughnuts

Sapphire Community is and always will be open source, even if we don't get donations. That being said, we know there are amazing people who may still want to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Open Collective, Ko-fi, PayPal, Patreon and GitHub Sponsorships. You can use the buttons below to donate through your method of choice.

|   Donate With   |                       Address                       |
| :-------------: | :-------------------------------------------------: |
| Open Collective | [Click Here](https://sapphirejs.com/opencollective) |
|      Ko-fi      |      [Click Here](https://sapphirejs.com/kofi)      |
|     Patreon     |    [Click Here](https://sapphirejs.com/patreon)     |
|     PayPal      |     [Click Here](https://sapphirejs.com/paypal)     |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://favware.tech/"><img src="https://avatars3.githubusercontent.com/u/4019718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeroen Claassens</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=Favna" title="Code">💻</a> <a href="#infra-Favna" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#projectManagement-Favna" title="Project Management">📆</a> <a href="https://github.com/sapphire-community/utilities/commits?author=Favna" title="Documentation">📖</a> <a href="https://github.com/sapphire-community/utilities/commits?author=Favna" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kyranet"><img src="https://avatars0.githubusercontent.com/u/24852502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Antonio Román</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=kyranet" title="Code">💻</a> <a href="#projectManagement-kyranet" title="Project Management">📆</a> <a href="https://github.com/sapphire-community/utilities/pulls?q=is%3Apr+reviewed-by%3Akyranet" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/sapphire-community/utilities/commits?author=kyranet" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/PyroTechniac"><img src="https://avatars2.githubusercontent.com/u/39341355?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gryffon Bellish</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=PyroTechniac" title="Code">💻</a> <a href="https://github.com/sapphire-community/utilities/pulls?q=is%3Apr+reviewed-by%3APyroTechniac" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/sapphire-community/utilities/commits?author=PyroTechniac" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/vladfrangu"><img src="https://avatars3.githubusercontent.com/u/17960496?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vlad Frangu</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=vladfrangu" title="Code">💻</a> <a href="https://github.com/sapphire-community/utilities/issues?q=author%3Avladfrangu" title="Bug reports">🐛</a> <a href="https://github.com/sapphire-community/utilities/pulls?q=is%3Apr+reviewed-by%3Avladfrangu" title="Reviewed Pull Requests">👀</a> <a href="#userTesting-vladfrangu" title="User Testing">📓</a> <a href="https://github.com/sapphire-community/utilities/commits?author=vladfrangu" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Soumil07"><img src="https://avatars0.githubusercontent.com/u/29275227?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Soumil07</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=Soumil07" title="Code">💻</a> <a href="#projectManagement-Soumil07" title="Project Management">📆</a> <a href="https://github.com/sapphire-community/utilities/commits?author=Soumil07" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/apps/depfu"><img src="https://avatars3.githubusercontent.com/in/715?v=4?s=100" width="100px;" alt=""/><br /><sub><b>depfu[bot]</b></sub></a><br /><a href="#maintenance-depfu[bot]" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/apps/allcontributors"><img src="https://avatars0.githubusercontent.com/in/23186?v=4?s=100" width="100px;" alt=""/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=allcontributors[bot]" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Nytelife26"><img src="https://avatars1.githubusercontent.com/u/22531310?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tyler J Russell</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=Nytelife26" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Alcremie"><img src="https://avatars0.githubusercontent.com/u/54785334?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ivan Lieder</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=Alcremie" title="Code">💻</a> <a href="https://github.com/sapphire-community/utilities/issues?q=author%3AAlcremie" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/RealShadowNova"><img src="https://avatars3.githubusercontent.com/u/46537907?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hezekiah Hendry</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=RealShadowNova" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Stitch07"><img src="https://avatars.githubusercontent.com/u/29275227?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stitch07</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=Stitch07" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Vetlix"><img src="https://avatars.githubusercontent.com/u/31412314?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vetlix</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=Vetlix" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ethamitc"><img src="https://avatars.githubusercontent.com/u/27776796?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ethan Mitchell</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=ethamitc" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/noftaly"><img src="https://avatars.githubusercontent.com/u/34779161?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Elliot</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=noftaly" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://jurien.dev"><img src="https://avatars.githubusercontent.com/u/5418114?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jurien Hamaker</b></sub></a><br /><a href="https://github.com/sapphire-community/utilities/commits?author=jurienhamaker" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

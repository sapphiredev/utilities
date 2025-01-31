# Changelog

All notable changes to this project will be documented in this file.

# [@sapphire/string-store@2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@1.2.0...@sapphire/string-store@2.0.0) - (2025-01-31)

## 🏠 Refactor

- Add `DuplexBuffer` interface ([548200f](https://github.com/sapphiredev/utilities/commit/548200f1af067ae2f017c27a3c5d056ec6dd7ff8)) ([#865](https://github.com/sapphiredev/utilities/pull/865) by @kyranet)
- **SchemaStore:** Introduce `serializeRaw` ([5141559](https://github.com/sapphiredev/utilities/commit/51415597fa4b8ed0e17ba71743e73f3963a6803b)) ([#862](https://github.com/sapphiredev/utilities/pull/862) by @kyranet)
  - 💥 **BREAKING CHANGE:** `serialize` no longer returns an `UnalignedUint16Array`, if you desire the old behaviour, use `serializeRaw`

## 🚀 Features

- **Schema:** Add serialization helpers ([8a922c4](https://github.com/sapphiredev/utilities/commit/8a922c421576707dcd1e74379544f20a8c43d785)) ([#864](https://github.com/sapphiredev/utilities/pull/864) by @kyranet)
  - 💥 **BREAKING CHANGE:** `serialize` has been renamed to `serializeInto`

# [@sapphire/string-store@1.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@1.1.0...@sapphire/string-store@1.2.0) - (2024-12-18)

## 🏠 Refactor

- Improve types for `t.constant` and `t.nullable` ([80c79c3](https://github.com/sapphiredev/utilities/commit/80c79c3faf6520acc1c4c8a67797d2a2c64e0e1d)) ([#849](https://github.com/sapphiredev/utilities/pull/849) by @kyranet)

## 📝 Documentation

- Add `nullable` to the README ([86690e3](https://github.com/sapphiredev/utilities/commit/86690e35df6020c6b2eaaa5adf1194a075e07160)) ([#847](https://github.com/sapphiredev/utilities/pull/847) by @kyranet)

## 🚀 Features

- Added `constant` type ([4414462](https://github.com/sapphiredev/utilities/commit/4414462a0147de444122df2ebe0f6ed20d2164ac)) ([#848](https://github.com/sapphiredev/utilities/pull/848) by @kyranet)
- Added `nullable` type ([3b1a353](https://github.com/sapphiredev/utilities/commit/3b1a353cb9ae6ffc3a0baf50cc27e2be26553a9b)) ([#846](https://github.com/sapphiredev/utilities/pull/846) by @kyranet)

# [@sapphire/string-store@1.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@1.0.1...@sapphire/string-store@1.1.0) - (2024-12-01)

## 📝 Documentation

- Added remark on compile-time value types ([0c59968](https://github.com/sapphiredev/utilities/commit/0c59968d077155686106bdf62e94a317121f16cb)) ([#839](https://github.com/sapphiredev/utilities/pull/839) by @kyranet)

## 🚀 Features

- **SchemaStore:** Add `getIdentifier` method ([5127445](https://github.com/sapphiredev/utilities/commit/5127445079b13092968c0ab37924136e7819af28)) ([#838](https://github.com/sapphiredev/utilities/pull/838) by @kyranet)

# [@sapphire/string-store@1.0.0](https://github.com/sapphiredev/utilities/tree/@sapphire/string-store@1.0.0) - (2024-11-02)

## 🏃 Performance

- Implement fast word writing ([f63a9a1](https://github.com/sapphiredev/utilities/commit/f63a9a1165209c8367202d98233cea1837f01f1d)) ([#787](https://github.com/sapphiredev/utilities/pull/787) by @kyranet)

## 🐛 Bug Fixes

- Move browser imports ([100ffb0](https://github.com/sapphiredev/utilities/commit/100ffb0a2471bb9f74cc580d282d11059e1a0a68)) ([#826](https://github.com/sapphiredev/utilities/pull/826) by @kyranet)

## 📝 Documentation

- Grammar and use `t.type` ([6f32cac](https://github.com/sapphiredev/utilities/commit/6f32caca7ba5e1a9578e672c9e939f3855cf69e6)) ([#781](https://github.com/sapphiredev/utilities/pull/781) by @kyranet)

## 🚀 Features

- Add buffer utilities ([2e9590b](https://github.com/sapphiredev/utilities/commit/2e9590be59d57310b276365b372ba2602f3d665d)) ([#779](https://github.com/sapphiredev/utilities/pull/779) by @kyranet)
- Add signed ints ([68ee882](https://github.com/sapphiredev/utilities/commit/68ee882a8b13efcfb8d5bd01fabc23600f711e46)) ([#778](https://github.com/sapphiredev/utilities/pull/778) by @kyranet)
- Added string-store ([4c3de5e](https://github.com/sapphiredev/utilities/commit/4c3de5ebb8ced1a6b6d65fdee29caf731651a0fe)) ([#118](https://github.com/sapphiredev/utilities/pull/118) by @kyranet)


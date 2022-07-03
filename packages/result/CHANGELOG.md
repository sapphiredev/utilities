# Changelog

All notable changes to this project will be documented in this file.

# [@sapphire/result@2.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/result@2.0.0...@sapphire/result@2.0.1) - (2022-07-03)

## 🏠 Refactor

- **result:** Fixed types (#391) ([a1934e1](https://github.com/sapphiredev/utilities/commit/a1934e10cc7d81c71354deb153a4f3bb83e50e65))

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies ([84af0db](https://github.com/sapphiredev/utilities/commit/84af0db2db749223b036aa99fe19a2e9af5681c6))

# [@sapphire/result@2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/result@1.1.1...@sapphire/result@2.0.0) - (2022-06-26)

## 🏠 Refactor

- Rewrite @sapphire/result from scratch (#364) ([d5b57ff](https://github.com/sapphiredev/utilities/commit/d5b57ff52402bfd261372bf4486e46f39bb41b6d))

   ### 💥 Breaking Changes:
   - Removed `Maybe` type, the substitute is `Option`
   - Removed `maybe` function, the substitute is `Option.from`
   - Removed `some` function, the substitute is `Option.some`
   - Removed `none` function, the substitute is `Option.none`
   - Removed `isSome` function, the substitute is `option.isSome`
   - Removed `isNone` function, the substitute is `option.isNone`
   - Removed `isMaybe` function, the substitute is `Option.is`
   - Removed `UnwrapMaybeValue` type, the substitute is `Option.UnwrapSome`
   - Removed `None` type, the substitute is `Option.None`
   - Removed `Some` type, the substitute is `Option.Some`
   - Removed `Err` type, the substitute is `Result.Err`
   - Removed `Ok` type, the substitute is `Result.Ok`
   - Removed `from` function, the substitute is `Result.from`
   - Removed `fromAsync` function, the substitute is `Result.fromAsync`


## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies ([50cd8de](https://github.com/sapphiredev/utilities/commit/50cd8dea593b6f5ae75571209456b3421e2ca59a))

## 📝 Documentation

- Add @MajesticString as a contributor ([295b3e9](https://github.com/sapphiredev/utilities/commit/295b3e9849a4b0fe64074bae02f6426378a303c3))
- Add @Mzato0001 as a contributor ([c790ef2](https://github.com/sapphiredev/utilities/commit/c790ef25df2d7e22888fa9f8169167aa555e9e19))
- Add @NotKaskus as a contributor ([00da8f1](https://github.com/sapphiredev/utilities/commit/00da8f199137b9277119823f322d1f2d168d928a))
- Add @imranbarbhuiya as a contributor ([fb674c2](https://github.com/sapphiredev/utilities/commit/fb674c2c5594d41e71662263553dcb4bac9e37f4))
- Add @axisiscool as a contributor ([ce1aa31](https://github.com/sapphiredev/utilities/commit/ce1aa316871a88d3663efbdf2a42d3d8dfe6a27f))
- Add @dhruv-kaushikk as a contributor ([ebbf43f](https://github.com/sapphiredev/utilities/commit/ebbf43f63617daba96e72c50a234bf8b64f6ddc4))
- Add @Commandtechno as a contributor ([f1d69fa](https://github.com/sapphiredev/utilities/commit/f1d69fabe1ee0abe4be08b19e63dbec03102f7ce))
- Fix typedoc causing OOM crashes ([63ba41c](https://github.com/sapphiredev/utilities/commit/63ba41c4b6678554b1c7043a22d3296db4f59360))

## 🧪 Testing

- Migrate to vitest (#380) ([075ec73](https://github.com/sapphiredev/utilities/commit/075ec73c7a8e3374fad3ada612d37eb4ac36ec8d))

## [1.1.1](https://github.com/sapphiredev/utilities/compare/@sapphire/result@1.1.0...@sapphire/result@1.1.1) (2022-04-01)

**Note:** Version bump only for package @sapphire/result

# [1.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/result@1.0.0...@sapphire/result@1.1.0) (2022-03-06)

### Features

-   allow module: NodeNext ([#306](https://github.com/sapphiredev/utilities/issues/306)) ([9dc6dd6](https://github.com/sapphiredev/utilities/commit/9dc6dd619efab879bb2b0b3c9e64304e10a67ed6))

# 1.0.0 (2022-02-06)

### Features

-   **package:** add @sapphire/result package ([#274](https://github.com/sapphiredev/utilities/issues/274)) ([8a86826](https://github.com/sapphiredev/utilities/commit/8a8682607c2aa4c845e814816fa2b4478c23aa84))

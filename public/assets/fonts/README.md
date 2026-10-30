# Locally hosted Fontsource fonts

These unmodified WOFF2 files replace the Fontsource CDN requests made during
Astro startup/build. Only the previously selected normal-style latin and
cyrillic subsets are included. Font selection and system fallbacks are unchanged.
Zen Maru Gothic has no 600 weight; browsers select the nearest available weight.

Sources (downloaded from the official npm registry, package SHA-512 verified):

- `@fontsource/zen-maru-gothic@5.3.1`: https://registry.npmjs.org/@fontsource/zen-maru-gothic/-/zen-maru-gothic-5.3.1.tgz
- `@fontsource/inter@5.3.0`: https://registry.npmjs.org/@fontsource/inter/-/inter-5.3.0.tgz
- `@fontsource/jetbrains-mono@5.3.0`: https://registry.npmjs.org/@fontsource/jetbrains-mono/-/jetbrains-mono-5.3.0.tgz

Each family directory contains its original SIL Open Font License and copyright
notice in LICENSE. Unicode ranges in src/config/fontConfig.ts are copied from
the corresponding Fontsource CSS. No npm dependency installation is required.

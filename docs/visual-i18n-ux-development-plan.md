# Visual, i18n, and UX Development Plan

## Goal

Upgrade ICON HERO from a functional converter into a more globally adaptive, layered workbench experience:

- Detect the user's browser/system language before falling back to Traditional Chinese.
- Add five high-value languages beyond the existing `zh-TW` and `en`.
- Improve mascot animation with fade, movement, glow, and shadow states.
- Improve layout hierarchy and operational UX using the Spatial Workbench visual philosophy.
- Make the logo background visually consistent with the site background.

## Language Decision

Current languages: `zh-TW`, `en`.

Recommended new languages:

- `zh-CN` Simplified Chinese: covers a large Chinese-language audience and browser locale family.
- `ja` Japanese: high web-content share and strong icon/design-tool audience fit.
- `es` Spanish: consistently among the top web content languages.
- `fr` French: consistently top-tier web content language.
- `ko` Korean: regional UX fit for East Asian design/tool users and common browser locale.

Rationale:

- W3Techs April 2026 lists English, Spanish, German, Japanese, French, Portuguese, Russian, and Arabic among the leading website content languages.
- ICON HERO already covers English and Traditional Chinese. For this product, Simplified Chinese and Korean are prioritized over German/Portuguese/Russian because the current interface is Chinese-first and design-tool adoption in East Asia is a closer audience fit.
- `navigator.languages` should be used first, with base-language matching (`zh-HK`/`zh-MO` -> `zh-TW`, `zh-SG`/`zh-CN` -> `zh-CN`, `ja-JP` -> `ja`) and saved user selection overriding detection.

References:

- https://w3techs.com/technologies/overview/content_language
- https://www.visualcapitalist.com/ranked-the-most-common-website-languages-on-the-internet/

## Implementation Batches

### Batch 1: i18n Detection and Locale Expansion

- Add `src/i18n/languages.ts` as the single language inventory.
- Add a pure resolver contract: `resolvePreferredLanguage({ saved, navigatorLanguages, navigatorLanguage })`.
- Update `src/i18n/index.ts` to resolve saved language first, then browser languages, then fallback.
- Update `LanguageSwitcher` to render from the shared language inventory.
- Add full locale files for `zh-CN`, `ja`, `es`, `fr`, and `ko`.
- Add focused tests for invalid saved values, unavailable storage, empty browser languages, `navigator.language` fallback, and Chinese variants including `zh-Hant`, `zh-Hans`, `zh-HK`, `zh-MO`, `zh-SG`, bare `zh`, and `zh-CN`.
- Add locale completeness tests so new languages cannot silently miss keys from the Traditional Chinese source locale.

Done when:

- Fresh browser loads a suitable language from `navigator.languages`.
- Manual selection still persists.
- Existing `zh-TW` and `en` remain unchanged.

### Batch 2: Mascot Animation System

- Refactor `MascotDisplay` into explicit animation profiles by state and variant.
- Add coordinated fade in/out, subtle movement, breathing glow, and grounded shadow.
- Keep motion restrained and functional, avoiding excessive decoration.
- Respect `prefers-reduced-motion`: use static opacity/transform states, avoid continuous blur/filter animation, and keep all decorative layers `pointer-events-none`.
- Keep mascot containers bounded so movement cannot overlap upload, URL, queue, or completed-item actions.

Done when:

- Idle, analyzing, processing, success, and error states have distinct but coherent motion.
- No mascot asset overlaps primary controls on desktop or mobile.

### Batch 3: Spatial Workbench Layout

- Apply layered page structure: command band, primary workspace, process rail, optional resources.
- Improve spacing, hierarchy, and scanability without turning the app into a landing page.
- Preserve current core workflow and dark/light theme behavior.
- Keep cards only for repeated queue/resource items.
- Hard acceptance criteria: upload button, URL action, and primary drop zone remain visible in the first viewport on desktop and mobile.
- Keep the process rail compact and secondary; resources remain lazy-loaded below the workflow; queue actions remain closer to converted items than to mascot or explanatory text.

Done when:

- First viewport still starts with the actual tool.
- Primary actions, drop zone, and workflow rail read as one coherent workbench.

### Batch 4: Logo Background and Polish

- Adjust the logo image treatment so its visible background matches the site surface.
- Inspect whether the source logo contains baked background. Prefer a transparent asset when available.
- If transparency is not practical in this batch, use an intentional logo plate/stage matched to theme tokens; masking/blending is optional polish, not the baseline.
- Verify logo on light and dark themes.

Done when:

- The logo no longer appears as a mismatched square/patch against the header background.

## Review Gate

External reviewer should check:

- Whether the language list is justified and not over-expanded.
- Whether detection can override user preference by mistake.
- Whether layout changes preserve the tool-first UX.
- Whether animation improvements risk performance, accessibility, or visual clutter.

## Verification

- `npm test`
- `npx tsc -b --noEmit`
- `npm run lint`
- `npm run build`
- `npm audit`
- Playwright desktop/mobile screenshots and console checks.

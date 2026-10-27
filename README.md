# PhotoVibe legal pages

Static privacy policy, terms of service and account-deletion page for the
PhotoVibe Android app (`ai.photovibe.app`), served by GitHub Pages.

- Source of truth: `src/*.md`
- Build: `node build.js` (no dependencies) → `privacy/`, `terms/`, `delete-account/`, `index.html`
- `PRIVACY.md` / `TERMS.md` in the app repo are copies of `src/privacy.md` / `src/terms.md`; update here first, then copy over.

Custom domain: add a `CNAME` file containing `photovibe.ai` once the domain is registered and its DNS points at GitHub Pages.

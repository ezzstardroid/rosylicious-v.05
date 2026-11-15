# Rosylicious v2.0

## Files
- `index.html` — complete phone-style app, screens, applications and mini-games.
- `manifest.json` — PWA metadata.
- `service-worker.js` — offline app-shell cache.

## Publish on GitHub Pages
1. Upload these files to the repository root.
2. Keep the existing `icon-192.png` and `icon-512.png` files in the root.
3. In GitHub, open Settings → Pages.
4. Select Deploy from a branch → `main` → `/ (root)` → Save.
5. Open the published Pages URL.

## Important cleanup
Delete the duplicate `manifest (1).json`. Keep only `manifest.json`.
Do not keep an old service worker with a different filename. This project registers `service-worker.js`.

This is a PWA/web app, not an Android APK. Creating an APK requires a separate packaging step.

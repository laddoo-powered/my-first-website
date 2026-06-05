# ehdude dashboard

Small static split of the dashboard page.

## Files

- `index.html` keeps the markup lean.
- `css/theme.css` contains the light/dark tokens from your supplied theme base.
- `css/dashboard.css` contains the dashboard, dock, popup, and widget shell styling.
- `js/dashboard.js` handles the theme toggle, app grid, popup, and listening-widget iframe.
- `screenshots/` contains the viewport checks that were generated after the split.
- `layout-check.json` contains measured bounds for the tested viewports.

## Asset note

Keep these existing assets beside `index.html`, just like the original page expects:

- `blue-waves.webp`
- `folder-svgrepo-com.svg`
- `home-icon.png`
- `debian-stroke.png`
- favicon/site manifest assets if your deployment serves them from `/`

The Last.fm iframe is lazy-loaded only when the small `fm` dock toggle is opened.

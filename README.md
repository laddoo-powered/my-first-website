# ehdude dashboard

Static split version of the dashboard.

## Files
- `index.html` keeps the markup.
- `css/theme.css` keeps the light/dark tokens.
- `css/dashboard.css` keeps the dashboard, dock, popup, and listening-widget layout.
- `js/dashboard.js` keeps the app grid, popup toggles, lazy iframe loading, and tiny theme toggle.
- `lastfm-svgrepo-com.svg` is included as a small placeholder for the fourth dock gem.

## Notes
The original visual assets should live beside `index.html`:
- `blue-waves.webp`
- `folder-svgrepo-com.svg`
- `home-icon.png`
- `debian-stroke.png`

The listening widget iframe is lazy-loaded only after the `last.fm` dock icon is clicked.

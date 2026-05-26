# redirector

Static redirect page for two allowed app schemes only:

- `obsidian://`
- `todoist://`

Designed to run on GitHub Pages with client-side hardening.

## Security model

- Strict app allowlist: only `type=obsidian` or `type=todoist`.
- Strict CSP via `<meta http-equiv="Content-Security-Policy">` with external JS/CSS only.
- Auto-redirect is on by default.
- Optional per-link override: set `auto=0` to disable auto-redirect and require a click.

## URL formats

Obsidian (auto-redirect default):

`/?type=obsidian&vault=MyVault&file=Notes%2FToday`

Obsidian (manual mode override):

`/?type=obsidian&vault=MyVault&file=Notes%2FToday&auto=0`

Todoist (auto-redirect default):

`/?type=todoist&id=6gj7wm4xQjgPX3Hj`

Todoist (manual mode override):

`/?type=todoist&id=task-slug-or-id-token&auto=0`

## Notes for GitHub Pages

- GitHub Pages does not let you set custom HTTP headers per page.
- This project uses a CSP meta tag in `index.html` to enforce policy in-browser.
- Keep scripts and styles external (`app.js`, `styles.css`) so CSP can stay strict.

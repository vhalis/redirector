# redirector

Static redirect page for two allowed app schemes only:

- `obsidian://`
- `todoist://`

Designed to run on GitHub Pages with client-side hardening.

## Security model

- Strict app allowlist: only `type=obsidian` or `type=todoist`.
- Strict CSP via `<meta http-equiv="Content-Security-Policy">` with external JS/CSS only.
- Auto-redirect is off by default to reduce abuse from crafted links.
- Optional trusted auto-redirect can be enabled per-link with `auto=1`.

## URL formats

Obsidian (manual click by default):

`/?type=obsidian&vault=MyVault&file=Notes%2FToday.md`

Obsidian (trusted auto-redirect):

`/?type=obsidian&vault=MyVault&file=Notes%2FToday.md&auto=1`

Todoist (manual click by default):

`/?type=todoist&id=1234567890`

Todoist (trusted auto-redirect):

`/?type=todoist&id=1234567890&auto=1`

## Notes for GitHub Pages

- GitHub Pages does not let you set custom HTTP headers per page.
- This project uses a CSP meta tag in `index.html` to enforce policy in-browser.
- Keep scripts and styles external (`app.js`, `styles.css`) so CSP can stay strict.

# dev

Client development sites, served at **https://dev.ryanbartlette.com** by GitHub Pages.
Everything here is public and hidden from search engines (`robots.txt` + `noindex`). Keep secrets and keys out of this repo.

## Layout

Each client gets its own folder, so every dev site stays online at once:

| Folder | URL |
| --- | --- |

## Adding a client

1. Create a folder, e.g. `acme/`.
2. Build the site so links start with the folder path (`/acme/assets/...`), or use relative links.
3. Commit to `main`. Pages redeploys within a minute or two.

## Setup notes

- DNS: `CNAME dev -> ryanbartlette.github.io`
- Settings -> Pages: deploy from `main`, root folder, custom domain `dev.ryanbartlette.com`, Enforce HTTPS.
- `CNAME` and `.nojekyll` must stay at the repo root.

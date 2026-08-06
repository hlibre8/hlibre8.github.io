# Hossein Libre personal website — starter version

This is a dependency-free static website prepared for the GitHub username `hlibre8`.

## Preview it on your computer

Open `index.html` in a browser, or run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a public GitHub repository named exactly `hlibre8.github.io`.
2. Upload the contents of this folder to the repository root.
3. Enable GitHub Pages for the repository.
4. The eventual address will be `https://hlibre8.github.io/` after deployment completes.

## First details to replace

- About text in `index.html`
- Exact education and experience entries in `index.html`
- News dates and wording in `index.html` and `news.html`
- Contact details in `contact.html`
- Research descriptions in `research.html`
- Gallery placeholders in `glass.html`
- Add a PDF CV and link it from the site

## Main design files

- `assets/css/styles.css` — layout, colors, typography, mobile behavior
- `assets/js/site.js` — scroll reveal, header change, mobile menu
- `assets/images/hero-lab.jpg` — homepage image
- `assets/images/profile-lab.jpg` — temporary profile crop

The site uses no framework or build step, so it is easy to edit and publish. It can be migrated to Astro later if the content becomes more complex.

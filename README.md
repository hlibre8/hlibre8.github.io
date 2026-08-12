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

## Glass gallery workflow

1. Put a new image in `assets/images/gallery/`.
2. Add its `image`, `title`, `date`, `type`, and optional manual `location` to `assets/js/gallery-data.js`.
3. Run the analyzer:

```bash
python3 -m pip install Pillow numpy
python3 scripts/analyze-gallery.py
```

Or, if you prefer npm scripts:

```bash
npm run gallery
```

The analyzer uses Pillow and NumPy to calculate color metadata, then writes
`assets/js/gallery-generated.js`, which the Glass page reads automatically.

The site uses no framework or build step, so it is easy to edit and publish. It can be migrated to Astro later if the content becomes more complex.

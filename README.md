# Bhanu Ganesh — Computer Vision Engineer Portfolio

Static, fast, accessible portfolio hosted on GitHub Pages.

## Structure

- `index.html` — single-page site (semantic HTML, SEO + Open Graph + JSON-LD)
- `style.css` — dark technical theme, CSS custom properties, responsive, `prefers-reduced-motion`
- `script.js` — vanilla JS: mobile nav, scrollspy, project modals, lazy video loading, reveal-on-scroll
- `images/` — project thumbnails and demo videos (loaded on demand only)
- `resume.pdf` — resume file (add your PDF at this path; all resume buttons point here)

## Local preview

Serve the folder and open in a browser:

```
python -m http.server 8000
```

## Deploy

Push to `main` — GitHub Pages serves it automatically.

## TODO (owner)

- [ ] Add `resume.pdf` at the repo root
- [ ] Verify canonical URL against the final Pages domain
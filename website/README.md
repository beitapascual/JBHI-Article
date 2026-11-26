# Research website

An Astro site for *Dynamic and robust EEG functional connectivity biomarkers of cognitive load across age groups*.

[Open the public website](https://beitapascual.github.io/JBHI-Article/)

## Local development

Use Node.js 22.12 or newer and Python 3.12. From `website/`, install the build dependencies and start Astro.

```sh
python3 -m pip install -r requirements.txt
npm ci
npm run dev
```

Development and production builds generate figure previews, original downloads, and table data from [`materials/`](../materials/). `src/data/material-sources.json` maps the scientific files to stable website identifiers. The generated files are omitted from version control.

Run `npm run prepare:materials` before `npm run check`. Run `npm run build` to write the static website to `dist/`. To preview the GitHub Pages layout locally, use the repository base path for both commands.

```sh
SITE_URL=https://beitapascual.github.io SITE_BASE=/JBHI-Article npm run build
SITE_BASE=/JBHI-Article npm run preview
```

## Deployment and materials

The [GitHub Pages workflow](../.github/workflows/eeg-companion-pages.yml) builds the site when its source or scientific materials change on `main`. See the [supplementary materials guide](docs/materials-guide.md) for scientific descriptions and reporting conventions.

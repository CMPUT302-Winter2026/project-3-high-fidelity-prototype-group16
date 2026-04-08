# Vocab Explorer

A Cree/English dictionary web app inspired by itwewina, designed to make vocabulary lookup and exploration easier.

## Live Deployment

- Production URL: https://vocab-explorer.vercel.app/

## Project Overview

Vocab Explorer is a high-fidelity prototype that supports Cree and English word discovery through search, definitions, and viewing word relationship in a word map. The goal is to provide an approachable interface for bilingual vocabulary exploration.

This project is inspired by itwewina and uses demo dictionary data derived from publicly accessible itwewina endpoints/pages for prototyping and educational use.

## Technology Used

- Framework: SvelteKit (Svelte 5)
- Language: TypeScript
- Build tool: Vite
- Hosting/Deployment: Vercel
- Search utility: Fuse.js
- Optional backend/service integration: Firebase SDK

## Run Locally

### Requirements

- Node.js 20 LTS recommended, tested using Node.js 24+
- npm

### Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal (usually http://localhost:5173).

### Useful Scripts

- `npm run dev` - run local development server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run check` - run type and Svelte checks

## Data Notes

- Demo dictionary data is scraped/assembled from itwewina sources for this prototype.
- The repository includes scraping/generation scripts (for example, `scripts/generate-itwewina-dictionary.mjs`).
- Some static dummy content is included for demonstrations.

## AI and Tooling Disclosure

- GitHub Copilot was used for some styling and component creation.
- Cursor was used for parts of web scraping and data-source preparation.

## Sources and References

### Inspiration and Data Sources

- itwewina (project inspiration and data source): https://itwewina.altlab.app/
- itwewina source note in dataset file: https://itwêwina.altlab.app/
- itwewina search API endpoint pattern: https://itwewina.altlab.app/api/search/?query=...
- itwewina word page pattern: https://itwewina.altlab.app/word/{slug}/

### Algorithm and Implementation References (from code comments)

- Barnes-Hut overview: https://arborjs.org/docs/barnes-hut
- Barnes-Hut interactive explanation: https://jheer.github.io/barnes-hut/
- Quadtree reference: https://en.wikipedia.org/wiki/Quadtree

### Language/Unicode and Cree-related References (from code comments)

- Regex reference snippet: https://stackoverflow.com/a/15604206/12471420
- Plains Cree syllabics chart: https://resources.atlas-ling.ca/media//Plains-Cree-Syllabic-Chart-Basic.pdf
- Swampy Cree syllabics chart: https://resources.atlas-ling.ca/media/Syllabic_Chart_Swampy-Cree_N-dialect-1.pdf
- Canadian Aboriginal Syllabics Unicode block: https://www.compart.com/en/unicode/block/U+1400
- Unicode list reference: https://en.wikipedia.org/wiki/List_of_Unicode_characters


## Attribution

This app is an independent educational prototype inspired by itwewina and is not an official itwewina product.
# Social Hub Studio - Vercel Fixed Package

Use this package if Vercel shows `404: NOT_FOUND`.

## Correct Vercel Settings

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: leave empty/default

## Environment Variables

Add this in Vercel Project Settings > Environment Variables:

- `OPENAI_API_KEY`: your fresh OpenAI API key
- `OPENAI_TEXT_MODEL`: `gpt-4.1-mini`

Do not put the key inside `index.html` or GitHub.

## GitHub Upload

Upload all files in this folder to a GitHub repository:

- `index.html`
- `package.json`
- `build.js`
- `local-server.js`
- `vercel.json`
- `.gitignore`
- `README.md`

Then import the GitHub repository in Vercel.

## Why This Fixes 404

Vercel sometimes deploys nothing when a plain HTML project has no build output. This package creates `dist/index.html`, and Vercel publishes that folder.

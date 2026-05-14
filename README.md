# funnyDogs

A meme-style dog gallery website with swipe navigation, random accessories, and ratings.

## Run locally

Open `index.html` in a browser.

## Deployment

This repository now includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that deploys the static site to GitHub Pages on every push to `main`.

After enabling **GitHub Pages** in repository settings (Source: **GitHub Actions**), the site will publish with `index.html` as the entry point to avoid the previous 404 from missing deployment.

## Features

- Browse a variety of dog pictures
- Meme overlays (captions + random hats/eyes/props)
- Swipe navigation on touch devices (also arrow keys + buttons)
- Rate each meme from 1–5 stars
- Auto-swipe mode and leaderboard of top-rated dogs

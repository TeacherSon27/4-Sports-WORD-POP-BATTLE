# Word-Pop Battle

This folder contains separated, self-contained project files for all three
Word-Pop Battle HTML files supplied for the transfer.

## Default game

Open `index.html`. It is the newest and most complete version, with the
PowerPoint-derived game images, installable-app manifest, touch support,
two-player play, and one-player mode.

## Project structure

- `index.html` — default current game page
- `css/styles.css` — current game styling
- `js/game.js` — current game data and behavior
- `manifest.webmanifest` and `icons/` — installable-app metadata and icons
- `assets/current/` — 41 images used by the current game
- `variants/asset-edition.html` — older image-based version
- `css/asset-edition.css` and `js/asset-edition.js` — older version code
- `assets/legacy/` — 41 images used only by the older version
- `variants/standalone-edition.html` — lightweight generated-art version
- `css/standalone-edition.css` and `js/standalone-edition.js` — standalone code
- `asset-manifest.json` — checksums for all 89 copied images and icons
- `PROJECT-AUDIT.md` — detailed analysis and transfer notes

No package installation, remote library, account, or internet connection is
required to run the game locally. The original Playground files were not changed.

# Sihina Kanji Master — FINAL 450 Source Edition

## App
- **Sihina Kanji Master**
- iOS portrait-first PWA
- Soft colorful rounded-card/grid UI inspired by the supplied visual references
- Powerful dashboard, daily 25, XP, streak, mastery and JFT-oriented navigation
- Flashcards open in an iOS-style popup
- Animation layer intentionally removed

## 450-source requirement
The uploaded `kanji-all-450.pdf` is represented by exactly **450 source slots** (page 2–46, 10 slots per page). The app now exposes **all 450 source entries**, each with its original source-image crop.

Important: the source PDF is a 450-entry source/vocabulary scan; it is **not silently relabeled as 450 unique Kanji characters**. The original scan remains the authority for every entry.

## Data integrity
The following pre-existing files are copied byte-for-byte and are NOT edited:
- `data/kanji.json`
- `data/source-slots.json`
- `data/n4-pages.json`
- `data/source-manifest.json`
- `sources/kanji-all-450.pdf`
- `sources/n4-kanji.pdf`

New files are additive only:
- `data/source450-index.json` — 450-slot navigation index
- `assets/source450/` — 450 source-image crops
- `data/kanji-character-stories.json` — separate learning-aid layer; not used to overwrite source records

Existing structured records keep their dedicated Sinhala stories. A new additive `data/kanji-memory-450.json` contains exactly 450 source-entry memory-aid records, keyed 1:1 to `source450-index.json`. Where structured source text exists, the memory aid uses that source meaning; otherwise the original source image remains authoritative and the app does not invent missing source facts.

## Language rules
Normal learning UI keeps Japanese + Furigana + Romaji + Sinhala together.
Quiz mode remains Japanese + Furigana only.

## GitHub Pages
Upload the contents of this folder to the repository root and enable GitHub Pages.


## GitHub Pages deployment
A workflow is included at `.github/workflows/pages.yml`. GitHub Pages must use **GitHub Actions** as the publishing source; the workflow deploys the repository root on pushes to `main`.

# HomeCore rules

Read this before drawing or building any HomeCore element. Every number is a pixel. Every value comes from the demo's CSS (`src/styles.css`, `src/display.css`, `src/demo.css`, `src/weather-bento.css`) and its board code (`src/test-focus.js`). When the demo and this file disagree, the demo is wrong: fix the demo.

## 1. One shape

Every element is the same shape:

1. **Head**: icon button, title, subtitle.
2. **Space**: one area below the head for data or actions.

Size changes how much space there is. Width changes how many columns it takes. Nothing else changes. A page is a collection of these elements on one grid. The Weather page is not special.

Two families, each with one rule:

- **Tile**: nests inside cards. Corner 28, padding 18.
- **Card**: holds tiles. Corner 34, padding 10.

Never mix the two rules.

## 2. Grid

| Rule | Value |
|---|---|
| Column width | 252 (allowed 200 to 315 when the screen forces it) |
| Column gap | 16 |
| Row height | 60 |
| Row gap | 16 (so one row pitch is 76) |
| Columns at 1440 wide | 4 |
| Columns on a phone (under 620 wide) | 2 |
| Page gutter | 22 |
| Section label indent | 22.4, with 8 below it |
| Left rail (desktop) | 80 wide, hidden on phones |

Elements snap to columns and rows. They never stretch to fill leftover space. Pages are built from the top left outwards.

## 3. Sizes

Height is counted in rows. Width is counted in columns.

| Height | Rows | Pixels |
|---|---|---|
| XS | 1 | 60 |
| S | 2 | 136 |
| M | 3 | 212 |
| L | 4 | 288 |
| XL | 5 | 364 |

| Width | Columns | Pixels at 252 |
|---|---|---|
| Narrow | 1 | 252 |
| Wide | 2 | 520 |
| Really wide | all | the page |

Rules for sizes:

- XS is the head alone. No space.
- A device tile needs one row for the head plus one row per control shown. Showing more controls makes the tile taller, which can move the tiles under it.
- Cards of tiles default to XL. Weather readings and single cards default to L.
- An area tile is S, M or L (136, 212, 288) at 252 wide. Phones lay areas out at L.
- Nothing is ever shorter than XS or taller than XL.

## 4. Head

| Part | Value |
|---|---|
| Icon button | 40 × 40, corner 16, glyph 34 |
| Title | Geist 600, 14 / 20 |
| Subtitle | Geist 400, 16 / 20 |
| Gap below the head | 14 |

The icon is the button on a device tile. There is never a separate switch on a tile. Text that does not fit is cut with "…" and shows a tooltip. Align text to its letters, never to the icon box.

## 5. Tile

| Rule | Value |
|---|---|
| Corner | 28 |
| Padding | 18 all round |
| Gap between head and controls, and between controls | 14 |
| Background | card colour (`--card`) |
| Edge | hairline 0.4 (`--line`) |
| Width | 252 in a column; two to a row inside a card |

## 6. Card

| Rule | Value |
|---|---|
| Corner | 34 (= tile 24 + inset 10 in the original system) |
| Padding | 10 all round; 14 at the top when it has a title |
| Title | Geist 500 italic, 18, cap-trimmed |
| Gap between tiles inside | 10 |
| Background | `--card` |
| Edge | hairline 0.4 |

A card of tiles fills its height: as many rows of tiles as fit at 56 or taller, every row the same height. A card never squeezes what it holds; it scrolls sideways instead.

## 7. Controls

All controls sit in the tile's Space, full width, 14 apart.

| Control | Height | Corner | Notes |
|---|---|---|---|
| Track (brightness, warmth, colour, tilt) | 46 | 16 | the level is the filled part |
| Segments (modes, playback) | 46 | 16 | 4 padding, each segment corner 12 |
| Stepper (− value +) | 46 | 16 | |
| Blocks (cover positions) | 46 | 16 | 4 padding, 4 gap |
| Chips (rooms, presets) | 40 | 16 | padding 0 14, gap 8, Geist 600 14 / 20 |
| Button | 46 | 16 | padding 0 16, Geist 600 14 / 20 |
| Pill | 26 | 10 | padding 0 10, Geist 600 12 / 16 |
| Input / search | 46 | 16 | padding 12 16, Geist 400 16 |
| Switch | 50 × 28 | full | only in settings rows, on the left of the name |

Control fill is `--tile`, with the hairline. Segments and the stepper's buttons sit 4 inside their track, so their corner is 12.

## 8. Rows

A row is a head laid flat: icon button 40, name, then the value on the right. Minimum height 60, padding 10, gap 10, corner 24. Rows live inside cards (favourites, readings, activity) and in lists. In a Wide card rows run two per line, so four favourites make an M card and six summaries a card of three lines. On a phone the summaries and favourites are each one full-width card of rows, two per line, no title. Tables have no card: they sit on the page, 60 per row, 20 in, a 0.4 hairline between rows.

## 9. Popups

| Rule | Value |
|---|---|
| Popup | 440 wide, centred, padding 20, gap 14, corner 34 |
| Sheet | 640 wide, from the bottom |
| On a phone | always a bottom sheet, corner 34 top only |
| Head row | 40 tall: head on the left, close 34 on the right |
| Tabs | 38 tall pill |
| Details side panel | 300 wide, 12 from the popup, same height; slides over the popup under 800 wide |
| Summary popup | min(1040, screen − 32) wide, padding 40 (20 / 16 on phones), 28 between groups |

One popup per device kind. Most controls already live on the tile; the popup adds only what the tile has no room for.

## 10. Edit mode

| Part | Value |
|---|---|
| Tray | 576 wide, from the right; inner padding 16, gap 16, corner 34 on the open side |
| Tuck button | 40, corner 16, 52 left of the tray |
| Grip | 48 × 28, corner 14, centred on the card's top edge |
| Chip (⋯, hide) | 28 round |
| Board menu | min 200 wide, padding 6, corner 24, 2 between items, items 40 tall |
| Mini phone | 324 wide, padding 12, corner 44; screen corner 34 |
| Board while the tray is open | scaled down to fit beside it (0.35 to 1); grips, chips and menus keep their size |

## 11. Type

Geist only.

| Style | Value |
|---|---|
| Display (page title, big numbers) | 52 / 1.05, 800, −0.055em (46 on phones) |
| Popup title | 22 / 1, 500 italic, −0.03em |
| Card title | 18 / 1.1, 500 italic, −0.02em |
| Section label | 18 / 1.2, 400, −0.01em (16 on phones) |
| Tile title | 14 / 20, 600 |
| Tile detail | 16 / 20, 400 |
| Value | 16 / 1.15, 400, −0.02em |
| Strong | 14 / 1.25, 600 |
| Body | 12 / 1.4, 400 (14 on phones) |
| Caption | 12 / 1.35, 400 |
| Weather temperature | 64, 500; range 24, 300 |

## 12. Colour

| Token | Use |
|---|---|
| `--bg` | the page |
| `--card` | cards, tiles, popups, the tray |
| `--tile` | controls and inputs inside a tile or card |
| `--line` | the 0.4 hairline |
| `--text`, `--muted` | words |
| `--hc-icon`, `--hc-icon-ink` | icon buttons: neutral grey, glyph in the text colour |
| `--primary` #03A9F4 | the one accent |

Icon buttons are grey everywhere. A light that is on shows its own colour on its icon. Alerts are red. Nothing else is coloured.

## 13. What never happens

- No page-specific grid, card shape or size set.
- No element stretched past 25% to fill a row or column.
- No separate switch on a tile.
- No second rule for phones: the same elements at the same sizes, two columns.
- No invented elements: build only what is asked for.

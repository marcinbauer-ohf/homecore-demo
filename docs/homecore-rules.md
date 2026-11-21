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

The icon's fill says what a tap does:

- **Full fill** (grey, or the light's colour when on): the icon is an on/off button. Only on devices that can be switched, unless that device has it turned off.
- **Faint fill** (the text colour at 9%): the icon opens something: more-info, a popup or a page, depending on the device, summary or group. Summaries and the device icons inside an area tile use this.

The two looks never swap jobs. There is never a separate switch on a tile. Text that does not fit is cut with "…" and shows a tooltip. Align text to its letters, never to the icon box.

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

A row is a head laid flat: icon button 40, name, then the value on the right. Minimum height 60, padding 10, gap 10, corner 24. Rows live inside cards (favourites, readings, activity) and in lists. In a Wide card rows run two per line, so four favourites make an M card and six summaries a card of three lines. A card of rows shows its title by default (Favourites). The summaries strip is the exception: it never has one. On a phone the summaries and favourites are each one full-width card of rows, two per line. Tables have no card: they sit on the page, 60 per row, 20 in, a 0.4 hairline between rows.

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
| `--title` | titles, names and big readings: the text colour in dark mode, a greyer #55504a in light mode, so headings sit back from the body text |
| `--hc-icon`, `--hc-icon-ink` | icon buttons: neutral grey, glyph in the text colour |
| `--primary` #03A9F4 | the one accent |

Icon buttons are grey everywhere. A light that is on shows its own colour on its icon. Alerts are red. Nothing else is coloured.

## 13. What never happens

- No page-specific grid, card shape or size set.
- No element stretched past 25% to fill a row or column.
- No separate switch on a tile.
- No second rule for phones: the same elements at the same sizes, two columns.
- No invented elements: build only what is asked for.

## 14. Data tiles

A data tile is a Tile that shows a reading instead of controls. Air quality, Pollen, UV, Moon, Humidity, Pressure, Wind and Visibility are all this one tile with different words.

| Part | Value |
|---|---|
| Zone (the reading) | Geist 500 at 44, unit Light 18 muted on the baseline, at the bottom of the Space |
| Callout | Geist 14 / 20; advice in the text colour, or a muted name with its value on the right; up to three, 4 apart, 8 under the Zone, ending 18 from the bottom |
| XS | the head alone |
| S | head and Zone |
| M, XL | head, Zone and callouts |

## 15. Weather

Weather uses the same grammar at a different scale: condition imagery replaces the chip.

| Kind | Value |
|---|---|
| Weather icon | condition on a coloured square; Small 60 corner 20, Large 90 corner 24 |
| Wide (520, XL) | 20 in; Large icon, 26 at 64 with the unit at 24, the place 14; Sunny / H / L in an inset tile (corner 24); six forecast days that stretch to fill the row (tile fill, corner 24, 16 above and below, day 14, icon 60, high 16, low 16 muted) |
| Compact (336) | three 60 rows: Now, Today, Tomorrow |
| Halves (355) | 10 in; current conditions above three pairs of forecast rows |

## 16. Energy and graphs

| Part | Value |
|---|---|
| Bars by the hour | "Most" caption 11, three hairline guides, one bar per hour 14 wide corner 2 at a 20 pitch, text colour with the current hour in the accent, hour labels 11 muted |
| Energy today (Wide) | XS: sources in one 60 row; S: title + sources; M–XL: title, graph filling the space, sources at the bottom; the picked source takes the tile fill |
| Open tile (300 × 242) | a reading tile opened to its 24 hours: tile fill inset 10, head with a back glyph, drawing with three guides and hour labels 10 |

## 17. Area accordion

The Areas card is an accordion the width of the board: one area open, the rest folded, 16 apart, all the same height.

| Part | Value |
|---|---|
| Open | 556 wide, corner 28, 18 in; name 18 Medium; reading 51 with its line 16 muted at the top of the Space; device rows (252, 60) two per line at the bottom |
| Folded | 128 wide, corner 24, 18 above and 10 at the sides; icon, name 16 SemiBold centred, main 32 ExtraLight, devices that are on as icon buttons two to a row, 20 apart, at the bottom |

## 18. More info, by kind

One popup per device kind (440 × 604, phone 358). Head row, Space, Controls, tabs pill.

| Kind | Space | Controls |
|---|---|---|
| Light | two vertical bars 134 × 319 corner 24: brightness (level from the bottom), warmth (gradient, a 30 × 4 handle) | tabs: palette, DAC, sliders; info on the right |
| Climate, humidifier, water heater | tile-filled box 224: reading 64 with unit 24, facts 14 (muted name, value) | stepper, Range (two steppers), Mode segments |
| Fan, lock, switch, valve | big switch 224 corner 89.6, glyph 190 | track, segments |
| Alarm | tile-filled keypad: Code field 46, keys 46 corner 12 card fill, 8 apart | Off / Home / Away / Night / Vacation |
| Cover | drawing of the cover | blocks 25 / 50 / 75 / 100 (accent when reached), tilt track, Open / Stop / Close |
| Vacuum | reading box with fan speed | Start / Dock / Locate, rooms as chips |
| Media | artwork 240 corner 28 | playback 46 |
| Info page | last 24 hours strip, facts 40 tall with a hairline above each | tabs with info chosen |
| Summary | 1040 on the page colour, 40 in; title 24, headline 28, groups 18, reading tiles 306 × 76 three per row 20 apart | |
| Tabs pill | 38 tall, 3 in, tabs 48 × 32 corner 16, chosen bright | |

## 19. Edit pages

| Part | Value |
|---|---|
| Tray row | 60; grip 20, Head, show and remove 20 (favourite) or a switch (summary); hidden card = tile-filled chip with a grip |
| Section head | Head with one line of help and a chevron that turns |
| Setting row | name, Info button 28 (faint), switch on the right |
| Edit dashboard | title + Done, tabs Cards / Home page / Phone, sections at 18: hidden cards, Tiles (Add tile), Areas (Add area), Phone (Show the phone), Favourites, Show suggestions |
| Edit Home page | folding sections Personalize (welcome, favourites, suggestions) and Summaries (rows with switches) |
| Card menu | 271 wide, 6 in, corner 24; Height XS–XL and Width options as 12 SemiBold pills 3 in; Edit card, Move ×4 (impossible at 40%), Hide; items 40 |
| Mini phone | 324 wide corner 44, 12 in; screen 300 corner 34 on the page colour, blocks at 0.8 |
| Info popover | 280 wide, 16 in, corner 24, title + explanation + Learn more |

## 20. Action spaces in Figma

Every Space slot in the Figma file carries a faint accent tint (6%) so an empty or misplaced space is visible. It is a Figma aid only; the demo draws no tint.

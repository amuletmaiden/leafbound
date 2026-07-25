# LEAFBOUND — The Living Tarot

A wordless two-card tarot roguelite grown from [LEAF](https://github.com/amuletmaiden/leaf).

**Play:** https://amuletmaiden.github.io/leafbound/


LEAFBOUND is not an attack-and-damage deckbuilder. Every encounter is a girl held inside an impossible arrangement of color. You resolve her condition by composing ordered pairs of symbols and making the present field resemble the future she desires.

## The reading

Every turn accepts exactly two cards:

1. The first symbol determines which goddess acts.
2. The second determines what she acts on, with, through, or upon.
3. Order matters. Green → Blue summons the Siren; Blue → Green summons the Mermaid.

The starting deck follows the cadence **RGBRGBP**:

- Sun — red
- Green Eye — green
- Mirror — blue
- Flame — red
- Garden — green
- Swan — blue
- Moth — pink

Cards are wordless on the ritual table. Their central symbol, color, body-place, pips, and accumulated karmic weight communicate their identity. A toggle reveals names for accessibility and learning.

## Four physical colors

Everything contains a hidden four-channel field:

- **Red / Heart** — self, action, motion, strength
- **Green / Love** — connection, life, sight, growth
- **Pink / Power** — decay, fermentation, transformation
- **Blue / Temple** — law, stillness, distance, structure

The field is shown as a continuous aura, not as damage numbers. A condition resolves when her current aura crosses the harmony threshold and remains there for enough consecutive rites.

## What is unusual here

- **Exactly two cards per turn.** There are no energy points or attack rotations.
- **Sixteen ordered manifestations.** Each color pair summons a distinct goddess-form.
- **No enemies or health bars.** Failure means the condition hardens before a livable continuation is found.
- **Karmic gravity.** Played symbols become heavier, return more readily, and awaken after repeated use.
- **Hands, Eyes, Lips, Pockets.** Cards inhabit body-places that alter how a rite behaves.
- **Location row.** Three omens change the physical interpretation of the same pair from turn to turn.
- **Color-vector operations.** Rites transfer, invert, preserve, smooth, delay, or incarnate color weight.
- **Deckbuilding through memory.** Resolved girls offer new tarot symbols rather than weapons.
- **Persistent codex.** Discovered manifestations remain witnessed in local storage.

## Current vertical slice

The build contains:

- 18 symbolic tarot cards
- 16 ordered color manifestations
- 8 location omens
- 4 condition-girls
- a complete beginning-to-ending run
- reward drafting between readings
- procedural SVG character illustration
- optional WebAudio chimes
- responsive desktop and mobile layouts
- keyboard controls: `1–5`, `Enter`, `Ctrl/Cmd+Z`, `Esc`

## Local use

No build step or network connection is required. Open `index.html`, or serve the directory with any static web server.

## Development

The game is deliberately self-contained:

- `index.html` — semantic interface and dialogs
- `styles.css` — visual system, tarot cards, responsive layout
- `game.js` — color physics, deck state, girls, omens, persistence, sound
- `DESIGN.md` — rules and production direction

## License

MIT.

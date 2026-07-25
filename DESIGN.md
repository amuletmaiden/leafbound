# LEAFBOUND — Design Law

## Thesis

LEAFBOUND is a roguelite deckbuilder in the structural sense—draw, compose, transform, draft, repeat—but it rejects the dominant combat grammar of attack, block, damage, and hit points.

A card is a tarot symbol. A turn is an ordered two-symbol sentence. An encounter is a girl whose physical color-field has become impossible to inhabit. Play does not defeat her; it discovers a continuation in which she can exist.

The game should feel like reading tarot, operating a machine, composing a spell, and learning a private visual language at once.

## The irreducible rule

Play exactly two cards every turn.

- Card I identifies the acting goddess.
- Card II identifies her object, medium, instrument, place, or law.
- I → II differs from II → I.

The system has four base colors and therefore sixteen ordered color products. Each product has:

- a manifestation-girl
- a visual composition
- a characteristic vector operation
- a poetic name
- a discoverable codex entry

Examples:

- Green → Blue: **The Siren**. Connection travels through distance and pulls the field toward desire.
- Blue → Green: **The Mermaid**. Law becomes habitable and smooths violent differences.
- Pink → Red: **A New Heart**. Decay completes its circuit and returns as a changed self.
- Blue → Pink: **Law Unwrites Itself**. The most excessive certainty is permitted to disappear.

## Cards

Cards are wordless during play.

A face contains:

- one large symbol
- one dominant semantic color
- optional secondary-color division
- one to three magnitude pips
- one body-place glyph
- visible karmic weight after repeated use

Names and explanations live in tooltips and the codex. The player may enable a gloss mode that adds names to card faces.

### Starting cadence

The starter deck is intentionally asymmetric:

**R G B R G B P**

This teaches the three stable colors twice before introducing transformation once. Pink initially feels rare, dangerous, and precious rather than merely being the fourth suit in a balanced starter pack.

### Magnitude

Numbers exist internally, but the face communicates magnitude through pips. This preserves exact rules without making the board feel like spreadsheet combat.

### Karmic gravity

Every use adds karmic weight to both symbols.

Consequences:

- weighted symbols are drawn earlier during reshuffles
- at three weight the card awakens and gains magnitude
- at five weight it may return directly to fate instead of entering discard
- repeated ordered pairs gather precedent through Lips and the Bird Choir omen

Karma makes a deck remember what the player has actually done, rather than only what they drafted.

## Four physical colors

Every card, condition, and operation has an RGՓB vector. Pink is written `p` internally so blue can remain `b`.

### Red — Heart

Self, action, motion, declaration, strength, heat, blood, sun.

Physical tendency: assertion, incarnation, directed transfer.

### Green — Love

Connection, life, witness, sight, relation, garden, growth.

Physical tendency: filling deficits, equalization, attraction toward desired states.

### Pink — Power

Decay, fermentation, metamorphosis, rot, inversion, becoming.

Physical tendency: swapping, rotating, delaying, converting surplus into another channel.

### Blue — Temple

Law, stillness, space, distance, vessel, mirror, moon, tower.

Physical tendency: smoothing, freezing drift, storing change, removing excess certainty.

Color is load-bearing. It is not a decorative rarity system.

## Conditions instead of enemies

A condition has:

- a current color vector
- a desired color vector
- a characteristic drift
- a harmony threshold
- a number of consecutive stable rites required
- a limited reading length
- a girl embodiment

Harmony is based on distance between the current and desired fields. The player sees both as circular color auras. Exact component values remain hidden in the normal interface, encouraging visual judgment rather than arithmetic optimization.

When the field crosses the threshold, it must remain there. Conditions drift after rites, so a momentary solution may not constitute a livable law.

Failure text must never imply death, injury, conquest, or moral inferiority. The reading closed. The condition hardened. Another reading may find another continuation.

## The four body-places

### Hands

Immediate agency and direct manipulation.

### Eyes

Sight, comparison, revelation, and sensitivity to the desired field.

### Lips

Invocation, repetition, precedent, and spoken law.

### Pockets

Storage, delay, concealment, and unfinished operations.

A pair sharing a body-place gains additional magnitude. Specific cards and locations elaborate these meanings.

## Locations and omens

Randomness should not come only from draw order. Each condition is read through a row of three locations/omens. The active omen advances each turn.

Current examples:

- **Solar Orchard** — red and green carry farther
- **Moon Pool** — the second symbol speaks more loudly
- **Moth Weather** — karma leaves pink residue
- **Swan Stair** — matching body-places arrest drift
- **Bird Choir** — repeated pair-laws gather a chorus
- **Pocket Eclipse** — stored operations return with doubled weight
- **Glass Garden** — the emptiest color receives mercy
- **Silent Tower** — blue operations hold their shape

The same cards therefore mean different things in different places.

## Girls

The game should contain many girls, but they must be systemic rather than decorative rewards pasted over conventional mechanics.

Current layers:

1. Four primary goddesses: Ruby, Garden Maid, Moth Princess, Swan.
2. Sixteen ordered-pair manifestations.
3. Four condition-girls.
4. Future location spirits, card custodians, and route companions.

Art direction:

- unmistakably illustrated and two-dimensional
- stylized anime proportions
- clear silhouettes
- large expressive eyes
- flat or soft cel shading
- no simulated photography
- no 3D skin, pores, lens effects, or faux-real faces
- costume motifs derived from card symbols and color law

The current build uses procedural SVG portraits so the cast remains crisp, lightweight, and free of uncanny realism.

## Run structure

Current slice:

1. Enter with seven symbols.
2. Resolve a condition through ordered rites.
3. Receive three wordless symbols from her opened hand.
4. Choose one and continue.
5. Complete four readings, ending with the Star-Devouring Goddess.

Production direction:

- branching possibility-tree overworld rather than a map of combat nodes
- companion girls who modify syntax rather than add passive damage
- tarot reversals and card orientation
- genuinely bifacial symbols whose active color depends on position
- persistent card patina, edge wear, annotations, and visual karma
- condition-specific grammars and alternative resolutions
- pair manifestations that develop relationships and memories across runs
- richer vector operations derived directly from card RGB values
- deterministic replay seed presented as a reading spread

## Principles that must remain true

1. No generic attack/block economy.
2. No health bars hidden behind synonyms.
3. Cards remain symbols first and text boxes last.
4. Exactly two cards form the core sentence.
5. Order remains significant.
6. Color remains semantic and physical.
7. Girls embody mechanics rather than decorate them.
8. Rot is transformation, not automatic punishment.
9. Failure preserves dignity and possibility.
10. The player should learn by witnessing repeated visual law.

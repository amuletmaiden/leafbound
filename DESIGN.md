# LEAFBOUND design document

## Thesis

Most deckbuilders treat cards as actions applied to an already-defined combat state. LEAFBOUND treats the cards as a temporary ontology. The player does not merely choose what to do inside the world; the player chooses what kinds of events can constitute the world this turn.

The useful design question is not “what new card keyword can be added?” It is “what familiar game object can be made causally downstream of the deck’s grammar?”

## 1. Possibility-spectrum combat

At the start of each enemy turn, generate a small conflict family of coherent enemy futures. A future is a condition with visible collapse predicates. The player’s law monotonically removes futures as it is written.

The system creates three layers of strategy:

1. **Immediate card value** — damage, ward, healing, draw.
2. **Grammatical value** — the pair made with the previous card.
3. **Counterfactual value** — which enemy futures become impossible because the card occupied this position.

A weak card can therefore be the correct play because its color, direction, or position removes the only catastrophic future.

### Expansion

A production version should generate spectra from a real incompatibility graph. Each candidate future is a node; an edge joins futures that cannot coexist in the same local world. The displayed spectrum can then expose independent coherent sets, not only individual intents. Bosses may attack by changing the graph itself: adding compatibility edges, hiding nodes, or making two futures inseparable.

## 2. Directional grammar

The four colors are typed operators:

- HEART supplies subject, origin, self, and verdict.
- LOVE supplies attention, witness, mercy, and binding.
- POWER supplies process, decay, fermentation, and change.
- TEMPLE supplies object, foundation, law, and containment.

Every ordered pair has a distinct effect. This makes sequence order structural rather than a combo counter. The deck’s combinatorial space lives between cards.

### Production extension: inflection

Cards should eventually have edge-inflections as well as colors. A card could enter as noun, verb, qualifier, or witness. A four-card law would be parsed into an executable rule rather than looked up as a fixed combo.

Example:

> HEART(subject) → LOVE(witness) → POWER(verb) → TEMPLE(object)
>
> “The witnessed self transforms the law.”

The engine could compile this into a temporary event listener whose predicate and consequence are assembled from the four cards.

## 3. Chorus of Precedent

Pair repetition is stored as precedent. A relation’s mechanical force grows because the world has seen it happen before.

This replaces the standard “build archetype” signal with an endogenous one. The run does not announce that the player has a poison deck; the player repeatedly writes POWER → LOVE until rot blooming becomes constitutional habit.

### Production extension: precedent disputes

Enemies should cite, distinguish, or overturn precedent:

- **Cite:** use one of the player’s established pair effects.
- **Distinguish:** temporarily make a familiar pair behave differently under a special fact.
- **Overturn:** erase power from a precedent but leave its historical record.
- **Dissent:** preserve a defeated rule as a minority effect that may return later.

This makes law a contested shared memory rather than a private buff list.

## 4. Fermentation instead of upgrades

Use ages a card. At three rot, it changes behavior. The transformed behavior is related but not necessarily numerically superior.

This creates deckbuilding through duration. A card’s identity records how much history has passed through it. Rewards can care about age, freshness, decay diversity, or the exact turn on which fermentation occurs.

### Production extension: decomposition

A mortal compound card should decompose into its own terms rather than into a generic scrap. A HEART/POWER card could die into one HEART seed and one POWER residue, changing deck topology while preserving semantic conservation.

## 5. Conditions, not spawned enemies

An encounter is a world entering a condition. The opponent is rendered as the visible consequence of that condition. Victory does not kill a named creature; it makes the condition unable to complete itself.

This supports encounter designs unlike conventional monster fights:

- a continent becoming too lawful;
- a starfall whose observed falls turn gold;
- an open crown attempting to become hermetic;
- a goddess climbing from impulse to legislation;
- hunger moving backward through an ecology.

## 6. World-memory presentation

LEAF treats accumulated paint as memory. A production version should retain visible traces across the whole run:

- every collapsed future leaves a faint absent shape;
- repeated pairs synchronize particles into a shared rhythm;
- fermented cards permanently tint the world’s record layer;
- previous boss laws remain as geometric scars in later arenas.

The field should become a visual autobiography of the run, not a fresh background per room.

## 7. Roguelite map without rooms

The overworld should be a growing possibility tree. The player does not select a room icon. The player prunes branches by choosing what kind of world can follow.

Rewards are then not three offered cards. They are three future ecologies. Choosing one changes the next encounter pool, card pool, and physical background simultaneously.

## 8. Production roadmap

### Milestone A — systemic alpha

- executable four-clause rule compiler;
- conflict-graph spectra;
- 60 cards and 8 conditions;
- precedent citation/dispute system;
- record-layer persistence across encounters.

### Milestone B — content alpha

- four playable selves with different grammatical privileges;
- 3 acts, 24 conditions, 6 outer-condition bosses;
- decomposing compounds and multi-color cards;
- possibility-tree overworld;
- full accessibility and controller support.

### Milestone C — visual production

- WebGL2 renderer with signed-distance-field figures;
- bloom, occlusion, semantic light mixing, and persistent paint buffers;
- authored figure silhouettes combined with procedural law fields;
- adaptive generative score in four harmonic systems.

## Design constraints

- Color may never become mere rarity or damage type.
- No figure is created by a function named after the figure; figures arise when conditions are satisfied.
- Rot is not framed as moral corruption or simple loss.
- Same-color adjacency remains an exceptional event with structural meaning.
- Hidden intelligence must be learned from changed behavior, not announced as a level number.
- Pace may alter elapsed presentation time but never split the world into inconsistent clocks.

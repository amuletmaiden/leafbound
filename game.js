(() => {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const uid = () => Math.random().toString(36).slice(2, 9);

  const SUITS = {
    heart:  { name: 'HEART',  color: '#ff2037', glyph: '●', concept: 'the self · blood · origin' },
    love:   { name: 'LOVE',   color: '#00ff76', glyph: '◉', concept: 'attention · light · mercy' },
    power:  { name: 'POWER',  color: '#ff00ff', glyph: '↻', concept: 'change · rot · transmutation' },
    temple: { name: 'TEMPLE', color: '#00c8ff', glyph: '◇', concept: 'law · vessel · gravity' }
  };

  const PAIRS = {
    'heart>love': {
      name: 'The Heart Is Attended',
      copy: 'The self becomes visible and recovers.',
      apply(scale) { healPlayer(Math.ceil(3 * scale)); }
    },
    'love>heart': {
      name: 'The Beloved Self',
      copy: 'Attention returns as shelter.',
      apply(scale) { gainBlock(Math.ceil(4 * scale)); }
    },
    'heart>power': {
      name: 'Blood Ferments',
      copy: 'The self becomes fuel for change.',
      apply(scale) { damageEnemy(Math.ceil(3 * scale), 'power'); state.player.law += 1; }
    },
    'power>heart': {
      name: 'A New Heart',
      copy: 'Rot completes its circuit as life.',
      apply(scale) { healPlayer(Math.ceil(2 * scale)); drawCards(1); }
    },
    'heart>temple': {
      name: 'The Sovereign Clause',
      copy: 'The self is written into the foundation.',
      apply(scale) { gainBlock(Math.ceil(5 * scale)); }
    },
    'temple>heart': {
      name: 'Law Incarnate',
      copy: 'The vessel becomes a body with force.',
      apply(scale) { state.player.strength += Math.ceil(2 * scale); }
    },
    'love>power': {
      name: 'The Dream Decays',
      copy: 'What is seen becomes vulnerable to change.',
      apply(scale) { state.enemy.mark += Math.ceil(2 * scale); }
    },
    'power>love': {
      name: 'Rot Blossoms',
      copy: 'Decay flowers rather than ending.',
      apply(scale) {
        const fermented = countFermented();
        healPlayer(Math.max(2, Math.ceil((2 + fermented) * scale)));
      }
    },
    'love>temple': {
      name: 'The Witnessed Law',
      copy: 'The gentlest remaining future is held open.',
      apply(scale) { softenFutures(Math.ceil(2 * scale)); }
    },
    'temple>love': {
      name: 'The Temple Opens',
      copy: 'Law makes room for mercy.',
      apply(scale) { gainBlock(Math.ceil(3 * scale)); state.player.mercy += 1; }
    },
    'power>temple': {
      name: 'Change Becomes Law',
      copy: 'A gesture repeats because the world now expects it.',
      apply(scale, card) { repeatCardHalf(card, scale); }
    },
    'temple>power': {
      name: 'Law Unwrites Itself',
      copy: 'One coherent future loses permission to exist.',
      apply(scale) { collapseOneFuture('precedent'); damageEnemy(Math.ceil(2 * scale), 'temple'); }
    }
  };

  const CARDS = {
    'silence': {
      name: 'Silence', suit: 'temple', kind: 'ABSENCE',
      copy: 'Costs one breath. Nothing answers. Even absence occupies a place in law.',
      effect() { gainBlock(1); }
    },
    'first-flame': {
      name: 'First Flame', suit: 'heart', kind: 'ORIGIN',
      copy: 'Deal 6. If this begins the law, deal 3 more.',
      effect(card) { damageEnemy(6 + (state.clause.length === 1 ? 3 : 0), card.suit); }
    },
    'heart-withdrawn': {
      name: 'Heart Withdrawn', suit: 'heart', kind: 'SELF',
      copy: 'Recover 5 coherence. Fermented: also gain 4 ward.',
      effect(card) { healPlayer(card.rot >= 3 ? 7 : 5); if (card.rot >= 3) gainBlock(4); }
    },
    'red-verdict': {
      name: 'Red Verdict', suit: 'heart', kind: 'SOVEREIGNTY',
      copy: 'Deal 5. Gain 2 strength until the turn ends.',
      effect(card) { damageEnemy(card.rot >= 3 ? 8 : 5, card.suit); state.player.strength += 2; }
    },
    'open-eye': {
      name: 'Open Eye', suit: 'love', kind: 'WITNESS',
      copy: 'Mark the condition. Every later wound this turn is deeper.',
      effect(card) { state.enemy.mark += card.rot >= 3 ? 4 : 2; }
    },
    'majority-mercy': {
      name: 'Mercy Is Majority', suit: 'love', kind: 'MERCY',
      copy: 'Gain 6 ward. Soften every coherent future by 1.',
      effect(card) { gainBlock(card.rot >= 3 ? 9 : 6); softenFutures(card.rot >= 3 ? 2 : 1); }
    },
    'kept-light': {
      name: 'Kept Light', suit: 'love', kind: 'ATTENTION',
      copy: 'Recover 3 and draw a gesture. Fermented: the draw costs no breath.',
      effect(card) { healPlayer(card.rot >= 3 ? 5 : 3); drawCards(1); if (card.rot >= 3) state.player.energy += 1; }
    },
    'ferment': {
      name: 'Ferment', suit: 'power', kind: 'TRANSMUTATION',
      copy: 'Deal 4. Every gesture already in this law gains one rot.',
      effect(card) {
        damageEnemy(card.rot >= 3 ? 7 : 4, card.suit);
        state.clause.forEach((c) => { if (c.uid !== card.uid) c.rot = clamp(c.rot + 1, 0, 3); });
      }
    },
    'cleave': {
      name: 'Cleave', suit: 'power', kind: 'BIFURCATION',
      copy: 'Deal 9 and lose 2 coherence. Fermented: the loss becomes ward.',
      effect(card) {
        damageEnemy(card.rot >= 3 ? 13 : 9, card.suit);
        if (card.rot >= 3) gainBlock(3); else hurtPlayer(2, true);
      }
    },
    'beautiful-rot': {
      name: 'Beautiful Rot', suit: 'power', kind: 'DECAY',
      copy: 'Deal 2 for every fermented gesture in your constitution.',
      effect(card) { damageEnemy(Math.max(3, countFermented() * (card.rot >= 3 ? 4 : 2)), card.suit); }
    },
    'blue-grammar': {
      name: 'Blue Grammar', suit: 'temple', kind: 'FOUNDATION',
      copy: 'Gain 8 ward. Lawfulness increases future pair effects.',
      effect(card) { gainBlock(card.rot >= 3 ? 12 : 8); state.player.law += card.rot >= 3 ? 2 : 1; }
    },
    'contagious-law': {
      name: 'Contagious Law', suit: 'temple', kind: 'LEGISLATION',
      copy: 'Deal 3 for each future already made impossible.',
      effect(card) {
        const collapsed = state.futures.filter((f) => !futureCoherent(f)).length;
        damageEnemy(Math.max(3, collapsed * (card.rot >= 3 ? 5 : 3)), card.suit);
        state.player.law += 1;
      }
    },
    'dormant-sigil': {
      name: 'Dormant Sigil', suit: 'temple', kind: 'SILENT DOCTRINE',
      copy: 'Silently collapse one coherent future. Gain 3 ward.',
      effect(card) { collapseOneFuture('sigil'); gainBlock(card.rot >= 3 ? 6 : 3); }
    },
    'round-horizon': {
      name: 'Round Horizon', suit: 'temple', kind: 'GEOMETRY',
      copy: 'Gain 5 ward. Draw one. Your next card may touch its own color.',
      effect(card) { gainBlock(card.rot >= 3 ? 8 : 5); drawCards(1); state.allowCollision = 1; }
    },
    'star-temperance': {
      name: 'Star Temperance', suit: 'love', kind: 'TEMPERANCE',
      copy: 'Reduce the force of all coherent futures by 3.',
      effect(card) { softenFutures(card.rot >= 3 ? 5 : 3); }
    },
    'open-crown': {
      name: 'Open Crown', suit: 'heart', kind: 'ASCENSION',
      copy: 'Gain 1 breath. Deal 2 for every distinct color in the law.',
      effect(card) {
        state.player.energy += 1;
        const distinct = new Set(state.clause.map((c) => c.suit)).size;
        damageEnemy(distinct * (card.rot >= 3 ? 4 : 2), card.suit);
      }
    },
    'retrograde-hunger': {
      name: 'Retrograde Hunger', suit: 'power', kind: 'REVERSAL',
      copy: 'Reverse your last loss of coherence, then deal that much.',
      effect(card) {
        const amount = Math.max(3, state.lastHpLoss || 3);
        healPlayer(amount);
        damageEnemy(card.rot >= 3 ? amount + 5 : amount, card.suit);
      }
    }
  };

  const STARTER_DECK = [
    'first-flame', 'first-flame', 'heart-withdrawn',
    'open-eye', 'majority-mercy', 'majority-mercy',
    'ferment', 'cleave',
    'blue-grammar', 'contagious-law'
  ];
  const REWARD_POOL = [
    'red-verdict', 'kept-light', 'beautiful-rot', 'dormant-sigil',
    'round-horizon', 'star-temperance', 'open-crown', 'retrograde-hunger'
  ];

  const ENCOUNTERS = [
    {
      name: 'THE LAWLESS GYRE', kind: 'CONDITION I', className: 'gyre', hp: 42,
      intro: 'It turns because nothing has yet told it not to.',
      futures: [
        { id: 'spiral-bite', name: 'Spiral Bite', copy: 'The gyre closes around the self.', power: 9, collapse: [{ type: 'suit', suit: 'love' }], effect: { damage: 9 } },
        { id: 'scatter', name: 'Scatter', copy: 'The hand is thrown into disordered orbit.', power: 5, collapse: [{ type: 'suit', suit: 'temple' }], effect: { damage: 5, discard: 1 } },
        { id: 'feast-motion', name: 'Feast on Motion', copy: 'Unlawful change feeds the turning.', power: 8, collapse: [{ type: 'pair', pair: 'power>temple' }], effect: { heal: 8 } },
        { id: 'lawless-rush', name: 'Lawless Rush', copy: 'Without a declared self, force has no boundary.', power: 13, collapse: [{ type: 'first', suit: 'heart' }], effect: { damage: 13 } }
      ]
    },
    {
      name: 'THE BRIDE OF ICE', kind: 'CONDITION II', className: 'bride', hp: 56,
      intro: 'She offers a perfect future and freezes every alternative.',
      futures: [
        { id: 'ice-vow', name: 'Ice Vow', copy: 'A promise becomes a blade.', power: 12, collapse: [{ type: 'pair', pair: 'heart>love' }], effect: { damage: 12 } },
        { id: 'dowry-silence', name: 'Dowry of Silence', copy: 'A dead gesture enters the discard.', power: 7, collapse: [{ type: 'suit', suit: 'power' }], effect: { damage: 4, curse: 1 } },
        { id: 'mirror-kiss', name: 'Mirror Kiss', copy: 'The condition drinks its own reflection.', power: 10, collapse: [{ type: 'pair', pair: 'temple>power' }], effect: { heal: 10 } },
        { id: 'bridal-veil', name: 'Bridal Veil', copy: 'Beauty conceals a second impact.', power: 8, collapse: [{ type: 'pair', pair: 'love>temple' }], effect: { damage: 8, enemyBlock: 8 } }
      ]
    },
    {
      name: 'THE STAR-DEVOURER', kind: 'OUTER CONDITION', className: 'devourer', hp: 74,
      intro: 'Near her, processes do not stop. They un-happen.',
      futures: [
        { id: 'devour-star', name: 'Devour the Star', copy: 'Light is eaten before it was emitted.', power: 16, collapse: [{ type: 'suit', suit: 'love' }], effect: { damage: 16 } },
        { id: 'unhappen', name: 'Unhappen', copy: 'Your most fermented gesture loses one age.', power: 10, collapse: [{ type: 'suit', suit: 'temple' }], effect: { damage: 7, unrot: 1 } },
        { id: 'retro-hunger', name: 'Retrograde Hunger', copy: 'Her wound becomes yesterday. Yours becomes now.', power: 13, collapse: [{ type: 'pair', pair: 'power>love' }], effect: { damage: 8, heal: 13 } },
        { id: 'closed-crown', name: 'Closed Crown', copy: 'The world seals around one violent theorem.', power: 14, collapse: [{ type: 'distinct', count: 4 }], effect: { damage: 11, enemyBlock: 10 } }
      ]
    }
  ];

  const LEDGER_KEY = 'leafbound_living_ledger_v1';
  let ledger = loadLedger();
  let state = null;
  let history = [];
  let toastTimer = null;
  let resolving = false;

  function loadLedger() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LEDGER_KEY) || '{}');
      return {
        laws: parsed.laws || {},
        victories: parsed.victories || 0,
        runs: parsed.runs || 0,
        denied: parsed.denied || 0,
        fermented: parsed.fermented || {}
      };
    } catch (_) {
      return { laws: {}, victories: 0, runs: 0, denied: 0, fermented: {} };
    }
  }

  function saveLedger() {
    try { localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger)); } catch (_) {}
  }

  function makeCard(id, rot = 0) {
    return { id, uid: uid(), suit: CARDS[id].suit, rot };
  }

  function createRun() {
    const runDeck = STARTER_DECK.map((id) => makeCard(id));
    state = {
      encounterIndex: 0,
      runDeck,
      drawPile: [],
      discard: [],
      hand: [],
      clause: [],
      futures: [],
      forcedCollapsed: [],
      turn: 0,
      player: {
        hp: 48, maxHp: 48, block: 0, energy: 4,
        strength: 0, law: 0, mercy: 0
      },
      enemy: null,
      precedents: {},
      allowCollision: 0,
      cardsPlayed: 0,
      futuresDenied: 0,
      lawsWritten: 0,
      lastHpLoss: 0,
      animationPace: 1
    };
    ledger.runs += 1;
    saveLedger();
    history = [];
    startEncounter(0);
  }

  function startEncounter(index) {
    state.encounterIndex = index;
    const blueprint = ENCOUNTERS[index];
    state.enemy = {
      name: blueprint.name,
      kind: blueprint.kind,
      className: blueprint.className,
      hp: blueprint.hp,
      maxHp: blueprint.hp,
      block: 0,
      mark: 0,
      softened: 0,
      intro: blueprint.intro
    };
    state.drawPile = shuffle(state.runDeck.map((card) => ({ ...card })));
    state.discard = [];
    state.hand = [];
    state.clause = [];
    state.turn = 0;
    state.allowCollision = 0;
    resolving = false;
    nextTurn(true);
    showToast(blueprint.intro);
    updateRunline();
    burstForSuit(index === 0 ? 'power' : index === 1 ? 'love' : 'heart', 45);
  }

  function nextTurn(first = false) {
    if (!first) {
      state.discard.push(...state.hand, ...state.clause);
      state.hand = [];
      state.clause = [];
    }
    state.turn += 1;
    state.player.block = Math.ceil(state.player.block * 0.2);
    state.player.energy = 4;
    state.player.strength = 0;
    state.enemy.block = Math.ceil(state.enemy.block * 0.25);
    state.enemy.softened = 0;
    state.allowCollision = 0;
    state.forcedCollapsed = [];
    state._lastDenied = 0;
    generateFutures();
    applyChorus();
    drawCards(5);
    history = [];
    resolving = false;
    render();
  }

  function generateFutures() {
    const base = ENCOUNTERS[state.encounterIndex].futures;
    state.futures = base.map((future) => ({
      ...future,
      collapse: future.collapse.map((rule) => ({ ...rule })),
      effect: { ...future.effect },
      turnPower: Math.max(0, future.power + (state.turn - 1) * (state.encounterIndex + 1))
    }));
  }

  function drawCards(count) {
    for (let i = 0; i < count; i++) {
      if (state.drawPile.length === 0 && state.discard.length) {
        state.drawPile = shuffle(state.discard);
        state.discard = [];
      }
      if (!state.drawPile.length) break;
      state.hand.push(state.drawPile.pop());
    }
  }

  function snapshotState() {
    return JSON.stringify({
      state,
      resolving
    });
  }

  function restoreSnapshot(json) {
    const saved = JSON.parse(json);
    state = saved.state;
    resolving = saved.resolving;
    render();
  }

  function cardCanPlay(card) {
    if (resolving || state.player.energy < 1 || state.clause.length >= 4) return false;
    const last = state.clause[state.clause.length - 1];
    if (last && last.suit === card.suit && state.allowCollision <= 0) return false;
    return true;
  }

  function playCard(uidValue) {
    const index = state.hand.findIndex((card) => card.uid === uidValue);
    if (index < 0) return;
    const card = state.hand[index];
    if (!cardCanPlay(card)) {
      showToast('The same color cannot touch itself.');
      pulseInvalid(card.suit);
      return;
    }

    history.push(snapshotState());
    state.hand.splice(index, 1);
    state.clause.push(card);
    state.player.energy -= 1;
    if (state.allowCollision > 0) state.allowCollision -= 1;
    state.cardsPlayed += 1;

    const beforeRot = card.rot;
    card.rot = clamp(card.rot + 1, 0, 3);
    syncRunCard(card);
    if (beforeRot < 3 && card.rot === 3) {
      ledger.fermented[card.id] = (ledger.fermented[card.id] || 0) + 1;
      saveLedger();
      showToast(`${CARDS[card.id].name} has fermented.`);
      burstForSuit(card.suit, 36);
    }

    CARDS[card.id].effect(card);
    const previous = state.clause[state.clause.length - 2];
    if (previous) applyPair(previous, card);
    updateFutureDenials();
    burstForSuit(card.suit, 20);
    sound.playSuit(card.suit);
    render();

    if (state.player.hp <= 0) {
      setTimeout(loseRun, 350 / state.animationPace);
      return;
    }
    if (state.enemy.hp <= 0) {
      setTimeout(winEncounter, 500 / state.animationPace);
      return;
    }
    if (state.clause.length === 4 || state.player.energy <= 0) {
      setTimeout(resolveLaw, 500 / state.animationPace);
    }
  }

  function syncRunCard(card) {
    const original = state.runDeck.find((c) => c.uid === card.uid);
    if (original) original.rot = card.rot;
  }

  function applyPair(a, b) {
    const key = `${a.suit}>${b.suit}`;
    const pair = PAIRS[key];
    if (!pair) return;
    const prior = state.precedents[key] || 0;
    const scale = 1 + prior * 0.24 + state.player.law * 0.05;
    pair.apply(scale, b);
    state.precedents[key] = prior + 1;
    state.player.law += prior >= 1 ? 1 : 0;
    $('#pairMessage').textContent = prior
      ? `${pair.name} — precedent ×${prior + 1}`
      : `${pair.name} — the world notices.`;
    if (prior >= 1) sound.chorus();
  }

  function repeatCardHalf(card, scale) {
    const def = CARDS[card.id];
    const savedStrength = state.player.strength;
    state.player.strength = Math.floor(state.player.strength * 0.5);
    const hpBefore = state.enemy.hp;
    const blockBefore = state.player.block;
    def.effect({ ...card, rot: Math.min(card.rot, 2) });
    const damage = Math.max(0, hpBefore - state.enemy.hp);
    const block = Math.max(0, state.player.block - blockBefore);
    if (scale < 1.4) {
      if (damage > 0) state.enemy.hp += Math.floor(damage * 0.5);
      if (block > 0) state.player.block -= Math.floor(block * 0.5);
    }
    state.player.strength = savedStrength;
  }

  function futureCoherent(future) {
    if (state.forcedCollapsed.includes(future.id)) return false;
    const suits = state.clause.map((card) => card.suit);
    const pairs = state.clause.slice(1).map((card, i) => `${state.clause[i].suit}>${card.suit}`);
    return !future.collapse.some((rule) => {
      if (rule.type === 'suit') return suits.includes(rule.suit);
      if (rule.type === 'pair') return pairs.includes(rule.pair);
      if (rule.type === 'first') return suits[0] === rule.suit;
      if (rule.type === 'last') return suits[suits.length - 1] === rule.suit;
      if (rule.type === 'distinct') return new Set(suits).size >= rule.count;
      return false;
    });
  }

  function updateFutureDenials() {
    const denied = state.futures.filter((f) => !futureCoherent(f)).length;
    const previousDenied = state._lastDenied || 0;
    if (denied > previousDenied) {
      const delta = denied - previousDenied;
      state.futuresDenied += delta;
      ledger.denied += delta;
      saveLedger();
      if (state.player.law > 0) damageEnemy(delta * state.player.law, 'temple');
      showToast(delta > 1 ? `${delta} futures became impossible.` : 'A future became impossible.');
    }
    state._lastDenied = denied;
  }

  function collapseOneFuture(source) {
    const coherent = state.futures.filter((f) => futureCoherent(f));
    if (!coherent.length) return;
    const target = coherent.reduce((best, f) => (f.turnPower > best.turnPower ? f : best), coherent[0]);
    state.forcedCollapsed.push(target.id);
    state.futuresDenied += 1;
    ledger.denied += 1;
    saveLedger();
    if (source === 'sigil') showToast(`${target.name} falls under silent doctrine.`);
  }

  function softenFutures(amount) {
    state.enemy.softened += amount;
  }

  function applyChorus() {
    const chorus = Object.values(state.precedents).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
    if (chorus > 0) {
      state.player.block += chorus;
      state.player.law += Math.floor(chorus / 3);
      showToast(`The chorus grants ${chorus} ward.`);
    }
  }

  function resolveLaw() {
    if (resolving || state.enemy.hp <= 0) return;
    resolving = true;
    state.lawsWritten += 1;
    const pattern = state.clause.map((card) => card.suit).join('>') || 'silence';
    const lawName = generateLawName();
    if (!ledger.laws[pattern]) ledger.laws[pattern] = { name: lawName, count: 0 };
    ledger.laws[pattern].count += 1;
    saveLedger();

    const coherent = state.futures.filter((future) => futureCoherent(future));
    if (coherent.length === 0) {
      showToast('PARADOX: no violent future remains coherent.');
      floatText('PARADOX', 'var(--gold)');
      damageEnemy(12 + state.player.law * 2, 'temple');
      gainBlock(5 + state.player.mercy * 2);
      sound.paradox();
      if (state.enemy.hp <= 0) {
        setTimeout(winEncounter, 700 / state.animationPace);
      } else {
        setTimeout(() => nextTurn(false), 850 / state.animationPace);
      }
      return;
    }

    const weighted = [];
    coherent.forEach((future) => {
      const weight = Math.max(1, 7 - future.turnPower / 3);
      for (let i = 0; i < Math.round(weight); i++) weighted.push(future);
    });
    const chosen = pick(weighted.length ? weighted : coherent);
    renderSpectrum(chosen.id);
    showToast(`${chosen.name} actualizes.`);
    setTimeout(() => {
      enactFuture(chosen);
      if (state.player.hp <= 0) loseRun();
      else if (state.enemy.hp <= 0) winEncounter();
      else setTimeout(() => nextTurn(false), 650 / state.animationPace);
    }, 620 / state.animationPace);
  }

  function enactFuture(future) {
    const effect = future.effect;
    const force = Math.max(0, (effect.damage || 0) + state.turn - 1 - state.enemy.softened);
    if (force) hurtPlayer(force);
    if (effect.heal) healEnemy(effect.heal + Math.floor(state.turn / 2));
    if (effect.enemyBlock) {
      state.enemy.block += effect.enemyBlock;
      floatText(`+${effect.enemyBlock} CROWN`, SUITS.temple.color);
    }
    if (effect.discard && state.hand.length) {
      const removed = state.hand.splice(Math.floor(Math.random() * state.hand.length), 1)[0];
      state.discard.push(removed);
      showToast(`${CARDS[removed.id].name} is scattered.`);
    }
    if (effect.curse) {
      const curse = makeCard('heart-withdrawn');
      curse.id = 'silence';
      curse.suit = 'temple';
      state.discard.push(curse);
      showToast('A silence enters the discard.');
    }
    if (effect.unrot) {
      const candidates = state.runDeck.filter((card) => card.rot > 0);
      if (candidates.length) {
        const target = candidates.reduce((best, card) => card.rot > best.rot ? card : best, candidates[0]);
        target.rot -= 1;
        for (const zone of [state.hand, state.drawPile, state.discard, state.clause]) {
          const copy = zone.find((card) => card.uid === target.uid);
          if (copy) copy.rot = target.rot;
        }
        showToast(`${CARDS[target.id].name} is made younger.`);
      }
    }
    render();
  }

  function generateLawName() {
    if (!state.clause.length) return 'The Law of Silence';
    const first = SUITS[state.clause[0].suit].name;
    const last = SUITS[state.clause[state.clause.length - 1].suit].name;
    const distinct = new Set(state.clause.map((c) => c.suit)).size;
    const prefixes = {
      HEART: ['Sovereign', 'Red', 'Inward'],
      LOVE: ['Attending', 'Merciful', 'Luminous'],
      POWER: ['Fermented', 'Turning', 'Mortal'],
      TEMPLE: ['Blue', 'Hermetic', 'Legislative']
    };
    const nouns = {
      HEART: ['Self', 'Blood', 'Origin'],
      LOVE: ['Witness', 'Dream', 'Mercy'],
      POWER: ['Change', 'Rot', 'Bifurcation'],
      TEMPLE: ['Temple', 'Grammar', 'Horizon']
    };
    const prefix = prefixes[first][state.lawsWritten % prefixes[first].length];
    const noun = nouns[last][(state.turn + distinct) % nouns[last].length];
    return distinct === 4 ? `The Open Crown of ${noun}` : `The ${prefix} ${noun}`;
  }

  function damageEnemy(amount, suit = 'heart') {
    amount = Math.max(0, Math.round(amount + state.player.strength + state.enemy.mark));
    if (amount <= 0) return;
    const absorbed = Math.min(state.enemy.block, amount);
    state.enemy.block -= absorbed;
    const dealt = amount - absorbed;
    state.enemy.hp = clamp(state.enemy.hp - dealt, 0, state.enemy.maxHp);
    if (state.enemy.mark > 0) state.enemy.mark = Math.max(0, state.enemy.mark - 1);
    floatText(`−${dealt}`, SUITS[suit]?.color || '#fff');
    hurtEnemyVisual();
    sound.hit(Math.min(1, dealt / 15));
  }

  function healEnemy(amount) {
    const actual = Math.min(amount, state.enemy.maxHp - state.enemy.hp);
    state.enemy.hp += actual;
    if (actual) floatText(`+${actual}`, SUITS.love.color);
  }

  function hurtPlayer(amount, direct = false) {
    amount = Math.max(0, Math.round(amount));
    if (!direct) {
      const absorbed = Math.min(state.player.block, amount);
      state.player.block -= absorbed;
      amount -= absorbed;
    }
    if (amount > 0) {
      state.player.hp = clamp(state.player.hp - amount, 0, state.player.maxHp);
      state.lastHpLoss = amount;
      screenFlash(SUITS.heart.color);
      floatText(`SELF −${amount}`, SUITS.heart.color, 34);
      sound.hurt();
    }
  }

  function healPlayer(amount) {
    const actual = Math.min(Math.round(amount), state.player.maxHp - state.player.hp);
    state.player.hp += actual;
    if (actual) floatText(`SELF +${actual}`, SUITS.love.color, 30);
  }

  function gainBlock(amount) {
    state.player.block += Math.max(0, Math.round(amount));
  }

  function countFermented() {
    return state.runDeck.filter((card) => card.rot >= 3).length;
  }

  function winEncounter() {
    if (resolving && state.enemy.hp > 0) return;
    resolving = true;
    state.enemy.hp = 0;
    render();
    burstForSuit(state.encounterIndex === 2 ? 'heart' : 'love', 90);
    sound.victory();
    if (state.encounterIndex >= ENCOUNTERS.length - 1) {
      ledger.victories += 1;
      saveLedger();
      setTimeout(showEnding, 900 / state.animationPace);
    } else {
      setTimeout(showRewards, 750 / state.animationPace);
    }
  }

  function loseRun() {
    resolving = true;
    $('#endingScreen').classList.add('active');
    $('#endingScreen .eyebrow').textContent = 'THE SELF WITHDRAWS';
    $('#endingScreen h2').textContent = 'This world closes.';
    $('#endingCopy').textContent = 'The Living Ledger keeps the laws you discovered. The next self does not begin from nothing.';
    renderEndingStats();
  }

  function showEnding() {
    $('#endingScreen').classList.add('active');
    $('#endingScreen .eyebrow').textContent = 'THE CROWN REMAINS OPEN';
    $('#endingScreen h2').textContent = 'You legislated outward.';
    $('#endingCopy').textContent = 'The Star-Devourer was not slain. You wrote a world in which her hunger could no longer complete itself.';
    renderEndingStats();
  }

  function renderEndingStats() {
    $('#endingStats').innerHTML = `
      <div><strong>${state.lawsWritten}</strong><span>LAWS WRITTEN</span></div>
      <div><strong>${state.futuresDenied}</strong><span>FUTURES DENIED</span></div>
      <div><strong>${countFermented()}</strong><span>GESTURES FERMENTED</span></div>`;
  }

  function showRewards() {
    const options = shuffle(REWARD_POOL.filter((id) => !state.runDeck.some((c) => c.id === id))).slice(0, 3);
    while (options.length < 3) options.push(...shuffle(REWARD_POOL).slice(0, 3 - options.length));
    $('#rewardCards').innerHTML = options.map((id) => cardMarkup(makeCard(id), true)).join('');
    $('#rewardCards').querySelectorAll('.card').forEach((el) => {
      el.addEventListener('click', () => chooseReward(el.dataset.cardId));
    });
    $('#rewardScreen').classList.add('active');
  }

  function chooseReward(id) {
    state.runDeck.push(makeCard(id));
    $('#rewardScreen').classList.remove('active');
    startEncounter(state.encounterIndex + 1);
  }

  function restResolve() {
    if (resolving) return;
    if (!state.clause.length) {
      gainBlock(3);
      showToast('Silence gathers 3 ward.');
    }
    resolveLaw();
  }

  function undo() {
    if (!history.length || resolving) return;
    restoreSnapshot(history.pop());
    showToast('The last gesture returns to possibility.');
  }

  function render() {
    if (!state) return;
    renderStats();
    renderEnemy();
    renderSpectrum();
    renderClause();
    renderHand();
    renderPrecedents();
    renderCodex();
  }

  function renderStats() {
    $('#playerHpText').textContent = `${state.player.hp} / ${state.player.maxHp}`;
    $('#playerHpBar').style.width = `${state.player.hp / state.player.maxHp * 100}%`;
    $('#blockText').textContent = state.player.block;
    $('#energyText').textContent = state.player.energy;
    $('#precedentText').textContent = Object.values(state.precedents).reduce((a, b) => a + b, 0);
    $('#lawText').textContent = state.player.law;
    $('#deckText').textContent = `DRAW ${state.drawPile.length} · DISCARD ${state.discard.length}`;
    $('#paceText').textContent = `${state.animationPace}×`;
  }

  function renderEnemy() {
    $('#enemyKind').textContent = state.enemy.kind;
    $('#enemyName').textContent = state.enemy.name;
    $('#enemyHpText').textContent = `${state.enemy.hp} / ${state.enemy.maxHp}`;
    $('#enemyHpBar').style.width = `${state.enemy.hp / state.enemy.maxHp * 100}%`;
    $('#enemySigil').className = `enemy-sigil ${state.enemy.className}`;
    const statuses = [];
    if (state.enemy.block) statuses.push(`<span class="status-chip" style="color:${SUITS.temple.color}">CROWN ${state.enemy.block}</span>`);
    if (state.enemy.mark) statuses.push(`<span class="status-chip" style="color:${SUITS.love.color}">WITNESSED ${state.enemy.mark}</span>`);
    if (state.enemy.softened) statuses.push(`<span class="status-chip" style="color:${SUITS.love.color}">MERCY −${state.enemy.softened}</span>`);
    $('#enemyStatus').innerHTML = statuses.join('');
  }

  function renderSpectrum(chosenId = null) {
    const coherentCount = state.futures.filter((future) => futureCoherent(future)).length;
    $('#spectrumHint').textContent = coherentCount === 0
      ? 'No future is permitted. A paradox is forming.'
      : `${coherentCount} of ${state.futures.length} futures remain coherent.`;
    $('#spectrum').innerHTML = state.futures.map((future) => {
      const coherent = futureCoherent(future);
      const force = Math.max(0, future.turnPower - state.enemy.softened);
      return `<article class="future ${coherent ? '' : 'impossible'} ${chosenId === future.id ? 'chosen' : ''}">
        <span class="future-power">${force}</span>
        <h4>${future.name}</h4>
        <p>${future.copy}</p>
      </article>`;
    }).join('');
  }

  function renderClause() {
    const slots = $$('.clause-slot');
    slots.forEach((slot, index) => {
      const card = state.clause[index];
      if (!card) {
        slot.className = 'clause-slot';
        slot.style.removeProperty('--suit');
        slot.innerHTML = `<span>${['I', 'II', 'III', 'IV'][index]}</span>`;
      } else {
        const def = CARDS[card.id] || { name: 'Silence' };
        slot.className = 'clause-slot filled';
        slot.style.setProperty('--suit', SUITS[card.suit].color);
        slot.innerHTML = `<span class="mini-glyph">${SUITS[card.suit].glyph}</span><span class="mini-name">${def.name}</span>`;
      }
    });
    $('#lawName').textContent = state.clause.length ? generateLawName() : 'An unwritten law';
    $('#undoButton').disabled = !history.length || resolving;
    $('#restButton').disabled = resolving;
    if (!state.clause.length) $('#pairMessage').textContent = 'Choose the first gesture.';
  }

  function renderHand() {
    $('#hand').innerHTML = state.hand.map((card) => cardMarkup(card)).join('');
    $('#hand').querySelectorAll('.card').forEach((el, index) => {
      const card = state.hand.find((c) => c.uid === el.dataset.uid);
      const canPlay = card && cardCanPlay(card);
      el.disabled = !canPlay;
      if (!canPlay && card && state.clause.length && state.clause.at(-1).suit === card.suit) el.classList.add('invalid');
      el.style.animationDelay = `${index * 35}ms`;
      el.addEventListener('click', () => playCard(el.dataset.uid));
    });
  }

  function cardMarkup(card, reward = false) {
    const def = CARDS[card.id] || {
      name: 'Silence', suit: card.suit || 'temple', kind: 'ABSENCE',
      copy: 'Costs one breath. Nothing answers.'
    };
    const suit = SUITS[def.suit];
    const rotDots = [0, 1, 2].map((i) => `<i class="${card.rot > i ? 'full' : ''}"></i>`).join('');
    return `<button class="card ${card.rot >= 3 ? 'fermented' : ''}" data-uid="${card.uid}" data-card-id="${card.id}" style="--suit:${suit.color}" ${reward ? '' : ''}>
      <div class="card-top"><span class="card-glyph">${suit.glyph}</span><span class="card-cost">1</span></div>
      <h4>${def.name}</h4>
      <div class="card-kind">${suit.name} · ${def.kind}</div>
      <p class="card-copy">${def.copy}</p>
      <div class="card-footer"><span class="rot">${rotDots}</span><span class="ferment-label">${card.rot >= 3 ? 'TRANSFORMED' : `ROT ${card.rot}/3`}</span></div>
    </button>`;
  }

  function renderPrecedents() {
    const entries = Object.entries(state.precedents).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      $('#precedentList').innerHTML = '<div class="empty-copy">Repeat a relation and the world will remember it.</div>';
      return;
    }
    $('#precedentList').innerHTML = entries.map(([key, count]) => {
      const [a, b] = key.split('>');
      const pair = PAIRS[key];
      return `<article class="precedent">
        <span class="precedent-glyph" style="color:${SUITS[a].color};background:linear-gradient(135deg,${SUITS[a].color}22,${SUITS[b].color}22)">${SUITS[a].glyph}${SUITS[b].glyph}</span>
        <div><h4>${pair.name}</h4><p>${pair.copy}</p></div><strong>×${count}</strong>
      </article>`;
    }).join('');
  }

  function renderCodex() {
    if (!state) return;
    const lawEntries = Object.entries(ledger.laws).sort((a, b) => b[1].count - a[1].count);
    const suitEntries = Object.entries(SUITS).map(([key, suit]) => `
      <article class="codex-entry"><h3 style="color:${suit.color}">${suit.glyph} ${suit.name}</h3><p>${suit.concept}. In a law, direction matters: ${suit.name} before another color is not the same relation as ${suit.name} after it.</p></article>`).join('');
    const laws = lawEntries.length ? lawEntries.slice(0, 8).map(([pattern, law]) => `
      <article class="codex-entry"><h3>${law.name} ×${law.count}</h3><p>${pattern.split('>').map((s) => SUITS[s]?.name || s).join(' → ')}</p></article>`).join('') : '<article class="codex-entry"><h3>No laws recorded</h3><p>The ledger is patient.</p></article>';
    $('#codexBody').innerHTML = suitEntries + laws;
  }

  function updateRunline() {
    $$('.run-node').forEach((node, index) => {
      node.classList.toggle('active', index === state.encounterIndex);
      node.classList.toggle('done', index < state.encounterIndex);
    });
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800 / (state?.animationPace || 1));
  }

  function floatText(text, color, top = 46) {
    const el = document.createElement('span');
    el.className = 'float-text';
    el.style.color = color;
    el.style.top = `${top}%`;
    el.textContent = text;
    $('#floatingLayer').appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function hurtEnemyVisual() {
    const sigil = $('#enemySigil');
    sigil.classList.add('hurt');
    setTimeout(() => sigil.classList.remove('hurt'), 160);
  }

  function screenFlash(color) {
    document.body.animate([
      { boxShadow: `inset 0 0 0 0 ${color}00` },
      { boxShadow: `inset 0 0 120px 15px ${color}55` },
      { boxShadow: `inset 0 0 0 0 ${color}00` }
    ], { duration: 340, easing: 'ease-out' });
  }

  function pulseInvalid(suit) {
    document.documentElement.animate([
      { filter: 'none' },
      { filter: `drop-shadow(0 0 5px ${SUITS[suit].color})` },
      { filter: 'none' }
    ], { duration: 260 });
  }

  // -------------------------------------------------------------------------
  // Generative world renderer. No image assets: every frame is born from law.
  // -------------------------------------------------------------------------
  const canvas = $('#world');
  const ctx = canvas.getContext('2d', { alpha: false });
  let W = 0, H = 0, DPR = 1, t = 0;
  let pointer = { x: 0, y: 0 };
  let stars = [];
  let particles = [];
  let latticeSeed = [];

  function resizeCanvas() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    stars = Array.from({ length: Math.round(W * H / 8000) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + .2, phase: Math.random() * Math.PI * 2,
      c: pick(Object.values(SUITS)).color
    }));
    latticeSeed = Array.from({ length: 46 }, (_, i) => ({
      a: Math.random() * Math.PI * 2,
      r: 80 + Math.random() * Math.min(W, H) * .34,
      q: i % 4
    }));
  }

  function burstForSuit(suit, count = 20) {
    const color = SUITS[suit].color;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.push({
        x: W * .5 + (Math.random() - .5) * 120,
        y: H * .42 + (Math.random() - .5) * 90,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 1,
        decay: .012 + Math.random() * .025,
        size: 1 + Math.random() * 3,
        color
      });
    }
    if (particles.length > 450) particles.splice(0, particles.length - 450);
  }

  function drawWorld(now) {
    const pace = state?.animationPace || 1;
    t += .008 * pace;
    const cx = W * .5 + pointer.x * 9;
    const cy = H * .42 + pointer.y * 7;

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .78);
    bg.addColorStop(0, '#071018');
    bg.addColorStop(.33, '#02070b');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'screen';
    for (const star of stars) {
      const flicker = .18 + .45 * (Math.sin(t * 2 + star.phase) * .5 + .5);
      ctx.globalAlpha = flicker;
      ctx.fillStyle = star.c;
      ctx.beginPath();
      ctx.arc(star.x + pointer.x * star.r * 2, star.y + pointer.y * star.r * 2, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * .035);
    ctx.lineWidth = .55;
    for (let i = 0; i < latticeSeed.length; i++) {
      const p = latticeSeed[i];
      const next = latticeSeed[(i * 7 + 9) % latticeSeed.length];
      const x1 = Math.cos(p.a + Math.sin(t + i) * .04) * p.r;
      const y1 = Math.sin(p.a + Math.cos(t * .7 + i) * .04) * p.r * .72;
      const x2 = Math.cos(next.a) * next.r;
      const y2 = Math.sin(next.a) * next.r * .72;
      const suit = Object.values(SUITS)[p.q];
      ctx.strokeStyle = suit.color;
      ctx.globalAlpha = .035 + (state?.player.law || 0) * .003;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(0, 0, x2, y2);
      ctx.stroke();
    }
    ctx.restore();

    const orbit = Math.min(W, H) * .19;
    Object.entries(SUITS).forEach(([key, suit], i) => {
      const a = t * (.32 + i * .035) + i * Math.PI / 2;
      const x = cx + Math.cos(a) * orbit * (1 + i * .08);
      const y = cy + Math.sin(a * 1.14) * orbit * .55;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 46);
      g.addColorStop(0, suit.color + 'd0');
      g.addColorStop(.08, suit.color + '88');
      g.addColorStop(1, suit.color + '00');
      ctx.globalAlpha = .55;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, 46, 0, Math.PI * 2);
      ctx.fill();
    });

    particles.forEach((p) => {
      p.x += p.vx * pace;
      p.y += p.vy * pace;
      p.vx *= .985;
      p.vy *= .985;
      p.life -= p.decay * pace;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.01, p.size * p.life), 0, Math.PI * 2);
      ctx.fill();
    });
    particles = particles.filter((p) => p.life > 0);

    if (state?.enemy) {
      const hpRatio = state.enemy.hp / state.enemy.maxHp;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * .08);
      ctx.strokeStyle = state.enemy.className === 'bride' ? SUITS.love.color : state.enemy.className === 'devourer' ? SUITS.heart.color : SUITS.power.color;
      ctx.globalAlpha = .06 + (1 - hpRatio) * .08;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        const r = 105 + i * 18 + Math.sin(t * 2 + i) * 7;
        ctx.arc(0, 0, r, i * .4, i * .4 + Math.PI * (1.1 + hpRatio * .5));
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(drawWorld);
  }

  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / Math.max(1, W) - .5) * 2;
    pointer.y = (event.clientY / Math.max(1, H) - .5) * 2;
  });
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(drawWorld);

  // -------------------------------------------------------------------------
  // Generative audio: restrained tones mapped to the four semantic colors.
  // -------------------------------------------------------------------------
  const sound = {
    ctx: null,
    master: null,
    enabled: false,
    drone: null,
    ensure() {
      if (this.ctx) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = .085;
      this.master.connect(this.ctx.destination);
    },
    toggle() {
      this.ensure();
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.ctx.resume();
        this.startDrone();
      } else this.stopDrone();
      $('#audioButton').textContent = this.enabled ? '◉' : '◌';
      showToast(this.enabled ? 'The world is audible.' : 'The world is silent.');
    },
    tone(freq, duration = .24, type = 'sine', gain = .15, delay = 0) {
      if (!this.enabled) return;
      this.ensure();
      const at = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, at);
      amp.gain.setValueAtTime(0, at);
      amp.gain.linearRampToValueAtTime(gain, at + .018);
      amp.gain.exponentialRampToValueAtTime(.0001, at + duration);
      osc.connect(amp); amp.connect(this.master);
      osc.start(at); osc.stop(at + duration + .03);
    },
    playSuit(suit) {
      const f = { heart: 110, love: 220, power: 164.81, temple: 293.66 }[suit];
      this.tone(f, .28, suit === 'power' ? 'triangle' : 'sine', .14);
      this.tone(f * 2, .19, 'sine', .06, .04);
    },
    hit(force) { this.tone(70 + force * 45, .16, 'sawtooth', .08); },
    hurt() { this.tone(82.41, .35, 'sawtooth', .1); },
    chorus() { [220, 277.18, 329.63, 440].forEach((f, i) => this.tone(f, .65, 'sine', .055, i * .045)); },
    paradox() { [293.66, 220, 164.81, 110].forEach((f, i) => this.tone(f, .8, 'triangle', .09, i * .07)); },
    victory() { [110, 164.81, 220, 293.66, 440].forEach((f, i) => this.tone(f, 1.1, 'sine', .07, i * .08)); },
    startDrone() {
      if (this.drone || !this.enabled) return;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'sine'; osc.frequency.value = 55;
      filter.type = 'lowpass'; filter.frequency.value = 240;
      amp.gain.value = .035;
      osc.connect(filter); filter.connect(amp); amp.connect(this.master);
      osc.start();
      this.drone = { osc, amp };
    },
    stopDrone() {
      if (!this.drone) return;
      try { this.drone.osc.stop(); } catch (_) {}
      this.drone = null;
    }
  };

  // -------------------------------------------------------------------------
  // Controls.
  // -------------------------------------------------------------------------
  $('#beginButton').addEventListener('click', () => {
    $('#titleScreen').classList.remove('active');
    createRun();
    sound.ensure();
  });
  $('#newRunButton').addEventListener('click', () => {
    $('#endingScreen').classList.remove('active');
    $('#rewardScreen').classList.remove('active');
    createRun();
  });
  $('#againButton').addEventListener('click', () => {
    $('#endingScreen').classList.remove('active');
    createRun();
  });
  $('#restButton').addEventListener('click', restResolve);
  $('#undoButton').addEventListener('click', undo);
  $('#audioButton').addEventListener('click', () => sound.toggle());
  $('#codexButton').addEventListener('click', () => { renderCodex(); $('#codexDialog').showModal(); });
  $('#closeCodex').addEventListener('click', () => $('#codexDialog').close());
  $('#paceInput').addEventListener('input', (event) => {
    if (!state) return;
    state.animationPace = Number(event.target.value);
    document.documentElement.style.setProperty('--pace', state.animationPace);
    $('#paceText').textContent = `${state.animationPace}×`;
  });
  window.addEventListener('keydown', (event) => {
    if (!state || $('#titleScreen').classList.contains('active')) return;
    if (event.key >= '1' && event.key <= '9') {
      const card = state.hand[Number(event.key) - 1];
      if (card) playCard(card.uid);
    }
    if (event.key.toLowerCase() === 'r') restResolve();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault(); undo();
    }
  });

})();

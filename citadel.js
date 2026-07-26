(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const ids = ['cinder', 'orchard', 'seafoam', 'moth', 'sill', 'vial'];

  const RELICS = {
    cinder: { name: 'CINDER', type: 'ember', label: 'EMBER', mark: '✦', lead: 'sets a direction', receive: 'the heat chooses its path' },
    orchard: { name: 'ORCHARD', type: 'garden', label: 'GARDEN', mark: '❋', lead: 'gathers what can grow', receive: 'the roots take hold' },
    seafoam: { name: 'SEAFOAM', type: 'tide', label: 'TIDE', mark: '◌', lead: 'holds a moving reflection', receive: 'the shore remembers it' },
    moth: { name: 'MOTH', type: 'moth', label: 'CHANGE', mark: '⌁', lead: 'loosens the sealed form', receive: 'the wing opens' },
    sill: { name: 'SILL', type: 'threshold', label: 'THRESHOLD', mark: '⌑', lead: 'makes an entrance exact', receive: 'the passage admits it' },
    vial: { name: 'VIAL', type: 'vessel', label: 'VESSEL', mark: '◇', lead: 'keeps the volatile thing', receive: 'the vessel carries it onward' }
  };

  const PAIR_NAMES = {
    'cinder>orchard': 'THE BURNING GRAFT', 'cinder>seafoam': 'THE GLASS SPARK', 'cinder>moth': 'THE LIT WING', 'cinder>sill': 'THE HINGE OF FIRE', 'cinder>vial': 'THE RED TINCTURE',
    'orchard>cinder': 'THE ROOTED FLAME', 'orchard>seafoam': 'THE SALT GARDEN', 'orchard>moth': 'THE POLLEN VEIL', 'orchard>sill': 'THE GREEN DOOR', 'orchard>vial': 'THE GRAFTED VIAL',
    'seafoam>cinder': 'THE TIDE\'S EMBER', 'seafoam>orchard': 'THE REFLECTING GROVE', 'seafoam>moth': 'THE WET WING', 'seafoam>sill': 'THE LOW HORIZON', 'seafoam>vial': 'THE BRINE VESSEL',
    'moth>cinder': 'THE ASHEN CHRYSALIS', 'moth>orchard': 'THE NIGHT BLOOM', 'moth>seafoam': 'THE LUNAR FOAM', 'moth>sill': 'THE OPEN WING', 'moth>vial': 'THE CAPTURED DUST',
    'sill>cinder': 'THE WARM THRESHOLD', 'sill>orchard': 'THE GARDEN GATE', 'sill>seafoam': 'THE TIDELINE', 'sill>moth': 'THE CHANGING DOOR', 'sill>vial': 'THE SEALED PASSAGE',
    'vial>cinder': 'THE KEPT SPARK', 'vial>orchard': 'THE ROOT TONIC', 'vial>seafoam': 'THE BLUE ELIXIR', 'vial>moth': 'THE WINGED DISTILLATE', 'vial>sill': 'THE STORED KEY'
  };

  const storageKey = 'citadel-seafoam-compounds-v2';
  const remembered = (() => { try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; } })();
  const state = { deck: [], hand: [], discard: [], chosen: [], discoveries: new Set(remembered), cycle: 1, last: null, working: false };

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function art(kind) {
    const frames = {
      cinder: `<rect width="400" height="560" fill="#260d16"/><path d="M-40 483 116 60l35 438L244 30l43 462L440 71" fill="none" stroke="#b6384b" stroke-width="18" opacity=".44"/><circle cx="201" cy="237" r="128" fill="#d13b49" opacity=".18"/><path d="M200 92c52 76 65 143 29 198 55-35 71-95 48-146 49 76 46 166-9 230-22 26-44 40-67 55-29-23-52-44-70-72-42-67-38-146 12-215-18 61-6 113 38 148-36-63-27-129 19-198Z" fill="#ff8664"/><path d="M200 132c22 55 26 105 3 145 30-33 37-76 22-113 24 53 17 112-25 157-25-43-31-91-15-135-7 31-3 59 15 82-13-41-12-86 3-136Z" fill="#ffd4a0"/><path d="M74 424 200 454 326 424M91 449l109 46 109-46" fill="none" stroke="#ffb078" stroke-width="2"/><g fill="#ffe6b6"><circle cx="93" cy="126" r="2"/><circle cx="315" cy="177" r="3"/><circle cx="331" cy="355" r="2"/><circle cx="69" cy="342" r="2"/></g>`,
      orchard: `<rect width="400" height="560" fill="#08221e"/><path d="M0 434c84-107 112-189 129-390M400 471C304 320 291 160 279 30" fill="none" stroke="#1f775d" stroke-width="26" opacity=".5"/><path d="M201 510V73M201 218 91 142M201 258l116-85M201 335 75 277M201 377l125-60" fill="none" stroke="#bcdf9f" stroke-width="4"/><path d="M194 221c-81-2-115-39-106-84 68 4 105 38 106 84ZM207 260c77-4 111-40 105-86-66 5-104 39-105 86ZM194 339c-89-12-120-52-104-95 68 13 103 48 104 95ZM207 382c80-13 111-48 99-94-64 12-99 47-99 94Z" fill="#64bb7d"/><path d="M200 78 242 147 200 216 158 147Z" fill="#e6efb8" opacity=".78"/><g fill="#e9f4c3"><circle cx="107" cy="99" r="4"/><circle cx="301" cy="113" r="3"/><circle cx="58" cy="401" r="3"/><circle cx="338" cy="424" r="4"/><circle cx="273" cy="477" r="2"/></g>`,
      seafoam: `<rect width="400" height="560" fill="#09232d"/><circle cx="200" cy="194" r="102" fill="#bbebe0" opacity=".24"/><circle cx="200" cy="194" r="61" fill="#d9f0d7" opacity=".8"/><circle cx="200" cy="194" r="47" fill="#6cadbc" opacity=".48"/><path d="M-20 299c63-54 102 31 165-10 55-35 98-85 277-10v91c-59-48-118 37-189 0-83-43-129 44-253-5Z" fill="#86d0cb" opacity=".72"/><path d="M-20 374c65-49 116 36 185-9 70-46 105-87 257-6v88c-83-45-124 45-204 4-84-42-143 31-238-7Z" fill="#347f91"/><path d="M-12 434c78-52 127 37 206-7 67-38 116-69 218-6" fill="none" stroke="#c7f0dc" stroke-width="5"/><path d="M53 181c46-104 250-109 295 6" fill="none" stroke="#bcefe1" stroke-width="3"/><g fill="#e2f3dd"><circle cx="76" cy="104" r="3"/><circle cx="320" cy="109" r="2"/><circle cx="321" cy="483" r="3"/></g>`,
      moth: `<rect width="400" height="560" fill="#26132d"/><circle cx="200" cy="273" r="154" fill="#b94caa" opacity=".17"/><path d="M192 272c-73-161-159-153-160-41 0 90 63 152 151 98Z" fill="#de98d0"/><path d="M208 272c73-161 159-153 160-41 0 90-63 152-151 98Z" fill="#b56ab8"/><path d="M192 277c-54-96-112-94-117-29 0 53 42 87 110 54M208 277c54-96 112-94 117-29 0 53-42 87-110 54" fill="none" stroke="#f7d5dc" stroke-width="4"/><path d="M200 154c-25 66-25 160 0 245 25-85 25-179 0-245Z" fill="#f7e8bd"/><path d="M200 156v244M91 193c44 21 74 54 101 99M309 193c-44 21-74 54-101 99M99 337c45-19 72-15 98 8M301 337c-45-19-72-15-98 8" fill="none" stroke="#f8d8e8" stroke-width="3"/><path d="M62 93q138-79 276 0M62 460q138 79 276 0" fill="none" stroke="#eeb6df" stroke-width="3"/><g fill="#ffe7d9"><circle cx="70" cy="136" r="2"/><circle cx="334" cy="148" r="3"/><circle cx="75" cy="432" r="3"/><circle cx="322" cy="424" r="2"/></g>`,
      sill: `<rect width="400" height="560" fill="#101936"/><path d="M0 0h400v560H0z" fill="url(#none)"/><path d="M58 489V202C58 66 342 66 342 202v287" fill="#081221" stroke="#9eb7ee" stroke-width="5"/><path d="M93 489V207c0-95 214-95 214 0v282" fill="#162852"/><path d="M200 108c60 90 60 213 0 323-60-110-60-233 0-323Z" fill="#edf0c8"/><path d="M200 144c31 66 31 164 0 248-31-84-31-182 0-248Z" fill="#90b2e7"/><path d="M35 490 200 35l165 455M60 490h280" fill="none" stroke="#b7c8f5" stroke-width="3"/><path d="M93 208h214M58 489h284" stroke="#92a9e2" stroke-width="2"/><g fill="#e6edcf"><circle cx="200" cy="56" r="4"/><circle cx="53" cy="485" r="3"/><circle cx="347" cy="485" r="3"/></g>`,
      vial: `<rect width="400" height="560" fill="#0c2725"/><path d="M72 0h72v102c0 24-12 46-30 59-36 27-54 61-54 119v151c0 59 48 107 107 107h66c59 0 107-48 107-107V280c0-58-18-92-54-119-18-13-30-35-30-59V0h72" fill="#173d39" stroke="#e0c88e" stroke-width="4"/><path d="M139 0h122v109c0 34 15 63 42 82 26 20 37 49 37 90v150c0 59-48 107-107 107h-66c-59 0-107-48-107-107V281c0-41 11-70 37-90 27-19 42-48 42-82Z" fill="#89caa2" opacity=".3"/><path d="M124 85h152M105 270c52-41 124 36 192-8v169c0 35-28 63-63 63h-68c-35 0-63-28-63-63V270Z" fill="#82c8aa" opacity=".6"/><path d="M200 194 251 285 200 376 149 285Z" fill="#d88ccc"/><path d="M200 222 230 285 200 348 170 285Z" fill="none" stroke="#f0e5b1" stroke-width="3"/><g fill="#f5e7b0"><circle cx="116" cy="327" r="4"/><circle cx="279" cy="360" r="3"/><circle cx="145" cy="410" r="3"/><circle cx="252" cy="445" r="4"/></g>`
    };
    return `<svg viewBox="0 0 400 560" role="img" aria-label="${RELICS[kind].name} illustration">${frames[kind]}</svg>`;
  }

  function mini(id) {
    const relic = RELICS[id];
    return `<span class="altar-mini type-${relic.type}"><span class="mini-inner">${art(id)}</span></span>`;
  }

  function card(id, dealt = false) {
    const relic = RELICS[id];
    const position = state.chosen.indexOf(id);
    const selected = position >= 0;
    return `<button class="tarot-card type-${relic.type}${selected ? ' selected' : ''}${dealt ? ' dealt' : ''}" data-id="${id}" role="listitem" aria-pressed="${selected}" aria-label="${relic.name}, ${relic.label}">
      <span class="card-frame"><span class="card-inner"><span class="card-head"><span>${relic.label}</span><i>${relic.mark}</i></span><span class="card-art">${art(id)}</span><span class="card-foot"><b>${relic.name}</b><small>${selected ? position === 0 ? 'FIRST RELIC' : 'SECOND RELIC' : 'READY'}</small></span></span></span>
      ${selected ? `<span class="order-badge">${position + 1}</span>` : ''}
    </button>`;
  }

  function drawToHand() {
    const dealt = [];
    let reshuffled = false;
    while (state.hand.length < 4) {
      if (!state.deck.length) {
        if (!state.discard.length) break;
        state.deck = shuffle(state.discard);
        state.discard = [];
        state.cycle += 1;
        reshuffled = true;
      }
      const id = state.deck.pop();
      state.hand.push(id);
      dealt.push(id);
    }
    return { dealt, reshuffled };
  }

  function roman(number) { return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][number - 1] || String(number); }

  function compound(first, second) {
    const a = RELICS[first];
    const b = RELICS[second];
    return {
      first,
      second,
      name: PAIR_NAMES[`${first}>${second}`],
      copy: `${a.name} ${a.lead}; ${b.name.toLowerCase()} receives it, and ${b.receive}.`,
      key: `${first}>${second}`
    };
  }

  function renderAltar() {
    const cards = $('#altarCards');
    const message = $('#altarMessage');
    const picked = state.chosen;
    cards.className = `altar-cards${picked.length === 2 ? ' altar-pair' : ''}`;
    cards.innerHTML = picked.map(mini).join('');
    if (state.last && !picked.length) {
      message.className = 'altar-message result-reveal';
      message.innerHTML = `<span class="result-rule"></span><h1>${state.last.name}</h1><p><b>${RELICS[state.last.first].name}</b> → <b>${RELICS[state.last.second].name}</b><br>${state.last.copy}</p>`;
    } else if (!picked.length) {
      message.className = 'altar-message';
      message.innerHTML = `<div class="prompt-mark">✦</div><h1>Choose two relics.</h1><p>Every ordering makes a distinct compound. Nothing is consumed; the deck turns.</p>`;
    } else if (picked.length === 1) {
      message.className = 'altar-message';
      message.innerHTML = `<h1>${RELICS[picked[0]].name} leads.</h1><p>Choose the relic that receives it.</p>`;
    } else {
      const result = compound(picked[0], picked[1]);
      message.className = 'altar-message';
      message.innerHTML = `<span class="result-rule"></span><h1>${result.name}</h1><p>Ready to combine: ${RELICS[picked[0]].name} → ${RELICS[picked[1]].name}</p>`;
    }
  }

  function renderPiles() {
    const top = state.discard[state.discard.length - 1];
    $('#deckPile').className = `pile deck-pile${state.deck.length ? '' : ' empty'}`;
    $('#deckPile').innerHTML = '<span class="pile-top"></span>';
    $('#discardPile').className = `pile discard-pile${top ? '' : ' empty'}${top ? ` type-${RELICS[top].type}` : ''}`;
    $('#discardPile').innerHTML = `<span class="pile-top">${top ? `<span>${art(top)}</span>` : ''}</span>`;
    $('#deckCount').textContent = state.deck.length;
    $('#discardCount').textContent = state.discard.length;
    $('#cycleCount').textContent = roman(state.cycle);
    $('#discoveryCount').textContent = state.discoveries.size;
  }

  function render({ dealt = [], reshuffled = false } = {}) {
    $('#hand').innerHTML = state.hand.map(id => card(id, dealt.includes(id))).join('');
    $$('#hand .tarot-card').forEach(element => {
      element.addEventListener('click', () => choose(element.dataset.id));
      element.addEventListener('pointermove', tilt);
      element.addEventListener('pointerleave', resetTilt);
    });
    renderAltar();
    renderPiles();
    $('#clearButton').disabled = !state.chosen.length || state.working;
    $('#combineButton').disabled = state.chosen.length !== 2 || state.working;
    if (reshuffled) {
      $('#deckPile').classList.add('reshuffling');
      toast('The discard becomes the next deck.');
    }
  }

  function tilt(event) {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--tilt-x', `${((event.clientY - box.top) / box.height - .5) * -6}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - .5) * 6}deg`);
  }

  function resetTilt(event) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  }

  function choose(id) {
    if (state.working) return;
    const oldPosition = state.chosen.indexOf(id);
    if (oldPosition === 0) state.chosen = [];
    else if (oldPosition === 1) state.chosen = [state.chosen[0]];
    else if (state.chosen.length < 2) state.chosen.push(id);
    else state.chosen = [id];
    render();
  }

  async function flyCards(selected) {
    const destination = $('#altar').getBoundingClientRect();
    const flights = selected.map((id, index) => {
      const source = $(`.tarot-card[data-id="${id}"]`);
      if (!source) return null;
      const from = source.getBoundingClientRect();
      const clone = source.cloneNode(true);
      clone.classList.remove('selected', 'dealt');
      clone.classList.add('flight');
      clone.style.left = `${from.left}px`;
      clone.style.top = `${from.top}px`;
      clone.style.width = `${from.width}px`;
      clone.style.height = `${from.height}px`;
      const targetX = destination.left + destination.width * (index ? .58 : .42) - from.left - from.width / 2;
      const targetY = destination.top + destination.height * .39 - from.top - from.height / 2;
      clone.style.setProperty('--flight-x', `${targetX}px`);
      clone.style.setProperty('--flight-y', `${targetY}px`);
      clone.style.setProperty('--flight-r', `${index ? 5 : -5}deg`);
      document.body.appendChild(clone);
      requestAnimationFrame(() => clone.classList.add('fly-in'));
      return clone;
    }).filter(Boolean);
    await wait(540);
    flights.forEach(flight => flight.remove());
  }

  async function combine() {
    if (state.working || state.chosen.length !== 2) return;
    state.working = true;
    const selected = [...state.chosen];
    await flyCards(selected);
    state.last = compound(selected[0], selected[1]);
    state.discoveries.add(state.last.key);
    try { localStorage.setItem(storageKey, JSON.stringify([...state.discoveries])); } catch { /* storage is optional */ }
    state.hand = state.hand.filter(id => !selected.includes(id));
    state.discard.push(...selected);
    state.chosen = [];
    const replenished = drawToHand();
    state.working = false;
    render(replenished);
    toast(`${state.last.name} entered the ledger.`);
  }

  function toast(text) {
    const element = $('#toast');
    element.textContent = text;
    element.classList.add('show');
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => element.classList.remove('show'), 2200);
  }

  function reset() {
    state.deck = shuffle(ids);
    state.hand = [];
    state.discard = [];
    state.chosen = [];
    state.cycle = 1;
    state.last = null;
    state.working = false;
    drawToHand();
    render();
    toast('A fresh six-card cycle begins.');
  }

  $('#clearButton').addEventListener('click', () => { state.chosen = []; render(); });
  $('#combineButton').addEventListener('click', combine);
  $('#resetButton').addEventListener('click', reset);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { state.chosen = []; render(); }
    const index = Number(event.key) - 1;
    if (index >= 0 && index < state.hand.length) choose(state.hand[index]);
    if (event.key === 'Enter') combine();
  });

  reset();
})();

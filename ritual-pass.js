(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const art = {
    '☉': `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
      <circle class="ghost color" cx="60" cy="62" r="43"/>
      <g class="faint line"><path d="M60 6v22M60 96v28M5 62h25M90 62h25M21 23l18 18M81 83l18 18M99 23 81 41M39 83l-18 18"/></g>
      <circle class="bright paper" cx="60" cy="62" r="21"/>
      <circle class="ink" cx="60" cy="62" r="12"/>
      <path class="skin" d="M46 142q14-24 28 0l5 31H41z"/>
      <path class="color" d="M42 143q18-19 36 0l-4 19H46z"/>
      <circle class="skin" cx="60" cy="126" r="13"/>
      <path class="color" d="M47 126q3-18 13-18t13 18q-8-7-13-7t-13 7z"/>
      <path class="fine bright" d="M52 127q3-2 6 0M62 127q3-2 6 0M56 134q4 3 8 0"/>
      <path class="heavy bright" d="M28 174q32-19 64 0"/>
    </svg>`,
    '◉': `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
      <path class="ghost color" d="M4 74q56-66 112 0Q60 140 4 74z"/>
      <path class="line bright" d="M8 74q52-53 104 0Q60 126 8 74z"/>
      <ellipse class="paper" cx="60" cy="74" rx="31" ry="27"/>
      <ellipse class="color" cx="60" cy="74" rx="18" ry="23"/>
      <ellipse class="ink" cx="60" cy="76" rx="8" ry="14"/>
      <circle class="paper" cx="65" cy="68" r="4"/>
      <g class="soft line"><path d="M23 47 12 28M34 38 30 14M48 33 47 8M72 33 74 8M86 39 92 15M98 48l12-18"/></g>
      <path class="skin" d="M44 144q16-26 32 0l3 29H41z"/>
      <circle class="skin" cx="60" cy="127" r="13"/>
      <path class="color" d="M45 128q3-22 15-22t15 22q-10-9-15-9t-15 9z"/>
      <path class="fine bright" d="M52 127q3-2 6 0M62 127q3-2 6 0M56 134q4 3 8 0"/>
      <path class="line soft" d="M33 176q27-12 54 0M25 162q-9-9-3-21M95 162q9-9 3-21"/>
    </svg>`,
    '◇': `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
      <path class="ghost color" d="M60 8 110 50 92 174 60 186 28 174 10 50z"/>
      <path class="heavy bright" d="M60 14 102 52 86 166 60 178 34 166 18 52z"/>
      <path class="paper faint" d="M60 25 90 57 79 153 60 163 41 153 30 57z"/>
      <path class="line bright" d="M60 25 90 57 79 153 60 163 41 153 30 57z"/>
      <path class="color soft" d="M44 137q16-27 32 0l3 19H41z"/>
      <circle class="paper" cx="60" cy="119" r="13"/>
      <path class="color" d="M45 120q2-21 15-21t15 21q-9-8-15-8t-15 8z"/>
      <path class="fine bright" d="M52 119q3-2 6 0M62 119q3-2 6 0M56 126q4 3 8 0"/>
      <path class="line soft" d="M37 83q23-18 46 0M42 72q18-11 36 0"/>
      <circle class="color" cx="60" cy="58" r="7"/>
      <path class="fine bright" d="M60 48v20M50 58h20"/>
    </svg>`,
    '♨': `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
      <path class="ghost color" d="M61 5q-31 39-8 65-23-8-31 24-10 43 38 61 48-18 38-61-8-32-31-24 23-26-6-65z"/>
      <path class="color bright" d="M61 22q-19 29-3 48-20-5-28 23-7 30 30 47 37-17 30-47-8-28-28-23 16-19-1-48z"/>
      <path class="paper" d="M60 63q-11 17-1 29-14-3-18 15-4 18 19 27 23-9 19-27-4-18-18-15 10-12-1-29z"/>
      <circle class="skin" cx="60" cy="119" r="12"/>
      <path class="ink" d="M46 120q2-20 14-20t14 20q-8-8-14-8t-14 8z"/>
      <path class="ink" d="M44 137q16-21 32 0l4 35H40z"/>
      <path class="fine color" d="M52 119q3-2 6 0M62 119q3-2 6 0M56 126q4 3 8 0"/>
      <path class="heavy bright" d="M25 175q35-17 70 0"/>
    </svg>`,
    '❈': `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
      <path class="ghost color" d="M4 185Q18 90 60 17q42 73 56 168z"/>
      <path class="heavy soft" d="M13 181Q24 91 60 31q36 60 47 150"/>
      <path class="line bright" d="M60 31v139M60 72Q38 58 25 72M60 91q23-20 40-8M60 121q-27-22-43-5M60 145q22-18 42-5"/>
      <g class="color bright"><circle cx="25" cy="72" r="8"/><circle cx="100" cy="83" r="9"/><circle cx="17" cy="116" r="7"/><circle cx="102" cy="140" r="8"/></g>
      <g class="paper"><circle cx="25" cy="72" r="3"/><circle cx="100" cy="83" r="3"/><circle cx="17" cy="116" r="3"/><circle cx="102" cy="140" r="3"/></g>
      <circle class="skin" cx="60" cy="112" r="13"/>
      <path class="color" d="M45 113q3-21 15-21t15 21q-9-8-15-8t-15 8z"/>
      <path class="skin" d="M44 131q16-24 32 0l4 39H40z"/>
      <path class="fine bright" d="M52 111q3-2 6 0M62 111q3-2 6 0M56 118q4 3 8 0"/>
    </svg>`,
    '♧': `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
      <circle class="ghost color" cx="73" cy="48" r="38"/>
      <path class="line bright" d="M95 25q-35 2-44 34-6 23 12 41 12 12 4 31-11 25-44 36 45 12 72-13-20-2-28-13 18-22 11-43-8-23 17-43z"/>
      <path class="paper" d="M91 32q-25 8-30 30-5 20 11 32 13 10 8 27-4 13-18 24 24-8 31-26-12-8-14-20-3-17 12-31 12-11 0-36z"/>
      <path class="color" d="M88 35 98 22l4 18z"/>
      <circle class="ink" cx="84" cy="47" r="3"/>
      <path class="skin" d="M37 148q14-22 28 0l3 25H34z"/>
      <circle class="skin" cx="51" cy="133" r="12"/>
      <path class="color" d="M37 134q2-19 14-19t14 19q-8-7-14-7t-14 7z"/>
      <path class="fine bright" d="M44 132q3-2 5 0M53 132q3-2 5 0M47 139q4 3 8 0"/>
      <path class="line soft" d="M20 176q40-14 80 0"/>
    </svg>`,
    'ϟ': `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
      <path class="ghost color" d="M60 18 11 50l34 35-31 55 46-22 46 22-31-55 34-35z"/>
      <path class="color soft" d="M60 30 23 54l28 29-25 42 34-17 34 17-25-42 28-29z"/>
      <path class="line bright" d="M60 29v128M60 51 28 41M60 51 92 41M60 88 22 75M60 88l38-13M60 120l-33 25M60 120l33 25"/>
      <path class="paper" d="M60 44q-13 25-1 43-16-5-23 16-5 21 24 34 29-13 24-34-7-21-23-16 12-18-1-43z"/>
      <circle class="skin" cx="60" cy="111" r="12"/>
      <path class="color" d="M46 112q2-20 14-20t14 20q-8-8-14-8t-14 8z"/>
      <path class="ink" d="M43 129q17-22 34 0l4 36H39z"/>
      <path class="fine bright" d="M52 110q3-2 6 0M62 110q3-2 6 0M56 117q4 3 8 0"/>
      <circle class="paper" cx="23" cy="53" r="4"/><circle class="paper" cx="97" cy="53" r="4"/>
    </svg>`
  };

  const genericArt = `<svg class="card-art" viewBox="0 0 120 190" aria-hidden="true">
    <path class="ghost color" d="M60 9 109 48 94 157 60 183 26 157 11 48z"/>
    <path class="line bright" d="M60 18 100 52 86 151 60 172 34 151 20 52z"/>
    <circle class="faint color" cx="60" cy="72" r="31"/>
    <circle class="paper" cx="60" cy="72" r="14"/>
    <circle class="ink" cx="60" cy="72" r="6"/>
    <path class="skin" d="M44 139q16-24 32 0l4 34H40z"/>
    <circle class="skin" cx="60" cy="122" r="13"/>
    <path class="color" d="M45 123q2-21 15-21t15 21q-9-8-15-8t-15 8z"/>
    <path class="fine bright" d="M52 121q3-2 6 0M62 121q3-2 6 0M56 128q4 3 8 0"/>
  </svg>`;

  let orderedSelection = [];

  function ritualizeCard(card) {
    if (card.dataset.ritualized === 'true') return;

    const glyphNode = $('.card-glyph', card);
    if (!glyphNode) return;

    const glyph = glyphNode.textContent.trim();
    const gloss = $('.card-gloss', card)?.textContent.trim() || 'Symbol';
    const karmaNode = $('.card-karma', card);
    const karma = Number((karmaNode?.textContent.match(/\d+/) || [0])[0]);

    card.dataset.ritualized = 'true';
    card.setAttribute('aria-label', gloss);
    card.removeAttribute('title');

    glyphNode.className = 'card-art-wrap';
    glyphNode.innerHTML = art[glyph] || genericArt;

    if (karmaNode) {
      karmaNode.innerHTML = Array.from({ length: Math.min(karma, 7) }, () => '<i class="karma-bead"></i>').join('');
      karmaNode.setAttribute('aria-label', karma ? `${karma} karmic weight` : 'No karmic weight');
    }
  }

  function syncSelectionOrder() {
    const hand = $('#hand');
    if (!hand) return;

    const cards = $$('.tarot-card', hand);
    const selected = cards.filter(card => card.classList.contains('selected'));
    const selectedIds = new Set(selected.map(card => card.dataset.uid));

    orderedSelection = orderedSelection.filter(uid => selectedIds.has(uid));
    selected.forEach(card => {
      if (!orderedSelection.includes(card.dataset.uid)) orderedSelection.push(card.dataset.uid);
    });
    if (!selected.length) orderedSelection = [];
    orderedSelection = orderedSelection.slice(0, 2);

    cards.forEach(card => card.classList.remove('selected-first', 'selected-second'));
    orderedSelection.forEach((uid, index) => {
      const card = cards.find(candidate => candidate.dataset.uid === uid);
      card?.classList.add(index === 0 ? 'selected-first' : 'selected-second');
    });
  }

  function veilRiteText() {
    const name = $('#riteName');
    const result = $('#riteResult');
    if (!name || !result) return;

    const current = name.textContent.trim();
    let veiled = current;
    if (current === 'CHOOSE THE ACTING SYMBOL') veiled = '';
    if (current.endsWith(' WILL ACT')) veiled = current.slice(0, -9);
    if (name.textContent !== veiled) name.textContent = veiled;
    if (result.textContent) result.textContent = '';
  }

  function refreshCards(root = document) {
    $$('.tarot-card', root).forEach(ritualizeCard);
    syncSelectionOrder();
    veilRiteText();
  }

  function observeSurface(element) {
    if (!element) return;
    new MutationObserver(() => queueMicrotask(() => refreshCards(element))).observe(element, {
      childList: true,
      subtree: true
    });
  }

  observeSurface($('#hand'));
  observeSurface($('#rewardChoices'));

  const riteName = $('#riteName');
  const riteResult = $('#riteResult');
  if (riteName) new MutationObserver(veilRiteText).observe(riteName, { childList: true, characterData: true, subtree: true });
  if (riteResult) new MutationObserver(veilRiteText).observe(riteResult, { childList: true, characterData: true, subtree: true });

  refreshCards();
})();

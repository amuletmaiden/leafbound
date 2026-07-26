(() => {
  'use strict';

  const hand = document.querySelector('#hand');
  let order = [];

  function markOrder() {
    if (!hand) return;
    const cards = [...hand.querySelectorAll('.tarot-card')];
    const selected = cards.filter(card => card.classList.contains('selected'));
    const ids = new Set(selected.map(card => card.dataset.uid));

    order = order.filter(id => ids.has(id));
    selected.forEach(card => {
      if (!order.includes(card.dataset.uid)) order.push(card.dataset.uid);
    });
    order = order.slice(0, 2);

    cards.forEach(card => card.classList.remove('selected-first', 'selected-second'));
    order.forEach((id, index) => {
      const card = cards.find(candidate => candidate.dataset.uid === id);
      card?.classList.add(index === 0 ? 'selected-first' : 'selected-second');
    });
  }

  if (hand) new MutationObserver(markOrder).observe(hand, { childList: true, subtree: true });
  markOrder();
})();

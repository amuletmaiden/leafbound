(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const sum = (v) => v.r + v.g + v.p + v.b;
  const COLORS = { r: '#ff2037', g: '#00ff76', p: '#ff00ff', b: '#00c8ff' };
  const COLOR_NAMES = { r: 'HEART', g: 'LOVE', p: 'POWER', b: 'TEMPLE' };
  const GODDESSES = {
    r: { name: 'Ruby', title: 'THE SOVEREIGN SELF', hair: '#e51e3b', hair2: '#7b0718', eye: '#ffd4cc', accent: COLORS.r, style: 'flare' },
    g: { name: 'Garden Maid', title: 'THE BELOVED WITNESS', hair: '#42e891', hair2: '#087c4b', eye: '#072d20', accent: COLORS.g, style: 'braid' },
    p: { name: 'Moth Princess', title: 'THE BEAUTIFUL CHANGE', hair: '#ff71e8', hair2: '#9c168e', eye: '#4d083f', accent: COLORS.p, style: 'wing' },
    b: { name: 'Swan', title: 'THE STILL LAW', hair: '#73ddff', hair2: '#12679b', eye: '#062e4c', accent: COLORS.b, style: 'veil' }
  };
  const ZONES = {
    hands: { glyph: '✋', name: 'Hands', copy: 'Immediate agency. Same-zone rites become decisive.' },
    eyes: { glyph: '◉', name: 'Eyes', copy: 'Sight and revelation. The target field becomes easier to read.' },
    lips: { glyph: '⌒', name: 'Lips', copy: 'Invocation. Repeated pair-laws gather force.' },
    pockets: { glyph: '▱', name: 'Pockets', copy: 'Delay and storage. Surplus can be kept rather than destroyed.' }
  };

  const CARD_LIBRARY = {
    sun:      { glyph: '☉', name: 'Sun', color: 'r', pips: 2, zone: 'hands', vector: {r:7,g:1,p:0,b:2}, copy: 'Declares the acting self and produces motion.' },
    eye:      { glyph: '◉', name: 'Green Eye', color: 'g', pips: 2, zone: 'eyes', vector: {r:0,g:7,p:1,b:2}, copy: 'Sees connection, living deficits, and concealed desire.' },
    mirror:   { glyph: '◇', name: 'Mirror', color: 'b', pips: 2, zone: 'eyes', vector: {r:1,g:1,p:1,b:7}, copy: 'Makes structure visible and lets a condition compare itself.' },
    flame:    { glyph: '♨', name: 'Flame', color: 'r', pips: 3, zone: 'lips', vector: {r:8,g:0,p:2,b:0}, copy: 'A spoken motion. Strong, bright, and difficult to retract.' },
    garden:   { glyph: '❈', name: 'Garden', color: 'g', pips: 3, zone: 'hands', vector: {r:1,g:8,p:1,b:0}, copy: 'Fills absence with a living relation.' },
    swan:     { glyph: '♧', name: 'Swan', color: 'b', pips: 3, zone: 'pockets', vector: {r:0,g:2,p:0,b:8}, copy: 'Carries law inside softness and stores stillness.' },
    moth:     { glyph: 'ϟ', name: 'Moth', color: 'p', pips: 2, zone: 'lips', vector: {r:1,g:2,p:7,b:0}, copy: 'Turns what is already happening into another kind of happening.' },
    ruby:     { glyph: '◆', name: 'Ruby', color: 'r', pips: 1, zone: 'pockets', vector: {r:6,g:0,p:2,b:2}, copy: 'A portable self. It can be kept, lost, or incarnated.' },
    birds:    { glyph: '⋀⋁', name: 'Birds', color: 'g', split: 'p', pips: 2, zone: 'lips', vector: {r:0,g:5,p:4,b:1}, copy: 'Connection taking flight through transformation.' },
    moon:     { glyph: '☾', name: 'Moon', color: 'b', split: 'p', pips: 2, zone: 'eyes', vector: {r:0,g:1,p:4,b:5}, copy: 'Law seen indirectly: a mirror that changes what it reflects.' },
    tower:    { glyph: '⌂', name: 'Tower', color: 'b', split: 'r', pips: 3, zone: 'hands', vector: {r:3,g:0,p:0,b:7}, copy: 'Motion made architectural. A force that remembers its boundary.' },
    butterfly:{ glyph: '⋈', name: 'Butterfly', color: 'p', split: 'g', pips: 3, zone: 'hands', vector: {r:0,g:4,p:6,b:0}, copy: 'A completed metamorphosis that can seed another.' },
    lips:     { glyph: '⌒', name: 'Lips', color: 'p', split: 'r', pips: 1, zone: 'lips', vector: {r:3,g:0,p:5,b:2}, copy: 'The transformation caused by saying a thing aloud.' },
    pocket:   { glyph: '▱', name: 'Pocket', color: 'b', split: 'g', pips: 1, zone: 'pockets', vector: {r:0,g:3,p:1,b:6}, copy: 'A hidden place where an unfinished operation may persist.' },
    nova:     { glyph: '✺', name: 'Nova', color: 'r', split: 'p', pips: 3, zone: 'eyes', vector: {r:5,g:0,p:5,b:0}, copy: 'A self transformed so quickly that it becomes an event.' },
    meridian: { glyph: '⊕', name: 'Meridian', color: 'g', split: 'b', pips: 2, zone: 'pockets', vector: {r:0,g:5,p:0,b:5}, copy: 'A two-sided path: green on one face, blue on the other.' },
    seed:     { glyph: '•', name: 'Seed', color: 'g', pips: 1, zone: 'pockets', vector: {r:1,g:6,p:2,b:1}, copy: 'Small magnitude, enormous futurity.' },
    eclipse:  { glyph: '◑', name: 'Eclipse', color: 'p', split: 'b', pips: 3, zone: 'eyes', vector: {r:1,g:0,p:5,b:4}, copy: 'A transformation whose law is temporarily hidden.' }
  };

  const STARTER = ['sun','eye','mirror','flame','garden','swan','moth']; // RGBRGBP
  const REWARDS = ['ruby','birds','moon','tower','butterfly','lips','pocket','nova','meridian','seed','eclipse'];

  const PAIRS = {
    rr:{ name:'RUBY ASCENDANT', girl:'The Ruby Queen', copy:'The self asserts the exact amount of motion it requires.' },
    rg:{ name:'THE AWAKENING GARDEN', girl:'Garden Ruby', copy:'Strength enters connection; what was dormant begins to answer.' },
    rp:{ name:'BLOOD FERMENTS', girl:'The Wine Princess', copy:'Motion becomes transformation without ceasing to be itself.' },
    rb:{ name:'THE SOVEREIGN CLAUSE', girl:'Tower Maiden', copy:'The self writes a boundary and makes force inhabitable.' },
    gr:{ name:'THE BELOVED SELF', girl:'Devoted Maid', copy:'Connection returns to the one who produced it.' },
    gg:{ name:'THE MAIDEN GARDEN', girl:'The Verdant Maid', copy:'Life fills the deepest absence first.' },
    gp:{ name:'BIRDS OF CHANGE', girl:'Butterfly Shepherd', copy:'Growth accepts decay and leaves the old shape willingly.' },
    gb:{ name:'THE SIREN', girl:'Siren of the Green Moon', copy:'Connection travels through distance and draws the field toward desire.' },
    pr:{ name:'A NEW HEART', girl:'Nova Princess', copy:'Decay completes its circuit and returns as a changed self.' },
    pg:{ name:'THE CHRYSALIS', girl:'Moth Gardener', copy:'Transformation is kept alive long enough to bloom later.' },
    pp:{ name:'BEAUTIFUL ROT', girl:'The Pink Empress', copy:'Surplus and deficit exchange masks.' },
    pb:{ name:'THE SEALED WING', girl:'Veiled Moth', copy:'Change is stored beneath law instead of being lost.' },
    br:{ name:'LAW INCARNATE', girl:'Ruby Swan', copy:'Stillness grows a body and enters the world as motion.' },
    bg:{ name:'THE MERMAID', girl:'Mermaid of the Quiet Garden', copy:'Law becomes habitable and smooths every violent difference.' },
    bp:{ name:'LAW UNWRITES ITSELF', girl:'Mirror Moth', copy:'The most excessive certainty is permitted to disappear.' },
    bb:{ name:'THE ROUND HORIZON', girl:'The White Swan', copy:'The field becomes still enough to resemble its desire.' }
  };

  const OMENS = [
    {id:'orchard',glyph:'☉',name:'Solar Orchard',copy:'Red and green rites carry farther.', apply(ctx){ if ('rg'.includes(ctx.a) || 'rg'.includes(ctx.b)) ctx.mag *= 1.18; }},
    {id:'moonpool',glyph:'☾',name:'Moon Pool',copy:'The second symbol speaks more loudly.', apply(ctx){ ctx.mag += spec(ctx.second).pips * .65; }},
    {id:'mothweather',glyph:'ϟ',name:'Moth Weather',copy:'Karma leaves a pink residue.', apply(ctx){ ctx.residue.p += (ctx.first.karma + ctx.second.karma) * .8; }},
    {id:'swanstair',glyph:'♧',name:'Swan Stair',copy:'Matching places arrest the next drift.', apply(ctx){ if(spec(ctx.first).zone === spec(ctx.second).zone) ctx.freeze = true; }},
    {id:'birdchoir',glyph:'⋀⋁',name:'Bird Choir',copy:'A repeated pair-law gathers a chorus.', apply(ctx){ ctx.mag += Math.min(4, (state.pairHistory[ctx.key] || 0) * 1.2); }},
    {id:'pocketeclipse',glyph:'◑',name:'Pocket Eclipse',copy:'What was kept returns with doubled gravity.', apply(ctx){ ctx.pocketMultiplier = 2; }},
    {id:'glassgarden',glyph:'◇',name:'Glass Garden',copy:'The emptiest color receives a small mercy.', after(){ nudgeLowestDeficit(2.5); }},
    {id:'silenttower',glyph:'⌂',name:'Silent Tower',copy:'Blue operations hold their shape.', apply(ctx){ if(ctx.a==='b') ctx.freeze = true; }}
  ];

  const ENCOUNTERS = [
    { name:'The Sleeping Gardener', epithet:'Her garden dreams without remembering her.', palette:['#4ff0a0','#104d3d','#00c8ff'], hair:'#55e3a4', hair2:'#0c6a4d', eye:'#143b31', style:'braid', current:{r:8,g:22,p:13,b:57}, target:{r:24,g:48,p:12,b:16}, drift:{r:-1,g:-3,p:2,b:2}, turns:7, threshold:.84, stable:2 },
    { name:'The Glass Swan', epithet:'Perfect law has made her too beautiful to move.', palette:['#9deaff','#3a83bd','#e5faff'], hair:'#98e7ff', hair2:'#24699d', eye:'#063d63', style:'veil', current:{r:7,g:12,p:8,b:73}, target:{r:21,g:31,p:19,b:29}, drift:{r:-2,g:-1,p:0,b:3}, turns:7, threshold:.86, stable:2 },
    { name:'The Moth Princess', epithet:'Every possibility is hatching at once.', palette:['#ff85e8','#89167f','#fff0fb'], hair:'#ff82ea', hair2:'#941579', eye:'#550744', style:'wing', current:{r:11,g:18,p:62,b:9}, target:{r:16,g:35,p:34,b:15}, drift:{r:0,g:-2,p:4,b:-2}, turns:8, threshold:.87, stable:2 },
    { name:'The Star-Devouring Goddess', epithet:'Near her, processes do not stop. They un-happen.', palette:['#ff3155','#ff3ee8','#61dfff'], hair:'#ef4b91', hair2:'#50105d', eye:'#170624', style:'crown', current:{r:44,g:4,p:39,b:13}, target:{r:25,g:25,p:25,b:25}, drift:{r:3,g:-3,p:3,b:-3}, turns:9, threshold:.9, stable:3 }
  ];

  const ledger = loadLedger();
  const state = {
    screen:'title', encounter:0, turn:1, current:null, target:null, omens:[], activeOmen:0,
    deck:[], draw:[], discard:[], hand:[], selected:[], pocket:[], stable:0, pairHistory:{},
    resolved:0, sound:false, gloss:false, animating:false, runKarma:0, lastRite:null, freezeNext:false,
    delayed:[], discoveries:new Set(ledger.discoveries || [])
  };

  function loadLedger(){
    try { return JSON.parse(localStorage.getItem('leafbound-ledger-v2') || '{}'); } catch { return {}; }
  }
  function saveLedger(){
    const next={runs:(ledger.runs||0),victories:(ledger.victories||0),discoveries:[...state.discoveries]};
    try { localStorage.setItem('leafbound-ledger-v2',JSON.stringify(next)); } catch {}
    Object.assign(ledger,next);
  }
  function makeCard(id){ return { uid:cryptoRandom(), id, karma:0 }; }
  function cryptoRandom(){ return Math.random().toString(36).slice(2,9); }
  function spec(card){ return CARD_LIBRARY[card.id]; }
  function dominant(v){ return Object.keys(v).sort((a,b)=>v[b]-v[a])[0]; }
  function normalize(v){
    const t=Math.max(.001,sum(v)); const out={};
    for(const k of 'rgpb') out[k]=clamp(v[k]*100/t,0,100);
    return out;
  }
  function cloneVec(v){ return {r:v.r,g:v.g,p:v.p,b:v.b}; }
  function errors(){ const e={}; for(const k of 'rgpb') e[k]=state.target[k]-state.current[k]; return e; }
  function harmony(){
    let distance=0; for(const k of 'rgpb') distance+=Math.abs(state.current[k]-state.target[k]);
    return clamp(1-distance/150,0,1);
  }
  function nudge(k, delta){ state.current[k]=Math.max(0,state.current[k]+delta); state.current=normalize(state.current); }
  function transfer(from,to,amount){
    const a=Math.min(amount,Math.max(0,state.current[from]-1));
    state.current[from]-=a; state.current[to]+=a; state.current=normalize(state.current);
  }
  function mostDeficit(except=[]){ const e=errors(); return Object.keys(e).filter(k=>!except.includes(k)).sort((a,b)=>e[b]-e[a])[0]; }
  function mostSurplus(except=[]){ const e=errors(); return Object.keys(e).filter(k=>!except.includes(k)).sort((a,b)=>e[a]-e[b])[0]; }
  function moveToward(k,amount){ const d=state.target[k]-state.current[k]; nudge(k, Math.sign(d)*Math.min(Math.abs(d),amount)); }
  function moveAllToward(amount){
    for(const k of 'rgpb') state.current[k]+=clamp(state.target[k]-state.current[k],-amount,amount);
    state.current=normalize(state.current);
  }
  function nudgeLowestDeficit(amount){ const k=mostDeficit(); if(errors()[k]>0) moveToward(k,amount); }

  function pairOperation(ctx){
    const {key,mag}=ctx;
    const e=errors();
    switch(key){
      case 'rr': moveToward('r',mag*1.25); moveToward(mostSurplus(['r']),mag*.45); break;
      case 'rg': moveToward('r',mag*.65); moveToward('g',mag); transfer(mostSurplus(['r','g']),'g',mag*.35); break;
      case 'rp': {
        const needR=e.r>e.p?'r':'p', other=needR==='r'?'p':'r';
        transfer(other,needR,mag*.75); moveToward(needR,mag*.45); ctx.residue.p+=1.5; break;
      }
      case 'rb': moveToward('r',mag*.8); moveToward('b',mag*.8); ctx.freeze=true; break;
      case 'gr': moveToward('g',mag*.85); moveToward('r',mag*.85); balancePair('g','r',mag*.35); break;
      case 'gg': moveToward(mostDeficit(),mag*1.05); moveToward(mostDeficit(),mag*.55); break;
      case 'gp': swapIfBetter('g','p',mag); moveToward('g',mag*.45); moveToward('p',mag*.45); break;
      case 'gb': moveAllToward(mag*.48); moveToward('g',mag*.35); moveToward('b',mag*.35); break;
      case 'pr': transfer(mostSurplus(['r']),'r',mag*.8); moveToward('r',mag*.7); ctx.residue.r+=1; break;
      case 'pg': {
        const payload={r:0,g:mag*.75,p:-mag*.25,b:0,label:'chrysalis'};
        state.delayed.push(payload); moveToward('p',mag*.45); ctx.result='A chrysalis will open after the next rite.'; break;
      }
      case 'pp': invertLargestError(mag); invertLargestError(mag*.6); break;
      case 'pb': {
        const from=mostSurplus(); const to=mostDeficit(); const kept=Math.min(mag*.7,Math.max(0,state.current[from]-state.target[from]));
        if(kept>0){ state.current[from]-=kept; state.pocket.push({from,to,amount:kept,label:'sealed wing'}); state.current=normalize(state.current); ctx.result='A surplus has been folded into the pocket.'; }
        else moveToward('p',mag);
        break;
      }
      case 'br': transfer('b',mostDeficit(['b']),mag*.75); moveToward('r',mag*.5); break;
      case 'bg': moveAllToward(mag*.62); smoothExtremes(mag*.3); break;
      case 'bp': moveToward(mostSurplus(),mag*1.15); moveToward('p',mag*.35); break;
      case 'bb': moveAllToward(mag*.38); moveToward('b',mag*.65); ctx.freeze=true; break;
    }
    for(const k of 'rgpb') if(ctx.residue[k]) state.current[k]+=ctx.residue[k];
    state.current=normalize(state.current);
  }
  function balancePair(a,b,amount){
    const desiredDiff=state.target[a]-state.target[b], currentDiff=state.current[a]-state.current[b];
    const delta=clamp((desiredDiff-currentDiff)/2,-amount,amount);
    state.current[a]+=delta; state.current[b]-=delta; state.current=normalize(state.current);
  }
  function swapIfBetter(a,b,amount){
    const before=Math.abs(state.target[a]-state.current[a])+Math.abs(state.target[b]-state.current[b]);
    const take=Math.min(amount,Math.abs(state.current[a]-state.current[b])*.35);
    const trial=cloneVec(state.current); const dir=state.current[a]>state.current[b]?1:-1;
    trial[a]-=dir*take; trial[b]+=dir*take;
    const after=Math.abs(state.target[a]-trial[a])+Math.abs(state.target[b]-trial[b]);
    if(after<before) state.current=normalize(trial); else { moveToward(a,amount*.5); moveToward(b,amount*.5); }
  }
  function invertLargestError(amount){
    const from=mostSurplus(), to=mostDeficit();
    if(errors()[from]<0 && errors()[to]>0) transfer(from,to,amount*.75); else moveToward(to,amount*.6);
  }
  function smoothExtremes(amount){
    const hi=Object.keys(state.current).sort((a,b)=>state.current[b]-state.current[a])[0];
    const lo=Object.keys(state.current).sort((a,b)=>state.current[a]-state.current[b])[0];
    transfer(hi,lo,amount);
  }

  function startRun(){
    state.encounter=0; state.turn=1; state.resolved=0; state.runKarma=0; state.pairHistory={}; state.pocket=[]; state.delayed=[]; state.selected=[];
    state.deck=STARTER.map(makeCard); state.draw=[]; state.discard=[]; state.hand=[];
    showScreen('game'); startEncounter();
  }
  function startEncounter(){
    const encounter=ENCOUNTERS[state.encounter];
    state.turn=1; state.stable=0; state.current=cloneVec(encounter.current); state.target=cloneVec(encounter.target); state.activeOmen=0;
    state.omens=sample(OMENS,3); state.selected=[]; state.pocket=[]; state.delayed=[]; state.freezeNext=false;
    state.draw=weightedShuffle([...state.deck]); state.discard=[]; state.hand=[]; drawTo(5);
    renderAll();
  }
  function drawTo(n){ while(state.hand.length<n){ const c=drawOne(); if(!c) break; state.hand.push(c); } }
  function drawOne(){
    if(!state.draw.length){ if(!state.discard.length) return null; state.draw=weightedShuffle(state.discard.splice(0)); }
    return state.draw.shift();
  }
  function weightedShuffle(cards){
    const pool=[...cards], out=[];
    while(pool.length){
      const total=pool.reduce((t,c)=>t+1+c.karma*.35,0); let roll=Math.random()*total; let idx=0;
      for(;idx<pool.length;idx++){ roll-=1+pool[idx].karma*.35; if(roll<=0) break; }
      out.push(pool.splice(Math.min(idx,pool.length-1),1)[0]);
    }
    return out;
  }
  function sample(arr,n){ return [...arr].sort(()=>Math.random()-.5).slice(0,n); }

  function selectCard(uid){
    if(state.animating) return;
    const index=state.selected.indexOf(uid);
    if(index>=0) state.selected.splice(index,1);
    else if(state.selected.length<2) state.selected.push(uid);
    else { state.selected.shift(); state.selected.push(uid); }
    renderHand(); renderSyntax();
  }
  function undo(){ state.selected=[]; renderHand(); renderSyntax(); }
  async function invoke(){
    if(state.selected.length!==2 || state.animating) return;
    state.animating=true;
    const first=state.hand.find(c=>c.uid===state.selected[0]);
    const second=state.hand.find(c=>c.uid===state.selected[1]);
    const a=dominant(spec(first).vector), b=dominant(spec(second).vector), key=a+b;
    const pair=PAIRS[key];
    const omen=state.omens[state.activeOmen];
    const ctx={ first,second,a,b,key,mag:3+spec(first).pips+spec(second).pips+(first.karma>=3?1.5:0)+(second.karma>=3?1.5:0),residue:{r:0,g:0,p:0,b:0},freeze:false,pocketMultiplier:1,result:'' };
    omen.apply?.(ctx);
    if(spec(first).zone===spec(second).zone) ctx.mag+=1;
    if(spec(first).zone==='eyes') ctx.mag+=.4;
    if(spec(first).zone==='lips') ctx.mag+=(state.pairHistory[key]||0)*.35;
    pairOperation(ctx);
    releasePocket(ctx);
    state.pairHistory[key]=(state.pairHistory[key]||0)+1;
    state.discoveries.add(key); saveLedger();
    first.karma++; second.karma++; state.runKarma+=2;
    state.lastRite={key,first,second,pair};
    playRiteSound(a,b); animateRite(first,second,pair,ctx);
    renderAuras(); renderRoster(); updateHeader();
    await wait(850);
    const score=harmony();
    if(score>=ENCOUNTERS[state.encounter].threshold) state.stable++; else state.stable=0;
    renderProgress();
    if(state.stable>=ENCOUNTERS[state.encounter].stable){
      await wait(500); state.animating=false; resolveEncounter(); return;
    }
    const used=state.hand.filter(c=>state.selected.includes(c.uid));
    state.hand=state.hand.filter(c=>!state.selected.includes(c.uid));
    for(const c of used){
      if(c.karma>=5 && Math.random()<.45) state.draw.unshift(c); else state.discard.push(c);
    }
    state.selected=[];
    applyDelayed();
    if(!(ctx.freeze||state.freezeNext)) applyDrift(); else state.freezeNext=false;
    omen.after?.();
    state.turn++;
    state.activeOmen=(state.activeOmen+1)%state.omens.length;
    if(state.turn>ENCOUNTERS[state.encounter].turns){ state.animating=false; endRun(false); return; }
    drawTo(5); renderAll(); state.animating=false;
  }
  function releasePocket(ctx){
    if(!state.pocket.length) return;
    const item=state.pocket.shift(); const amount=item.amount*(ctx.pocketMultiplier||1);
    const need=state.target[item.to]-state.current[item.to];
    if(need>0) state.current[item.to]+=Math.min(need,amount); else state.current[item.from]+=amount*.35;
    state.current=normalize(state.current);
    ctx.result = ctx.result || `The pocket released ${item.label}.`;
  }
  function applyDelayed(){
    if(!state.delayed.length) return;
    const due=state.delayed.shift();
    for(const k of 'rgpb') state.current[k]+=due[k]||0;
    state.current=normalize(state.current); toast('The chrysalis opened.');
  }
  function applyDrift(){
    const encounter=ENCOUNTERS[state.encounter];
    for(const k of 'rgpb') state.current[k]+=encounter.drift[k]+(Math.random()-.5)*1.8;
    state.current=normalize(state.current);
  }
  function resolveEncounter(){
    state.resolved++; updateHeader();
    if(state.encounter>=ENCOUNTERS.length-1){ endRun(true); return; }
    openRewards();
  }
  function openRewards(){
    const owned=new Set(state.deck.map(c=>c.id));
    let pool=REWARDS.filter(id=>!owned.has(id)); if(pool.length<3) pool=REWARDS;
    const choices=sample(pool,3);
    $('#rewardChoices').innerHTML=choices.map(id=>cardHTML(makeCard(id),true)).join('');
    $$('#rewardChoices .tarot-card').forEach((el,i)=>el.addEventListener('click',()=>chooseReward(choices[i])));
    $('#rewardModal').classList.add('open');
  }
  function chooseReward(id){
    state.deck.push(makeCard(id));
    $('#rewardModal').classList.remove('open');
    state.encounter++; startEncounter();
  }
  function endRun(victory){
    ledger.runs=(ledger.runs||0)+1; if(victory) ledger.victories=(ledger.victories||0)+1; saveLedger();
    const profile=victory?{...GODDESSES.p,hair:'#ff579b',hair2:'#4d0b58',style:'crown'}:GODDESSES.b;
    $('#endPortrait').innerHTML=portraitSVG(profile,{full:true,halo:victory});
    $('#endKicker').textContent=victory?'THE READING COMPLETES':'THE RITE CLOSES';
    $('#endTitle').textContent=victory?'All four colors remain possible.':'The condition remains unresolved.';
    $('#endCopy').textContent=victory?'No one was defeated. The goddesses learned a new way for the world to continue.':'Nothing died. The field merely hardened before the symbols could discover the right relation.';
    $('#endStats').innerHTML=`<span><b>${state.resolved}</b><small>CONDITIONS</small></span><span><b>${state.runKarma}</b><small>KARMIC WEIGHT</small></span><span><b>${state.discoveries.size}</b><small>MANIFESTATIONS</small></span>`;
    $('#endModal').classList.add('open');
  }

  function renderAll(){
    const e=ENCOUNTERS[state.encounter];
    $('#encounterIndex').textContent=roman(state.encounter+1); $('#conditionName').textContent=e.name; $('#conditionEpithet').textContent=e.epithet;
    $('#conditionPortrait').innerHTML=portraitSVG({...e,accent:e.palette[0]},{full:true,halo:true});
    renderAuras(); renderProgress(); renderOmens(); renderHand(); renderSyntax(); renderRoster(); renderPocket(); updateHeader();
    $('#deckCount').textContent=state.draw.length; $('#discardCount').textContent=state.discard.length;
  }
  function renderAuras(){
    setAura($('#currentAura'),state.current); setAura($('#targetAura'),state.target);
  }
  function setAura(el,v){
    el.style.background=`conic-gradient(${COLORS.r} 0 ${v.r}%,${COLORS.g} ${v.r}% ${v.r+v.g}%,${COLORS.p} ${v.r+v.g}% ${v.r+v.g+v.p}%,${COLORS.b} ${v.r+v.g+v.p}% 100%)`;
  }
  function renderProgress(){
    const e=ENCOUNTERS[state.encounter], h=harmony();
    $('#harmonyText').textContent=`${Math.round(h*100)}%`; $('#harmonyFill').style.width=`${h*100}%`; $('#harmonyThreshold').style.left=`${e.threshold*100}%`;
    $('#stabilityPips').innerHTML=Array.from({length:e.stable},(_,i)=>`<i class="${i<state.stable?'filled':''}"></i>`).join('');
    $('#turnText').textContent=`${state.turn} / ${e.turns}`; $('#turnPips').innerHTML=Array.from({length:e.turns},(_,i)=>`<i class="${i<state.turn?'used':''}"></i>`).join('');
  }
  function renderOmens(){
    $('#omenRow').innerHTML=state.omens.map((o,i)=>`<div class="omen ${i===state.activeOmen?'active':''}"><div class="omen-glyph">${o.glyph}</div><div><b>${o.name}</b><small>${o.copy}</small></div></div>`).join('');
  }
  function renderHand(){
    $('#hand').innerHTML=state.hand.map(c=>cardHTML(c,false,state.selected.includes(c.uid))).join('');
    $$('#hand .tarot-card').forEach(el=>el.addEventListener('click',()=>selectCard(el.dataset.uid)));
    $('#undoButton').disabled=!state.selected.length; $('#invokeButton').disabled=state.selected.length!==2;
  }
  function cardHTML(card,reward=false,selected=false){
    const c=spec(card), split=c.split?`<div class="card-split" style="--split-color:${COLORS[c.split]}"></div>`:'';
    return `<button class="tarot-card ${selected?'selected':''} ${card.karma>=3?'awakened':''}" style="--card-color:${COLORS[c.color]}" data-uid="${card.uid}" title="${c.name}: ${c.copy}">
      ${split}<div class="card-inner"><div class="card-pips">${'<i></i>'.repeat(c.pips)}</div><div class="card-glyph">${c.glyph}</div><div class="card-gloss">${c.name}</div><div class="card-zone">${ZONES[c.zone].glyph}</div><div class="card-karma">${card.karma?`⌁${card.karma}`:''}</div></div></button>`;
  }
  function renderSyntax(){
    const cards=state.selected.map(uid=>state.hand.find(c=>c.uid===uid));
    fillSlot($('#actorSlot'),cards[0]); fillSlot($('#mediumSlot'),cards[1]);
    if(!cards.length){ $('#riteName').textContent='CHOOSE THE ACTING SYMBOL'; $('#riteResult').textContent=''; $('#manifestPortrait').innerHTML=''; $('#manifestPortrait').classList.remove('active'); }
    else if(cards.length===1){ const g=GODDESSES[dominant(spec(cards[0]).vector)]; $('#riteName').textContent=`${g.name.toUpperCase()} WILL ACT`; $('#riteResult').textContent='Choose what she acts on, with, or through.'; $('#manifestPortrait').innerHTML=portraitSVG(g,{full:true}); $('#manifestPortrait').classList.add('active'); }
    else { const a=dominant(spec(cards[0]).vector),b=dominant(spec(cards[1]).vector),pair=PAIRS[a+b]; $('#riteName').textContent=pair.name; $('#riteResult').textContent=pair.copy; $('#manifestPortrait').innerHTML=manifestSVG(a,b); $('#manifestPortrait').classList.add('active'); }
    $('#undoButton').disabled=!cards.length; $('#invokeButton').disabled=cards.length!==2;
  }
  function fillSlot(el,card){
    if(!card){ el.className='syntax-slot'; el.innerHTML=`<span>${el.id==='actorSlot'?'Ⅰ':'Ⅱ'}</span>`; return; }
    const c=spec(card); el.className='syntax-slot filled'; el.style.setProperty('--slot-color',COLORS[c.color]); el.innerHTML=`<span class="mini-symbol">${c.glyph}</span>`;
  }
  function renderRoster(){
    const active=state.selected.length?dominant(spec(state.hand.find(c=>c.uid===state.selected[0])).vector):null;
    $('#goddessRoster').innerHTML=Object.entries(GODDESSES).map(([k,g])=>`<div class="goddess-chip ${active===k?'active':''}" style="--goddess-color:${g.accent}">${portraitSVG(g,{bust:true})}<div><b>${g.name}</b><small>${g.title}</small></div></div>`).join('');
  }
  function renderPocket(){
    $('#pocketTray').innerHTML=`<div class="panel-kicker">POCKETS</div>`+(state.pocket.length?state.pocket.map(p=>`<div class="pocket-token"><b>▱</b><span>${p.label}<small> ${p.amount.toFixed(1)} weight</small></span></div>`).join(''):'<p>Nothing is being kept.</p>');
  }
  function updateHeader(){ $('#resolvedCount').textContent=state.resolved; $('#karmaCount').textContent=state.runKarma; $('#discoveryCount').textContent=state.discoveries.size; }
  function animateRite(first,second,pair,ctx){
    $('#riteName').textContent=pair.name; $('#riteResult').textContent=ctx.result||pair.copy; $('#manifestPortrait').innerHTML=manifestSVG(dominant(spec(first).vector),dominant(spec(second).vector)); $('#manifestPortrait').classList.add('active');
    const wake=$('#colorWake'); wake.innerHTML=''; const colors=[COLORS[spec(first).color],COLORS[spec(second).color]];
    for(let i=0;i<28;i++){ const p=document.createElement('i'); p.className='wake-particle'; p.style.background=colors[i%2]; p.style.left=`${48+Math.random()*4}%`; p.style.top=`${48+Math.random()*4}%`; p.style.setProperty('--x',`${(Math.random()-.5)*520}px`); p.style.setProperty('--y',`${(Math.random()-.5)*310}px`); p.style.animationDelay=`${Math.random()*.18}s`; wake.appendChild(p); }
  }

  function portraitSVG(profile,opt={}){
    const accent=profile.accent||profile.palette?.[0]||'#fff', hair=profile.hair||accent, hair2=profile.hair2||'#222', eye=profile.eye||'#222', style=profile.style||'flare';
    const backHair = style==='braid'
      ? `<path d="M73 78 Q45 105 55 222 Q69 246 88 225 L91 105Z" fill="${hair2}"/><path d="M187 78 Q215 105 205 222 Q191 246 172 225 L169 105Z" fill="${hair2}"/><path d="M62 139 Q25 172 51 240" fill="none" stroke="${hair}" stroke-width="18" stroke-linecap="round" stroke-dasharray="13 5"/>`
      : style==='wing'
      ? `<path d="M83 70 Q27 87 30 186 Q47 159 73 155 Q42 205 70 246 Q99 199 103 102Z" fill="${hair2}"/><path d="M177 70 Q233 87 230 186 Q213 159 187 155 Q218 205 190 246 Q161 199 157 102Z" fill="${hair2}"/>`
      : style==='veil'
      ? `<path d="M64 66 Q28 113 47 248 L92 211 L91 92Z" fill="${hair2}"/><path d="M196 66 Q232 113 213 248 L168 211 L169 92Z" fill="${hair2}"/><path d="M49 100 Q130 30 211 100" fill="none" stroke="${hair}" stroke-width="26" stroke-linecap="round"/>`
      : style==='crown'
      ? `<path d="M55 92 L78 35 L105 72 L130 25 L155 72 L183 35 L206 92 Q224 160 192 240 L68 240 Q36 160 55 92Z" fill="${hair2}"/>`
      : `<path d="M58 95 Q42 42 105 37 Q130 11 158 40 Q218 46 202 108 L185 235 L72 235Z" fill="${hair2}"/>`;
    const fringe = style==='veil'
      ? `<path d="M77 91 Q105 52 131 69 Q153 49 184 92 L164 119 Q139 102 130 79 Q114 108 89 123Z" fill="${hair}"/>`
      : style==='wing'
      ? `<path d="M72 91 Q91 47 130 67 Q173 44 190 95 L159 111 L132 73 L104 115Z" fill="${hair}"/>`
      : `<path d="M72 91 Q93 43 129 67 Q167 43 188 91 L164 113 Q141 95 130 70 Q112 104 91 119Z" fill="${hair}"/>`;
    const accessory = style==='braid'?`<circle cx="49" cy="238" r="12" fill="${accent}"/>`:style==='wing'?`<path d="M52 82 20 56 34 101 11 122 54 119" fill="none" stroke="${accent}" stroke-width="7"/><path d="M208 82 240 56 226 101 249 122 206 119" fill="none" stroke="${accent}" stroke-width="7"/>`:style==='veil'?`<path d="M130 33 142 55 130 71 118 55Z" fill="${accent}"/>`:style==='crown'?`<circle cx="130" cy="27" r="10" fill="${accent}"/>`:`<path d="M130 43 142 58 130 70 118 58Z" fill="${accent}"/>`;
    const halo=opt.halo?`<circle cx="130" cy="125" r="106" fill="none" stroke="${accent}" stroke-opacity=".22" stroke-width="2"/><circle cx="130" cy="125" r="92" fill="none" stroke="${accent}" stroke-opacity=".12" stroke-dasharray="4 8"/>`:'';
    return `<svg viewBox="0 0 260 300" role="img" aria-label="${profile.name||'goddess'}"><defs><radialGradient id="bg${style}" cx="50%" cy="35%"><stop stop-color="${accent}" stop-opacity=".18"/><stop offset="1" stop-color="${hair2}" stop-opacity="0"/></radialGradient></defs><rect width="260" height="300" rx="26" fill="url(#bg${style})"/>${halo}${backHair}<path d="M99 203 L93 239 Q65 248 50 279 L210 279 Q195 248 167 239 L161 203Z" fill="#f5d8d6"/><path d="M77 260 Q130 222 183 260 L203 300 L57 300Z" fill="${hair2}"/><path d="M92 245 Q130 267 168 245 L157 286 L103 286Z" fill="${accent}" opacity=".72"/><ellipse cx="130" cy="137" rx="65" ry="79" fill="#f7dddd"/><ellipse cx="96" cy="145" rx="17" ry="23" fill="#fff"/><ellipse cx="164" cy="145" rx="17" ry="23" fill="#fff"/><ellipse cx="98" cy="148" rx="9" ry="15" fill="${eye}"/><ellipse cx="162" cy="148" rx="9" ry="15" fill="${eye}"/><circle cx="101" cy="143" r="3" fill="#fff"/><circle cx="165" cy="143" r="3" fill="#fff"/><path d="M83 126 Q98 116 112 125" fill="none" stroke="${hair2}" stroke-width="4" stroke-linecap="round"/><path d="M148 125 Q163 116 177 126" fill="none" stroke="${hair2}" stroke-width="4" stroke-linecap="round"/><path d="M130 153 Q125 169 132 172" fill="none" stroke="#d59698" stroke-width="2"/><path d="M115 188 Q130 198 145 188" fill="none" stroke="#a85665" stroke-width="3" stroke-linecap="round"/><ellipse cx="87" cy="177" rx="13" ry="6" fill="#ff91ad" opacity=".3"/><ellipse cx="173" cy="177" rx="13" ry="6" fill="#ff91ad" opacity=".3"/>${fringe}${accessory}</svg>`;
  }
  function manifestSVG(a,b){
    const actor=GODDESSES[a], medium=GODDESSES[b];
    const profile={...actor,name:PAIRS[a+b].girl,accent:medium.accent,eye:medium.eye,style:a===b?actor.style:medium.style};
    return portraitSVG(profile,{full:true,halo:true});
  }

  function openCodex(tab='symbols'){
    $('#codexModal').classList.add('open'); renderCodex(tab);
  }
  function renderCodex(tab){
    $$('.codex-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
    if(tab==='symbols'){
      $('#codexContent').innerHTML=`<div class="codex-grid">${Object.entries(CARD_LIBRARY).map(([id,c])=>`<article class="codex-entry"><div class="entry-top"><span class="entry-glyph" style="color:${COLORS[c.color]}">${c.glyph}</span><div><h3>${c.name}</h3><small>${COLOR_NAMES[c.color]} · ${ZONES[c.zone].name} · ${'●'.repeat(c.pips)}</small></div></div><p>${c.copy}</p></article>`).join('')}</div>`;
    } else if(tab==='pairs'){
      $('#codexContent').innerHTML=`<div class="pair-matrix">${Object.entries(PAIRS).map(([key,p])=>`<article class="pair-cell ${state.discoveries.has(key)?'':'locked'}" style="--a:${COLORS[key[0]]};--b:${COLORS[key[1]]}"><span style="color:${COLORS[key[0]]}">${COLOR_NAMES[key[0]][0]}</span> → <span style="color:${COLORS[key[1]]}">${COLOR_NAMES[key[1]][0]}</span><b>${state.discoveries.has(key)?p.girl:'UNDISCOVERED'}</b><small>${state.discoveries.has(key)?p.copy:'Invoke this ordered pair to witness her.'}</small></article>`).join('')}</div>`;
    } else {
      $('#codexContent').innerHTML=`<div class="law-copy"><section><h3>Two-card syntax</h3><p>Every turn accepts exactly two symbols. The first identifies the goddess who acts. The second identifies her object, medium, instrument, or world. Reversing them creates a different manifestation.</p></section><section><h3>Color is physical</h3><p>Every symbol and condition contains red, green, pink, and blue weight. The board shows these quantities as a continuous aura rather than as damage numbers. A successful rite makes the present field resemble the girl’s desired field.</p></section><section><h3>Karmic gravity</h3><p>Played cards gain karmic weight. Heavy symbols return to the hand more readily and awaken at three weight. At five, fate may return them immediately instead of allowing them to disappear into the discard.</p></section><section><h3>Hands, Eyes, Lips, Pockets</h3><p>Hands act. Eyes reveal. Lips make precedent. Pockets preserve unfinished change. A pair sharing a place gains extra magnitude; some locations create more specific consequences.</p></section><section><h3>No enemies</h3><p>A condition is a girl trapped in an impossible arrangement of color. Failure does not kill her, and success does not defeat her. The reading either discovers a livable continuation or closes before one appears.</p></section><section><h3>Harmony</h3><p>Cross the pale threshold and remain there for the required number of rites. The condition drifts after each invocation, so momentary similarity is not enough; the new relation must hold.</p></section></div>`;
    }
  }

  let audio=null;
  function playRiteSound(a,b){
    if(!state.sound) return;
    if(!audio) audio=new (window.AudioContext||window.webkitAudioContext)();
    const notes={r:196,g:261.63,p:329.63,b:392};
    [notes[a],notes[b],Math.sqrt(notes[a]*notes[b])*2].forEach((freq,i)=>{
      const osc=audio.createOscillator(), gain=audio.createGain(); osc.type=i===2?'sine':'triangle'; osc.frequency.value=freq;
      gain.gain.setValueAtTime(.0001,audio.currentTime+i*.08); gain.gain.exponentialRampToValueAtTime(.08,audio.currentTime+i*.08+.02); gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+i*.08+.55);
      osc.connect(gain).connect(audio.destination); osc.start(audio.currentTime+i*.08); osc.stop(audio.currentTime+i*.08+.6);
    });
  }
  function initSky(){
    const c=$('#sky'),ctx=c.getContext('2d'); let stars=[];
    const resize=()=>{ const d=devicePixelRatio||1;c.width=innerWidth*d;c.height=innerHeight*d;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:Math.min(180,Math.floor(innerWidth*innerHeight/8000))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.2,s:Math.random()*.15+.03,o:Math.random()*.6+.15}));}; resize(); addEventListener('resize',resize);
    const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.y+=s.s;if(s.y>innerHeight)s.y=0;ctx.globalAlpha=s.o;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;requestAnimationFrame(draw)};draw();
  }
  function initTitle(){
    $('#titleGoddesses').innerHTML=Object.values(GODDESSES).map(g=>`<div class="title-goddess">${portraitSVG(g,{full:true,halo:true})}<small>${g.name.toUpperCase()}</small></div>`).join('');
    updateHeader();
  }
  function showScreen(name){
    state.screen=name; $$('.screen').forEach(s=>s.classList.remove('active')); $(`#${name}Screen`).classList.add('active');
  }
  function toast(text){ const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),1800); }
  function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function roman(n){ return ['I','II','III','IV','V'][n-1]||n; }

  $('#beginButton').addEventListener('click',startRun);
  $('#restartButton').addEventListener('click',()=>{ $('#endModal').classList.remove('open'); startRun(); });
  $('#brand').addEventListener('click',()=>{ $$('.modal').forEach(m=>m.classList.remove('open')); showScreen('title'); });
  $('#undoButton').addEventListener('click',undo); $('#invokeButton').addEventListener('click',invoke);
  $('#codexButton').addEventListener('click',()=>openCodex());
  $('#glossToggle').addEventListener('click',()=>{ state.gloss=!state.gloss;document.body.classList.toggle('gloss',state.gloss);$('#glossToggle').setAttribute('aria-pressed',state.gloss); });
  $('#soundButton').addEventListener('click',()=>{ state.sound=!state.sound;$('#soundButton').setAttribute('aria-pressed',state.sound);toast(state.sound?'The cards may sing.':'The cards fall silent.'); });
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).classList.remove('open')));
  $$('.codex-tabs button').forEach(b=>b.addEventListener('click',()=>renderCodex(b.dataset.tab)));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') $$('.modal').forEach(m=>m.classList.remove('open')); if(state.screen==='game'&&!state.animating){ if(e.key==='1'||e.key==='2'||e.key==='3'||e.key==='4'||e.key==='5') state.hand[+e.key-1]&&selectCard(state.hand[+e.key-1].uid); if(e.key==='Enter'&&state.selected.length===2) invoke(); if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z')undo(); }});

  initSky(); initTitle();
})();

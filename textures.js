(() => {
  'use strict';
  const palettes = {
    cinder: ['#12080d', '#4d0d1e', '#b5233c', '#ff9b72', '#ffe1ad'],
    orchard: ['#051715', '#104134', '#277157', '#79be7d', '#e5efad'],
    seafoam: ['#061923', '#174657', '#397e8c', '#8fc7bf', '#e2ecd0'],
    moth: ['#1c1023', '#45203f', '#77366d', '#bd75ab', '#f3c5df'],
    sill: ['#0c1430', '#253464', '#536fa3', '#a8bde5', '#f0edc7'],
    vial: ['#071c19', '#19483f', '#397d67', '#8dc09a', '#ead69d']
  };

  const hash = text => [...text].reduce((n, char) => ((n * 31) + char.charCodeAt(0)) >>> 0, 17);
  function random(seed) { let value = seed; return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function state(canvas) {
    if (canvas._material) return canvas._material;
    const kind = canvas.dataset.kind;
    const rand = random(hash(kind) + document.querySelectorAll(`canvas[data-kind="${kind}"]`).length * 19);
    canvas._material = {
      kind, rand,
      motes: Array.from({ length: 26 }, () => ({ x: rand(), y: rand(), r: .012 + rand() * .09, phase: rand() * Math.PI * 2, speed: .18 + rand() * .62 })),
      threads: Array.from({ length: 12 }, () => ({ y: rand(), phase: rand() * 7, speed: .15 + rand() * .4, amp: .02 + rand() * .07 })),
      dpr: 0, w: 0, h: 0
    };
    return canvas._material;
  }
  function sized(canvas, material) {
    const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight), dpr = Math.min(2, window.devicePixelRatio || 1);
    if (width === material.w && height === material.h && dpr === material.dpr) return;
    material.w = width; material.h = height; material.dpr = dpr;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  }
  function mist(x, color, cx, cy, radius) {
    const glow = x.createRadialGradient(cx, cy, 0, cx, cy, radius);
    glow.addColorStop(0, color); glow.addColorStop(.34, color.slice(0, 7) + '5a'); glow.addColorStop(1, 'transparent');
    x.fillStyle = glow; x.fillRect(0, 0, x.canvas.clientWidth, x.canvas.clientHeight);
  }
  function ribbon(x, y, width, height, time, hue, offset, amplitude, lineWidth) {
    x.beginPath();
    for (let step = -1; step <= 12; step++) {
      const px = width * step / 11;
      const py = y + Math.sin(step * .72 + time + offset) * amplitude + Math.cos(step * .27 - time * .7 + offset) * amplitude * .38;
      if (step === -1) x.moveTo(px, py); else x.lineTo(px, py);
    }
    x.strokeStyle = hue; x.lineWidth = lineWidth; x.stroke();
  }
  function body(x, material, time) {
    const { kind, motes, threads, w, h } = material, p = palettes[kind];
    x.setTransform(material.dpr, 0, 0, material.dpr, 0, 0);
    x.clearRect(0, 0, w, h);
    const base = x.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, p[0]); base.addColorStop(.48, p[1]); base.addColorStop(1, '#050b0c');
    x.fillStyle = base; x.fillRect(0, 0, w, h);

    x.globalCompositeOperation = 'screen';
    motes.forEach((m, index) => {
      const driftX = Math.sin(time * m.speed + m.phase) * w * .12;
      const driftY = Math.cos(time * (m.speed * .67) + m.phase) * h * .05;
      mist(x, p[2 + index % 3] + '68', m.x * w + driftX, m.y * h + driftY, m.r * Math.max(w, h));
    });
    x.globalCompositeOperation = 'source-over';

    if (kind === 'seafoam') {
      x.globalAlpha = .52;
      for (let i = 0; i < 9; i++) ribbon(x, h * (.28 + i * .065), w, h, time * .75, i % 2 ? p[3] + '85' : p[2] + 'b0', i, h * (.012 + i * .002), 1 + i % 2);
      x.globalAlpha = 1;
    } else if (kind === 'orchard') {
      x.globalAlpha = .38;
      threads.forEach((thread, i) => ribbon(x, h * thread.y, w, h, time * thread.speed, p[3] + '96', thread.phase, h * thread.amp, 1));
      for (let i = 0; i < 10; i++) {
        const y = h * (.24 + i * .058), side = i % 2 ? 1 : -1, sway = Math.sin(time * .7 + i) * w * .025;
        x.fillStyle = p[2 + i % 2] + 'ba'; x.beginPath(); x.ellipse(w * .5 + side * (w * .14 + sway), y, w * .10, h * .036, side * .65, 0, Math.PI * 2); x.fill();
      }
      x.globalAlpha = 1;
    } else if (kind === 'cinder') {
      x.globalAlpha = .42;
      for (let i = 0; i < 12; i++) ribbon(x, h * (.16 + i * .058), w, h, time * (1.1 + i * .03), i % 3 ? p[2] + 'a0' : p[4] + '9a', i * .6, h * .045, 1.2);
      x.globalAlpha = 1;
    } else if (kind === 'moth') {
      x.globalAlpha = .34;
      threads.forEach((thread, i) => ribbon(x, h * thread.y, w, h, time * thread.speed, p[3] + '83', thread.phase, h * thread.amp, 1));
      x.globalAlpha = 1;
    } else if (kind === 'sill') {
      x.globalAlpha = .44;
      for (let i = 0; i < 13; i++) ribbon(x, h * (.15 + i * .06), w, h, time * .4, p[3] + '7a', i * .8, h * .055, 1);
      x.globalAlpha = 1;
    } else {
      x.globalAlpha = .42;
      threads.forEach((thread, i) => ribbon(x, h * thread.y, w, h, time * thread.speed, p[4] + '7b', thread.phase, h * thread.amp, 1));
      x.globalAlpha = 1;
    }

    const cx = w / 2, cy = h * .58;
    x.save(); x.globalCompositeOperation = 'screen';
    x.fillStyle = p[3]; x.strokeStyle = p[4]; x.lineWidth = Math.max(1, w * .011);
    if (kind === 'cinder') {
      const flicker = Math.sin(time * 2.6) * h * .025;
      x.beginPath(); x.moveTo(cx, cy - h * .3 - flicker); x.bezierCurveTo(cx + w * .27, cy - h * .02, cx - w * .2, cy + h * .1, cx, cy + h * .29); x.bezierCurveTo(cx - w * .25, cy + h * .03, cx + w * .09, cy - h * .12, cx, cy - h * .3 - flicker); x.fill();
    } else if (kind === 'orchard') {
      x.strokeStyle = p[4]; x.beginPath(); x.moveTo(cx, cy - h * .34); x.lineTo(cx, cy + h * .33); x.stroke();
    } else if (kind === 'seafoam') {
      x.fillStyle = p[4]; x.globalAlpha = .82 + Math.sin(time * 1.4) * .12; x.beginPath(); x.arc(cx, cy - h * .2, w * .18, 0, Math.PI * 2); x.fill();
    } else if (kind === 'moth') {
      const breath = 1 + Math.sin(time * 1.3) * .06;
      x.fillStyle = p[3]; x.beginPath(); x.ellipse(cx - w * .16, cy, w * .18 * breath, h * .21, -.48, 0, Math.PI * 2); x.ellipse(cx + w * .16, cy, w * .18 * breath, h * .21, .48, 0, Math.PI * 2); x.fill(); x.fillStyle = p[4]; x.fillRect(cx - w * .024, cy - h * .29, w * .048, h * .58);
    } else if (kind === 'sill') {
      x.strokeStyle = p[4]; x.lineWidth = w * .025; x.beginPath(); x.arc(cx, cy + h * .05, w * .24, Math.PI, 0); x.lineTo(cx + w * .24, cy + h * .31); x.lineTo(cx - w * .24, cy + h * .31); x.closePath(); x.stroke(); x.fillStyle = p[4]; x.beginPath(); x.ellipse(cx, cy, w * .07, h * .2, 0, 0, Math.PI * 2); x.fill();
    } else {
      x.strokeStyle = p[4]; x.lineWidth = w * .024; x.beginPath(); x.roundRect(cx - w * .2, cy - h * .32, w * .4, h * .62, w * .08); x.stroke(); x.fillStyle = p[3]; x.beginPath(); x.ellipse(cx, cy + h * .11, w * .14, h * .15, 0, 0, Math.PI * 2); x.fill();
    }
    x.restore();

    const glaze = x.createLinearGradient(0, 0, 0, h); glaze.addColorStop(0, 'rgba(255,255,255,.04)'); glaze.addColorStop(.48, 'transparent'); glaze.addColorStop(1, 'rgba(0,0,0,.58)'); x.fillStyle = glaze; x.fillRect(0, 0, w, h);
  }
  let previous = 0;
  function animate(now) {
    requestAnimationFrame(animate);
    if (now - previous < 34) return;
    previous = now;
    document.querySelectorAll('.relic-canvas').forEach(canvas => { const material = state(canvas); sized(canvas, material); body(canvas.getContext('2d'), material, now / 1000); });
  }
  requestAnimationFrame(animate);
})();

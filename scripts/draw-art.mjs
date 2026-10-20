import fs from 'node:fs'
import path from 'node:path'

function frame(body, w = 800, h = 520) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070b18"/>
      <stop offset="58%" stop-color="#0d1a32"/>
      <stop offset="100%" stop-color="#1a1040"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#67e8f9"/>
      <stop offset="48%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="48%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${w * 0.62}" cy="${h * 0.38}" r="${Math.min(w, h) * 0.46}" fill="url(#glow)"/>
  ${body}
</svg>`
}

function write(rel, body, w, h) {
  const file = path.join('public', rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, frame(body, w, h))
}

const bolt = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M18 0 2 22h12l-4 20 22-28H18l0-14Z" fill="url(#accent)"/></g>`

write(
  'images/hero-sphere.svg',
  `
  <ellipse cx="390" cy="270" rx="250" ry="92" fill="none" stroke="#22d3ee" stroke-opacity="0.35" stroke-width="2"/>
  <ellipse cx="390" cy="270" rx="180" ry="150" fill="none" stroke="#a78bfa" stroke-opacity="0.4" stroke-width="2"/>
  <circle cx="390" cy="250" r="108" fill="#0b1730" stroke="url(#accent)" stroke-width="4"/>
  <path d="M390 150c52 36 52 164 0 200-52-36-52-164 0-200Z" fill="#22d3ee" fill-opacity="0.16"/>
  <path d="M300 250h180" stroke="#67e8f9" stroke-opacity="0.35"/>
  <path d="M390 160c30 40 30 140 0 180" fill="none" stroke="#a78bfa" stroke-opacity="0.55" stroke-width="2"/>
  ${bolt(372, 214, 1.15)}
  <g fill="#e8fbff">
    <circle cx="160" cy="180" r="10"/><circle cx="620" cy="160" r="8"/><circle cx="640" cy="340" r="12"/><circle cx="150" cy="360" r="7"/>
  </g>
  <path d="M160 180 L300 230 M620 160 L470 210 M640 340 L470 300 M150 360 L310 300" stroke="#67e8f9" stroke-opacity="0.45" fill="none"/>
  <rect x="520" y="360" width="230" height="130" rx="22" fill="#0c1730" stroke="#22d3ee" stroke-opacity="0.45"/>
  <text x="544" y="394" fill="#67e8f9" font-family="Inter,Segoe UI,sans-serif" font-size="14">SKILL</text>
  <rect x="544" y="412" width="150" height="10" rx="5" fill="#16304d"/>
  <rect x="544" y="412" width="108" height="10" rx="5" fill="url(#accent)"/>
  <rect x="544" y="436" width="120" height="10" rx="5" fill="#16304d"/>
  <rect x="544" y="436" width="72" height="10" rx="5" fill="#a78bfa"/>
`,
)

write(
  'images/skill-constellation.svg',
  `
  <path d="M120 360 L250 180 L420 250 L620 120 L680 300 L480 400 Z" fill="none" stroke="url(#accent)" stroke-width="3"/>
  <circle cx="120" cy="360" r="28" fill="#0c1730" stroke="#22d3ee" stroke-width="3"/>
  <circle cx="250" cy="180" r="22" fill="#0c1730" stroke="#3b82f6" stroke-width="3"/>
  <circle cx="420" cy="250" r="36" fill="#102044" stroke="url(#accent)" stroke-width="4"/>
  <circle cx="620" cy="120" r="18" fill="#0c1730" stroke="#a78bfa" stroke-width="3"/>
  <circle cx="680" cy="300" r="24" fill="#0c1730" stroke="#67e8f9" stroke-width="3"/>
  <circle cx="480" cy="400" r="20" fill="#0c1730" stroke="#8b5cf6" stroke-width="3"/>
  ${bolt(402, 228, 0.9)}
  <text x="96" y="420" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="16">Create</text>
  <text x="214" y="150" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="16">Reason</text>
  <text x="392" y="320" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="16">Build</text>
`,
)

write(
  'images/roadmap-path.svg',
  `
  <path d="M70 420 C 180 420, 180 300, 280 300 S 400 160, 520 170 S 680 90, 740 80" fill="none" stroke="url(#accent)" stroke-width="8" stroke-linecap="round"/>
  <circle cx="70" cy="420" r="16" fill="#07111f" stroke="#67e8f9" stroke-width="4"/>
  <circle cx="280" cy="300" r="16" fill="#07111f" stroke="#67e8f9" stroke-width="4"/>
  <circle cx="520" cy="170" r="16" fill="#07111f" stroke="#67e8f9" stroke-width="4"/>
  <circle cx="740" cy="80" r="28" fill="url(#accent)"/>
  <path d="M748 62 736 84h8l-3 14 14-20h-8l1-16Z" fill="#f8fbff"/>
  <text x="90" y="460" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="16">Discover</text>
  <text x="250" y="270" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="16">Analyze</text>
  <text x="490" y="140" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="16">Practice</text>
`,
)

write(
  'images/ai-companion.svg',
  `
  <circle cx="250" cy="250" r="120" fill="#0c1730" stroke="url(#accent)" stroke-width="4"/>
  <circle cx="210" cy="230" r="14" fill="#67e8f9"/>
  <circle cx="290" cy="230" r="14" fill="#a78bfa"/>
  <path d="M200 290c30 28 70 28 100 0" fill="none" stroke="#67e8f9" stroke-width="6" stroke-linecap="round"/>
  ${bolt(232, 300, 0.7)}
  <rect x="430" y="120" width="300" height="70" rx="22" fill="#0c1730" stroke="#22d3ee" stroke-opacity="0.5"/>
  <rect x="454" y="146" width="180" height="12" rx="6" fill="#67e8f9" fill-opacity="0.7"/>
  <rect x="500" y="230" width="260" height="90" rx="22" fill="#12102a" stroke="#a78bfa" stroke-opacity="0.55"/>
  <rect x="524" y="258" width="200" height="10" rx="5" fill="#c4b5fd" fill-opacity="0.8"/>
  <rect x="524" y="280" width="140" height="10" rx="5" fill="#67e8f9" fill-opacity="0.55"/>
`,
)

write(
  'images/empty-journey.svg',
  `
  <path d="M80 400 C 220 400, 260 280, 400 280" fill="none" stroke="#334155" stroke-width="8" stroke-linecap="round" stroke-dasharray="10 14"/>
  <circle cx="80" cy="400" r="18" fill="url(#accent)"/>
  <circle cx="400" cy="280" r="10" fill="#1e293b" stroke="#67e8f9" stroke-width="3"/>
  <text x="110" y="450" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="20">Your first milestone is still open</text>
`,
)

write(
  'images/success-milestone.svg',
  `
  <path d="M90 420 C 220 400, 300 250, 460 230" fill="none" stroke="url(#accent)" stroke-width="8" stroke-linecap="round"/>
  <path d="M460 120 v180" stroke="#e2e8f0" stroke-width="6"/>
  <path d="M460 130 h110 l-20 28 20 28 H460" fill="url(#accent)"/>
  <circle cx="90" cy="420" r="16" fill="#22d3ee"/>
  ${bolt(560, 300, 1)}
`,
)

write(
  'images/streak-flame.svg',
  `
  <path d="M400 460 C 250 340, 280 230, 370 170 C 340 280, 430 280, 450 190 C 530 280, 580 360, 540 460 Z" fill="url(#accent)"/>
  <path d="M400 460 C 350 360, 380 300, 430 250 C 410 340, 460 350, 470 290 C 510 360, 530 400, 500 460 Z" fill="#f8fbff" fill-opacity="0.85"/>
  <text x="230" y="500" fill="#dbeafe" font-family="Inter,Segoe UI,sans-serif" font-size="22">Days you actually studied</text>
`,
)

write(
  'images/analytics-board.svg',
  `
  <rect x="70" y="70" width="660" height="380" rx="28" fill="#0c1730" stroke="#22d3ee" stroke-opacity="0.4"/>
  <circle cx="220" cy="240" r="90" fill="none" stroke="#1e3a5f" stroke-width="18"/>
  <path d="M220 150 a90 90 0 1 1 -70 140" fill="none" stroke="url(#accent)" stroke-width="18" stroke-linecap="round"/>
  <rect x="400" y="300" width="36" height="80" rx="8" fill="url(#accent)"/>
  <rect x="456" y="250" width="36" height="130" rx="8" fill="url(#accent)"/>
  <rect x="512" y="210" width="36" height="170" rx="8" fill="#67e8f9"/>
  <rect x="568" y="160" width="36" height="220" rx="8" fill="#a78bfa"/>
  <rect x="624" y="190" width="36" height="190" rx="8" fill="url(#accent)"/>
`,
)

const careers = {
  software: `<rect x="160" y="120" width="480" height="280" rx="24" fill="#0c1730" stroke="url(#accent)" stroke-width="3"/>
    <text x="190" y="180" fill="#67e8f9" font-family="ui-monospace,Consolas,monospace" font-size="28">function sprint() {</text>
    <text x="220" y="230" fill="#c4b5fd" font-family="ui-monospace,Consolas,monospace" font-size="28">return path.up()</text>
    <text x="190" y="280" fill="#67e8f9" font-family="ui-monospace,Consolas,monospace" font-size="28">}</text>
    ${bolt(560, 300, 1.2)}`,
  aiml: `<g fill="none" stroke="url(#accent)" stroke-width="3">
      <circle cx="220" cy="180" r="28"/><circle cx="220" cy="300" r="28"/><circle cx="220" cy="420" r="28"/>
      <circle cx="400" cy="220" r="28"/><circle cx="400" cy="360" r="28"/>
      <circle cx="580" cy="290" r="36"/>
      <path d="M248 180 H372 M248 300 H372 M248 420 H372 M428 230 H544 M428 350 H544"/>
    </g>${bolt(562, 268, 0.8)}`,
  data: `<rect x="150" y="300" width="70" height="140" rx="12" fill="url(#accent)"/>
    <rect x="260" y="220" width="70" height="220" rx="12" fill="url(#accent)"/>
    <rect x="370" y="160" width="70" height="280" rx="12" fill="#67e8f9"/>
    <rect x="480" y="240" width="70" height="200" rx="12" fill="#a78bfa"/>
    <circle cx="620" cy="180" r="70" fill="none" stroke="#67e8f9" stroke-width="16"/>
    <path d="M620 180 L670 140" stroke="#a78bfa" stroke-width="8"/>`,
  design: `<rect x="140" y="110" width="250" height="300" rx="28" fill="#0c1730" stroke="#67e8f9" stroke-width="3"/>
    <rect x="180" y="160" width="170" height="28" rx="8" fill="#22d3ee" fill-opacity="0.7"/>
    <rect x="180" y="210" width="120" height="16" rx="8" fill="#a78bfa" fill-opacity="0.7"/>
    <rect x="430" y="160" width="230" height="250" rx="28" fill="#12102a" stroke="#a78bfa" stroke-width="3"/>
    <path d="M500 300c40-80 120-40 80 20" fill="none" stroke="url(#accent)" stroke-width="8" stroke-linecap="round"/>`,
  cyber: `<path d="M400 80 620 160 V300 c0 110-90 170-220 210 C270 470 180 410 180 300 V160 Z" fill="#0c1730" stroke="url(#accent)" stroke-width="6"/>
    ${bolt(372, 230, 1.6)}
    <path d="M250 180 H550 M250 360 H550" stroke="#22d3ee" stroke-opacity="0.35"/>`,
  entrepreneur: `<path d="M120 400 C 240 400, 260 240, 400 230 S 620 120, 700 90" fill="none" stroke="url(#accent)" stroke-width="8"/>
    <path d="M640 90 h80 v70" fill="none" stroke="#f8fbff" stroke-width="6"/>
    <path d="M690 70 v90" stroke="#e2e8f0" stroke-width="6"/>
    <path d="M690 80 h70 l-16 22 16 22 h-70" fill="url(#accent)"/>`,
  consulting: `<rect x="120" y="140" width="250" height="280" rx="20" fill="#0c1730" stroke="#67e8f9" stroke-width="3"/>
    <rect x="150" y="180" width="190" height="14" rx="7" fill="#67e8f9"/>
    <rect x="150" y="214" width="150" height="12" rx="6" fill="#a78bfa"/>
    <rect x="150" y="246" width="170" height="12" rx="6" fill="#3b82f6"/>
    <circle cx="560" cy="220" r="26" fill="#22d3ee"/>
    <circle cx="500" cy="340" r="26" fill="#3b82f6"/>
    <circle cx="650" cy="360" r="26" fill="#a78bfa"/>
    <path d="M545 240 L520 318 M575 240 L630 338 M526 340 H624" stroke="#dbeafe" stroke-width="3"/>`,
}

for (const [name, body] of Object.entries(careers)) write(`images/careers/${name}.svg`, body)

const badges = {
  'first-steps': `<circle cx="400" cy="250" r="150" fill="#0c1730" stroke="url(#accent)" stroke-width="10"/>${bolt(372, 150, 2)}<path d="M250 360 H550" stroke="#67e8f9" stroke-width="8" stroke-linecap="round"/>`,
  'skill-explorer': `<circle cx="400" cy="250" r="150" fill="#0c1730" stroke="url(#accent)" stroke-width="10"/>
    <circle cx="400" cy="250" r="16" fill="#67e8f9"/><circle cx="320" cy="190" r="12" fill="#67e8f9"/><circle cx="480" cy="190" r="12" fill="#a78bfa"/>
    <circle cx="300" cy="300" r="12" fill="#3b82f6"/><circle cx="500" cy="300" r="12" fill="#67e8f9"/><circle cx="400" cy="340" r="12" fill="#a78bfa"/>
    <path d="M400 250 L320 190 L480 190 L500 300 L300 300 Z" fill="none" stroke="#a78bfa" stroke-width="3"/>`,
  consistency: `<circle cx="400" cy="250" r="150" fill="#0c1730" stroke="url(#accent)" stroke-width="10"/><path d="M400 360 C 330 280, 345 230, 385 200 C 370 250, 410 250, 418 210 C 455 250, 470 290, 450 360 Z" fill="url(#accent)"/>`,
  'quiz-master': `<circle cx="400" cy="250" r="150" fill="#0c1730" stroke="url(#accent)" stroke-width="10"/><path d="M330 255 l40 42 100-110" fill="none" stroke="#67e8f9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`,
  'roadmap-runner': `<circle cx="400" cy="250" r="150" fill="#0c1730" stroke="url(#accent)" stroke-width="10"/><path d="M260 320 C 320 320, 340 230, 400 220 S 500 140, 560 130" fill="none" stroke="url(#accent)" stroke-width="10" stroke-linecap="round"/><circle cx="560" cy="130" r="14" fill="#f8fbff"/>`,
  'skill-builder': `<circle cx="400" cy="250" r="150" fill="#0c1730" stroke="url(#accent)" stroke-width="10"/><rect x="300" y="280" width="70" height="70" rx="10" fill="#22d3ee"/><rect x="380" y="220" width="70" height="130" rx="10" fill="#3b82f6"/><rect x="460" y="160" width="70" height="190" rx="10" fill="#a78bfa"/>`,
}

for (const [name, body] of Object.entries(badges)) write(`images/badges/${name}.svg`, body)
console.log('wrote images')

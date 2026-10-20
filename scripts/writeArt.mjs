import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = 'public/images'
mkdirSync(join(root, 'careers'), { recursive: true })
mkdirSync(join(root, 'badges'), { recursive: true })

const frame = (body, w = 640, h = 480) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <linearGradient id="g" x1="40" y1="20" x2="${w - 40}" y2="${h - 20}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#22d3ee"/>
      <stop offset="0.52" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0" stop-color="#3b82f6" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="36" fill="#070b18"/>
  <rect width="${w}" height="${h}" rx="36" fill="url(#glow)"/>
  <g stroke="#2a3658" stroke-opacity="0.45">
    <path d="M0 80H${w}M0 160H${w}M0 240H${w}M0 320H${w}M0 400H${w}M80 0V${h}M160 0V${h}M240 0V${h}M320 0V${h}M400 0V${h}M480 0V${h}M560 0V${h}"/>
  </g>
  ${body}
</svg>`

const files = {
  'hero-sphere.svg': frame(`
    <ellipse cx="390" cy="230" rx="168" ry="168" stroke="url(#g)" stroke-width="3"/>
    <ellipse cx="390" cy="230" rx="168" ry="58" stroke="#22d3ee" stroke-width="2" opacity="0.85"/>
    <ellipse cx="390" cy="230" rx="58" ry="168" stroke="#a78bfa" stroke-width="2" opacity="0.85"/>
    <ellipse cx="390" cy="230" rx="250" ry="96" stroke="#3b82f6" stroke-opacity="0.7" stroke-dasharray="6 8"/>
    <circle cx="390" cy="230" r="16" fill="#e8eefc"/>
    <circle cx="168" cy="176" r="10" fill="#22d3ee"/>
    <circle cx="560" cy="168" r="8" fill="#a78bfa"/>
    <circle cx="500" cy="318" r="8" fill="#34d399"/>
    <path d="M168 176L390 230L560 168M390 230L500 318" stroke="#22d3ee" stroke-opacity="0.7"/>
    <rect x="46" y="250" width="214" height="150" rx="22" fill="#10182e" stroke="#2a3658"/>
    <rect x="68" y="274" width="120" height="12" rx="6" fill="#22d3ee"/>
    <rect x="68" y="298" width="84" height="8" rx="4" fill="#8b5cf6" opacity="0.8"/>
    <rect x="70" y="348" width="22" height="28" rx="6" fill="#22d3ee"/>
    <rect x="100" y="332" width="22" height="44" rx="6" fill="#3b82f6"/>
    <rect x="130" y="318" width="22" height="58" rx="6" fill="#a78bfa"/>
    <rect x="160" y="338" width="22" height="38" rx="6" fill="#34d399"/>
    <path d="M470 92l18 46h28l-22 18 8 28-32-20-32 20 8-28-22-18h28l18-46z" fill="url(#g)"/>
  `),
  'skill-constellation.svg': frame(`
    <path d="M120 300L220 150L340 220L470 120L520 250L340 340L220 150" stroke="url(#g)" stroke-width="2"/>
    <path d="M120 300L340 340L520 250" stroke="#22d3ee" stroke-opacity="0.5"/>
    <g fill="#10182e" stroke="url(#g)" stroke-width="3">
      <circle cx="120" cy="300" r="28"/><circle cx="220" cy="150" r="34"/><circle cx="340" cy="220" r="40"/>
      <circle cx="470" cy="120" r="26"/><circle cx="520" cy="250" r="30"/><circle cx="340" cy="340" r="24"/>
    </g>
    <g fill="#e8eefc" font-family="Manrope, sans-serif" font-size="13" text-anchor="middle">
      <text x="120" y="346">Create</text><text x="220" y="112">Code</text><text x="340" y="186">Data</text>
      <text x="470" y="86">Logic</text><text x="520" y="298">Solve</text><text x="340" y="382">Voice</text>
    </g>
  `),
  'roadmap-path.svg': frame(`
    <path d="M70 360C150 360 150 250 240 250C330 250 330 140 430 140C500 140 540 90 590 70" stroke="url(#g)" stroke-width="8" stroke-linecap="round"/>
    <g>
      <circle cx="90" cy="350" r="18" fill="#34d399"/>
      <circle cx="240" cy="250" r="18" fill="#22d3ee"/>
      <circle cx="390" cy="168" r="18" fill="#3b82f6"/>
      <circle cx="560" cy="86" r="22" fill="#8b5cf6"/>
    </g>
    <path d="M560 48v28M546 62h28" stroke="#e8eefc" stroke-width="3" stroke-linecap="round"/>
    <g fill="#e8eefc" font-family="Manrope, sans-serif" font-size="14">
      <text x="70" y="400">Discover</text><text x="210" y="292">Diagnose</text><text x="360" y="210">Personalize</text><text x="520" y="130">Evolve</text>
    </g>
  `),
  'ai-companion.svg': frame(`
    <circle cx="230" cy="230" r="110" fill="#10182e" stroke="url(#g)" stroke-width="4"/>
    <circle cx="230" cy="230" r="68" stroke="#22d3ee" stroke-opacity="0.8"/>
    <path d="M190 220c16-28 64-28 80 0" stroke="#e8eefc" stroke-width="4" stroke-linecap="round"/>
    <circle cx="206" cy="206" r="6" fill="#22d3ee"/><circle cx="254" cy="206" r="6" fill="#a78bfa"/>
    <rect x="380" y="120" width="200" height="64" rx="18" fill="#12182e" stroke="#2a3658"/>
    <rect x="400" y="144" width="120" height="10" rx="5" fill="#22d3ee"/>
    <rect x="380" y="204" width="180" height="52" rx="18" fill="#12182e" stroke="#2a3658"/>
    <rect x="400" y="224" width="130" height="10" rx="5" fill="#a78bfa"/>
    <rect x="380" y="274" width="150" height="52" rx="18" fill="#12182e" stroke="#2a3658"/>
    <rect x="400" y="294" width="90" height="10" rx="5" fill="#34d399"/>
  `),
  'empty-journey.svg': frame(`
    <path d="M80 340C200 340 220 180 560 160" stroke="#2a3658" stroke-width="8" stroke-linecap="round"/>
    <circle cx="120" cy="332" r="16" fill="#22d3ee"/>
    <circle cx="300" cy="250" r="10" fill="#1c2744"/>
    <circle cx="460" cy="190" r="10" fill="#1c2744"/>
    <text x="150" y="300" fill="#b7c3dc" font-family="Manrope, sans-serif" font-size="18">Your path starts here</text>
  `, 640, 420),
  'success-milestone.svg': frame(`
    <path d="M70 360C180 300 240 220 330 210C430 198 470 120 560 90" stroke="url(#g)" stroke-width="8" stroke-linecap="round"/>
    <circle cx="120" cy="338" r="14" fill="#34d399"/>
    <circle cx="280" cy="230" r="14" fill="#22d3ee"/>
    <circle cx="470" cy="130" r="14" fill="#3b82f6"/>
    <path d="M548 40v90" stroke="#e8eefc" stroke-width="4"/>
    <path d="M548 48h46l-12 16 12 16h-46" fill="#8b5cf6"/>
    <text x="80" y="410" fill="#e8eefc" font-family="Manrope, sans-serif" font-size="18">Milestone complete</text>
  `, 640, 440),
  'streak-flame.svg': frame(`
    <g fill="url(#g)">
      <path d="M150 340c0-40 22-54 22-90 28 18 48 18 48 70 22-16 28-48 24-74 40 28 52 70 52 110 0 48-32 78-74 78s-72-34-72-94z"/>
      <path d="M300 360c0-28 16-40 16-66 20 14 34 12 34 50 16-12 20-34 16-52 28 18 36 48 36 76 0 34-22 56-52 56s-50-24-50-64z" opacity="0.8"/>
      <path d="M430 370c0-20 12-30 12-48 14 10 24 8 24 36 12-8 14-24 12-38 20 14 26 34 26 56 0 24-16 40-38 40s-36-18-36-46z" opacity="0.65"/>
    </g>
    <text x="80" y="80" fill="#e8eefc" font-family="Manrope, sans-serif" font-size="22">Learning streak</text>
  `, 640, 420),
  'analytics-board.svg': frame(`
    <circle cx="150" cy="210" r="78" stroke="#2a3658" stroke-width="16"/>
    <path d="M150 210m-78 0a78 78 0 1 1 120-40" stroke="url(#g)" stroke-width="16" stroke-linecap="round"/>
    <rect x="300" y="250" width="36" height="90" rx="8" fill="#22d3ee"/>
    <rect x="350" y="210" width="36" height="130" rx="8" fill="#3b82f6"/>
    <rect x="400" y="170" width="36" height="170" rx="8" fill="#8b5cf6"/>
    <rect x="450" y="140" width="36" height="200" rx="8" fill="#34d399"/>
    <rect x="500" y="190" width="36" height="150" rx="8" fill="#22d3ee"/>
    <text x="70" y="80" fill="#e8eefc" font-family="Manrope, sans-serif" font-size="22">Learning analytics</text>
  `),
}

const careers = {
  software: `<rect x="150" y="110" width="340" height="220" rx="24" fill="#10182e" stroke="url(#g)" stroke-width="3"/><rect x="178" y="150" width="180" height="12" rx="6" fill="#22d3ee"/><rect x="178" y="180" width="140" height="12" rx="6" fill="#3b82f6"/><rect x="178" y="210" width="210" height="12" rx="6" fill="#a78bfa"/><path d="M180 300c40-50 70-10 110-70 30 40 60 10 90-20" stroke="#34d399" stroke-width="6" stroke-linecap="round"/>`,
  aiml: `<circle cx="320" cy="220" r="70" stroke="url(#g)" stroke-width="4"/><g stroke="#22d3ee" stroke-width="2"><path d="M180 140L320 220L470 130M180 300L320 220L480 310M250 90L320 220L390 360"/></g><g fill="#e8eefc"><circle cx="180" cy="140" r="8"/><circle cx="470" cy="130" r="8"/><circle cx="180" cy="300" r="8"/><circle cx="480" cy="310" r="8"/><circle cx="250" cy="90" r="7"/><circle cx="390" cy="360" r="7"/><circle cx="320" cy="220" r="10"/></g>`,
  data: `<rect x="160" y="250" width="46" height="90" rx="10" fill="#22d3ee"/><rect x="230" y="190" width="46" height="150" rx="10" fill="#3b82f6"/><rect x="300" y="150" width="46" height="190" rx="10" fill="#8b5cf6"/><rect x="370" y="210" width="46" height="130" rx="10" fill="#34d399"/><circle cx="470" cy="180" r="54" stroke="url(#g)" stroke-width="14"/><path d="M470 180 L470 126 A54 54 0 0 1 516 202 Z" fill="#22d3ee"/>`,
  design: `<rect x="140" y="120" width="180" height="240" rx="24" stroke="url(#g)" stroke-width="3"/><rect x="250" y="160" width="240" height="180" rx="24" fill="#10182e" stroke="#a78bfa" stroke-width="3"/><path d="M430 300l70 40-18-64 40-18z" fill="#22d3ee"/>`,
  cyber: `<path d="M320 80l150 54v92c0 78-62 124-150 156-88-32-150-78-150-156v-92l150-54z" fill="#10182e" stroke="url(#g)" stroke-width="4"/><path d="M250 230l48 48 92-100" stroke="#34d399" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  entrepreneur: `<path d="M90 340c80-20 120-120 180-150 70-36 150-20 250-90" stroke="url(#g)" stroke-width="8" stroke-linecap="round"/><path d="M500 70v70M470 100h70" stroke="#e8eefc" stroke-width="4"/><circle cx="150" cy="318" r="12" fill="#22d3ee"/><circle cx="300" cy="196" r="12" fill="#3b82f6"/>`,
  consulting: `<rect x="120" y="100" width="220" height="270" rx="20" fill="#10182e" stroke="url(#g)" stroke-width="3"/><rect x="148" y="136" width="140" height="12" rx="6" fill="#22d3ee"/><rect x="148" y="166" width="160" height="10" rx="5" fill="#8b5cf6"/><rect x="148" y="192" width="110" height="10" rx="5" fill="#3b82f6"/><circle cx="430" cy="160" r="16" fill="#22d3ee"/><circle cx="520" cy="230" r="16" fill="#a78bfa"/><circle cx="430" cy="310" r="16" fill="#34d399"/><path d="M340 200L430 160L520 230L430 310" stroke="#3b82f6"/>`,
}

const badges = {
  'first-steps': `<path d="M30 110c30-10 40-40 70-46 20 30 50 24 70 4" stroke="url(#g)" stroke-width="8" stroke-linecap="round"/><circle cx="46" cy="104" r="8" fill="#22d3ee"/><path d="M96 28l8 22h20l-16 12 6 20-18-12-18 12 6-20-16-12h20l8-22z" fill="url(#g)"/>`,
  'skill-explorer': `<path d="M30 90L70 40L110 78L140 36" stroke="url(#g)" stroke-width="4"/><circle cx="30" cy="90" r="8" fill="#22d3ee"/><circle cx="70" cy="40" r="8" fill="#3b82f6"/><circle cx="110" cy="78" r="8" fill="#a78bfa"/><circle cx="140" cy="36" r="8" fill="#34d399"/>`,
  consistency: `<path d="M80 132c0-24 14-34 14-58 18 12 30 10 30 44 14-10 18-30 14-46 26 16 32 44 32 68 0 30-20 48-46 48s-44-20-44-56z" fill="url(#g)"/>`,
  'quiz-master': `<circle cx="80" cy="78" r="46" stroke="url(#g)" stroke-width="8"/><path d="M58 80l14 14 30-32" stroke="#22d3ee" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  'roadmap-runner': `<path d="M24 112c28-8 36-36 62-40 18 24 40 18 58 0 16 20 34 16 52-4" stroke="url(#g)" stroke-width="6" stroke-linecap="round"/><circle cx="28" cy="108" r="7" fill="#34d399"/><circle cx="86" cy="74" r="7" fill="#22d3ee"/><circle cx="142" cy="70" r="7" fill="#8b5cf6"/>`,
  'skill-builder': `<rect x="28" y="88" width="28" height="36" rx="6" fill="#22d3ee"/><rect x="66" y="64" width="28" height="60" rx="6" fill="#3b82f6"/><rect x="104" y="40" width="28" height="84" rx="6" fill="#8b5cf6"/>`,
}

for (const [name, body] of Object.entries(files)) writeFileSync(join(root, name), body)
for (const [name, body] of Object.entries(careers)) writeFileSync(join(root, 'careers', `${name}.svg`), frame(body, 640, 420))
for (const [name, body] of Object.entries(badges)) {
  writeFileSync(join(root, 'badges', `${name}.svg`), `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none">
  <defs>
    <linearGradient id="g" x1="20" y1="16" x2="140" y2="144" gradientUnits="userSpaceOnUse">
      <stop stop-color="#22d3ee"/><stop offset="0.5" stop-color="#3b82f6"/><stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <circle cx="80" cy="80" r="70" fill="#10182e" stroke="url(#g)" stroke-width="6"/>
  ${body}
</svg>`)
}
console.log('art written')

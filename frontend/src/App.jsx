import { useState } from 'react'
import { ARCGIS_EMBED_URL } from './config.js'
import sketch from './assets/concept-sketch.webp'

/* ------------------------------------------------------------------ */
/* Sample data (illustrative only)                                     */
/* ------------------------------------------------------------------ */

const hoods = [
  { id: 'northfield', name: 'Northfield', km: 5.8, iceHrs: 2, income: 0.32, youth: 27 },
  { id: 'eastgate', name: 'Eastgate', km: 4.6, iceHrs: 3, income: 0.4, youth: 24 },
  { id: 'oldmill', name: 'Old Mill', km: 3.2, iceHrs: 5, income: 0.55, youth: 21 },
  { id: 'westbrook', name: 'Westbrook', km: 2.5, iceHrs: 6, income: 0.48, youth: 19 },
  { id: 'harbour', name: 'Harbourview', km: 0.9, iceHrs: 11, income: 0.82, youth: 15 },
  { id: 'downtown', name: 'Downtown Core', km: 0.6, iceHrs: 14, income: 0.7, youth: 12 },
]

const factors = (n) => [
  { label: 'Distance to nearest ice', value: `${n.km} km`, pct: Math.min(n.km / 6, 1), weight: 40 },
  { label: 'Public ice time nearby', value: `${n.iceHrs} hrs/wk`, pct: 1 - Math.min(n.iceHrs / 15, 1), weight: 20 },
  { label: 'Cost barrier', value: n.income < 0.45 ? 'High' : n.income < 0.65 ? 'Medium' : 'Low', pct: 1 - n.income, weight: 25 },
  { label: 'Youth population', value: `${n.youth}%`, pct: Math.min(n.youth / 30, 1), weight: 15 },
]

const scoreOf = (n) => Math.round(factors(n).reduce((s, f) => s + f.pct * f.weight, 0))

const tierOf = (s) =>
  s >= 65 ? { label: 'Priority', tone: 'bg-[var(--sage-soft)] text-[var(--sage-ink)]' } : s >= 45 ? { label: 'Next wave', tone: 'bg-[var(--amber-soft)] text-[var(--amber-ink)]' } : { label: 'Well served', tone: 'bg-[var(--ice-soft)] text-[var(--navy)]' }

const spots = {
  closure: { group: 'Street', title: 'Street closure', note: 'Clear entry/exit points at each end. Traffic is diverted to a parallel road with extra traffic-watch on the perimeter.' },
  arena: { group: 'Street', title: 'Street hockey mini-arena', note: 'Low boards on the closed street. Sticks and balls provided — no skates, gear or sign-up needed.' },
  net: { group: 'Street', title: 'Practice net', note: 'Drop-in shooting practice for first-timers.' },
  art: { group: 'Street', title: 'Hockey-themed street art', note: 'Murals by local artists that stay after the event.' },
  chalk: { group: 'Street', title: 'Interactive chalk art', note: 'Chalk rinks, plays and drills on the sidewalk for younger fans.' },
  tourney: { group: 'Parking lot', title: 'Tournament / learn-to-play', note: 'Uses nearby city-owned or business parking, so the event never depends on a rec centre with ice.' },
  meet: { group: 'Parking lot', title: 'Meet the player', note: 'Autographs and speakers from the PWHL, AHL, OHL and more — so kids can see themselves represented.' },
  young: { group: 'Park', title: 'Young fans zone', note: 'Mini games and gear try-ons for kids.', park: true },
  gather: { group: 'Park', title: 'Space to gather', note: 'Seating, shade and food — a place to hang out.', park: true },
  merch: { group: 'Park', title: 'Merch booths & prizes', note: 'Local team booths, giveaways and an equipment swap table.', park: true },
  watch: { group: 'Park', title: 'Game-watch station', note: 'A big screen with a host explaining the rules for new fans.', park: true },
}

const feedbackOptions = [
  { id: 'skate', label: 'Learn to skate at a pop-up rink', next: (s) => `Bring a seasonal pop-up rink to ${s}, with free skate lending.` },
  { id: 'street', label: 'More street hockey', next: (s) => `Make the ${s} play street a monthly event.` },
  { id: 'gear', label: 'Equipment lending or swap', next: (s) => `Launch an equipment lending library with partners in ${s}.` },
  { id: 'watch', label: 'Community watch parties', next: (s) => `Host free watch parties with rules explainers in ${s}.` },
]

/* ------------------------------------------------------------------ */
/* Shared bits                                                          */
/* ------------------------------------------------------------------ */

const Logo = () => (
  <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
    <rect x="2" y="7" width="28" height="18" rx="8" fill="var(--ice-soft)" stroke="var(--navy)" strokeWidth="1.6" />
    <line x1="16" y1="7" x2="16" y2="25" stroke="var(--red)" strokeWidth="1.4" />
    <circle cx="16" cy="16" r="3.4" fill="none" stroke="var(--navy)" strokeWidth="1.3" />
  </svg>
)

function Section({ id, step, eyebrow, title, intro, children, tint }) {
  return (
    <section id={id} className={`scroll-mt-16 px-5 py-20 sm:px-8 ${tint ? 'bg-[var(--surface-2)]' : ''}`}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--navy)] text-xs text-white">{step}</span>
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--navy)] sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-[var(--muted)]">{intro}</p>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

const Panel = ({ className = '', children }) => (
  <div className={`rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm ${className}`}>{children}</div>
)

const Note = ({ children, className = '' }) => <span className={`note text-[var(--muted)] ${className}`}>{children}</span>

/* ------------------------------------------------------------------ */
/* 1. Rink Atlas                                                         */
/* ------------------------------------------------------------------ */

function GisEmbed() {
  if (ARCGIS_EMBED_URL) {
    return (
      <iframe
        src={ARCGIS_EMBED_URL}
        title="Rink Atlas map"
        className="h-full w-full"
        loading="lazy"
        allowFullScreen
      />
    )
  }
  return (
    <div className="dots relative grid h-full w-full place-items-center">
      <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="var(--slate-soft)" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M-10 60 C120 52 260 70 410 56" />
          <path d="M-10 140 C140 130 270 146 410 152" />
          <path d="M110 -10 L116 260" />
          <path d="M280 -10 L276 260" />
        </g>
        <circle cx="200" cy="175" r="10" fill="var(--ice)" stroke="var(--navy)" strokeWidth="1.2" />
        <circle cx="340" cy="185" r="10" fill="var(--ice)" stroke="var(--navy)" strokeWidth="1.2" />
        <circle cx="60" cy="100" r="34" fill="var(--sage)" opacity="0.35" />
        <circle cx="340" cy="100" r="26" fill="var(--sage)" opacity="0.3" />
      </svg>
      <div className="relative mx-6 max-w-sm rounded-xl border border-[var(--line)] bg-white/90 p-5 text-center shadow-sm backdrop-blur">
        <p className="font-semibold text-[var(--navy)]">ArcGIS map goes here</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add your ArcGIS Online embed URL in <code className="rounded bg-[var(--surface-2)] px-1">src/config.js</code> to show rinks, transit and need scores.
        </p>
      </div>
    </div>
  )
}

function Atlas({ site, setSite }) {
  const ranked = hoods.map((h) => ({ ...h, score: scoreOf(h) }))
  const sel = ranked.find((h) => h.id === site)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3 text-sm">
          <span className="font-semibold text-[var(--navy)]">Rink Atlas</span>
          <span className="flex items-center gap-4 text-[var(--muted)]">
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[var(--ice)] ring-1 ring-[var(--navy)]" /> rink</span>
            <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[var(--sage)]" /> high need</span>
          </span>
        </div>
        <div className="min-h-[360px] w-full flex-1">
          <GisEmbed />
        </div>
      </div>

      <Panel>
        <div className="flex items-baseline justify-between">
          <h3 className="font-semibold text-[var(--navy)]">Need score by neighbourhood</h3>
          <Note>sample data</Note>
        </div>
        <ul className="mt-4 divide-y divide-[var(--line)]">
          {ranked.map((h) => {
            const tier = tierOf(h.score)
            return (
              <li key={h.id}>
                <button
                  onClick={() => setSite(h.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition ${h.id === site ? 'bg-[var(--surface-2)]' : 'hover:bg-[var(--surface-2)]/60'}`}
                >
                  <span className="flex-1 font-medium">{h.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tier.tone}`}>{tier.label}</span>
                  <span className="w-8 text-right font-semibold tabular-nums text-[var(--navy)]">{h.score}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-5 border-t border-[var(--line)] pt-5">
          <p className="text-sm text-[var(--muted)]">Why {sel.name} scores {sel.score}</p>
          <dl className="mt-3 space-y-3 text-sm">
            {factors(sel).map((f) => (
              <div key={f.label}>
                <div className="flex justify-between">
                  <dt>{f.label}</dt>
                  <dd className="font-medium text-[var(--navy)]">{f.value}</dd>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-[var(--surface-2)]">
                  <div className="h-full rounded-full bg-[var(--slate)] transition-all duration-500" style={{ width: `${f.pct * 100}%` }} />
                </div>
              </div>
            ))}
          </dl>
          <a href="#play-street" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--navy-2)]">
            Plan a play street in {sel.name} →
          </a>
        </div>
      </Panel>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Play Street                                                        */
/* ------------------------------------------------------------------ */

function StreetPlan({ active, setActive, park }) {
  const S = { stroke: 'var(--slate)', strokeWidth: 1.2 }
  const sel = (id) => (active === id ? { stroke: 'var(--navy)', strokeWidth: 2.5 } : S)
  const hit = (id) => ({ onClick: () => setActive(id), className: 'cursor-pointer transition-opacity hover:opacity-80', role: 'button', 'aria-label': spots[id].title })
  const label = 'text-[12px] fill-[var(--ink)]'

  const zones = [
    { id: 'young', x: 30, y: 72, t: ['Young', 'fans zone'] },
    { id: 'gather', x: 118, y: 72, t: ['Space to', 'gather'] },
    { id: 'merch', x: 30, y: 164, t: ['Merch &', 'prizes'] },
    { id: 'watch', x: 118, y: 164, t: ['Game-watch', 'station'] },
  ]

  return (
    <svg viewBox="0 0 640 470" className="w-full" role="img" aria-label="Play street site plan">
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--ice)" strokeWidth="2" />
        </pattern>
      </defs>
      <g className="note fill-[var(--muted)] text-[22px]">
        <text x="24" y="38">park lands</text>
        <text x="240" y="38">street</text>
        <text x="392" y="38">city parking</text>
      </g>

      <path d="M22 62 H206 V255 L60 262 Q22 262 22 225Z" fill="none" stroke="var(--line-strong)" strokeWidth="1.2" />
      {zones.map((z) => (
        <g key={z.id} {...hit(z.id)}>
          <rect x={z.x} y={z.y} width="82" height="84" rx="8" fill={park[z.id] ? 'var(--sage)' : 'white'} fillOpacity={park[z.id] ? 0.55 : 1} strokeDasharray={park[z.id] ? '0' : '4 4'} {...sel(z.id)} />
          {z.t.map((l, i) => (
            <text key={i} x={z.x + 41} y={z.y + 40 + i * 15} textAnchor="middle" className={label} opacity={park[z.id] ? 1 : 0.4}>{l}</text>
          ))}
        </g>
      ))}

      <rect x="222" y="55" width="8" height="400" rx="4" fill="var(--sage)" opacity="0.5" />
      <rect x="344" y="55" width="8" height="400" rx="4" fill="var(--sage)" opacity="0.5" />
      <rect x="236" y="55" width="102" height="400" fill="var(--surface-2)" stroke="var(--line-strong)" />
      {[52, 446].map((y) => (
        <rect key={y} {...hit('closure')} x="236" y={y - 4} width="102" height="12" rx="3" fill="var(--amber)" {...sel('closure')} />
      ))}
      <g {...hit('arena')}>
        <rect x="250" y="80" width="74" height="80" rx="16" fill="white" {...sel('arena')} />
        <line x1="250" y1="120" x2="324" y2="120" stroke="var(--red)" strokeOpacity="0.5" />
        <text x="287" y="105" textAnchor="middle" className={label}>Mini</text>
        <text x="287" y="142" textAnchor="middle" className={label}>arena</text>
      </g>
      <g {...hit('net')}>
        <path d="M262 215 A25 25 0 0 1 312 215 Z" fill="white" {...sel('net')} />
        <text x="287" y="233" textAnchor="middle" className={label}>Practice net</text>
      </g>
      <g {...hit('art')}>
        <rect x="260" y="268" width="24" height="52" rx="4" fill="var(--lilac)" {...sel('art')} />
        <rect x="298" y="350" width="24" height="62" rx="4" fill="var(--lilac)" {...sel('art')} />
      </g>
      <g {...hit('chalk')}>
        <circle cx="310" cy="300" r="9" fill="var(--lilac)" {...sel('chalk')} />
        <circle cx="268" cy="385" r="9" fill="var(--lilac)" {...sel('chalk')} />
      </g>

      <rect x="385" y="55" width="225" height="400" rx="12" fill="none" stroke="var(--slate-soft)" strokeWidth="8" />
      <g {...hit('tourney')}>
        <rect x="410" y="80" width="175" height="240" rx="30" fill="url(#hatch)" {...sel('tourney')} />
        <rect x="410" y="80" width="175" height="240" rx="30" fill="white" fillOpacity="0.4" />
        <line x1="410" y1="200" x2="585" y2="200" stroke="var(--red)" strokeOpacity="0.6" strokeWidth="1.5" />
        <circle cx="497" cy="200" r="20" fill="none" stroke="var(--navy)" strokeOpacity="0.6" />
        <text x="497" y="155" textAnchor="middle" className={label}>Tournament /</text>
        <text x="497" y="171" textAnchor="middle" className={label}>learn to play</text>
      </g>
      <g {...hit('meet')}>
        <rect x="430" y="345" width="135" height="80" rx="8" fill="var(--ice)" {...sel('meet')} />
        <text x="497" y="382" textAnchor="middle" className={label}>Meet the</text>
        <text x="497" y="398" textAnchor="middle" className={label}>player</text>
      </g>
    </svg>
  )
}

function PlayStreet({ siteName }) {
  const [active, setActive] = useState('arena')
  const [park, setPark] = useState({ young: true, gather: true, merch: true, watch: true })
  const spot = spots[active]
  const count = Object.values(park).filter(Boolean).length

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Panel className="p-3 sm:p-4">
        <div className="flex items-center justify-between px-2 pb-1 text-sm">
          <span className="font-semibold text-[var(--navy)]">Site plan · {siteName}</span>
          <Note>tap any element</Note>
        </div>
        <StreetPlan active={active} setActive={setActive} park={park} />
      </Panel>

      <div className="flex flex-col gap-6">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{spot.group}</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--navy)]">{spot.title}</h3>
          <p className="mt-2 leading-relaxed text-[var(--muted)]">{spot.note}</p>
          {spot.park && (
            <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input type="checkbox" className="h-4 w-4 accent-[var(--navy)]" checked={park[active]} onChange={(e) => setPark({ ...park, [active]: e.target.checked })} />
              Include at this site
            </label>
          )}
        </Panel>
        <Panel>
          <h3 className="font-semibold text-[var(--navy)]">Site checklist</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {['Uses parks, parking lots, streets and sidewalks', 'Business or municipal lots wherever possible', 'No rec centre or ice arena required', `${count} of 4 themed park activities`, 'Traffic diverted to a parallel road'].map((t) => (
              <li key={t} className="flex gap-2"><span className="text-[var(--sage-ink)]">✓</span>{t}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <figure className="lg:col-span-2">
        <div className="grid items-center gap-6 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,320px)_1fr] sm:p-6">
          <img src={sketch} alt="Hand-drawn concept sketch of a downtown play street layout" className="w-full rounded-lg border border-[var(--line)]" loading="lazy" />
          <figcaption>
            <Note className="text-xl">original concept sketch</Note>
            <p className="mt-2 leading-relaxed text-[var(--muted)]">
              The plan above is built from our sketch: close a downtown street, keep clear entry/exit points, divert traffic to a parallel road, and spread activities across the park, the street and nearby city-owned parking.
            </p>
          </figcaption>
        </div>
      </figure>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Feedback                                                          */
/* ------------------------------------------------------------------ */

function Feedback({ siteName }) {
  const [votes, setVotes] = useState({ skate: 38, street: 31, gear: 27, watch: 14 })
  const [mine, setMine] = useState(null)
  const total = Object.values(votes).reduce((a, b) => a + b, 0)
  const top = feedbackOptions.reduce((a, b) => (votes[b.id] > votes[a.id] ? b : a))

  const vote = (id) => {
    if (mine === id) return
    setVotes((v) => ({ ...v, [id]: v[id] + 1, ...(mine ? { [mine]: v[mine] - 1 } : {}) }))
    setMine(id)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <Panel>
        <div className="flex items-baseline justify-between">
          <h3 className="text-xl font-bold text-[var(--navy)]">What would bring you back?</h3>
          <Note>{total} responses</Note>
        </div>
        <p className="mt-1 text-sm text-[var(--muted)]">Exit survey at the {siteName} play street — try voting.</p>
        <div className="mt-5 space-y-2">
          {feedbackOptions.map((o) => {
            const pct = Math.round((votes[o.id] / total) * 100)
            return (
              <button
                key={o.id}
                onClick={() => vote(o.id)}
                className={`relative block w-full overflow-hidden rounded-xl border px-4 py-3 text-left transition ${mine === o.id ? 'border-[var(--navy)]' : 'border-[var(--line)] hover:border-[var(--line-strong)]'}`}
              >
                <span className="absolute inset-y-0 left-0 bg-[var(--ice-soft)] transition-all duration-500" style={{ width: `${pct}%` }} />
                <span className="relative flex justify-between gap-4 text-sm">
                  <span className="font-medium">{mine === o.id && '✓ '}{o.label}</span>
                  <span className="tabular-nums text-[var(--muted)]">{pct}%</span>
                </span>
              </button>
            )
          })}
        </div>
      </Panel>

      <div className="flex flex-col gap-6">
        <Panel className="!border-[var(--navy)] !bg-[var(--navy)] text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Recommended next step</p>
          <p className="mt-2 text-xl font-semibold leading-snug">{top.next(siteName)}</p>
        </Panel>
        <Panel>
          <h3 className="font-semibold text-[var(--navy)]">The loop</h3>
          <ol className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li><b className="text-[var(--ink)]">Atlas</b> finds where ice is hardest to reach.</li>
            <li><b className="text-[var(--ink)]">Play streets</b> bring the game there first.</li>
            <li><b className="text-[var(--ink)]">Feedback</b> decides what comes next — pop-up rinks, gear, more play.</li>
            <li>Results flow back into the <b className="text-[var(--ink)]">Atlas</b>.</li>
          </ol>
        </Panel>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [site, setSite] = useState('northfield')
  const siteName = hoods.find((h) => h.id === site).name

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-2 whitespace-nowrap font-bold tracking-tight text-[var(--navy)]">
            <Logo /> <span className="hidden sm:inline">Bring the Rink</span>
          </a>
          <nav className="flex gap-0.5 whitespace-nowrap text-sm font-medium text-[var(--muted)]">
            {[['#atlas', 'Atlas'], ['#play-street', 'Play Street'], ['#feedback', 'Feedback']].map(([h, t]) => (
              <a key={h} href={h} className="rounded-full px-2.5 py-1.5 transition hover:bg-[var(--surface-2)] hover:text-[var(--navy)]">{t}</a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--surface-2)] px-5 py-20 sm:px-8 sm:py-28">
          {/* faint centre-ice markings */}
          <svg viewBox="0 0 1200 500" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
            <line x1="1060" y1="0" x2="1060" y2="500" stroke="var(--red)" strokeOpacity="0.15" strokeWidth="6" />
            <line x1="880" y1="0" x2="880" y2="500" stroke="var(--blue-line)" strokeOpacity="0.1" strokeWidth="10" />
            <circle cx="1060" cy="250" r="150" fill="none" stroke="var(--blue-line)" strokeOpacity="0.12" strokeWidth="3" />
            <circle cx="1060" cy="250" r="6" fill="var(--blue-line)" fillOpacity="0.25" />
          </svg>
          <div className="relative mx-auto max-w-6xl">
            <Note className="text-2xl">#BringTheRink</Note>
            <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-[var(--navy)] sm:text-6xl">
              Bring hockey to the neighbourhoods furthest from the ice.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Map where access is lowest, turn streets and parking lots into pop-up places to play, and let community feedback decide what comes next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#atlas" className="rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--navy-2)]">Try the demo</a>
              <a href="#play-street" className="rounded-full border border-[var(--line-strong)] bg-white px-6 py-3 text-sm font-semibold text-[var(--navy)] transition hover:border-[var(--navy)]">See a play street</a>
            </div>
          </div>
        </section>

        <Section id="atlas" step="1" eyebrow="Rink Atlas" title="Find the gaps" intro="Combine rink locations, ice time, transit, income and youth population to see where hockey is hardest to reach.">
          <Atlas site={site} setSite={setSite} />
        </Section>

        <Section id="play-street" step="2" eyebrow="Play Streets" title={`A play street in ${siteName}`} intro="Close a street for a day and bring the game to people — no ice, gear or rec centre required." tint>
          <PlayStreet key={site} siteName={siteName} />
        </Section>

        <Section id="feedback" step="3" eyebrow="Feedback" title="Let the community decide what's next" intro="Every event gathers feedback, which shapes the next investment — from more play streets to a seasonal pop-up rink.">
          <Feedback key={site} siteName={siteName} />
        </Section>
      </main>

      <footer className="border-t border-[var(--line)] px-5 py-8 text-sm text-[var(--muted)] sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 sm:flex-row">
          <span className="flex items-center gap-2 font-semibold text-[var(--navy)]"><Logo /> Bring the Rink</span>
          <span>A student concept for the NHL Innovation Challenge. Not affiliated with or endorsed by the NHL. Sample data only.</span>
        </div>
      </footer>
    </>
  )
}

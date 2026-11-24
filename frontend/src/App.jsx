import { useState } from 'react'

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

// Fictional city used for the demo. Need score blends distance to ice,
// public ice time nearby, income and youth population.
const hoods = [
  { id: 'northfield', name: 'Northfield', x: 20, y: 105, w: 145, h: 90, km: 5.8, iceHrs: 2, income: 0.32, youth: 27 },
  { id: 'oldmill', name: 'Old Mill', x: 205, y: 105, w: 210, h: 90, km: 3.2, iceHrs: 5, income: 0.55, youth: 21 },
  { id: 'eastgate', name: 'Eastgate', x: 450, y: 115, w: 170, h: 95, km: 4.6, iceHrs: 3, income: 0.4, youth: 24 },
  { id: 'westbrook', name: 'Westbrook', x: 20, y: 230, w: 145, h: 95, km: 2.5, iceHrs: 6, income: 0.48, youth: 19 },
  { id: 'downtown', name: 'Downtown Core', x: 205, y: 228, w: 210, h: 100, km: 0.6, iceHrs: 14, income: 0.7, youth: 12 },
  { id: 'harbour', name: 'Harbourview', x: 450, y: 245, w: 170, h: 85, km: 0.9, iceHrs: 11, income: 0.82, youth: 15 },
]

const rinks = [
  { x: 385, y: 252 },
  { x: 595, y: 268 },
]

const scoreOf = (n) =>
  Math.round(
    Math.min(n.km / 6, 1) * 40 + (1 - Math.min(n.iceHrs / 15, 1)) * 20 + (1 - n.income) * 25 + Math.min(n.youth / 30, 1) * 15,
  )

const verdict = (s) =>
  s >= 65 ? { label: 'Priority play street', color: 'var(--lime)' } : s >= 45 ? { label: 'Next wave', color: 'var(--orange)' } : { label: 'Support existing rink', color: 'var(--ice)' }

const spots = {
  closure: {
    title: 'Street closure',
    note: 'Clear entry/exit areas at both ends. Traffic is diverted to the parallel road, with extra traffic-watch on the perimeter.',
  },
  arena: {
    title: 'Street hockey mini "arena"',
    note: 'Low boards on the closed street. Sticks and balls provided — no skates, no gear, no sign-up.',
  },
  net: { title: 'Practice net', note: 'Drop-in shooting practice for first-timers while they wait for a game.' },
  art: { title: 'Hockey-themed street art', note: 'Murals and installations painted by local artists, left behind after the event.' },
  chalk: { title: 'Interactive chalk art', note: 'Chalk rinks, plays and drills on the sidewalk — hockey activities for the littlest fans.' },
  tourney: {
    title: 'Street hockey tourney / learn-to-play',
    note: 'Uses nearby city-owned (or business) parking so the event does not depend on a rec centre with ice.',
  },
  meet: {
    title: 'Meet the player',
    note: 'Autographs and speakers from the PWHL, AHL, OHL and more — not only the NHL — so kids see themselves represented.',
  },
  young: { title: 'Young fans zone', note: 'Mini games, face paint and gear try-ons for kids.', park: true },
  gather: { title: 'Space to gather', note: 'Shaded seating, food and room to just hang out.', park: true },
  merch: { title: 'Merch booths & prizes', note: 'Local team booths, giveaways and an equipment swap table.', park: true },
  watch: { title: 'Game-watch station', note: 'Big screen showing the game, with a rules-explainer host for new fans.', park: true },
}

const feedbackOptions = [
  { id: 'skate', label: 'Learn to skate (pop-up rink)' },
  { id: 'street', label: 'More street hockey' },
  { id: 'gear', label: 'Equipment lending / swap' },
  { id: 'watch', label: 'Neighbourhood watch parties' },
]

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const Defs = () => (
  <defs>
    <filter id="rough">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" />
      <feDisplacementMap in="SourceGraphic" scale="3.5" />
    </filter>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="var(--ice)" strokeWidth="2.5" />
    </pattern>
  </defs>
)

function Bar({ value, max = 100, color }) {
  return (
    <div className="h-3 w-full rounded-full border-2 border-[var(--ink)] bg-white/60">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  )
}

function Card({ children, className = '' }) {
  return <div className={`rounded-xl border-2 border-[var(--ink)] bg-[var(--paper)] p-5 shadow-[4px_4px_0_var(--ink)] ${className}`}>{children}</div>
}

/* ------------------------------------------------------------------ */
/* Step 1: Rink Atlas                                                   */
/* ------------------------------------------------------------------ */

function Atlas({ selected, onSelect, onPlan }) {
  const ranked = [...hoods].map((h) => ({ ...h, score: scoreOf(h) })).sort((a, b) => b.score - a.score)
  const sel = ranked.find((h) => h.id === selected)
  const v = verdict(sel.score)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card className="self-start p-2 sm:p-3">
        <svg viewBox="0 0 640 440" className="w-full" role="img" aria-label="Map of a city with neighbourhoods and rinks">
          <Defs />
          {/* lake */}
          <path d="M0 375 Q160 355 320 380 T640 370 V440 H0Z" fill="var(--ice)" opacity="0.45" filter="url(#rough)" />
          {/* streets */}
          <g stroke="var(--slate)" strokeWidth="14" strokeLinecap="round" fill="none" filter="url(#rough)" opacity="0.85">
            <path d="M-10 90 C200 80 420 100 650 84" />
            <path d="M-10 212 C220 200 420 214 650 228" />
            <path d="M-10 342 L650 350" />
            <path d="M185 -10 L190 450" />
            <path d="M435 -10 L430 450" />
          </g>
          {hoods.map((h) => {
            const s = scoreOf(h)
            const active = h.id === selected
            return (
              <g key={h.id} onClick={() => onSelect(h.id)} className="cursor-pointer" role="button" aria-label={h.name}>
                <rect
                  x={h.x}
                  y={h.y}
                  width={h.w}
                  height={h.h}
                  rx="8"
                  fill={verdict(s).color}
                  fillOpacity={active ? 0.85 : 0.35}
                  stroke="var(--ink)"
                  strokeWidth={active ? 3 : 1.5}
                  strokeDasharray={active ? '0' : '6 5'}
                  filter="url(#rough)"
                  className="transition-all hover:fill-opacity-70"
                />
                <text x={h.x + 10} y={h.y + 26} className="hand text-[19px]" fill="var(--ink)">
                  {h.name}
                </text>
                <text x={h.x + 10} y={h.y + h.h - 12} className="hand text-[15px]" fill="var(--ink)" opacity="0.75">
                  need {s} · {h.km} km to ice
                </text>
              </g>
            )
          })}
          {rinks.map((r, i) => (
            <g key={i} pointerEvents="none">
              <rect x={r.x - 16} y={r.y - 11} width="32" height="22" rx="9" fill="var(--ice)" stroke="var(--ink)" strokeWidth="2" filter="url(#rough)" />
              <line x1={r.x} y1={r.y - 11} x2={r.x} y2={r.y + 11} stroke="var(--ink)" strokeWidth="1.5" />
            </g>
          ))}
          <text x="20" y="40" className="marker text-[30px]" fill="var(--ink)">
            [the city]
          </text>
          <g className="hand text-[15px]" fill="var(--ink)">
            <rect x="470" y="22" width="22" height="15" rx="6" fill="var(--ice)" stroke="var(--ink)" strokeWidth="1.5" />
            <text x="500" y="35">= existing rink</text>
          </g>
        </svg>
      </Card>

      <div className="flex flex-col gap-5">
        <Card>
          <p className="hand text-lg opacity-70">selected neighbourhood</p>
          <h3 className="marker text-4xl leading-none">{sel.name}</h3>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="marker text-6xl leading-none">{sel.score}</span>
            <span className="hand text-lg">/ 100 need score</span>
          </div>
          <span className="hand mt-2 inline-block rounded-md border-2 border-[var(--ink)] px-2 text-lg" style={{ background: v.color }}>
            → {v.label}
          </span>
          <div className="hand mt-4 space-y-2 text-lg">
            <Row label={`Distance to ice: ${sel.km} km`}><Bar value={Math.min(sel.km, 6)} max={6} color="var(--orange)" /></Row>
            <Row label={`Public ice nearby: ${sel.iceHrs} hrs/wk`}><Bar value={15 - Math.min(sel.iceHrs, 15)} max={15} color="var(--purple)" /></Row>
            <Row label={`Cost barrier`}><Bar value={1 - sel.income} max={1} color="var(--slate)" /></Row>
            <Row label={`Youth population: ${sel.youth}%`}><Bar value={sel.youth} max={30} color="var(--lime)" /></Row>
          </div>
          <button
            onClick={onPlan}
            className="marker mt-5 w-full rounded-lg border-2 border-[var(--ink)] bg-[var(--lime)] px-4 py-2 text-2xl shadow-[3px_3px_0_var(--ink)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            plan a play street here →
          </button>
        </Card>

        <Card>
          <p className="hand mb-2 text-lg opacity-70">ranked by need</p>
          <ol className="hand space-y-1 text-lg">
            {ranked.map((h, i) => (
              <li key={h.id}>
                <button onClick={() => onSelect(h.id)} className={`flex w-full items-center gap-3 rounded px-1 text-left ${h.id === selected ? 'bg-[var(--lime)]/50' : 'hover:bg-black/5'}`}>
                  <span className="w-5">{i + 1}.</span>
                  <span className="flex-1">{h.name}</span>
                  <span className="h-3 w-3 rounded-full border border-[var(--ink)]" style={{ background: verdict(h.score).color }} />
                  <span className="w-8 text-right">{h.score}</span>
                </button>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div>
      <div>{label}</div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Step 2: Play Street                                                  */
/* ------------------------------------------------------------------ */

function PlayStreet({ site }) {
  const [active, setActive] = useState('arena')
  const [park, setPark] = useState({ young: true, gather: true, merch: true, watch: true })
  const spot = spots[active]
  const on = Object.values(park).filter(Boolean).length

  const hit = (id) => ({
    onClick: () => setActive(id),
    className: 'cursor-pointer',
    role: 'button',
    'aria-label': spots[id].title,
    opacity: active === id ? 1 : 0.88,
  })
  const ring = (id) => (active === id ? { stroke: 'var(--ink)', strokeWidth: 3.5 } : { stroke: 'var(--ink)', strokeWidth: 1.5 })

  const parkZones = [
    { id: 'young', x: 28, y: 70, label: ['young', 'fans zone'] },
    { id: 'gather', x: 118, y: 70, label: ['space to', 'gather'] },
    { id: 'merch', x: 28, y: 165, label: ['merch booths', '& prizes'] },
    { id: 'watch', x: 118, y: 165, label: ['game watch', 'station'] },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card className="self-start p-2 sm:p-3">
        <svg viewBox="0 0 640 470" className="w-full" role="img" aria-label={`Play street layout for ${site}`}>
          <Defs />
          <text x="20" y="38" className="marker text-[28px]" fill="var(--ink)">park lands</text>
          <text x="236" y="38" className="marker text-[28px]" fill="var(--ink)">street</text>
          <text x="392" y="38" className="marker text-[28px]" fill="var(--ink)">city parking</text>

          {/* park */}
          <g filter="url(#rough)">
            <path d="M22 62 H206 V255 L60 262 Q22 262 22 225Z" fill="none" stroke="var(--ink)" strokeWidth="2" />
          </g>
          {parkZones.map((z) => (
            <g key={z.id} {...hit(z.id)}>
              <rect
                x={z.x}
                y={z.y}
                width="84"
                height="88"
                rx="6"
                fill={park[z.id] ? 'var(--lime)' : 'transparent'}
                strokeDasharray={park[z.id] ? '0' : '5 5'}
                {...ring(z.id)}
                filter="url(#rough)"
              />
              {z.label.map((l, i) => (
                <text key={i} x={z.x + 42} y={z.y + 40 + i * 18} textAnchor="middle" className="hand text-[15px]" fill="var(--ink)" opacity={park[z.id] ? 1 : 0.45}>
                  {park[z.id] ? l : i === 0 ? 'open' : 'green space'}
                </text>
              ))}
            </g>
          ))}

          {/* sidewalks */}
          <g fill="var(--lime)" filter="url(#rough)">
            <rect x="222" y="55" width="10" height="400" rx="4" />
            <rect x="342" y="55" width="10" height="400" rx="4" />
          </g>
          {/* street */}
          <rect x="236" y="55" width="102" height="400" fill="none" stroke="var(--ink)" strokeWidth="2" filter="url(#rough)" />
          {/* closures */}
          {[55, 443].map((y) => (
            <rect key={y} {...hit('closure')} x="236" y={y - 6} width="102" height="14" rx="3" fill="var(--orange)" {...ring('closure')} filter="url(#rough)" />
          ))}
          {/* mini arena */}
          <g {...hit('arena')}>
            <rect x="250" y="80" width="74" height="78" rx="14" fill="white" {...ring('arena')} filter="url(#rough)" />
            <text x="287" y="112" textAnchor="middle" className="hand text-[14px]" fill="var(--ink)">street</text>
            <text x="287" y="128" textAnchor="middle" className="hand text-[14px]" fill="var(--ink)">hockey</text>
            <text x="287" y="144" textAnchor="middle" className="hand text-[14px]" fill="var(--ink)">mini arena</text>
          </g>
          {/* practice net */}
          <g {...hit('net')}>
            <path d="M262 215 A25 25 0 0 1 312 215 Z" fill="white" {...ring('net')} filter="url(#rough)" />
            <text x="287" y="235" textAnchor="middle" className="hand text-[14px]" fill="var(--ink)">practice net</text>
          </g>
          {/* street art */}
          <g {...hit('art')}>
            <rect x="262" y="268" width="26" height="52" rx="4" fill="var(--purple)" {...ring('art')} filter="url(#rough)" />
            <rect x="296" y="350" width="26" height="62" rx="4" fill="var(--purple)" {...ring('art')} filter="url(#rough)" />
          </g>
          {/* chalk */}
          <g {...hit('chalk')}>
            <circle cx="310" cy="300" r="10" fill="var(--purple)" {...ring('chalk')} filter="url(#rough)" />
            <circle cx="268" cy="385" r="10" fill="var(--purple)" {...ring('chalk')} filter="url(#rough)" />
            <circle cx="226" cy="340" r="8" fill="var(--purple)" {...ring('chalk')} filter="url(#rough)" />
          </g>

          {/* parking lot */}
          <rect x="385" y="55" width="225" height="400" rx="10" fill="none" stroke="var(--slate)" strokeWidth="12" filter="url(#rough)" />
          <g {...hit('tourney')}>
            <rect x="410" y="80" width="175" height="240" rx="28" fill="url(#hatch)" {...ring('tourney')} filter="url(#rough)" />
            <line x1="410" y1="200" x2="585" y2="200" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="497" cy="200" r="20" fill="none" stroke="var(--ink)" strokeWidth="2" />
            <path d="M465 100 h-12 v12 M529 100 h12 v12 M465 300 h-12 v-12 M529 300 h12 v-12" stroke="var(--ink)" strokeWidth="2" fill="none" />
            <text x="497" y="160" textAnchor="middle" className="hand text-[15px]" fill="var(--ink)">tourney /</text>
            <text x="497" y="177" textAnchor="middle" className="hand text-[15px]" fill="var(--ink)">learn to play</text>
          </g>
          <g {...hit('meet')}>
            <rect x="430" y="345" width="135" height="80" rx="6" fill="var(--ice)" {...ring('meet')} filter="url(#rough)" />
            <text x="497" y="380" textAnchor="middle" className="hand text-[15px]" fill="var(--ink)">meet the</text>
            <text x="497" y="398" textAnchor="middle" className="hand text-[15px]" fill="var(--ink)">player</text>
          </g>
        </svg>
      </Card>

      <div className="flex flex-col gap-5">
        <Card>
          <p className="hand text-lg opacity-70">tap anything on the plan</p>
          <h3 className="marker text-4xl leading-none">{spot.title}</h3>
          <p className="hand mt-3 text-xl leading-snug">{spot.note}</p>
          {spot.park && (
            <label className="hand mt-4 flex cursor-pointer items-center gap-3 text-xl">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[var(--lime)]"
                checked={park[active]}
                onChange={(e) => setPark({ ...park, [active]: e.target.checked })}
              />
              include at this site
            </label>
          )}
        </Card>

        <Card className="bg-[var(--note)]">
          <p className="marker text-3xl leading-none">{site} set-up</p>
          <ul className="hand mt-3 space-y-1 text-lg leading-snug">
            <li>✓ uses local parks, parking lots, streets & sidewalks</li>
            <li>✓ business or municipal lots wherever possible</li>
            <li>✓ no rec centre or ice arena required</li>
            <li>✓ {on} of 4 themed park activities</li>
            <li>✓ traffic diverted to parallel road</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Step 3: Feedback → what comes next                                   */
/* ------------------------------------------------------------------ */

function Feedback({ site }) {
  const [votes, setVotes] = useState({ skate: 38, street: 31, gear: 27, watch: 14 })
  const [mine, setMine] = useState(null)
  const total = Object.values(votes).reduce((a, b) => a + b, 0)
  const top = feedbackOptions.reduce((a, b) => (votes[b.id] > votes[a.id] ? b : a))
  const colors = { skate: 'var(--ice)', street: 'var(--lime)', gear: 'var(--orange)', watch: 'var(--purple)' }

  const vote = (id) => {
    if (mine === id) return
    setVotes((v) => ({ ...v, [id]: v[id] + 1, ...(mine ? { [mine]: v[mine] - 1 } : {}) }))
    setMine(id)
  }

  const next = {
    skate: `Bring a seasonal pop-up rink to ${site}, with free skate lending.`,
    street: `Make the ${site} play street a monthly event.`,
    gear: `Set up an equipment lending library with local partners in ${site}.`,
    watch: `Run free watch parties with rules explainers in ${site}.`,
  }[top.id]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <p className="hand text-lg opacity-70">exit survey at the {site} play street</p>
        <h3 className="marker text-4xl leading-none">What would bring you back?</h3>
        <div className="mt-5 space-y-4">
          {feedbackOptions.map((o) => (
            <button key={o.id} onClick={() => vote(o.id)} className={`hand block w-full rounded-lg border-2 p-3 text-left text-xl transition ${mine === o.id ? 'border-[var(--ink)] bg-white' : 'border-transparent hover:border-[var(--ink)]/40'}`}>
              <div className="mb-1 flex justify-between">
                <span>{mine === o.id ? '☑' : '☐'} {o.label}</span>
                <span>{Math.round((votes[o.id] / total) * 100)}%</span>
              </div>
              <Bar value={votes[o.id]} max={total} color={colors[o.id]} />
            </button>
          ))}
        </div>
        <p className="hand mt-4 text-lg opacity-70">{total} responses</p>
      </Card>

      <div className="flex flex-col gap-5">
        <Card className="bg-[var(--note)]">
          <p className="hand text-lg opacity-70">recommended next step</p>
          <p className="marker mt-1 text-3xl leading-tight">{next}</p>
        </Card>
        <Card>
          <p className="marker text-3xl leading-none">the loop</p>
          <ol className="hand mt-3 space-y-1 text-lg leading-snug">
            <li>1. Atlas finds where ice is hardest to reach</li>
            <li>2. Play street brings the game there first</li>
            <li>3. Feedback decides what stays — pop-up rink, gear, more play</li>
            <li>4. Results feed back into the Atlas</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                  */
/* ------------------------------------------------------------------ */

const steps = [
  { n: 1, name: 'Rink Atlas', hint: 'find the gaps', color: 'var(--ice)' },
  { n: 2, name: 'Play Street', hint: 'bring the game out', color: 'var(--lime)' },
  { n: 3, name: 'Feedback', hint: 'decide what comes next', color: 'var(--orange)' },
]

export default function App() {
  const [step, setStep] = useState(1)
  const [site, setSite] = useState('northfield')
  const siteName = hoods.find((h) => h.id === site).name

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="marker text-5xl leading-none sm:text-6xl">#BringTheRink</h1>
          <p className="hand mt-1 text-xl opacity-75">bringing hockey to neighbourhoods far from the ice — demo</p>
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-3" aria-label="Demo steps">
        {steps.map((s) => (
          <button
            key={s.n}
            onClick={() => setStep(s.n)}
            aria-current={step === s.n ? 'step' : undefined}
            className={`rounded-lg border-2 border-[var(--ink)] px-4 py-1.5 text-left transition ${step === s.n ? 'shadow-[3px_3px_0_var(--ink)]' : 'bg-transparent opacity-60 hover:opacity-100'}`}
            style={step === s.n ? { background: s.color } : undefined}
          >
            <span className="marker block text-2xl leading-none">{s.n}. {s.name}</span>
            <span className="hand text-base">{s.hint}</span>
          </button>
        ))}
      </nav>

      {step === 1 && (
        <Atlas
          selected={site}
          onSelect={setSite}
          onPlan={() => setStep(2)}
        />
      )}
      {step === 2 && <PlayStreet key={site} site={siteName} />}
      {step === 3 && <Feedback key={site} site={siteName} />}

      <div className="mt-6 flex justify-between">
        <button disabled={step === 1} onClick={() => setStep(step - 1)} className="hand text-xl underline decoration-2 underline-offset-4 disabled:invisible">
          ← back
        </button>
        <button disabled={step === 3} onClick={() => setStep(step + 1)} className="hand text-xl underline decoration-2 underline-offset-4 disabled:invisible">
          next →
        </button>
      </div>
    </div>
  )
}

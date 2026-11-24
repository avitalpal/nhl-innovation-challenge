const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Pin = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

const phases = [
  {
    number: '01',
    name: 'Rink Atlas',
    label: 'Find the gaps',
    description:
      'Map rink access, transit, population, and recreation spaces to see where hockey is hardest to reach—and where a little investment can go furthest.',
    detail: 'A shared picture of access',
    icon: '⌖',
  },
  {
    number: '02',
    name: 'Play Streets',
    label: 'Bring the game out',
    description:
      'Turn welcoming public spaces into pop-up places to play. Street hockey, try-it sessions, and local hosts make the first step feel easy.',
    detail: 'Free, local, and made together',
    icon: '↗',
  },
  {
    number: '03',
    name: 'Pop-up Rinks',
    label: 'Make room to grow',
    description:
      'Use community feedback and local partnerships to shape seasonal skating experiences, equipment access, and pathways into ongoing play.',
    detail: 'A city-specific next step',
    icon: '✳',
  },
]

const benefits = [
  { value: '01', title: 'Closer to home', copy: 'Meet people where they are, not only where the ice is.' },
  { value: '02', title: 'Easier to enter', copy: 'Make equipment, first-time play, and the culture of hockey less intimidating.' },
  { value: '03', title: 'Built to belong', copy: 'Let each neighbourhood shape what hockey looks and feels like there.' },
]

function App() {
  return (
    <div className="overflow-hidden">
      <header className="relative z-10 border-b border-white/10 bg-[#071b2a] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <a href="#top" className="flex items-center gap-3" aria-label="Bring the Rink home">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#d9f0e5]/60 text-sm font-bold text-[#d9f0e5]">B/R</span>
            <span className="text-sm font-bold tracking-[0.13em]">BRING THE RINK</span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a className="transition hover:text-white" href="#why">The challenge</a>
            <a className="transition hover:text-white" href="#approach">Our approach</a>
            <a className="transition hover:text-white" href="#impact">The impact</a>
            <a className="transition hover:text-white" href="#team">Our perspective</a>
          </nav>
          <a href="#approach" className="rounded-full bg-[#d9f0e5] px-4 py-2.5 text-xs font-bold tracking-wide text-[#092033] transition hover:bg-white sm:px-5">
            Explore the idea <span aria-hidden="true" className="ml-1">↘</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden bg-[#071b2a] text-white">
          <div aria-hidden="true" className="absolute -right-36 -top-32 -z-10 h-[34rem] w-[34rem] rounded-full border border-white/10 sm:right-[-5rem] sm:top-[-18rem] sm:h-[58rem] sm:w-[58rem]">
            <div className="absolute inset-10 rounded-full border border-white/[0.08]" />
            <div className="absolute inset-24 rounded-full border border-white/[0.08]" />
            <div className="absolute inset-40 rounded-full border border-white/[0.08]" />
          </div>
          <div aria-hidden="true" className="absolute bottom-[-8rem] left-[-10rem] -z-10 h-80 w-80 rounded-full bg-[#d9f0e5]/[0.07] blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-32 lg:pt-28">
            <div className="max-w-2xl">
              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#c8e8d9]">
                <span className="h-px w-8 bg-[#c8e8d9]" /> A more open game
              </p>
              <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Hockey belongs
                <br />
                <span className="italic text-[#c8e8d9]">everywhere.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                What if the next great hockey community started on the street outside the rink? Bring The Rink is a people-first plan to make playing—and connecting with—the game easier to reach.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#approach" className="inline-flex items-center gap-2 rounded-full bg-[#d9f0e5] px-6 py-3.5 text-sm font-bold text-[#092033] transition hover:bg-white">
                  See how it works <ArrowUpRight />
                </a>
                <a href="#why" className="px-3 py-3 text-sm font-semibold text-white/75 transition hover:text-white">
                  Why access matters <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="mt-12 flex items-center gap-4 border-t border-white/15 pt-6">
                <div className="flex -space-x-2" aria-hidden="true">
                  <span className="h-8 w-8 rounded-full border-2 border-[#071b2a] bg-[#d9f0e5]" />
                  <span className="h-8 w-8 rounded-full border-2 border-[#071b2a] bg-[#e6a77a]" />
                  <span className="h-8 w-8 rounded-full border-2 border-[#071b2a] bg-[#a7c7d7]" />
                </div>
                <p className="text-xs leading-5 text-white/60">A community-led vision for<br className="sm:hidden" /> the future of hockey</p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="relative aspect-[1.08] overflow-hidden rounded-[2rem] border border-white/10 bg-[#102d3d] p-5 sm:p-8">
                <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(30deg, transparent 49.7%, rgba(255,255,255,.13) 50%, transparent 50.3%), linear-gradient(150deg, transparent 49.7%, rgba(255,255,255,.13) 50%, transparent 50.3%)', backgroundSize: '56px 56px' }} />
                <div className="relative flex h-full flex-col justify-between rounded-[1.4rem] border border-dashed border-white/20 p-5 sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">A new map of access</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d9f0e5] text-[#092033]"><Pin /></span>
                  </div>
                  <div className="absolute left-[13%] top-[25%] h-3 w-3 rounded-full bg-[#d9f0e5] shadow-[0_0_0_8px_rgba(217,240,229,.13)]" />
                  <div className="absolute right-[19%] top-[39%] h-2.5 w-2.5 rounded-full bg-[#e6a77a] shadow-[0_0_0_7px_rgba(230,167,122,.14)]" />
                  <div className="absolute left-[44%] top-[47%] h-3 w-3 rounded-full bg-[#d9f0e5] shadow-[0_0_0_8px_rgba(217,240,229,.13)]" />
                  <div className="absolute bottom-[26%] right-[29%] h-2.5 w-2.5 rounded-full bg-[#e6a77a] shadow-[0_0_0_7px_rgba(230,167,122,.14)]" />
                  <div className="absolute left-[19%] top-[33%] h-[1px] w-[37%] rotate-[29deg] bg-white/30" />
                  <div className="absolute left-[45%] top-[52%] h-[1px] w-[34%] -rotate-[19deg] bg-white/30" />
                  <div className="relative mt-auto rounded-2xl border border-white/10 bg-[#071b2a]/90 p-5 backdrop-blur-sm sm:p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8e8d9]">Access is more than a rink</p>
                    <p className="mt-3 font-serif text-2xl leading-tight sm:text-3xl">Find the gap.<br />Meet the community.</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/60">
                      <span>People + places + play</span><span aria-hidden="true">✳</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-2 rounded-xl bg-[#e6a77a] px-4 py-3 text-[#092033] shadow-xl sm:-left-7 sm:px-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em]">Start where people are</p>
                <p className="mt-1 font-serif text-xl">Neighbourhood first</p>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="bg-[#f5f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#467062]">The barrier</p>
              <h2 className="mt-5 max-w-lg font-serif text-4xl leading-[1.05] tracking-tight text-[#0b2534] sm:text-5xl">
                The game is for everyone. The way in isn’t.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-[#41525a]">
                Hockey asks a lot before you ever get to the first faceoff: a nearby rink, time, travel, specialized equipment, and the confidence to understand a game with its own language. For many communities, those barriers add up to a sport that feels out of reach.
              </p>
              <p className="mt-5 text-base leading-7 text-[#64727a]">
                Physical access, cost, and cultural familiarity are connected. If we want more people to find the passion, community, and connection at the heart of hockey, we have to make the first invitation easier to accept.
              </p>
              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                {benefits.map((benefit) => (
                  <div key={benefit.value} className="border-t border-[#cbd3cc] pt-4">
                    <p className="text-xs font-bold tracking-[0.14em] text-[#467062]">{benefit.value}</p>
                    <h3 className="mt-3 text-sm font-bold text-[#0b2534]">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#64727a]">{benefit.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="approach" className="bg-[#e6eee8] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#467062]">A phased approach</p>
                <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-[#0b2534] sm:text-5xl">Listen first. Then bring the game closer.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#64727a]">A flexible, city-by-city model—starting with what communities need, then building the right kind of play together.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {phases.map((phase) => (
                <article key={phase.number} className="group flex min-h-[22rem] flex-col rounded-2xl border border-[#d2ddd5] bg-[#f7f7f2] p-6 transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.16em] text-[#467062]">PHASE {phase.number}</span>
                    <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-[#d9e8dd] font-serif text-2xl text-[#315d4d]">{phase.icon}</span>
                  </div>
                  <p className="mt-10 text-xs font-bold uppercase tracking-[0.16em] text-[#a46543]">{phase.label}</p>
                  <h3 className="mt-2 font-serif text-3xl text-[#0b2534]">{phase.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#64727a]">{phase.description}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-[#d2ddd5] pt-5 text-xs font-semibold text-[#315d4d]">
                    <span>{phase.detail}</span><span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="bg-[#f5f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div className="relative min-h-[25rem] overflow-hidden rounded-3xl bg-[#dce9df] p-7 sm:p-10">
              <div aria-hidden="true" className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#799485 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              <div className="absolute left-[12%] top-[20%] h-24 w-24 rounded-full border border-[#6c8c7c]/50" />
              <div className="absolute left-[19%] top-[28%] h-10 w-10 rounded-full bg-[#e6a77a]" />
              <div className="absolute right-[18%] top-[30%] h-16 w-16 rounded-full border border-dashed border-[#6c8c7c]" />
              <div className="absolute right-[24%] top-[36%] h-5 w-5 rounded-full bg-[#315d4d]" />
              <div className="absolute left-[43%] top-[50%] h-20 w-20 rounded-full border border-[#6c8c7c]/50" />
              <div className="absolute left-[50%] top-[57%] h-5 w-5 rounded-full bg-[#315d4d]" />
              <div className="absolute left-[22%] top-[38%] h-px w-[39%] rotate-[17deg] bg-[#789286]" />
              <div className="absolute left-[51%] top-[55%] h-px w-[29%] -rotate-[15deg] bg-[#789286]" />
              <div className="relative flex h-full min-h-[25rem] flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#315d4d]"><Pin /> Designed with local insight</div>
                <div className="max-w-xs rounded-2xl bg-[#f7f7f2] p-5 shadow-lg sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a46543]">A useful first question</p>
                  <p className="mt-3 font-serif text-2xl leading-tight text-[#0b2534]">Where could hockey show up next?</p>
                </div>
              </div>
            </div>
            <div className="self-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#467062]">Built for real-world impact</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-[#0b2534] sm:text-5xl">More than a moment. A way to belong.</h2>
              <p className="mt-6 text-base leading-7 text-[#64727a]">
                Play streets and pop-up rinks can create a low-pressure first connection. With local artists, recreation teams, nonprofits, and residents involved, each activation can reflect the place it calls home.
              </p>
              <div className="mt-8 space-y-5">
                <div className="border-l-2 border-[#e6a77a] pl-5">
                  <h3 className="font-bold text-[#0b2534]">Make play part of the neighbourhood</h3>
                  <p className="mt-1 text-sm leading-6 text-[#64727a]">Toronto’s Bentway Play Path and community play-street projects show how public space can invite movement, discovery, and gathering.</p>
                </div>
                <div className="border-l-2 border-[#315d4d] pl-5">
                  <h3 className="font-bold text-[#0b2534]">Create an invitation that lasts</h3>
                  <p className="mt-1 text-sm leading-6 text-[#64727a]">The goal is not only a feel-good event—it’s a local connection to people, equipment, programs, and the game beyond the day itself.</p>
                </div>
              </div>
              <a className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#315d4d] hover:text-[#a46543]" href="https://play.thebentway.ca/experience/play-path/" target="_blank" rel="noreferrer">
                Explore the Bentway Play Path <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[#102d3d] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c8e8d9]">Plan with purpose</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Use the data.<br /><span className="italic text-[#c8e8d9]">Keep the people.</span></h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                Good planning helps cities and the NHL understand where investment can make the biggest difference—before committing to a project.
              </p>
              <a className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#c8e8d9] hover:text-white" href="https://www.udg.org.uk/publications/udlibrary/planning-play" target="_blank" rel="noreferrer">
                Read about planning for play <ArrowUpRight />
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
                <span className="text-xs font-bold tracking-[0.15em] text-[#c8e8d9]">01 / UNDERSTAND</span>
                <h3 className="mt-8 font-serif text-2xl">See the full picture</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">Bring rink locations, transit, public spaces, and community needs into the same conversation.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
                <span className="text-xs font-bold tracking-[0.15em] text-[#c8e8d9]">02 / LISTEN</span>
                <h3 className="mt-8 font-serif text-2xl">Ask people who live there</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">Use feedback sessions and local partners to understand what would make a space welcoming.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
                <span className="text-xs font-bold tracking-[0.15em] text-[#c8e8d9]">03 / TRY</span>
                <h3 className="mt-8 font-serif text-2xl">Start small, learn fast</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">Pilot pop-up programming and learn from participation, partner input, and what the community asks for next.</p>
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-[#d9f0e5] p-6 text-[#092033] sm:p-7">
                <span className="text-xs font-bold tracking-[0.15em]">04 / GROW</span>
                <p className="mt-8 font-serif text-3xl leading-tight">Let what works<br />travel further.</p>
                <p className="mt-4 text-sm leading-6 text-[#415d52]">Share the learning. Keep each city’s approach its own.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className="bg-[#f5f4ee] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#467062]">Our perspective</p>
              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-[#0b2534] sm:text-5xl">Different routes to the game. One shared goal.</h2>
            </div>
            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-[#41525a]">
                We bring together urban planning, engineering, and very different relationships with hockey. Some of us grew up surrounded by the game. One of us has never been skating, despite being a fan, because access to ice was out of reach.
              </p>
              <p className="mt-5 text-base leading-7 text-[#64727a]">
                Those experiences shape the question we ask: how can existing public spaces become welcoming places to discover hockey? Our work combines practical planning with a belief that cities can create new ways for people to play, gather, and feel part of the game.
              </p>
              <div className="mt-9 flex flex-wrap gap-2">
                {['Urban planning', 'Engineering', 'Hockey fans', 'Community first'].map((tag) => (
                  <span key={tag} className="rounded-full border border-[#cbd3cc] px-4 py-2 text-xs font-semibold text-[#41525a]">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#071b2a] px-5 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href="#top" className="text-sm font-bold tracking-[0.13em]">BRING THE RINK</a>
            <p className="mt-2 text-sm text-white/55">A vision for a game with room for everyone.</p>
          </div>
          <a href="#top" className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8e8d9] hover:text-white">Back to top <span aria-hidden="true">↑</span></a>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-white/40">
          A concept for the NHL Innovation Challenge
        </div>
      </footer>
    </div>
  )
}

export default App

import { BadgeCheck, Building, HeartHandshake, Users } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const endorsers = [
  {
    icon: HeartHandshake,
    name: 'Medical Support Committee',
    statement:
      'We have verified this appeal and are coordinating all donations transparently.',
  },
  {
    icon: Users,
    name: 'Office Colleagues',
    statement:
      'Our colleague has our full backing. We urge everyone to support generously.',
  },
  {
    icon: Building,
    name: 'Medical Team',
    statement:
      'This appeal is recognised as a genuine medical support initiative.',
  },
  {
    icon: BadgeCheck,
    name: 'Welfare Committee',
    statement:
      'We stand behind this cause and confirm the need is urgent and real.',
  },
]

export function Endorsements() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Trusted &amp; Endorsed
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Backed By Those Who Know Her Best
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {endorsers.map((e, i) => (
            <Reveal key={e.name} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <e.icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading font-bold text-foreground">
                  {e.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{e.statement}&rdquo;
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

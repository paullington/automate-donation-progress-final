import { Microscope, Pill, Stethoscope, Syringe } from 'lucide-react'
import { formatNaira } from '@/lib/campaign'
import { Reveal } from '@/components/reveal'

const impacts = [
  { icon: Pill, amount: 50000, label: 'Supports one session of dialysis' },
  { icon: Microscope, amount: 200000, label: 'Supports dialysis for a month' },
  { icon: Stethoscope, amount: 50000, label: 'Supports specialist consultations' },
  { icon: Syringe, amount: 45000000, label: 'Supports transplant preparation and surgery' },
]

export function DonationImpact() {
  return (
    <section className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Your Impact
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            See What Your Gift Can Do
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            No amount is too small. Here is how different contributions help.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {impacts.map((item, i) => (
            <Reveal key={item.amount} delay={i * 80}>
              <div className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-teal hover:shadow-md">
                <span className="flex size-14 items-center justify-center rounded-full bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-teal-foreground">
                  <item.icon className="size-7" aria-hidden="true" />
                </span>
                <p className="mt-4 font-heading text-2xl font-extrabold text-foreground">
                  {formatNaira(item.amount)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

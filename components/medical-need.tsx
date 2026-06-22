import {
  Activity,
  AlertTriangle,
  Building2,
  ClipboardList,
  HeartPulse,
  Microscope,
  Stethoscope,
  Syringe,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

const cards = [
  {
    icon: Activity,
    title: 'Diagnosis',
    value: 'End-Stage Kidney Disease',
    desc: 'Confirmed by nephrology specialists.',
  },
  {
    icon: HeartPulse,
    title: 'Treatment Required',
    value: 'Kidney Transplant',
    desc: 'Surgery, medication, and recovery care.',
  },
  {
    icon: AlertTriangle,
    title: 'Urgency Level',
    value: 'Critical — Immediate',
    desc: 'Treatment is time-sensitive.',
    urgent: true,
  },
  {
    icon: Building2,
    title: 'Hospital',
    value: 'Hospital Placeholder',
    desc: 'Accredited transplant center.',
  },
]

const timeline = [
  { icon: Stethoscope, label: 'Diagnosis' },
  { icon: ClipboardList, label: 'Specialist Care' },
  { icon: Microscope, label: 'Evaluation' },
  { icon: HeartPulse, label: 'Transplant' },
  { icon: Syringe, label: 'Recovery' },
]

export function MedicalNeed() {
  return (
    <section id="medical-need" className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            The Medical Need
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Understanding Her Condition
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            A clear overview of the diagnosis, the treatment required, and the
            journey toward recovery.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                <span
                  className={`flex size-12 items-center justify-center rounded-xl ${
                    c.urgent ? 'bg-urgent/10 text-urgent' : 'bg-teal/10 text-teal'
                  }`}
                >
                  <c.icon className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.title}
                </p>
                <p className="mt-1 font-heading text-lg font-bold text-foreground">
                  {c.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h3 className="mb-8 text-center font-heading text-xl font-bold text-foreground">
            Treatment Journey
          </h3>
          <ol className="relative mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row sm:justify-between">
            <div
              className="absolute left-6 top-0 hidden h-full w-0.5 bg-border sm:left-0 sm:top-6 sm:h-0.5 sm:w-full"
              aria-hidden="true"
            />
            {timeline.map((step, i) => (
              <li
                key={step.label}
                className="relative z-10 flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-xs font-medium text-muted-foreground">
                    Step {i + 1}
                  </span>
                  <span className="font-heading text-sm font-semibold text-foreground">
                    {step.label}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

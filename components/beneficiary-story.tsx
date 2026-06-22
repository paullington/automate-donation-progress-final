import { Briefcase, Clock, Quote, User } from 'lucide-react'
import { campaign } from '@/lib/campaign'
import { Reveal } from '@/components/reveal'

const narrative = [
  'Our dear colleague has spent years serving others and making meaningful contributions to her workplace and community.',
  'Today she faces one of the greatest challenges of her life.',
  'Following a diagnosis of End-Stage Kidney Disease, doctors have recommended an urgent kidney transplant.',
  'The surgery, medications, investigations, and recovery costs exceed what her family can bear alone.',
  'With your support, we can help give her another chance at life.',
]

const facts = [
  { icon: User, label: 'Full Name', value: campaign.beneficiary.fullName },
  { icon: Briefcase, label: 'Department', value: campaign.beneficiary.department },
  { icon: Clock, label: 'Service', value: campaign.beneficiary.yearsOfService },
]

export function BeneficiaryStory() {
  return (
    <section id="about" className="bg-background py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative">
            <img
              src="/beneficiary.png"
              alt={`Portrait of ${campaign.beneficiary.fullName}, the beneficiary`}
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 left-6 right-6 rounded-xl bg-card p-4 shadow-lg sm:left-8 sm:right-auto sm:max-w-xs">
              <div className="grid grid-cols-3 gap-3">
                {facts.map((f) => (
                  <div key={f.label} className="text-center">
                    <f.icon className="mx-auto mb-1 size-5 text-teal" aria-hidden="true" />
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {f.label}
                    </p>
                    <p className="text-xs font-semibold text-foreground">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Her Story
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Meet The Beneficiary
          </h2>
          <div className="mt-5 space-y-4">
            {narrative.map((para, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground text-pretty">
                {para}
              </p>
            ))}
          </div>

          <blockquote className="mt-6 flex gap-3 rounded-xl border-l-4 border-teal bg-secondary/60 p-5">
            <Quote className="size-6 shrink-0 text-teal" aria-hidden="true" />
            <p className="font-heading text-lg font-semibold text-foreground text-balance">
              Every donation, regardless of amount, brings hope.
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}

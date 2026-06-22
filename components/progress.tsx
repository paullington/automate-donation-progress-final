'use client'

import { useEffect, useRef, useState } from 'react'
import { HeartHandshake, Target, TrendingUp, Users, Share2 } from 'lucide-react'
import { campaign, formatNaira } from '@/lib/campaign'
import { useCountUp } from '@/hooks/use-count-up'
import { Reveal } from '@/components/reveal'
import { useCampaignStats } from '@/hooks/use-campaign-stats'

const target = campaign.funds.target

export function Progress() {
  const { stats, loading } = useCampaignStats(true)
  const [barWidth, setBarWidth] = useState(0)
  const [dash, setDash] = useState(0)
  const ringRef = useRef<HTMLDivElement>(null)
  const radius = 70
  const circumference = 2 * Math.PI * radius

  // Use real-time stats, fall back to campaign defaults
  const raised = stats.amountRaised || campaign.funds.raised
  const donors = stats.donors || campaign.funds.donors
  const shares = stats.shares || campaign.funds.shares
  const balance = target - raised
  const percent = Math.round((raised / target) * 100)

  const raisedCounter = useCountUp(raised)
  const donorCounter = useCountUp(donors)
  const shareCounter = useCountUp(shares)

  useEffect(() => {
    const el = ringRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBarWidth(percent)
            setDash(circumference * (percent / 100))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [circumference, percent])

  return (
    <section id="progress" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Fundraising Progress
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Together, We Are Getting Closer
          </h2>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Raised so far
                  </p>
                  <p className="font-heading text-3xl font-extrabold text-success sm:text-4xl">
                    <span ref={raisedCounter.ref}>
                      {formatNaira(raisedCounter.value)}
                    </span>
                  </p>
                </div>
                <p className="font-heading text-2xl font-bold text-primary">
                  {percent}%
                </p>
              </div>

              <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal to-success transition-[width] duration-[1800ms] ease-out"
                  style={{ width: `${barWidth}%` }}
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Fundraising progress"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Stat
                  icon={Target}
                  label="Target"
                  value={formatNaira(target)}
                  tone="text-primary"
                />
                <Stat
                  icon={TrendingUp}
                  label="Balance Needed"
                  value={formatNaira(balance)}
                  tone="text-urgent"
                />
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                  <Users className="size-5 shrink-0 text-teal" aria-hidden="true" />
                  <span>
                    <span ref={donorCounter.ref} className="font-bold text-foreground">
                      {donorCounter.value.toLocaleString()}
                    </span>{' '}
                    generous donors have contributed so far
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                  <Share2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <span ref={shareCounter.ref} className="font-bold text-foreground">
                      {shareCounter.value.toLocaleString()}
                    </span>{' '}
                    people have shared this appeal
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div ref={ringRef} className="flex flex-col items-center">
              <div className="relative size-56">
                <svg className="size-full -rotate-90" viewBox="0 0 180 180">
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    strokeWidth="14"
                    className="stroke-secondary"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="stroke-teal transition-[stroke-dashoffset] duration-[1800ms] ease-out"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - dash}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-4xl font-extrabold text-foreground">
                    {percent}%
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Complete
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
                <HeartHandshake
                  className="size-5 shrink-0 text-teal"
                  aria-hidden="true"
                />
                <p>
                  Your contribution directly supports surgery, medications,
                  hospitalization, investigations, and post-operative care.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Target
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <Icon className={`size-5 ${tone}`} aria-hidden="true" />
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`font-heading text-lg font-bold ${tone}`}>{value}</p>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Banknote, Heart, Share2, Users } from 'lucide-react'
import { formatNaira } from '@/lib/campaign'
import { useCampaignStats } from '@/hooks/use-campaign-stats'
import { useCountUp } from '@/hooks/use-count-up'
import { Reveal } from '@/components/reveal'
import type { RecentDonation } from '@/app/api/recent-donations/route'

export function SocialProof() {
  const { stats, loading } = useCampaignStats()
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([])
  const [donationsLoading, setDonationsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recent-donations')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RecentDonation[]) => setRecentDonations(data))
      .catch(() => setRecentDonations([]))
      .finally(() => setDonationsLoading(false))
  }, [])

  const donors = useCountUp(loading ? 0 : stats.donors)
  const shares = useCountUp(loading ? 0 : stats.shares)
  const raised = useCountUp(loading ? 0 : stats.amountRaised)

  return (
    <section className="bg-primary py-20 text-primary-foreground sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-6 sm:grid-cols-3">
          <Counter
            ref={donors.ref}
            icon={Users}
            value={donors.value.toLocaleString()}
            label="Generous Donors"
          />
          <Counter
            ref={shares.ref}
            icon={Share2}
            value={shares.value.toLocaleString()}
            label="Times Shared"
          />
          <Counter
            ref={raised.ref}
            icon={Banknote}
            value={formatNaira(raised.value)}
            label="Raised So Far"
          />
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-12 max-w-2xl">
          <h3 className="mb-4 flex items-center justify-center gap-2 font-heading text-lg font-bold">
            <Heart className="size-5" fill="currentColor" aria-hidden="true" />
            Recent Donations
          </h3>

          {donationsLoading ? (
            <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-9 animate-pulse rounded-full bg-white/20" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-24 animate-pulse rounded-full bg-white/20" />
                      <div className="h-2.5 w-16 animate-pulse rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="h-3 w-20 animate-pulse rounded-full bg-white/20" />
                </div>
              ))}
            </div>
          ) : recentDonations.length === 0 ? (
            <div className="rounded-2xl bg-white/10 px-5 py-8 text-center backdrop-blur-sm">
              <p className="text-sm text-primary-foreground/70">
                Be the first to donate and appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
              {recentDonations.map((d, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-teal text-teal-foreground">
                      <Heart className="size-4" fill="currentColor" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-xs text-primary-foreground/70">
                        {new Date(d.date).toLocaleDateString('en-NG', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-teal-foreground">
                    {d.amount != null ? formatNaira(d.amount) : '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Counter({
  ref,
  icon: Icon,
  value,
  label,
}: {
  ref: React.Ref<HTMLSpanElement>
  icon: typeof Users
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur-sm">
      <Icon className="mx-auto size-7 text-teal-foreground" aria-hidden="true" />
      <p className="mt-3 font-heading text-3xl font-extrabold sm:text-4xl">
        <span ref={ref}>{value}</span>
      </p>
      <p className="mt-1 text-sm text-primary-foreground/80">{label}</p>
    </div>
  )
}

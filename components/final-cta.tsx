import { Heart, Share2 } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-teal py-24 text-primary-foreground">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="mx-auto flex size-16 animate-pulse-ring items-center justify-center rounded-full bg-urgent text-urgent-foreground">
            <Heart className="size-8" fill="currentColor" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-heading text-4xl font-extrabold text-balance sm:text-5xl">
            Every Contribution Saves A Life
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-primary-foreground/90 text-pretty">
            No amount is too small. Together we can help give our colleague a
            second chance at life.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#donate"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-urgent px-8 py-4 text-base font-bold text-urgent-foreground shadow-lg transition-transform hover:scale-105 sm:w-auto"
            >
              <Heart className="size-5" fill="currentColor" aria-hidden="true" />
              Donate Now
            </a>
            <a
              href="#share"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/70 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
            >
              <Share2 className="size-5" aria-hidden="true" />
              Share Appeal
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

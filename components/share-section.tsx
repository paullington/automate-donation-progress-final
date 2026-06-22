import { Share2 } from 'lucide-react'
import { ShareButtons } from '@/components/share-buttons'
import { Reveal } from '@/components/reveal'

export function ShareSection() {
  return (
    <section id="share" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal/10 text-teal">
            <Share2 className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Sharing Is Saving
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            If you cannot donate today, you can still make a powerful difference.
            Share this appeal with your network — every share brings us closer to
            our goal.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <ShareButtons />
        </Reveal>
      </div>
    </section>
  )
}

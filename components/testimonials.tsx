import { Quote } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const testimonials = [
  {
    quote: 'She has always been there for others. Now it is our turn to be there for her.',
    name: 'Colleague',
    role: 'Former Unit Member',
    image: '/testimonial-1.png',
  },
  {
    quote: 'Your support can help save a remarkable life. Please give whatever you can.',
    name: 'Friend',
    role: 'Former Department member',
    image: '/testimonial-2.png',
  },
  {
    quote: 'We stand with her and her family during this difficult time.',
    name: ' General Secretary',
    role: 'Church Committee',
    image: '/testimonial-3.png',
  },
]

export function Testimonials() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Voices Of Support
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            What Her Community Is Saying
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                <Quote className="size-8 text-teal/40" aria-hidden="true" />
                <blockquote className="mt-3 flex-1 text-pretty leading-relaxed text-foreground">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <img
                    src={t.image || '/placeholder.svg'}
                    alt={`${t.name}, ${t.role}`}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-heading text-sm font-bold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

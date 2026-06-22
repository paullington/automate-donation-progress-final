'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

const faqs = [
  {
    q: 'Why is the transplant needed?',
    a: 'Our colleague has been diagnosed with End-Stage Kidney Disease. Her kidneys can no longer function adequately, and doctors have determined that a kidney transplant is the most effective and urgent treatment to save her life.',
  },
  {
    q: 'How will the funds be used?',
    a: 'All funds go directly toward the transplant surgery, pre-operative investigations, medications, hospitalization, and post-operative recovery care. The Medical Support Committee oversees and records all expenditure.',
  },
  {
    q: 'How can I verify the appeal?',
    a: 'You can contact Adebola through her email to request for her medical reports, hospital estimates, and verification letters.',
  },
  {
    q: 'Can I donate anonymously?',
    a: 'Yes. When confirming your donation through the form, simply select the anonymous option. Your contribution will be recorded without displaying your name publicly.',
  },
  {
    q: 'Can I share this appeal?',
    a: 'Absolutely — and we strongly encourage it. Use the sharing buttons throughout the page to spread the word via WhatsApp, Facebook, X, LinkedIn, Telegram, or email. Every share helps.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Questions &amp; Answers
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-10 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading font-semibold text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      'size-5 shrink-0 text-teal transition-transform duration-300',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-muted-foreground text-pretty">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

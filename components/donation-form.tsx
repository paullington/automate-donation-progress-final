'use client'

import { CheckCircle2, ListChecks } from 'lucide-react'
import { ReceiptUpload } from './receipt-upload'
import { Reveal } from './reveal'

const infos = [
  'Upload your bank transfer receipt (PDF or image)',
  'Provide your name (optional)',
  'Share your email (optional)',
  'Add donation amount if desired',
  'Include any notes or messages',
  'Remain completely anonymous if you prefer',
]

export function DonationForm() {
  return (
    <section id="confirm" className="bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Confirm Your Donation
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Let Us Acknowledge Your Generosity
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            After transferring your donation, upload your receipt below. All information is secure and optional — you can remain anonymous.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-heading font-bold text-foreground">
                <ListChecks className="size-5 text-teal" aria-hidden="true" />
                How it works
              </h3>
              <ul className="mt-4 space-y-2.5">
                {infos.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      className="size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-success/10 p-4 text-sm leading-relaxed text-foreground">
                <p className="flex items-center gap-2 font-semibold text-success">
                  <CheckCircle2 className="size-4" aria-hidden="true" /> Your Privacy
                </p>
                <p className="mt-1 text-muted-foreground">
                  Receipts are stored securely and only viewed by authorized personnel. You can remain anonymous.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 font-heading font-bold text-foreground">
                Upload Receipt
              </h3>
              <ReceiptUpload />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

import { Eye, FileText, ShieldCheck } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const documents = [
  'Medical Report (Request via email)',
  'Consultant Recommendation (Request via email)',
  'Hospital Estimate (Request via email)',
  'Treatment Plan (Request via email)',
  'Verification Letter (Request via email)',
]

export function Transparency() {
  return (
    <section id="documents" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal">
            Verified &amp; Documented
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Transparency &amp; Accountability
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            All documents are available for verification and accountability
            purposes.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => (
            <Reveal key={doc} delay={i * 70}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-urgent/10 text-urgent">
                    <FileText className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{doc}</h3>
                    <p className="text-xs text-muted-foreground">PDF Document</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    <FileText className="size-4" /> Download
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <Eye className="size-4" /> Preview
                  </button>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={documents.length * 70}>
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-teal/40 bg-teal/5 p-6 text-center">
              <ShieldCheck className="size-9 text-teal" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every document is reviewed and authenticated by the Medical
                Support Committee.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

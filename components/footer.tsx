import { Heart, Mail, Phone } from 'lucide-react'
import { campaign } from '@/lib/campaign'

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-border bg-foreground text-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-heading text-lg font-bold">
              <span className="flex size-9 items-center justify-center rounded-full bg-urgent text-urgent-foreground">
                <Heart className="size-5" fill="currentColor" aria-hidden="true" />
              </span>
              Save A Life
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/70 text-pretty">
              A medical fundraising appeal to help our dear colleague receive a
              life-saving kidney transplant. Coordinated by the Medical Support
              Committee.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-background/80">
              <li>
                <a
                  href={`mailto:${campaign.contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-background"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {campaign.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${campaign.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 transition-colors hover:text-background"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {campaign.contact.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-background/80">
              {['About', 'Medical Need', 'Progress', 'Donate', 'Documents'].map(
                (l) => (
                  <li key={l}>
                    <a
                      href={`#${l.toLowerCase().replace(/\s/g, '-')}`}
                      className="transition-colors hover:text-background"
                    >
                      {l}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-4 border-t border-background/15 pt-8">
          <p className="rounded-lg bg-background/5 p-4 text-xs leading-relaxed text-background/70">
            <strong className="text-background/90">Disclaimer:</strong> This
            appeal is intended solely for the kidney transplant and recovery
            process of the beneficiary. All donations are tracked and managed by
            the Medical Support Committee.
          </p>
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-background/60 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} Save A Life Appeal. All rights
              reserved.
            </p>
            <a href="#" className="transition-colors hover:text-background">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

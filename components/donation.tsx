'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Building2,
  Check,
  Copy,
  Download,
  ShieldCheck,
  User,
} from 'lucide-react'
import { campaign } from '@/lib/campaign'

export function Donation() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* noop */
    }
  }

  const fullDetails = `Bank: ${campaign.bank.name}\nAccount Name: ${campaign.bank.accountName}\nAccount Number: ${campaign.bank.accountNumber}`

  // Plain-text payload encoded into the QR code. Scanning it with any phone
  // camera reveals the verified beneficiary bank account details.
  const qrValue = `${campaign.title} — Beneficiary Account Details\n\nBank: ${campaign.bank.name}\nAccount Name: ${campaign.bank.accountName}\nAccount Number: ${campaign.bank.accountNumber}`

  const downloadInfo = () => {
    const content = `SAVE A LIFE — DONATION INFORMATION\n\n${fullDetails}\n\n${campaign.shareUrl}\n\nAll donations are tracked and managed by the Medical Support Committee.`
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'donation-information.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <section
      id="donate"
      className="bg-gradient-to-b from-primary to-primary/90 py-20 text-primary-foreground sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-teal-foreground/90">
            Make A Donation
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-balance sm:text-4xl">
            Your Gift Brings Her Closer To Recovery
          </h2>
          <p className="mt-4 leading-relaxed text-primary-foreground/80 text-pretty">
            Send your contribution directly to the verified account below, then
            confirm your donation using the form so we can acknowledge you.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-card text-card-foreground shadow-2xl">
          <div className="flex items-center justify-between bg-secondary px-6 py-4">
            <div className="flex items-center gap-2 font-heading font-bold text-foreground">
              <Building2 className="size-5 text-primary" aria-hidden="true" />
              {campaign.bank.name}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
              <ShieldCheck className="size-4" aria-hidden="true" /> Verified
            </span>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-4">
              <Field
                icon={User}
                label="Account Name"
                value={campaign.bank.accountName}
              />
              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Copy className="size-4" aria-hidden="true" /> Account Number
                </p>
                <p className="mt-1 font-heading text-2xl font-extrabold tracking-wider text-foreground">
                  {campaign.bank.accountNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-4">
              <div className="flex size-28 items-center justify-center rounded-xl bg-card p-2">
                <QRCodeSVG
                  value={qrValue}
                  size={96}
                  level="M"
                  marginSize={0}
                  className="size-full"
                  title="Scan to view beneficiary bank account details"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Scan to save account details
              </span>
            </div>
          </div>

          <div className="grid gap-3 px-6 pb-6 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => copy('number', campaign.bank.accountNumber)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {copied === 'number' ? (
                <>
                  <Check className="size-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copy Number
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => copy('details', fullDetails)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-teal-foreground transition-transform hover:-translate-y-0.5"
            >
              {copied === 'details' ? (
                <>
                  <Check className="size-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copy Details
                </>
              )}
            </button>
            <button
              type="button"
              onClick={downloadInfo}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Download className="size-4" /> Download Info
            </button>
          </div>

          <div className="flex items-start gap-2 border-t border-border bg-secondary/50 px-6 py-4 text-sm text-muted-foreground">
            <ShieldCheck className="size-5 shrink-0 text-success" aria-hidden="true" />
            <p>
              All donations are tracked and managed by the Medical Support
              Committee.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" /> {label}
      </p>
      <p className="mt-1 font-heading text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}

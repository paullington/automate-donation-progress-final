'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Download, Eye, FileText, LogOut, Inbox, AlertCircle, CheckCircle, Clock, Copy } from 'lucide-react'
import { useState } from 'react'

export type AdminDonation = {
  id: number
  donorName: string | null
  donorEmail: string | null
  receiptFileName: string
  receiptPathname: string
  amount: string | null
  notes: string | null
  createdAt: string
  isProcessed?: boolean
  isDuplicate?: boolean
  duplicateOfId?: number | null
  transactionType?: string | null
  processingNotes?: string | null
  isAnonymous?: boolean
}

function StatusBadge({ donation }: { donation: AdminDonation }) {
  if (donation.isDuplicate) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
        <Copy className="size-3.5" />
        Duplicate #{donation.duplicateOfId}
      </div>
    )
  }
  
  if (donation.isProcessed) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
        <CheckCircle className="size-3.5" />
        Processed
      </div>
    )
  }
  
  if (donation.processingNotes?.includes('error')) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
        <AlertCircle className="size-3.5" />
        Failed
      </div>
    )
  }
  
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
      <Clock className="size-3.5" />
      Pending
    </div>
  )
}

function TypeBadge({ transactionType }: { transactionType?: string | null }) {
  if (transactionType === 'transaction') {
    return (
      <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Transaction
      </span>
    )
  }
  
  if (transactionType === 'not_transaction') {
    return (
      <span className="inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        Non-Transaction
      </span>
    )
  }
  
  return (
    <span className="inline-block rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
      Unvalidated
    </span>
  )
}

export function AdminDashboard({ donations }: { donations: AdminDonation[] }) {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.refresh()
  }

  // Filter donations
  let filteredDonations = donations
  if (filterStatus) {
    filteredDonations = donations.filter(d => {
      if (filterStatus === 'processed') return d.isProcessed
      if (filterStatus === 'pending') return !d.isProcessed && !d.isDuplicate && d.transactionType !== 'not_transaction'
      if (filterStatus === 'duplicate') return d.isDuplicate
      if (filterStatus === 'non-transaction') return d.transactionType === 'not_transaction'
      return true
    })
  }

  const fileUrl = (pathname: string, download: boolean) =>
    `/api/download?pathname=${encodeURIComponent(pathname)}${download ? '&download=1' : ''}`

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-border py-4">
            <div>
              <h1 className="font-heading text-xl font-bold text-card-foreground">
                Donor Documents
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredDonations.length} of {donations.length}{' '}
                {donations.length === 1 ? 'submission' : 'submissions'}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto py-4 pb-2">
            <button
              type="button"
              onClick={() => setFilterStatus(null)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filterStatus === null
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              All ({donations.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('processed')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filterStatus === 'processed'
                  ? 'bg-green-600 text-white'
                  : 'border border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              Processed ({donations.filter(d => d.isProcessed).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('pending')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'border border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              Pending ({donations.filter(d => !d.isProcessed && !d.isDuplicate && d.transactionType !== 'not_transaction').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('duplicate')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filterStatus === 'duplicate'
                  ? 'bg-orange-600 text-white'
                  : 'border border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              Duplicates ({donations.filter(d => d.isDuplicate).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('non-transaction')}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filterStatus === 'non-transaction'
                  ? 'bg-amber-600 text-white'
                  : 'border border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              Non-Transactions ({donations.filter(d => d.transactionType === 'not_transaction').length})
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {filteredDonations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Inbox className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium text-card-foreground">
              {donations.length === 0 ? 'No documents yet' : 'No matching documents'}
            </p>
            <p className="text-sm text-muted-foreground">
              {donations.length === 0
                ? 'Uploaded donor receipts will appear here.'
                : 'Try adjusting your filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Donor</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Receipt</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                  <th className="px-4 py-3 text-right font-semibold">Document</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(d.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-card-foreground">
                        {d.isAnonymous ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                            Anonymous
                          </span>
                        ) : (
                          d.donorName || 'Anonymous'
                        )}
                      </div>
                      {d.donorEmail && !d.isAnonymous && (
                        <div className="text-xs text-muted-foreground">
                          {d.donorEmail}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-card-foreground">
                      {d.amount || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge donation={d} />
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge transactionType={d.transactionType} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-card-foreground">
                        <FileText className="size-4 text-muted-foreground" />
                        <span className="max-w-[12rem] truncate">
                          {d.receiptFileName}
                        </span>
                      </span>
                    </td>
                    <td className="max-w-[16rem] px-4 py-3 text-muted-foreground">
                      <span className="line-clamp-2">{d.processingNotes || d.notes || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={fileUrl(d.receiptPathname, false)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Eye className="size-3.5" /> View
                        </a>
                        <a
                          href={fileUrl(d.receiptPathname, true)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          <Download className="size-3.5" /> Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

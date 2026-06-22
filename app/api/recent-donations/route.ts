import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export interface RecentDonation {
  name: string
  amount: number | null
  date: string
}

/**
 * GET /api/recent-donations
 *
 * Public endpoint returning the 5 most recent processed, non-duplicate transactions.
 * Donor emails are never exposed. Anonymous donors are shown as "Anonymous".
 */
export async function GET() {
  try {
    const rows = await db
      .select({
        donorName: donations.donorName,
        isAnonymous: donations.isAnonymous,
        amount: donations.amount,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .where(
        and(
          eq(donations.isProcessed, true),
          eq(donations.isDuplicate, false),
          eq(donations.transactionType, 'transaction')
        )
      )
      .orderBy(desc(donations.createdAt))
      .limit(5)

    const recent: RecentDonation[] = rows.map((row) => {
      // Determine display name — never expose emails
      const name =
        row.isAnonymous || !row.donorName || row.donorName.trim() === ''
          ? 'Anonymous'
          : row.donorName.trim()

      // Parse the stored amount string (e.g. "500000", "₦500,000") into a number
      let amount: number | null = null
      if (row.amount) {
        const parsed = parseFloat(row.amount.replace(/[^0-9.]/g, '').trim())
        if (!isNaN(parsed) && parsed > 0) {
          amount = parsed
        }
      }

      const date =
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : String(row.createdAt)

      return { name, amount, date }
    })

    return NextResponse.json(recent)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] recent-donations error:', message)
    return NextResponse.json(
      { error: 'Failed to retrieve recent donations' },
      { status: 500 }
    )
  }
}

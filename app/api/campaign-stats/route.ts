import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { donations, shares } from '@/lib/db/schema'
import { sql, and, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get all donations data
    const allDonations = await db
      .select()
      .from(donations)

    // Calculate statistics
    const stats = {
      // Total donors (distinct emails/names, excluding duplicates)
      totalDonors: 0,
      // Amount raised (sum of processed donations with amounts)
      amountRaised: 0,
      // Processed donations count
      processedCount: 0,
      // Unprocessed donations count
      pendingCount: 0,
      // Duplicate donations count
      duplicateCount: 0,
      // Non-transaction uploads
      nonTransactionCount: 0,
      // Failed/unprocessed uploads
      failedCount: 0,
    }

    // Track unique donors (by email first, then by name, then anonymous)
    const uniqueDonors = new Set<string>()

    for (const donation of allDonations) {
      // ---- Unique-donor counting: skip duplicate records ----
      if (!donation.isDuplicate) {
        let donorKey: string | null = null

        if (donation.donorEmail) {
          donorKey = `email:${donation.donorEmail}`
        } else if (donation.donorName && !donation.isAnonymous) {
          donorKey = `name:${donation.donorName}`
        } else {
          // Each anonymous donation counts as a distinct donor
          donorKey = `anonymous:${donation.id}`
        }

        if (donorKey) {
          uniqueDonors.add(donorKey)
        }
      }

      // ---- Amount raised: count ALL processed transactions (including processed duplicates) ----
      if (donation.isProcessed && donation.transactionType === 'transaction' && donation.amount) {
        try {
          const parsedAmount = parseFloat(
            donation.amount.replace(/[^0-9.]/g, '').trim()
          )
          if (!isNaN(parsedAmount)) {
            stats.amountRaised += parsedAmount
          }
        } catch (e) {
          console.log('[v0] Could not parse amount:', donation.amount)
        }
      }

      // ---- Status breakdown counts (mutually exclusive buckets) ----
      if (donation.isDuplicate) {
        stats.duplicateCount += 1
      } else if (donation.isProcessed) {
        stats.processedCount += 1
      } else if (donation.transactionType === 'not_transaction') {
        stats.nonTransactionCount += 1
      } else {
        stats.pendingCount += 1
      }

      // Count uploads that errored during processing
      if (
        donation.processingNotes &&
        donation.processingNotes.toLowerCase().includes('error') &&
        !donation.isProcessed
      ) {
        stats.failedCount += 1
      }
    }

    stats.totalDonors = uniqueDonors.size

    // Get total shares
    const allShares = await db
      .select({
        total: sql<number>`COALESCE(SUM(${shares.count}), 0)`.mapWith(Number),
      })
      .from(shares)

    const totalShares = allShares[0]?.total || 0

    // Get share breakdown
    const shareBreakdown = await db
      .select({
        platform: shares.platform,
        count: shares.count,
      })
      .from(shares)

    return NextResponse.json({
      donors: stats.totalDonors,
      amountRaised: Math.round(stats.amountRaised), // Round to avoid floating point issues
      shares: totalShares,
      breakdown: {
        processed: stats.processedCount,
        pending: stats.pendingCount,
        duplicates: stats.duplicateCount,
        nonTransaction: stats.nonTransactionCount,
        failed: stats.failedCount,
      },
      shareBreakdown,
      lastUpdated: new Date().toISOString(),
      totalUploads: allDonations.length,
    })
  } catch (error) {
    console.error('[v0] Campaign stats error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve campaign stats' },
      { status: 500 }
    )
  }
}

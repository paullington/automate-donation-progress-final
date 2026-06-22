import { type NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { isNull, eq } from 'drizzle-orm'
import { validateAndProcessDocument, updateDonationStatus } from '@/lib/document-processor'

/**
 * POST /api/admin/process-existing
 *
 * Admin-only endpoint that retroactively validates and auto-processes all legacy
 * donations that have a NULL transactionType (uploaded before the processor was added).
 *
 * Requires a valid admin session cookie.
 */
export async function POST(request: NextRequest) {
  const authed = await isAdminAuthenticated()
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch all donations that have never been validated (transactionType is null)
    const unvalidated = await db
      .select()
      .from(donations)
      .where(isNull(donations.transactionType))

    if (unvalidated.length === 0) {
      return NextResponse.json({
        message: 'No unvalidated donations found.',
        processed: 0,
        skipped: 0,
        total: 0,
      })
    }

    let processedCount = 0
    let skippedCount = 0
    const errors: string[] = []

    for (const donation of unvalidated) {
      try {
        // Re-validate using filename heuristics (we no longer have the original file buffer)
        const validation = await validateAndProcessDocument(
          donation.donorEmail ?? undefined,
          donation.donorName ?? undefined,
          donation.receiptFileName,
          Buffer.from(''), // file buffer unavailable for legacy records
          donation.amount ?? undefined
        )

        const autoProcess = validation.isTransaction && !validation.isDuplicate

        await updateDonationStatus(donation.id, {
          isProcessed: autoProcess,
          isDuplicate: validation.isDuplicate,
          duplicateOfId: validation.duplicateOfId,
          transactionType: validation.isTransaction ? 'transaction' : 'not_transaction',
          processingNotes: `[Retroactive] ${validation.notes}`,
        })

        // Store file hash if we generated one (will be empty string for legacy records with no buffer)
        if (validation.fileHash) {
          await db
            .update(donations)
            .set({ fileHash: validation.fileHash })
            .where(eq(donations.id, donation.id))
        }

        processedCount += 1
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        errors.push(`Donation #${donation.id}: ${message}`)
        skippedCount += 1
      }
    }

    return NextResponse.json({
      message: `Processing complete. ${processedCount} donation(s) validated.`,
      processed: processedCount,
      skipped: skippedCount,
      total: unvalidated.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] process-existing error:', message)
    return NextResponse.json(
      { error: 'Failed to process existing donations', detail: message },
      { status: 500 }
    )
  }
}

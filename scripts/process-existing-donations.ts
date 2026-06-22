/**
 * One-time script to process existing donations
 * 
 * This script handles the migration of existing donations by:
 * 1. Marking the first 2 uploads as test data
 * 2. Marking the next 2 uploads as processed
 * 3. Processing remaining uploads through validation
 * 
 * Usage: npx ts-node scripts/process-existing-donations.ts
 */

import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import {
  markAsTestData,
  markAsProcessed,
  validateAndProcessDocument,
  updateDonationStatus,
} from '@/lib/document-processor'

async function processExistingDonations() {
  try {
    console.log('\n📋 Starting existing donations processing...\n')

    // Get all donations ordered by creation date
    const allDonations = await db
      .select()
      .from(donations)
      .orderBy(donations.createdAt)

    console.log(`Found ${allDonations.length} total donations\n`)

    if (allDonations.length === 0) {
      console.log('No donations to process.')
      return
    }

    // Step 1: Mark first 2 as test data
    const testDataCount = Math.min(2, allDonations.length)
    console.log(`Step 1: Marking first ${testDataCount} uploads as test data...`)
    const testDonations = allDonations.slice(0, testDataCount)
    for (const donation of testDonations) {
      await updateDonationStatus(donation.id, {
        isProcessed: false,
        isDuplicate: false,
        transactionType: null,
        processingNotes: 'Test data - initial upload for testing',
      })
      console.log(`  ✓ Marked donation #${donation.id} as test data`)
    }
    console.log()

    // Step 2: Mark next 2 as processed (if they exist)
    const startIdx = testDataCount
    const processedCount = Math.min(2, allDonations.length - startIdx)
    if (processedCount > 0) {
      console.log(`Step 2: Marking next ${processedCount} uploads as processed...`)
      const processingIds = allDonations
        .slice(startIdx, startIdx + processedCount)
        .map((d) => d.id)

      for (const id of processingIds) {
        const donation = await db
          .select()
          .from(donations)
          .where(eq(donations.id, id))
          .limit(1)

        if (donation.length > 0) {
          const d = donation[0]
          // Validate these uploads
          const validation = await validateAndProcessDocument(
            d.donorEmail || undefined,
            d.donorName || undefined,
            d.receiptFileName,
            Buffer.from(''), // No file buffer available
            d.amount || undefined
          )

          await updateDonationStatus(id, {
            isProcessed: true,
            isDuplicate: validation.isDuplicate,
            duplicateOfId: validation.duplicateOfId,
            transactionType: validation.isTransaction ? 'transaction' : 'not_transaction',
            processingNotes: validation.notes,
          })

          console.log(`  ✓ Processed donation #${id}`)
          console.log(`    - Type: ${validation.isTransaction ? 'Transaction' : 'Non-Transaction'}`)
          console.log(`    - Duplicate: ${validation.isDuplicate ? 'Yes' : 'No'}`)
        }
      }
      console.log()
    }

    // Step 3: Process remaining donations through validation
    const remainingStartIdx = startIdx + processedCount
    if (remainingStartIdx < allDonations.length) {
      const remaining = allDonations.slice(remainingStartIdx)
      console.log(`Step 3: Validating remaining ${remaining.length} uploads...`)

      for (const donation of remaining) {
        const validation = await validateAndProcessDocument(
          donation.donorEmail || undefined,
          donation.donorName || undefined,
          donation.receiptFileName,
          Buffer.from(''), // No file buffer available
          donation.amount || undefined
        )

        await updateDonationStatus(donation.id, {
          isProcessed: false, // Leave as pending for admin review
          isDuplicate: validation.isDuplicate,
          duplicateOfId: validation.duplicateOfId,
          transactionType: validation.isTransaction ? 'transaction' : 'not_transaction',
          processingNotes: validation.notes,
        })

        console.log(`  ✓ Validated donation #${donation.id}`)
        console.log(`    - Type: ${validation.isTransaction ? 'Transaction' : 'Non-Transaction'}`)
        console.log(`    - Duplicate: ${validation.isDuplicate ? 'Yes' : 'No'}`)
      }
      console.log()
    }

    // Summary
    console.log('📊 Processing Summary:')
    console.log(`  • Test data: ${testDataCount}`)
    console.log(`  • Processed: ${processedCount}`)
    console.log(`  • Validated (pending): ${Math.max(0, allDonations.length - testDataCount - processedCount)}`)
    console.log('\n✅ All existing donations have been processed!\n')
  } catch (error) {
    console.error('❌ Error processing donations:', error)
    process.exit(1)
  }
}

// Run the script
processExistingDonations()

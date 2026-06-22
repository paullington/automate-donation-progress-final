import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { eq, and, isNotNull } from 'drizzle-orm'
import crypto from 'crypto'

export interface DocumentValidationResult {
  isTransaction: boolean
  isDuplicate: boolean
  isAnonymous: boolean
  duplicateOfId?: number
  confidence: number
  notes: string
  fileHash: string
}

export interface ProcessingResult {
  success: boolean
  message: string
  amount?: number
  validation: DocumentValidationResult
  donationId?: number
}

/**
 * Validates if a filename appears to be a transaction document
 */
function validateTransactionByFilename(fileName: string): {
  isTransaction: boolean
  confidence: number
} {
  const lowerName = fileName.toLowerCase()
  
  // Transaction keywords
  const transactionKeywords = [
    'receipt', 'transfer', 'payment', 'invoice', 'debit', 'credit', 
    'transaction', 'receipt', 'slip', 'proof', 'evidence', 'confirmed'
  ]
  
  // Non-transaction keywords
  const nonTransactionKeywords = [
    'screenshot', 'photo', 'image', 'picture', 'document', 'letter',
    'form', 'application', 'request', 'note', 'memo', 'message'
  ]

  let transactionScore = 0
  let nonTransactionScore = 0

  // Check for transaction keywords
  transactionKeywords.forEach(keyword => {
    if (lowerName.includes(keyword)) {
      transactionScore += 1
    }
  })

  // Check for non-transaction keywords
  nonTransactionKeywords.forEach(keyword => {
    if (lowerName.includes(keyword)) {
      nonTransactionScore += 1
    }
  })

  const isTransaction = transactionScore > nonTransactionScore
  const confidence = Math.max(transactionScore, nonTransactionScore) / 10
  
  return { isTransaction, confidence }
}

/**
 * Generates a hash of the file for duplicate detection
 */
function generateFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Checks for duplicate uploads using SHA-256 file hash (exact match) first,
 * then falls back to same-email + same-filename within a time window.
 */
async function checkForDuplicates(
  donorEmail: string | null | undefined,
  fileName: string,
  fileHash: string,
  timeWindowMinutes: number = 60
): Promise<{ isDuplicate: boolean; duplicateOfId?: number }> {
  try {
    // Primary check: exact file hash match against any stored hash
    const hashMatches = await db
      .select({ id: donations.id })
      .from(donations)
      .where(and(eq(donations.fileHash, fileHash), isNotNull(donations.fileHash)))
      .limit(1)

    if (hashMatches.length > 0) {
      return { isDuplicate: true, duplicateOfId: hashMatches[0].id }
    }

    // Secondary check: same email + same normalised filename within the time window
    if (!donorEmail) {
      return { isDuplicate: false }
    }

    const timeThreshold = new Date()
    timeThreshold.setMinutes(timeThreshold.getMinutes() - timeWindowMinutes)

    const emailMatches = await db
      .select({ id: donations.id, receiptFileName: donations.receiptFileName, createdAt: donations.createdAt })
      .from(donations)
      .where(eq(donations.donorEmail, donorEmail))

    const normalizedNew = fileName.toLowerCase().replace(/[^a-z0-9]/g, '')

    for (const existing of emailMatches) {
      if (existing.createdAt && new Date(existing.createdAt) > timeThreshold) {
        const normalizedExisting = existing.receiptFileName.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (normalizedExisting === normalizedNew) {
          return { isDuplicate: true, duplicateOfId: existing.id }
        }
      }
    }

    return { isDuplicate: false }
  } catch (error) {
    console.error('[v0] Error checking for duplicates:', error)
    return { isDuplicate: false }
  }
}

/**
 * Main document validation and processing function
 */
export async function validateAndProcessDocument(
  donorEmail: string | null | undefined,
  donorName: string | null | undefined,
  fileName: string,
  fileBuffer: Buffer,
  amount?: string | null
): Promise<DocumentValidationResult> {
  try {
    // Step 0: Check if donor is anonymous (no name provided)
    const isAnonymous = !donorName || donorName.trim().length === 0

    // Step 1: Validate transaction type by filename
    const { isTransaction, confidence } = validateTransactionByFilename(fileName)

    // Step 2: Check for duplicates
    const fileHash = generateFileHash(fileBuffer)
    const { isDuplicate, duplicateOfId } = await checkForDuplicates(
      donorEmail,
      fileName,
      fileHash
    )

    // Build validation notes
    const notes = [
      `File: ${fileName}`,
      `Transaction confidence: ${(confidence * 100).toFixed(0)}%`,
      isAnonymous ? 'Anonymous donor' : null,
      isDuplicate ? `Duplicate of donation #${duplicateOfId}` : null,
      isTransaction ? 'Identified as transaction' : 'Non-transaction file detected',
    ]
      .filter(Boolean)
      .join(' | ')

    return {
      isTransaction,
      isDuplicate,
      isAnonymous,
      duplicateOfId,
      confidence,
      notes,
      fileHash,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Document validation error:', message)
    return {
      isTransaction: false,
      isDuplicate: false,
      isAnonymous: true,
      confidence: 0,
      notes: `Validation error: ${message}`,
      fileHash: '',
    }
  }
}

/**
 * Update donation processing status in database
 */
export async function updateDonationStatus(
  donationId: number,
  status: {
    isProcessed: boolean
    isDuplicate: boolean
    duplicateOfId?: number
    transactionType: 'transaction' | 'not_transaction' | null
    processingNotes: string
  }
) {
  try {
    await db
      .update(donations)
      .set({
        isProcessed: status.isProcessed,
        isDuplicate: status.isDuplicate,
        duplicateOfId: status.duplicateOfId || null,
        transactionType: status.transactionType,
        processingNotes: status.processingNotes,
        updatedAt: new Date(),
      })
      .where(eq(donations.id, donationId))

    console.log('[v0] Updated donation status:', donationId)
  } catch (error) {
    console.error('[v0] Error updating donation status:', error)
    throw error
  }
}

/**
 * Mark existing donations as test data (first 2 uploads)
 */
export async function markAsTestData(count: number = 2) {
  try {
    const allDonations = await db
      .select()
      .from(donations)
      .orderBy(donations.createdAt)
      .limit(count)

    for (const donation of allDonations) {
      await updateDonationStatus(donation.id, {
        isProcessed: false,
        isDuplicate: false,
        transactionType: null,
        processingNotes: 'Test data - initial upload',
      })
    }

    console.log(`[v0] Marked ${allDonations.length} donations as test data`)
    return allDonations.length
  } catch (error) {
    console.error('[v0] Error marking test data:', error)
    throw error
  }
}

/**
 * Process and mark donations as successfully processed
 */
export async function markAsProcessed(donationIds: number[]) {
  try {
    for (const id of donationIds) {
      const donation = await db
        .select()
        .from(donations)
        .where(eq(donations.id, id))
        .limit(1)

      if (donation.length > 0) {
        const validation = await validateAndProcessDocument(
          donation[0].donorEmail,
          donation[0].donorName,
          donation[0].receiptFileName,
          Buffer.from(''), // We don't have the file buffer anymore
          donation[0].amount
        )

        await updateDonationStatus(id, {
          isProcessed: true,
          isDuplicate: validation.isDuplicate,
          duplicateOfId: validation.duplicateOfId,
          transactionType: validation.isTransaction ? 'transaction' : 'not_transaction',
          processingNotes: validation.notes,
        })
      }
    }

    console.log(`[v0] Marked ${donationIds.length} donations as processed`)
    return donationIds.length
  } catch (error) {
    console.error('[v0] Error marking donations as processed:', error)
    throw error
  }
}

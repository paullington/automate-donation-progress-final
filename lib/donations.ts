/**
 * Example script to retrieve and manage donations
 * This demonstrates how to access the donations data programmatically
 */

import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { desc, eq, gte, isNotNull, isNull } from 'drizzle-orm'

/**
 * Get all donations
 */
export async function getAllDonations() {
  try {
    const allDonations = await db
      .select()
      .from(donations)
      .orderBy(desc(donations.createdAt))

    console.log(`\n✅ Retrieved ${allDonations.length} donations`)
    return allDonations
  } catch (error) {
    console.error('Error retrieving donations:', error)
    throw error
  }
}

/**
 * Get recent donations (last N days)
 */
export async function getRecentDonations(days: number = 7) {
  try {
    const dateThreshold = new Date()
    dateThreshold.setDate(dateThreshold.getDate() - days)

    const recentDonations = await db
      .select()
      .from(donations)
      .where(gte(donations.createdAt, dateThreshold))
      .orderBy(desc(donations.createdAt))

    console.log(`\n✅ Retrieved ${recentDonations.length} donations from last ${days} days`)
    return recentDonations
  } catch (error) {
    console.error('Error retrieving recent donations:', error)
    throw error
  }
}

/**
 * Get donations with donor name (non-anonymous)
 */
export async function getNamedDonations() {
  try {
    const namedDonations = await db
      .select()
      .from(donations)
      .where(isNotNull(donations.donorName))
      .orderBy(desc(donations.createdAt))

    console.log(`\n✅ Retrieved ${namedDonations.length} named donations`)
    return namedDonations
  } catch (error) {
    console.error('Error retrieving named donations:', error)
    throw error
  }
}

/**
 * Get anonymous donations (no name provided)
 */
export async function getAnonymousDonations() {
  try {
    const anonymousDonations = await db
      .select()
      .from(donations)
      .where(isNull(donations.donorName))
      .orderBy(desc(donations.createdAt))

    console.log(`\n✅ Retrieved ${anonymousDonations.length} anonymous donations`)
    return anonymousDonations
  } catch (error) {
    console.error('Error retrieving anonymous donations:', error)
    throw error
  }
}

/**
 * Get donations with email (for sending thank you emails)
 */
export async function getDonationsWithEmail() {
  try {
    const withEmail = await db
      .select()
      .from(donations)
      .where(isNotNull(donations.donorEmail))
      .orderBy(desc(donations.createdAt))

    console.log(`\n✅ Retrieved ${withEmail.length} donations with email addresses`)
    return withEmail
  } catch (error) {
    console.error('Error retrieving donations with email:', error)
    throw error
  }
}

/**
 * Get donation by ID
 */
export async function getDonationById(id: number) {
  try {
    const donation = await db
      .select()
      .from(donations)
      .where(eq(donations.id, id))
      .limit(1)

    if (donation.length === 0) {
      console.log(`\n⚠️ Donation with ID ${id} not found`)
      return null
    }

    console.log(`\n✅ Retrieved donation #${id}`)
    return donation[0]
  } catch (error) {
    console.error('Error retrieving donation:', error)
    throw error
  }
}

/**
 * Get count of total donations
 */
export async function getDonationStats() {
  try {
    const allDonations = await db.select().from(donations)
    const namedDonations = allDonations.filter((d) => d.donorName)
    const anonymousDonations = allDonations.filter((d) => !d.donorName)
    const withEmail = allDonations.filter((d) => d.donorEmail)

    const stats = {
      total: allDonations.length,
      named: namedDonations.length,
      anonymous: anonymousDonations.length,
      withEmail: withEmail.length,
    }

    console.log('\n📊 Donation Statistics:')
    console.log(`   Total donations: ${stats.total}`)
    console.log(`   Named donations: ${stats.named}`)
    console.log(`   Anonymous donations: ${stats.anonymous}`)
    console.log(`   With email: ${stats.withEmail}`)

    return stats
  } catch (error) {
    console.error('Error calculating stats:', error)
    throw error
  }
}

/**
 * Export donations as CSV for spreadsheet
 */
export async function exportDonationsAsCSV() {
  try {
    const allDonations = await db.select().from(donations)

    const headers = [
      'ID',
      'Donor Name',
      'Donor Email',
      'Amount',
      'Receipt File',
      'Notes',
      'Date',
    ]

    const rows = allDonations.map((d) => [
      d.id,
      d.donorName || 'Anonymous',
      d.donorEmail || 'N/A',
      d.amount || 'N/A',
      d.receiptFileName,
      d.notes || 'N/A',
      new Date(d.createdAt).toISOString(),
    ])

    const csv =
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\n')

    console.log('\n📄 CSV Export:')
    console.log(csv)

    return csv
  } catch (error) {
    console.error('Error exporting CSV:', error)
    throw error
  }
}

/**
 * Delete a donation (use with caution)
 */
export async function deleteDonation(id: number) {
  try {
    await db.delete(donations).where(eq(donations.id, id))
    console.log(`\n✅ Deleted donation #${id}`)
  } catch (error) {
    console.error('Error deleting donation:', error)
    throw error
  }
}

// Example usage
if (require.main === module) {
  ;(async () => {
    try {
      // Uncomment the functions you want to run:

      // await getDonationStats()
      // await getAllDonations()
      // await getRecentDonations(7)
      // await getNamedDonations()
      // await getAnonymousDonations()
      // await getDonationsWithEmail()
      // await getDonationById(1)
      // await exportDonationsAsCSV()

      console.log(
        '\n💡 Tip: Import these functions into your own scripts to retrieve donation data'
      )
    } catch (error) {
      console.error('Fatal error:', error)
      process.exit(1)
    }
  })()
}

export default {
  getAllDonations,
  getRecentDonations,
  getNamedDonations,
  getAnonymousDonations,
  getDonationsWithEmail,
  getDonationById,
  getDonationStats,
  exportDonationsAsCSV,
  deleteDonation,
}

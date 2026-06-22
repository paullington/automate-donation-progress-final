import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { AdminLogin } from '@/components/admin/admin-login'
import {
  AdminDashboard,
  type AdminDonation,
} from '@/components/admin/admin-dashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authed = await isAdminAuthenticated()

  if (!authed) {
    return <AdminLogin />
  }

  let rows: AdminDonation[] = []
  try {
    const result = await db
      .select({
        id: donations.id,
        donorName: donations.donorName,
        donorEmail: donations.donorEmail,
        receiptFileName: donations.receiptFileName,
        receiptPathname: donations.receiptPathname,
        amount: donations.amount,
        notes: donations.notes,
        createdAt: donations.createdAt,
        isProcessed: donations.isProcessed,
        isDuplicate: donations.isDuplicate,
        duplicateOfId: donations.duplicateOfId,
        transactionType: donations.transactionType,
        processingNotes: donations.processingNotes,
        isAnonymous: donations.isAnonymous,
      })
      .from(donations)
      .orderBy(desc(donations.createdAt))

    rows = result.map((d): AdminDonation => ({
      id: d.id,
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      receiptFileName: d.receiptFileName,
      receiptPathname: d.receiptPathname,
      amount: d.amount,
      notes: d.notes,
      createdAt:
        d.createdAt instanceof Date
          ? d.createdAt.toISOString()
          : String(d.createdAt),
      isProcessed: d.isProcessed ?? undefined,
      isDuplicate: d.isDuplicate ?? undefined,
      duplicateOfId: d.duplicateOfId,
      transactionType: d.transactionType,
      processingNotes: d.processingNotes,
      isAnonymous: d.isAnonymous ?? undefined,
    }))
  } catch (error) {
    console.error('[v0] Admin donations query failed:', error)
  }

  return <AdminDashboard donations={rows} />
}

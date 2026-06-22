import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { donations } from '@/lib/db/schema'
import { desc, sql } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // This endpoint returns personal donor data — restrict it to authenticated admins.
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '50'),
      100
    )
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(donations)

    const totalCount = countResult[0]?.count || 0

    // Get donations, most recent first
    const donationsList = await db
      .select({
        id: donations.id,
        donorName: donations.donorName,
        donorEmail: donations.donorEmail,
        receiptFileName: donations.receiptFileName,
        receiptPathname: donations.receiptPathname,
        amount: donations.amount,
        notes: donations.notes,
        isProcessed: donations.isProcessed,
        isDuplicate: donations.isDuplicate,
        duplicateOfId: donations.duplicateOfId,
        transactionType: donations.transactionType,
        processingNotes: donations.processingNotes,
        createdAt: donations.createdAt,
        isAnonymous: donations.isAnonymous,
      })
      .from(donations)
      .orderBy(desc(donations.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      donations: donationsList,
      total: totalCount,
      limit,
      offset,
    })
  } catch (error) {
    console.error('[v0] List donations error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve donations' },
      { status: 500 }
    )
  }
}

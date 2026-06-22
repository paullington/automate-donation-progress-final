import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { shares } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get all shares grouped by platform
    const allShares = await db
      .select({
        platform: shares.platform,
        count: shares.count,
        lastUpdated: shares.lastUpdated,
      })
      .from(shares)

    // Calculate total shares
    const totalShares = allShares.reduce((sum, s) => sum + (s.count || 0), 0)

    return NextResponse.json({
      shares: allShares,
      total: totalShares,
    })
  } catch (error) {
    console.error('[v0] Get shares error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve shares' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform } = body

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    // Validate platform
    const validPlatforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'email', 'direct']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if platform already exists
    const existing = await db
      .select()
      .from(shares)
      .where(eq(shares.platform, platform))
      .limit(1)

    let result
    if (existing.length > 0) {
      // Increment existing share count
      result = await db
        .update(shares)
        .set({
          count: sql`${shares.count} + 1`,
          lastUpdated: new Date(),
        })
        .where(eq(shares.platform, platform))
        .returning()
    } else {
      // Create new platform share record
      result = await db
        .insert(shares)
        .values({
          platform,
          count: 1,
          lastUpdated: new Date(),
        })
        .returning()
    }

    console.log('[v0] Share recorded:', platform)

    return NextResponse.json({
      success: true,
      platform,
      newCount: result[0]?.count || 1,
      message: 'Share recorded successfully',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Record share error:', message)
    return NextResponse.json(
      { error: 'Failed to record share', detail: message },
      { status: 500 }
    )
  }
}

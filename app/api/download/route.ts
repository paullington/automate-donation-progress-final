import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Donor receipts are confidential — only an authenticated admin may fetch them.
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pathname = request.nextUrl.searchParams.get('pathname')
    const forceDownload = request.nextUrl.searchParams.get('download') === '1'

    if (!pathname) {
      return NextResponse.json(
        { error: 'Missing pathname parameter' },
        { status: 400 }
      )
    }

    // Validate pathname is in the receipts folder to prevent directory traversal
    if (!pathname.startsWith('receipts/')) {
      return NextResponse.json(
        { error: 'Invalid pathname' },
        { status: 400 }
      )
    }

    const result = await get(pathname, {
      access: 'private',
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
    })

    if (!result) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Return 304 Not Modified if ETag matches
    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          'Cache-Control': 'private, no-cache',
        },
      })
    }

    // Return the file stream with proper headers. `inline` previews in the
    // browser (View); `attachment` forces a file download (Download).
    const fileName = result.blob.pathname.split('/').pop() ?? 'receipt'
    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        'Content-Disposition': `${forceDownload ? 'attachment' : 'inline'}; filename="${fileName}"`,
        ETag: result.blob.etag,
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (error) {
    console.error('[v0] Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}

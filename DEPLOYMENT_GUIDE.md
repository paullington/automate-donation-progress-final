# Deployment Guide: Donation Automation System

This guide provides step-by-step instructions to deploy the automated donation tracking system to production.

## Overview of Changes

### New Features
- **Automated Share Tracking**: Social share buttons now track shares across all platforms
- **Real-time Donor Count**: Automatically counts unique donors from processed donations
- **Donation Amount Progress**: Calculates total amount from validated transactions
- **Processing Status Tracking**: All uploads marked as Processed/Pending/Duplicate/Failed
- **Transaction Validation**: Automatically validates if uploads are actual transaction documents
- **Duplicate Detection**: Identifies and links duplicate uploads from same donor
- **Anonymous Donor Support**: Donors who don't provide a name are recorded as anonymous (each anonymous donation counted separately)
- **Admin Dashboard Enhancements**: New status badges, filtering, and detail columns

### Files Created
- `/app/api/shares/route.ts` - Share tracking API
- `/app/api/campaign-stats/route.ts` - Real-time statistics API
- `/hooks/use-campaign-stats.ts` - React hook for fetching stats
- `/lib/document-processor.ts` - Document validation and processing logic
- `/scripts/002-add-processing-columns.sql` - Database migration
- `/scripts/process-existing-donations.ts` - Data migration script

### Files Modified
- `lib/db/schema.ts` - Added is_anonymous column and shares table
- `lib/document-processor.ts` - Added isAnonymous detection logic
- `app/api/donations/upload/route.ts` - Added validation on upload with anonymous handling
- `app/api/donations/route.ts` - Returns new status fields including isAnonymous
- `app/api/campaign-stats/route.ts` - Updated donor counting for anonymous donors
- `components/progress.tsx` - Fetches real-time stats
- `components/share-buttons.tsx` - Tracks shares
- `components/receipt-upload.tsx` - Updated help text for anonymous submission
- `components/admin/admin-dashboard.tsx` - Shows anonymous badge, status, type, and filters

## Deployment Steps

### Phase 1: GitHub Push

1. **Commit and push all changes**:
   ```bash
   git add .
   git commit -m "feat: Add automated donation tracking system with share counting, donor tracking, and transaction validation

   - Add database columns: transaction_type, is_processed, is_duplicate, duplicate_of_id, processing_notes
   - Create shares table to track social share counts
   - Add /api/shares endpoint for recording shares
   - Add /api/campaign-stats endpoint for real-time statistics
   - Add useCampaignStats hook for frontend stats fetching
   - Enhance upload validation with transaction detection and duplicate detection
   - Update Progress component to display real-time donor/amount/share counts
   - Track shares when users click social buttons
   - Update admin dashboard with status badges, type indicators, and filtering
   - Add database migration script (002-add-processing-columns.sql)
   - Add data processing script (process-existing-donations.ts)"
   
   git push origin main
   ```

2. **Verify GitHub**:
   - Navigate to your GitHub repository
   - Confirm all files appear in the commits
   - Check that no sensitive data was committed

### Phase 2: Database Migration

Before deploying to Vercel, run the database migration to add new columns and shares table.

#### Option A: Using Vercel Postgres CLI (if connected)

```bash
# Set environment to production
export NODE_ENV=production

# Run migration script
psql $DATABASE_URL -f scripts/002-add-processing-columns.sql
```

#### Option B: Manual SQL Execution (via Neon Dashboard)

1. Go to [Neon Dashboard](https://console.neon.tech)
2. Select your project and database
3. Click "SQL Editor"
4. Copy and paste the contents of `scripts/002-add-processing-columns.sql`
5. Click "Execute"
6. Verify success - should see message about creating shares table and indexes

#### SQL Migration Commands:
```sql
-- Add processing columns
ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS transaction_type TEXT,
  ADD COLUMN IF NOT EXISTS is_processed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS duplicate_of_id INTEGER,
  ADD COLUMN IF NOT EXISTS processing_notes TEXT;

-- Create shares table
CREATE TABLE IF NOT EXISTS public.shares (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Initialize share platforms
INSERT INTO public.shares (platform, count)
  VALUES
    ('whatsapp', 0),
    ('facebook', 0),
    ('twitter', 0),
    ('linkedin', 0),
    ('telegram', 0),
    ('email', 0),
    ('direct', 0)
  ON CONFLICT (platform) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_donations_is_processed ON public.donations(is_processed);
CREATE INDEX IF NOT EXISTS idx_donations_is_duplicate ON public.donations(is_duplicate);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_type ON public.donations(transaction_type);
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON public.donations(donor_email);
```

### Phase 3: Vercel Deployment

1. **Trigger automatic deployment**:
   - Vercel watches your GitHub repository and automatically deploys when you push to `main`
   - Navigate to [Vercel Dashboard](https://vercel.com/dashboard)
   - Your project should show a new deployment in progress
   - Wait for "✓ Production" status

2. **Alternative: Manual Deploy via CLI**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Monitor Deployment**:
   - Check [Vercel Deployments](https://vercel.com/dashboard/deployments)
   - Look for green checkmark next to latest commit
   - View logs if any errors occur

### Phase 4: Verify Deployment

1. **Test Frontend**:
   ```bash
   # Visit your live site
   https://your-domain.com
   
   # Test share buttons - click any social media button
   # Verify donation progress shows realistic numbers
   # Verify progress updates after shares
   ```

2. **Test APIs**:
   ```bash
   # Test share tracking
   curl -X POST https://your-domain.com/api/shares \
     -H "Content-Type: application/json" \
     -d '{"platform":"whatsapp"}'
   
   # Should return: {"success":true,"platform":"whatsapp","newCount":1}
   
   # Test stats API
   curl https://your-domain.com/api/campaign-stats
   
   # Should return: {"donors":X,"amountRaised":Y,"shares":Z,"breakdown":{...}}
   ```

3. **Test Admin Dashboard**:
   - Log into admin panel
   - Verify new "Status" and "Type" columns appear
   - Test filter buttons (Processed, Pending, Duplicates, Non-Transactions)
   - Verify status badges show correctly

4. **Test Existing Uploads**:
   - Verify all uploaded files still accessible
   - Confirm View/Download buttons work
   - Check that validation notes appear in dashboard

### Phase 5: Process Existing Donations

After deployment, process all existing donations to mark their status.

#### Local Processing (Recommended for First Run):

```bash
# Run locally with production database
export DATABASE_URL="your-neon-connection-string"
npx ts-node scripts/process-existing-donations.ts
```

The script will:
- Mark first 2 uploads as test data
- Mark next 2 uploads as processed
- Validate remaining uploads and set transaction type

#### Expected Output:
```
📋 Starting existing donations processing...

Found N total donations

Step 1: Marking first 2 uploads as test data...
  ✓ Marked donation #1 as test data
  ✓ Marked donation #2 as test data

Step 2: Marking next 2 uploads as processed...
  ✓ Processed donation #3
    - Type: Transaction
    - Duplicate: No
  ✓ Processed donation #4
    - Type: Non-Transaction
    - Duplicate: No

Step 3: Validating remaining uploads...
  ✓ Validated donation #5
    - Type: Transaction
    - Duplicate: No
  [... more validations ...]

📊 Processing Summary:
  • Test data: 2
  • Processed: 2
  • Validated (pending): N

✅ All existing donations have been processed!
```

### Phase 6: Vercel Dashboard Configuration

1. **Check Environment Variables**:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Select your project
   - Click "Settings" → "Environment Variables"
   - Verify these are set:
     - `DATABASE_URL` - Your Neon connection string
     - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
     - `ADMIN_PASSWORD` - Your admin password
   - **No new environment variables needed** for this update

2. **Monitor Performance**:
   - Click "Analytics" tab
   - Watch real-time requests
   - Monitor API response times

3. **Set Up Observability** (Optional):
   - Enable "Function Logs" to view errors
   - Enable "Web Analytics" for user behavior
   - Set up error alerting via Slack/Email

## Rollback Procedure

If something goes wrong:

### Option 1: Revert via Vercel
1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "Redeploy" next to it
4. Confirm - site will revert to previous version

### Option 2: Revert via GitHub
```bash
git revert HEAD
git push origin main
# Vercel will automatically deploy the revert
```

### Option 3: Manual Database Rollback
If database schema is the issue:
```bash
# Drop the new columns (careful!)
ALTER TABLE public.donations
  DROP COLUMN IF EXISTS processing_notes,
  DROP COLUMN IF EXISTS duplicate_of_id,
  DROP COLUMN IF EXISTS is_duplicate,
  DROP COLUMN IF EXISTS is_processed,
  DROP COLUMN IF EXISTS transaction_type;

# Drop shares table
DROP TABLE IF EXISTS public.shares;
```

## Verification Checklist

After deployment, verify each item:

- [ ] Website loads without errors
- [ ] Share buttons display correctly
- [ ] Clicking share buttons tracks shares (check /api/campaign-stats)
- [ ] Progress component shows updated donor count
- [ ] Progress component shows updated donation amount
- [ ] Progress component shows updated share count
- [ ] Admin dashboard loads with new status columns
- [ ] Status badges display (Processed/Pending/Duplicate)
- [ ] Type badges display (Transaction/Non-Transaction/Unvalidated)
- [ ] Filter buttons work (Processed, Pending, Duplicates, Non-Transactions)
- [ ] Processing notes display in notes column
- [ ] Download/View document buttons still work
- [ ] New upload shows validation info in notes
- [ ] Duplicate detection works (upload same file twice, second is marked Duplicate)
- [ ] All existing donations appear with status

## Troubleshooting

### Issue: Stats API returns 500 error
**Solution**: 
- Check DATABASE_URL is set in Vercel environment
- Run migration script to ensure new columns exist
- Check Neon dashboard for connection issues

### Issue: Share count not incrementing
**Solution**:
- Check browser console for JavaScript errors
- Verify /api/shares endpoint responds with 200
- Check Vercel logs for API errors

### Issue: Admin dashboard shows all Pending
**Solution**:
- Run `scripts/process-existing-donations.ts` to validate uploads
- Check processing_notes column for validation errors

### Issue: Migration SQL fails
**Solution**:
- Verify you're using correct DATABASE_URL
- Check if columns already exist (safe to rerun)
- If manual SQL in Neon editor, ensure you have proper permissions

## Performance Notes

- Stats are cached for 5 minutes on client side
- Share tracking is non-blocking (doesn't slow down shares)
- Dashboard filters are client-side (instant feedback)
- Database indexes created for common query patterns

## Support

For issues or questions:
1. Check Vercel deployment logs (Deployments → Details)
2. Review browser console for frontend errors
3. Check database directly for data integrity
4. Contact support with deployment ID and timestamps

---

**Deployment Date**: [Insert deployment date]
**Previous Build Hash**: [Previous commit hash]
**New Build Hash**: [New commit hash]
**Status**: ✓ Ready for production

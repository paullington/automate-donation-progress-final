# Production Errors - Detailed Resolution Guide

## Overview

Your Vercel deployment has logged two errors that need immediate attention:

1. **PostgreSQL SSL Mode Warning** - Database connection using outdated SSL mode
2. **BLOB_READ_WRITE_TOKEN Not Set** - File storage token missing from production environment

**Total Fix Time: 15-20 minutes**

---

## ERROR #1: PostgreSQL SSL Mode Warning (5-7 minutes)

### The Error Message
```
SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca'
are treated as aliases for 'verify-full'. In the next major version
(pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt
standard libpq semantics, which have weaker security guarantees...
```

### Why This Happens

The PostgreSQL connection library (`pg`) is deprecating the old SSL mode format. Your `DATABASE_URL` currently uses `sslmode=require`, which will break in future versions.

**Current (problematic):** `postgresql://user:pass@host/db?sslmode=require`
**Future proof:** `postgresql://user:pass@host/db?sslmode=verify-full`

### Impact

- **Current:** Warning appears in logs but app still works
- **Future:** Connection will fail in pg v9.0.0+ and PostgreSQL v3.0.0+
- **Recommendation:** Fix now to future-proof your application

### Step-by-Step Fix

#### Step 1: Get Your Connection String from Neon

1. Open Neon Console: https://console.neon.tech
2. Log in to your account
3. Select your project (look for "automate-donation-tracking" or similar)
4. Click on your database
5. Click **"Connection String"** button (usually top right or in settings)
6. Copy the full connection string that looks like:
   ```
   postgresql://user:password@region.neon.tech/database?sslmode=require&...
   ```

#### Step 2: Modify the Connection String

In the connection string you copied, locate the SSL mode parameter:

**Find this:**
```
?sslmode=require
```

**Replace it with:**
```
?sslmode=verify-full
```

**Complete example:**

BEFORE:
```
postgresql://user:pass@host.neon.tech/dbname?sslmode=require&...
```

AFTER:
```
postgresql://user:pass@host.neon.tech/dbname?sslmode=verify-full&...
```

> **Important:** Only change `require` to `verify-full`. Don't modify anything else.

#### Step 3: Update in Vercel Dashboard

1. Open Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `automate-donation-tracking`
3. Go to **Settings** (top menu bar)
4. Click **Environment Variables** (left sidebar)
5. Find the variable named: `DATABASE_URL`
6. Click the **three dots (...)** next to it
7. Select **Edit**
8. Replace the entire value with your modified connection string (from Step 2)
9. Click **Save**

**Visual guide:**
```
Vercel Dashboard
├── Settings
│   └── Environment Variables
│       └── DATABASE_URL [Edit] ← Click here
│           └── Paste modified connection string with sslmode=verify-full
│               └── Save
```

#### Step 4: Wait for Deployment

1. Go to **Deployments** tab
2. Watch the latest deployment
3. Wait for **green checkmark ✓** (2-3 minutes)
4. Red X means deployment failed - check logs

#### Step 5: Verify the Fix

1. Go to **Deployments** → Latest deployment
2. Click **Logs** tab
3. Search for "SECURITY WARNING"
4. **Result:** Should NOT appear in logs anymore

---

## ERROR #2: BLOB_READ_WRITE_TOKEN Not Set (6-8 minutes)

### The Error Message
```
[v0] BLOB_READ_WRITE_TOKEN is not set
```

### Why This Happens

The error occurs in `/app/api/donations/upload/route.ts` at line 32-38:

```typescript
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('[v0] BLOB_READ_WRITE_TOKEN is not set')
  return NextResponse.json(
    { error: 'Server is not configured for file storage. Please contact support.' },
    { status: 500 }
  )
}
```

**Root cause:** The environment variable is missing from Vercel production environment.
- Local dev works (it's in `.env.local`)
- Production breaks (not added to Vercel)

### Impact

- **File uploads fail** - Users see error message
- **Admin dashboard broken** - Can't access uploaded files
- **No receipts stored** - Files never reach Blob storage
- **Donations incomplete** - No document attachments

### Step-by-Step Fix

#### Step 1: Navigate to Vercel Environment Variables

1. Open Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `automate-donation-tracking`
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. You should see a list of variables like:
   - DATABASE_URL ✓
   - ADMIN_PASSWORD ✓
   - BLOB_READ_WRITE_TOKEN ← Look for this

#### Step 2: Check if Variable Exists

**Scenario A: Variable does NOT exist**
- Proceed to "Add New Variable" below

**Scenario B: Variable exists but is empty**
- Proceed to "Edit Existing Variable" below

**Scenario C: Variable exists with a value**
- Verify it's set for Production environment
- Proceed to Step 4

#### Step 3: Add or Edit the Variable

##### Option A: Add New Variable (if not exists)

1. Click **Add New** button (top right of environment variables)
2. In **Name** field: Type `BLOB_READ_WRITE_TOKEN`
3. In **Value** field: Leave **BLANK** (don't type anything)
4. **Environments:** Make sure ALL THREE are selected:
   - ☑ Production
   - ☑ Preview  
   - ☑ Development
5. Click **Add**
6. Vercel will auto-generate the token value

##### Option B: Edit Existing Variable (if empty)

1. Find `BLOB_READ_WRITE_TOKEN` in the list
2. Click **three dots (...)** next to it
3. Click **Edit**
4. Leave **Value** field BLANK
5. Ensure ALL THREE environments selected:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
6. Click **Save**
7. Vercel will auto-populate the token

**Important:** When you leave the value blank for Blob storage tokens, Vercel automatically generates the correct value. This is the intended workflow.

#### Step 4: Verify Environment Selection

Confirm these are selected for `BLOB_READ_WRITE_TOKEN`:

```
✓ Production    (where your live app runs)
✓ Preview       (where preview deployments run)
✓ Development   (for local testing)
```

#### Step 5: Wait for Deployment

1. Go to **Deployments** tab
2. Wait for latest deployment to complete
3. Look for **green checkmark ✓** (2-3 minutes)
4. If red X: Check logs for specific error

#### Step 6: Test File Upload

1. Go to your app: `https://your-project.vercel.app`
2. Navigate to the donation form
3. Select a file (PDF, JPG, or PNG)
4. Fill in donor information
5. Click **Submit** or **Upload**
6. **Expected result:** File uploads successfully with no error

#### Step 7: Verify in Logs

1. Go to **Deployments** → Latest deployment
2. Click **Logs** tab
3. Search for "BLOB_READ_WRITE_TOKEN is not set"
4. **Result:** Should NOT appear in logs

---

## Complete Verification Checklist

### After Both Fixes - Verify All Systems

#### PostgreSQL SSL Configuration
- [ ] DATABASE_URL contains `sslmode=verify-full` (not `require`)
- [ ] Vercel deployment completed with green checkmark
- [ ] "SECURITY WARNING" does NOT appear in logs
- [ ] Database queries execute without SSL errors
- [ ] App loads normally without connection issues

#### Blob Storage Configuration
- [ ] `BLOB_READ_WRITE_TOKEN` exists in Environment Variables
- [ ] Token value is NOT empty (auto-generated by Vercel)
- [ ] ALL three environments selected (Production, Preview, Dev)
- [ ] Vercel deployment completed with green checkmark
- [ ] "[v0] BLOB_READ_WRITE_TOKEN is not set" NOT in logs
- [ ] File upload test successful
- [ ] Files appear in Blob storage (Vercel console)

#### All Five Environment Variables Set
- [ ] `DATABASE_URL` with `verify-full` SSL mode
- [ ] `BLOB_READ_WRITE_TOKEN` with value
- [ ] `ADMIN_PASSWORD` set for dashboard access
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL
- [ ] `NEON_AUTH_COOKIE_SECRET` set for auth

#### Application Functionality
- [ ] Homepage loads without errors
- [ ] File upload form works
- [ ] Files upload successfully
- [ ] Admin dashboard accessible with password
- [ ] Donation records saved to database
- [ ] Share tracking operational
- [ ] Real-time statistics updating
- [ ] No console errors (F12 in browser)
- [ ] No errors in Vercel logs

---

## Connection String Reference

### PostgreSQL Connection String Formats

| Format | Use Case | Status |
|--------|----------|--------|
| `postgresql://user:pass@host/db?sslmode=require` | OLD format | ⚠️ DEPRECATED |
| `postgresql://user:pass@host/db?sslmode=verify-full` | NEW format | ✅ RECOMMENDED |
| `postgresql://user:pass@host/db?sslmode=require&uselibpqcompat=true` | LibPQ compatible | Alternative |

**Action:** Change `require` to `verify-full`

### Example Connection Strings

**Before (causes warning):**
```
postgresql://neondb_user:password@ec2-12-34-56-78.neon.tech:5432/neondb?sslmode=require&directLB=true
```

**After (fixed):**
```
postgresql://neondb_user:password@ec2-12-34-56-78.neon.tech:5432/neondb?sslmode=verify-full&directLB=true
```

---

## Troubleshooting Common Issues

### Issue #1: "Deployment keeps failing after DATABASE_URL change"

**Symptoms:**
- Red X on deployment
- Connection refused errors
- Connection timeout

**Solutions:**
1. Verify connection string copied correctly (no extra spaces)
2. Check Neon console - database still active?
3. Try copying connection string again from Neon
4. Hard refresh browser: `Ctrl+Shift+R`
5. Check deployment logs for specific error

### Issue #2: "SSL warning still appears in logs"

**Symptoms:**
- Warning still shows after fix
- Logs still mention sslmode=require

**Solutions:**
1. Verify DATABASE_URL has `verify-full` not `require`
2. Wait 5 minutes for logs to refresh
3. Trigger new deployment: Click "Redeploy" button
4. Hard refresh browser
5. Check environment variables - is it saved?

### Issue #3: "File upload still gives error: BLOB_READ_WRITE_TOKEN not set"

**Symptoms:**
- Upload fails with error message
- Error message mentions file storage not configured

**Solutions:**
1. Verify `BLOB_READ_WRITE_TOKEN` exists in Environment Variables
2. Check value is NOT empty (should be auto-generated)
3. Confirm ALL three environments selected (Prod, Preview, Dev)
4. Try redeploy: Deployments → Latest → Redeploy button
5. Hard refresh browser: `Ctrl+Shift+R`
6. Wait 2-3 minutes after environment variable change
7. Check console errors: Press F12, look at Console tab

### Issue #4: "Can't find BLOB_READ_WRITE_TOKEN in environment variables"

**Symptoms:**
- Variable not visible in list
- List shows other variables but not Blob token

**Solutions:**
1. Scroll down - might be on next page
2. Use search/filter to find it
3. If truly missing: Click "Add New" to add it
4. Name: `BLOB_READ_WRITE_TOKEN` (exact spelling)
5. Value: Leave blank (Vercel auto-fills)
6. Select all environments
7. Click Add

### Issue #5: "Deployment shows green checkmark but errors still in logs"

**Symptoms:**
- Deployment successful but SSL warning or Blob error appears
- Confusing situation

**Solutions:**
1. Logs might be delayed - wait 5 minutes
2. Check it's the LATEST deployment logs
3. Look at timestamp - is it after you made changes?
4. Trigger fresh deployment to clear old logs
5. Search deployment list for most recent

---

## Reference Links

### Important Dashboards
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Neon Console:** https://console.neon.tech
- **Your App:** https://your-project.vercel.app

### Documentation
- **PostgreSQL SSL Modes:** https://www.postgresql.org/docs/current/libpq-ssl.html
- **Vercel Blob Docs:** https://vercel.com/docs/storage/vercel-blob
- **Neon Connection Help:** https://neon.tech/docs/get-started-with-neon/connect-neon

### Related Environment Variables
```
DATABASE_URL=postgresql://...?sslmode=verify-full
BLOB_READ_WRITE_TOKEN=vercel_blob_...
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NEON_AUTH_COOKIE_SECRET=generated_secret
```

---

## Time Estimate

| Task | Time |
|------|------|
| Fix PostgreSQL SSL | 5-7 min |
| Fix Blob Token | 6-8 min |
| Verification | 2-3 min |
| **Total** | **15-20 min** |

---

## After Fixes - What Works

When both errors are resolved, these features become operational:

✅ File uploads work correctly
✅ Receipts stored in Blob storage
✅ Donation records saved to database
✅ Admin dashboard fully functional
✅ Share tracking operational
✅ Real-time statistics updating
✅ No security warnings
✅ Production-ready application
✅ Future-proof SSL configuration
✅ Clean deployment logs

---

## Success Criteria

Everything is working correctly when:

1. **Logs are clean**
   - No "SECURITY WARNING" about SSL
   - No "BLOB_READ_WRITE_TOKEN is not set"
   - No critical errors

2. **File uploads work**
   - Select file from form
   - Click upload/submit
   - File successfully stored
   - No error messages

3. **Database works**
   - Donation records created
   - Data persists
   - Admin dashboard shows records
   - Queries execute fast

4. **Admin features work**
   - Access `/admin` with password
   - View all donations
   - See uploaded files
   - Download receipts

5. **All features operational**
   - Share tracking updates
   - Statistics refresh
   - Real-time data displays
   - No console errors

---

## Summary

This guide resolves two critical production errors:

1. **PostgreSQL SSL Warning** - Update `DATABASE_URL` to use `sslmode=verify-full`
2. **BLOB Token Missing** - Add `BLOB_READ_WRITE_TOKEN` to Vercel environment variables

Both fixes take approximately 15-20 minutes total, including deployment wait time.

**Ready to implement?** Start with Error #1 above!

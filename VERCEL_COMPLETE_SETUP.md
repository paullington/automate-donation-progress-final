# VERCEL DASHBOARD - COMPLETE SETUP GUIDE

## TABLE OF CONTENTS
1. Initial Project Connection
2. Environment Variables
3. Integrations Setup (Neon & Blob)
4. Deployment Configuration
5. Monitoring & Logs
6. Testing & Verification

---

## SECTION 1: INITIAL PROJECT CONNECTION

### Step 1.1: Verify Project Connected to Vercel

**Via Vercel Dashboard:**
1. Go to: https://vercel.com/dashboard
2. Look for: **automate-donation-tracking** (or your project name)
3. Click on the project name
4. You should see: **"✓ Connected to GitHub"** at the top

**Via Terminal:**
```bash
# Check if deployment is connected
vercel whoami

# Verify project settings
vercel env list
```

### Step 1.2: Verify GitHub Integration

1. In Vercel dashboard, go to: **Settings → Git**
2. Verify:
   - **Connected Repository**: paullington/automate-donation-tracking
   - **Branch**: main (or your deployment branch)
   - **Auto-deployment**: Enabled

3. If not connected:
   - Click "Connect Repository"
   - Select your GitHub account
   - Select: automate-donation-tracking
   - Click "Connect"

---

## SECTION 2: ENVIRONMENT VARIABLES - CRITICAL SETUP

### Step 2.1: Access Environment Variables

**Via Vercel Dashboard:**
1. Go to: Your project dashboard
2. Click: **Settings** (top navigation)
3. Click: **Environment Variables** (left sidebar)

### Step 2.2: Required Environment Variables

You need **5 environment variables**. Add each one:

#### Variable 1: DATABASE_URL (Neon PostgreSQL)

**Name:** `DATABASE_URL`

**Value:** Your Neon connection string
```
postgresql://user:password@host/database?sslmode=require
```

**Where to find it:**
1. Go to: https://console.neon.tech
2. Click your project
3. Click "Connection string"
4. Select "nodejs" from dropdown
5. Copy the full string

**Steps to add:**
1. In Vercel: Click "Add New"
2. Name: `DATABASE_URL`
3. Value: Paste your Neon connection string
4. Environment: Select all (Production, Preview, Development)
5. Click "Save"

#### Variable 2: BLOB_READ_WRITE_TOKEN (Vercel Blob Storage)

**Name:** `BLOB_READ_WRITE_TOKEN`

**Value:** Already set by Vercel integration

**Verify it exists:**
1. In Environment Variables list
2. Look for: `BLOB_READ_WRITE_TOKEN`
3. Should show: `●●●●●●●●●●●●●●●●●●●●●● (already set)`
4. If missing: See Blob Integration section below

#### Variable 3: ADMIN_PASSWORD (For Admin Dashboard)

**Name:** `ADMIN_PASSWORD`

**Value:** Create a secure password
```
SecureAdminPass123!@#
```

**Steps to add:**
1. Click "Add New"
2. Name: `ADMIN_PASSWORD`
3. Value: Enter a secure password
4. Environment: Select all
5. Click "Save"

#### Variable 4: NEXT_PUBLIC_SITE_URL (Public URL)

**Name:** `NEXT_PUBLIC_SITE_URL`

**Value:** Your production URL
```
https://your-project.vercel.app
```

**Steps to add:**
1. Click "Add New"
2. Name: `NEXT_PUBLIC_SITE_URL`
3. Value: `https://your-project.vercel.app`
4. Environment: Production only
5. Click "Save"

**After deployment, update with:**
- Custom domain if you have one
- Default: `https://your-project.vercel.app`

#### Variable 5: NEON_AUTH_COOKIE_SECRET (Authentication)

**Name:** `NEON_AUTH_COOKIE_SECRET`

**Value:** Generate a secure 32-character secret

**Generate the secret:**

On Mac/Linux:
```bash
openssl rand -base64 32
```

Output example:
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abc=
```

On Windows (PowerShell):
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
```

**Steps to add:**
1. Click "Add New"
2. Name: `NEON_AUTH_COOKIE_SECRET`
3. Value: Paste your generated secret
4. Environment: Select all
5. Click "Save"

### Step 2.3: Verify All Variables Added

**Checklist:**
- [ ] DATABASE_URL - Set ✓
- [ ] BLOB_READ_WRITE_TOKEN - Set ✓
- [ ] ADMIN_PASSWORD - Set ✓
- [ ] NEXT_PUBLIC_SITE_URL - Set ✓
- [ ] NEON_AUTH_COOKIE_SECRET - Set ✓

**View current list:**
```bash
vercel env list
```

Should show all 5 variables (some values hidden with dots for security).

---

## SECTION 3: INTEGRATIONS SETUP

### Integration 1: Neon PostgreSQL Database

#### Status Check
- Connected: ✓ Yes
- Database Schema: ✓ Available
- Missing: NEON_AUTH_COOKIE_SECRET (add in Section 2)

#### Step 3.1: Verify Neon Connection

**In Vercel Dashboard:**
1. Go to: **Settings → Integrations**
2. Look for: **Neon**
3. Should show: **"✓ Connected"**

**In Neon Console:**
1. Go to: https://console.neon.tech
2. Verify your database exists
3. Copy connection string for DATABASE_URL

#### Step 3.2: Database Schema Setup

The schema is already created in Neon with these tables:
- `public.donations` - Main donation records
- `public.shares` - Share tracking
- `neon_auth.*` - Authentication tables

**Required columns in donations table:**
```sql
CREATE TABLE IF NOT EXISTS public.donations (
  id SERIAL PRIMARY KEY,
  donor_name TEXT,
  donor_email TEXT,
  receipt_file_name TEXT NOT NULL,
  receipt_pathname TEXT NOT NULL,
  receipt_url TEXT,
  amount TEXT,
  notes TEXT,
  transaction_type TEXT,
  is_processed BOOLEAN DEFAULT FALSE,
  is_duplicate BOOLEAN DEFAULT FALSE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  duplicate_of_id INTEGER,
  processing_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Check if schema exists:**
1. In Neon console
2. Click "SQL Editor"
3. Run:
```sql
SELECT * FROM information_schema.tables 
WHERE table_name='donations';
```

Should return the donations table.

#### Step 3.3: Run Database Migrations

**Option A: Via Neon Console (Easiest)**

1. Go to: https://console.neon.tech
2. Click your project
3. Click "SQL Editor"
4. Copy-paste migration from: `scripts/002-add-processing-columns.sql`
5. Click "Execute"

**Option B: Via Terminal**

```bash
# Set database URL
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Run migrations
psql $DATABASE_URL < scripts/002-add-processing-columns.sql
```

**Verify migrations ran:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'donations' 
ORDER BY ordinal_position;
```

Should show all columns including: is_anonymous, transaction_type, is_processed, etc.

### Integration 2: Vercel Blob Storage

#### Status Check
- Connected: ✓ Yes
- Token: ✓ Set (BLOB_READ_WRITE_TOKEN)
- Ready: ✓ Yes

#### Step 3.4: Verify Blob Storage

**In Vercel Dashboard:**
1. Go to: **Storage → Blob**
2. Should show: **"✓ Connected"**
3. View: Files stored (will be empty initially)

**Test upload:**
1. Submit a receipt via the application
2. Should appear in Blob storage
3. Check: https://vercel.com/dashboard/storage/blob

#### Step 3.5: Configure Blob Settings

**Blob Storage Location:**
1. In Vercel dashboard: **Storage → Blob**
2. Click: **Settings**
3. Verify: Region is set appropriately (default: iad - US East)
4. Note: Region cannot be changed after creation

**File Retention:**
- Default: Keep indefinitely
- Can be modified in application code if needed

---

## SECTION 4: DEPLOYMENT CONFIGURATION

### Step 4.1: Build & Deployment Settings

**In Vercel Dashboard:**
1. Go to: **Settings → General**
2. Verify:
   - **Framework Preset**: Next.js ✓
   - **Node Version**: 18 or higher ✓
   - **Build Command**: `next build` ✓
   - **Output Directory**: `.next` ✓
   - **Development Command**: `next dev` ✓

3. If not set, configure:
   - Click "Edit" next to each setting
   - Enter the correct value
   - Click "Save"

### Step 4.2: Git Integration Settings

**In Vercel Dashboard:**
1. Go to: **Settings → Git**
2. Verify:
   - **Production Branch**: main
   - **Preview Deployments**: Enabled
   - **Automatic Deployments**: Enabled

3. Additional options:
   - **Ignored Build Step**: Leave empty (or set custom condition)
   - **Merging Strategies**: Default is fine

### Step 4.3: Deploy Hooks (Optional)

**Purpose:** Trigger deployments from external services

**To create:**
1. Go to: **Settings → Git**
2. Scroll to: **Deploy Hooks**
3. Click: **Add**
4. Name: `Manual Trigger`
5. Branch: `main`
6. Copy the webhook URL
7. Click: **Create**

**Use it:**
```bash
curl -X POST <YOUR_DEPLOY_HOOK_URL>
```

---

## SECTION 5: MONITORING & LOGS

### Step 5.1: View Deployment Logs

**In Vercel Dashboard:**
1. Click: **Deployments** (top navigation)
2. Click on latest deployment
3. View:
   - **Build logs** - Compilation process
   - **Runtime logs** - Application errors
   - **Function logs** - API endpoint logs

**Real-time monitoring:**
```bash
vercel logs --follow
```

### Step 5.2: Environment-Specific Logs

**Production logs:**
```bash
vercel logs --environment=production
```

**Preview logs:**
```bash
vercel logs --environment=preview
```

**Development logs:**
```bash
vercel logs --environment=development
```

### Step 5.3: Error Monitoring

**Check for deployment errors:**
1. Go to: **Deployments**
2. Look for: Red "X" indicator
3. Click deployment to see error details
4. Common issues:
   - Missing environment variables
   - Database connection failed
   - Build compilation error

**Fix failed deployments:**
1. Fix the issue (add env var, fix code, etc.)
2. Make a new commit to main branch
3. Vercel auto-redeploys
4. Or manually trigger: **Redeploy** button

### Step 5.4: Performance Monitoring

**In Vercel Dashboard:**
1. Go to: **Analytics** (if available in your plan)
2. View:
   - Page load times
   - Error rates
   - Regional performance
   - Bot traffic

---

## SECTION 6: TESTING & VERIFICATION

### Step 6.1: Verify Application Loads

**In browser:**
1. Go to: `https://your-project.vercel.app`
2. Should see: Beautiful donation page
3. Check for:
   - No console errors (F12 → Console tab)
   - No 500 errors
   - All images loaded
   - Share buttons visible

### Step 6.2: Test Database Connection

**Test via application:**
1. Fill donation form
2. Upload a receipt
3. Submit
4. Should see: Success message
5. Receipt should appear in Blob storage

**Test via terminal:**
```bash
# Using Vercel CLI
vercel env pull

# Test connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM donations;"
```

### Step 6.3: Test Authentication

**Test admin login:**
1. Go to: `https://your-project.vercel.app/admin`
2. Password: Your ADMIN_PASSWORD
3. Should login successfully
4. Should see: Admin dashboard

### Step 6.4: Test File Upload

**Test Blob storage:**
1. In admin dashboard
2. Should see uploaded donations
3. Click "Download" button
4. File should download
5. Receipt should be accessible

### Step 6.5: Test Real-time Features

**Test share tracking:**
1. Homepage: Click share button (WhatsApp, Facebook, etc.)
2. Should increment share count
3. Refresh page: Count should persist

**Test donor counting:**
1. Submit a donation with name
2. Admin dashboard: "Processed" status
3. Homepage: Donor count increases

**Test anonymous donations:**
1. Submit without providing name
2. Admin dashboard: Shows "Anonymous" badge
3. Email field hidden (for privacy)

### Step 6.6: Test Deployment Auto-restart

**Make a code change:**
1. Edit any file (e.g., change text in homepage)
2. Commit: `git add . && git commit -m "test change"`
3. Push: `git push origin main`
4. Vercel should auto-deploy
5. New deployment appears in Deployments tab
6. Should be live in ~30 seconds

---

## SECTION 7: CUSTOM DOMAIN (OPTIONAL)

### Step 7.1: Add Custom Domain

**If you have a domain:**
1. Go to: **Settings → Domains**
2. Click: **Add**
3. Enter: Your domain (e.g., donation.example.com)
4. Follow DNS configuration steps
5. Once verified: Domain goes live

### Step 7.2: Update Environment Variable

**After custom domain setup:**
1. Go to: **Settings → Environment Variables**
2. Edit: `NEXT_PUBLIC_SITE_URL`
3. Change value to: `https://your-custom-domain.com`
4. Click: **Save**

---

## TROUBLESHOOTING

### Issue: Build failing with "Cannot find module"

**Solution:**
```bash
# Your package.json might be missing dependencies
npm install

# Verify in package.json all deps are listed
# Then commit and push
git add package.json
git commit -m "update dependencies"
git push origin main
```

### Issue: Database connection error

**Solution:**
1. Verify DATABASE_URL is set correctly
2. Check Neon connection string format
3. Ensure SSL mode is set to "require"
4. Test locally first:
```bash
vercel env pull
psql $DATABASE_URL -c "SELECT 1;"
```

### Issue: Blob storage not working

**Solution:**
1. Verify BLOB_READ_WRITE_TOKEN exists
2. Check token hasn't expired
3. Regenerate if needed in Vercel dashboard
4. Re-add environment variable

### Issue: Admin login not working

**Solution:**
1. Verify ADMIN_PASSWORD is set
2. Try exact password (case-sensitive)
3. Check browser console for errors
4. Clear browser cache and try again

---

## FINAL CHECKLIST

Before considering deployment complete:

**Environment Variables:**
- [ ] DATABASE_URL - Set and tested
- [ ] BLOB_READ_WRITE_TOKEN - Set
- [ ] ADMIN_PASSWORD - Set
- [ ] NEXT_PUBLIC_SITE_URL - Set
- [ ] NEON_AUTH_COOKIE_SECRET - Set

**Integrations:**
- [ ] Neon - Connected & schema verified
- [ ] Blob - Connected & tested
- [ ] GitHub - Connected & auto-deploy working

**Deployment:**
- [ ] Build succeeds (no red X in deployments)
- [ ] Homepage loads without errors
- [ ] Admin dashboard accessible
- [ ] File uploads work
- [ ] Share tracking works
- [ ] Donation form works

**Testing:**
- [ ] Anonymous donation tested
- [ ] Named donation tested
- [ ] Duplicate detection works
- [ ] Stats update real-time
- [ ] All share buttons working

**Performance:**
- [ ] Page loads < 2 seconds
- [ ] No console errors
- [ ] Database queries fast
- [ ] File uploads reliable

---

## NEXT STEPS

1. Complete all sections above
2. Test each feature thoroughly
3. Monitor logs for first 24 hours
4. Share deployment URL with team
5. Set up monitoring/alerts if needed

**Questions?** Check:
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs

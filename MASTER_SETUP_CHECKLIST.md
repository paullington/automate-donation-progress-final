# MASTER SETUP CHECKLIST - COMPLETE DEPLOYMENT

## QUICK OVERVIEW

Your project has been pushed to GitHub and deployed on Vercel. This checklist ensures everything is configured correctly across all platforms.

**Status:**
- ✓ GitHub: Code pushed
- ✓ Vercel: Deployment live
- ⏳ Configuration: In Progress

**Time to complete:** 45-60 minutes

---

## SECTION 1: VERCEL DASHBOARD SETUP (15 minutes)

### 1.1: Project Connection
- [ ] Go to: https://vercel.com/dashboard
- [ ] Find project: automate-donation-tracking
- [ ] Click project to open
- [ ] Verify: "Connected to GitHub" status showing

**Verify:**
```bash
vercel whoami
vercel projects list
```

### 1.2: Add Environment Variables (CRITICAL - 10 min)

**Go to: Settings → Environment Variables**

**Add Variable 1: DATABASE_URL**
- [ ] Name: `DATABASE_URL`
- [ ] Value: Get from Neon console
  1. Go to: https://console.neon.tech
  2. Click your project
  3. Click: "Connection string"
  4. Select: "nodejs"
  5. Copy entire string
- [ ] Environment: Select All (Production, Preview, Development)
- [ ] Click: Add

**Add Variable 2: BLOB_READ_WRITE_TOKEN**
- [ ] Check if already exists (usually auto-set)
- [ ] If missing:
  1. Go to: Storage → Blob
  2. Click: Settings
  3. Copy token
  4. Add to Environment Variables
- [ ] Environment: Select All

**Add Variable 3: ADMIN_PASSWORD**
- [ ] Name: `ADMIN_PASSWORD`
- [ ] Value: Create secure password (e.g., `SecureAdminPass123!@#`)
- [ ] Environment: Select All
- [ ] Click: Add

**Add Variable 4: NEXT_PUBLIC_SITE_URL**
- [ ] Name: `NEXT_PUBLIC_SITE_URL`
- [ ] Value: `https://your-project.vercel.app`
- [ ] (Will change if you add custom domain)
- [ ] Environment: Production only
- [ ] Click: Add

**Add Variable 5: NEON_AUTH_COOKIE_SECRET**
- [ ] Name: `NEON_AUTH_COOKIE_SECRET`
- [ ] Generate value:
  - Mac/Linux: `openssl rand -base64 32`
  - Windows: Use online base64 generator
- [ ] Environment: Select All
- [ ] Click: Add

**Verify all 5 added:**
```bash
vercel env list
```

### 1.3: Verify Build Settings
- [ ] Go to: Settings → General
- [ ] Framework Preset: **Next.js** ✓
- [ ] Node Version: **18** or higher ✓
- [ ] Build Command: **`next build`** ✓
- [ ] Output Directory: **`.next`** ✓
- [ ] Development Command: **`next dev`** ✓

### 1.4: Verify Git Integration
- [ ] Go to: Settings → Git
- [ ] Connected Repository: **paullington/automate-donation-tracking** ✓
- [ ] Production Branch: **main** ✓
- [ ] Auto Deployments: **Enabled** ✓

### 1.5: Test Deployment
- [ ] Make small test change to main branch:
  ```bash
  echo "# Test $(date)" >> README.md
  git add README.md
  git commit -m "test: verify deployment"
  git push origin main
  ```
- [ ] Check Vercel: Go to **Deployments**
- [ ] Wait for: **✓ Production** status
- [ ] Takes ~2-3 minutes
- [ ] Delete test change afterward (revert commit)

---

## SECTION 2: GITHUB REPOSITORY SETUP (10 minutes)

### 2.1: Repository Verification
- [ ] Go to: https://github.com/paullington/automate-donation-tracking
- [ ] Verify: Repository is **Public**
- [ ] Verify: Latest commit shows your code
- [ ] Verify: Branch protection rules

**Check branch protection:**
1. Go to: **Settings → Branches**
2. Verify: **main** branch has protection rules
3. If not:
   - Click: **Add rule**
   - Pattern: `main`
   - Enable: **Require a pull request before merging**
   - Click: **Create**

### 2.2: GitHub Secrets Setup (Optional but Recommended)
- [ ] Go to: Settings → Secrets and variables → Actions
- [ ] Add: `VERCEL_TOKEN`
  1. Get from: https://vercel.com/account/tokens
  2. Click: **Create New Token**
  3. Name: `github-actions`
  4. Copy token
  5. In GitHub: Add secret with name `VERCEL_TOKEN`

- [ ] Add: `DATABASE_URL`
  1. Get from: Neon console
  2. In GitHub: Add secret with your Neon connection string

### 2.3: Verify Vercel Integration
- [ ] Go to: https://github.com/settings/installations
- [ ] Look for: **Vercel**
- [ ] Click to verify it has access to your repository
- [ ] If missing:
  1. Go to: https://vercel.com/integrations/github
  2. Click: **Install**
  3. Select: automate-donation-tracking
  4. Click: **Install**

### 2.4: Check Commit Status Checks
- [ ] Go to: **Commits** in GitHub
- [ ] Click on latest commit
- [ ] Should see: Green checkmark for Vercel deployment
- [ ] Click on status to see deployment details

---

## SECTION 3: NEON DATABASE SETUP (15 minutes)

### 3.1: Verify Database Connection
- [ ] Go to: https://console.neon.tech
- [ ] Select your project
- [ ] Status: Should be **Active** (green)
- [ ] Note connection details for reference

### 3.2: Create Database Schema
- [ ] In Neon console: Click **SQL Editor**
- [ ] Copy schema from: `scripts/002-add-processing-columns.sql`
- [ ] Paste into editor
- [ ] Click: **Execute**
- [ ] Should see: Success message

**Alternative via terminal:**
```bash
export DATABASE_URL="your_neon_connection_string"
psql $DATABASE_URL < scripts/002-add-processing-columns.sql
```

### 3.3: Create Database Indexes
- [ ] In SQL Editor, run:
```sql
CREATE INDEX IF NOT EXISTS idx_donations_is_processed ON public.donations(is_processed);
CREATE INDEX IF NOT EXISTS idx_donations_is_duplicate ON public.donations(is_duplicate);
CREATE INDEX IF NOT EXISTS idx_donations_is_anonymous ON public.donations(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_type ON public.donations(transaction_type);
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON public.donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shares_platform ON public.shares(platform);
```

### 3.4: Initialize Shares Table
- [ ] In SQL Editor, run:
```sql
INSERT INTO public.shares (platform, count, last_updated) 
VALUES 
  ('whatsapp', 0, NOW()),
  ('facebook', 0, NOW()),
  ('twitter', 0, NOW()),
  ('linkedin', 0, NOW()),
  ('telegram', 0, NOW()),
  ('email', 0, NOW()),
  ('direct', 0, NOW());
```

### 3.5: Verify Schema Created
- [ ] In SQL Editor, run:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```
- [ ] Should see: `donations`, `shares`, (and auth tables if using Better Auth)

- [ ] Run: `SELECT COUNT(*) FROM public.shares;`
- [ ] Should show: **7** rows

### 3.6: Configure Connection Pooling
- [ ] In Neon console: Click **Connection pooling**
- [ ] Pool mode: **Transaction** ✓
- [ ] Pool size: **10** (default)
- [ ] Click: **Save**

---

## SECTION 4: VERCEL BLOB STORAGE SETUP (5 minutes)

### 4.1: Verify Blob Connection
- [ ] Go to: https://vercel.com/dashboard
- [ ] Click your project
- [ ] Go to: **Storage → Blob**
- [ ] Verify: **✓ Connected** status

### 4.2: Verify Blob Token
- [ ] Go to: **Settings → Environment Variables**
- [ ] Look for: `BLOB_READ_WRITE_TOKEN`
- [ ] Should show: `●●●●●●●●●●●●●● (already set)` ✓
- [ ] If missing: Click regenerate

### 4.3: Verify Region
- [ ] In Storage → Blob: Click **Settings**
- [ ] Check: **Region** is appropriate
- [ ] Recommended:
  - US East (iad): For North America
  - Stockholm (arn): For Europe
  - Singapore (sin): For Asia

### 4.4: Configure File Retention
- [ ] In Blob Settings
- [ ] Retention policy: **Keep indefinitely** (recommended for receipts)

---

## SECTION 5: INTEGRATIONS VERIFICATION (10 minutes)

### 5.1: Test Database Connection
```bash
# Set environment
export DATABASE_URL="your_connection_string"

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Should output: 1 (success)

# Test with Vercel
vercel env pull
psql $DATABASE_URL -c "SELECT COUNT(*) FROM public.donations;"
```

### 5.2: Test API Endpoints

**Endpoint 1: Campaign Stats**
```bash
curl https://your-project.vercel.app/api/campaign-stats | jq
```
Should return:
```json
{
  "donors": 0,
  "amountRaised": 0,
  "shares": 0,
  "breakdown": { /* share breakdown */ }
}
```

**Endpoint 2: Share Tracking**
```bash
curl -X POST https://your-project.vercel.app/api/shares \
  -H "Content-Type: application/json" \
  -d '{"platform":"whatsapp"}'
```
Should return: `{"success": true}`

### 5.3: Test File Upload
- [ ] Go to: https://your-project.vercel.app
- [ ] Fill donation form:
  - [ ] Name (optional)
  - [ ] Email (optional)
  - [ ] Amount: 5000
  - [ ] Upload receipt: Any PDF/image
- [ ] Click: **Submit**
- [ ] Should see: Success message
- [ ] Check Blob storage:
  1. Go to Vercel: **Storage → Blob**
  2. Should see your uploaded file
  3. File details showing size, upload time

### 5.4: Test Admin Dashboard
- [ ] Go to: https://your-project.vercel.app/admin
- [ ] Enter password: Your `ADMIN_PASSWORD`
- [ ] Should login successfully
- [ ] Should see:
  - [ ] List of donations
  - [ ] Status badges
  - [ ] Type indicators
  - [ ] Download buttons
  - [ ] Filter options

---

## SECTION 6: FEATURE TESTING (10 minutes)

### 6.1: Test Share Tracking
- [ ] Homepage: Click "Share on WhatsApp"
- [ ] Should increment share count
- [ ] Refresh page: Count persists
- [ ] Try other platforms: Facebook, Twitter, etc.
- [ ] Check API: `curl https://your-project.vercel.app/api/campaign-stats`
- [ ] Share counts updated

### 6.2: Test Anonymous Donations
- [ ] Fill donation form WITHOUT name
- [ ] Provide email and amount
- [ ] Upload receipt
- [ ] Submit
- [ ] Check admin:
  1. Login to admin dashboard
  2. Should see donation with "Anonymous" badge
  3. Email should NOT be visible

### 6.3: Test Named Donations
- [ ] Fill donation form WITH name
- [ ] Provide all details
- [ ] Upload receipt
- [ ] Submit
- [ ] Check admin:
  1. Should see donor name
  2. Email should be visible
  3. Donor count increases

### 6.4: Test Duplicate Detection
- [ ] Upload same file twice:
  1. First upload: Should succeed
  2. Second upload (same file, same email): Should detect duplicate
  3. Admin dashboard: Second marked as "Duplicate"

### 6.5: Test Real-time Stats
- [ ] Submit new named donation
- [ ] Check admin: Mark as "Processed"
- [ ] Go back to homepage
- [ ] Donor count should increase automatically
- [ ] No page refresh needed

---

## SECTION 7: DEPLOYMENT & MONITORING (5 minutes)

### 7.1: Verify Production Deployment
```bash
# Check deployment status
vercel status

# View production URL
vercel projects list

# View logs
vercel logs --follow
```

### 7.2: Set Up Log Monitoring
```bash
# Real-time logs
vercel logs --follow

# Filter by endpoint
vercel logs --follow /api/donations

# Search for errors
vercel logs --follow | grep "error"
```

### 7.3: Check Error Handling
- [ ] Go to: Vercel Deployments
- [ ] Click latest deployment
- [ ] View: Build logs (should be clean)
- [ ] View: Function logs (should have activity)
- [ ] No errors showing

### 7.4: Monitor Performance
- [ ] Go to production URL
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Refresh page
- [ ] Check:
  - [ ] Page loads in < 2 seconds
  - [ ] No 404 errors
  - [ ] No 500 errors
  - [ ] All images load

---

## SECTION 8: SECURITY VERIFICATION (5 minutes)

### 8.1: Verify Secrets Not in Code
```bash
# Check for hardcoded secrets
grep -r "password" --include="*.ts" --include="*.js" ./ | grep -v node_modules
grep -r "DATABASE_URL" --include="*.ts" --include="*.js" ./ | grep -v node_modules
grep -r "token" --include="*.ts" --include="*.js" ./ | grep -v node_modules

# Should find no results in code
```

### 8.2: Verify .gitignore
- [ ] Check: `.gitignore` contains:
  - [ ] `node_modules`
  - [ ] `.env*` (environment files)
  - [ ] `.next` (build cache)
  - [ ] `.DS_Store` (OS files)

### 8.3: Verify Environment Variables
- [ ] Vercel: All 5 env vars set ✓
- [ ] GitHub Secrets: Configured (optional) ✓
- [ ] No secrets in code ✓
- [ ] No secrets in commits ✓

### 8.4: Test Database Security
```bash
# Verify connection uses SSL
psql $DATABASE_URL -c "SELECT ssl_is_used();" 

# Should return: t (true)
```

---

## SECTION 9: FINAL VERIFICATION (5 minutes)

### Full Application Test Flow

1. **Homepage:**
   - [ ] Page loads
   - [ ] All content visible
   - [ ] Share buttons working
   - [ ] Donation form visible

2. **Upload Receipt:**
   - [ ] Submit with name
   - [ ] See success message
   - [ ] File in Blob storage

3. **Admin Dashboard:**
   - [ ] Can login
   - [ ] See donation in list
   - [ ] Can download receipt
   - [ ] Can filter by status

4. **Real-time Updates:**
   - [ ] Mark donation as processed
   - [ ] Homepage updates automatically
   - [ ] Donor count increases
   - [ ] Amount displays

5. **Share Tracking:**
   - [ ] Click share buttons
   - [ ] Counts increment
   - [ ] API returns updated counts

### No Errors Check
- [ ] Browser console: No errors (F12)
- [ ] Vercel logs: No errors
- [ ] Application: All features working
- [ ] Database: Responding correctly
- [ ] File storage: Files accessible

---

## SECTION 10: TROUBLESHOOTING

### If tests fail, check:

**Deployment fails:**
- [ ] Check Vercel logs: `vercel logs --follow`
- [ ] Check for build errors
- [ ] Verify all env vars set
- [ ] Commit fix to GitHub (auto-redeploy)

**Database won't connect:**
- [ ] Verify DATABASE_URL in env vars
- [ ] Test connection: `psql $DATABASE_URL -c "SELECT 1;"`
- [ ] Check Neon console: Is database active?
- [ ] Verify SSL mode: ?sslmode=require in connection string

**File upload fails:**
- [ ] Verify BLOB_READ_WRITE_TOKEN set
- [ ] Check Vercel Blob status: Storage → Blob
- [ ] Look at application logs for error
- [ ] Test manually in Blob console

**Admin login fails:**
- [ ] Verify ADMIN_PASSWORD set
- [ ] Try exact password (case-sensitive)
- [ ] Check browser console for errors
- [ ] Clear browser cache

**Stats not updating:**
- [ ] Check database connection
- [ ] Verify donations table has data
- [ ] Check API endpoint: `/api/campaign-stats`
- [ ] Look for errors in logs

---

## FINAL CHECKLIST SUMMARY

### Vercel Dashboard
- [ ] Project connected to GitHub
- [ ] All 5 environment variables set
- [ ] Build settings correct
- [ ] Git integration working
- [ ] Auto-deployment functioning
- [ ] Logs accessible

### GitHub
- [ ] Repository public
- [ ] Latest code pushed
- [ ] Branch protection rules active
- [ ] Vercel integration verified
- [ ] Commit status checks showing
- [ ] Secrets configured (optional)

### Neon Database
- [ ] Connection string obtained
- [ ] Schema created (tables & indexes)
- [ ] Shares table initialized
- [ ] Connection pooling configured
- [ ] DATABASE_URL in Vercel
- [ ] Connection tested

### Vercel Blob
- [ ] Token generated
- [ ] BLOB_READ_WRITE_TOKEN in Vercel
- [ ] Region configured
- [ ] File upload tested
- [ ] Files appearing in storage

### Application
- [ ] Homepage loads
- [ ] Admin dashboard accessible
- [ ] File uploads working
- [ ] Share tracking functional
- [ ] Stats updating real-time
- [ ] Anonymous donations working
- [ ] Duplicate detection working
- [ ] All features tested

### Security
- [ ] No secrets in code
- [ ] .gitignore configured
- [ ] Environment variables secure
- [ ] SSL/TLS connections verified
- [ ] Access logs monitored

### Monitoring
- [ ] Logs accessible
- [ ] Performance acceptable
- [ ] Error rates normal
- [ ] Database responsive
- [ ] File storage available

---

## COMPLETION STATUS

When all items are checked:
- ✓ System is production-ready
- ✓ All features working
- ✓ All integrations configured
- ✓ Security verified
- ✓ Monitoring active

**Estimated time to complete entire checklist:** 45-60 minutes

**Once complete:** You have a fully operational automated donation tracking system!

---

## NEXT STEPS

1. ✓ Complete this entire checklist
2. ✓ Monitor application for 24 hours
3. ✓ Share deployment URL with team
4. ✓ Provide admin credentials securely
5. ✓ Document any custom configurations
6. ✓ Set up regular monitoring/maintenance

**Need help?** See:
- VERCEL_COMPLETE_SETUP.md - Detailed Vercel guide
- GITHUB_COMPLETE_SETUP.md - Detailed GitHub guide
- INTEGRATIONS_COMPLETE_SETUP.md - Detailed integrations guide

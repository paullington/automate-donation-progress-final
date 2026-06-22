# INTEGRATIONS - COMPLETE SETUP & CONFIGURATION GUIDE

## TABLE OF CONTENTS
1. Overview of All Integrations
2. Neon PostgreSQL Setup
3. Vercel Blob Storage Setup
4. Integration Testing
5. Monitoring & Maintenance
6. Troubleshooting

---

## SECTION 1: OVERVIEW OF ALL INTEGRATIONS

### Integrations Summary

Your application uses **2 main integrations:**

| Integration | Purpose | Status | Configuration |
|---|---|---|---|
| **Neon PostgreSQL** | Database for storing donations, users, shares | ✓ Connected | DATABASE_URL env var |
| **Vercel Blob** | File storage for receipt uploads | ✓ Connected | BLOB_READ_WRITE_TOKEN |

### Integration Architecture

```
Your Application
    ↓
├── API Layer
│   ├── /api/donations/upload → Vercel Blob (store receipt)
│   ├── /api/donations → Neon (query donations)
│   ├── /api/campaign-stats → Neon (calculate stats)
│   └── /api/shares → Neon (track shares)
│
├── Database Layer (Neon PostgreSQL)
│   ├── Table: donations
│   ├── Table: shares
│   └── Auth schema (via Better Auth)
│
└── Storage Layer (Vercel Blob)
    └── Receipt files
```

---

## SECTION 2: NEON POSTGRESQL SETUP

### Step 2.1: Verify Neon Connection

**Status:**
- ✓ Connected to Vercel
- ✓ Database created
- ✓ Schema available

**Check Neon dashboard:**
1. Go to: https://console.neon.tech
2. Select your project
3. Verify:
   - Database name: postgres (default)
   - Region: Appropriate for your location
   - Status: Active (green indicator)

### Step 2.2: Get Neon Connection String

**Connection string format:**
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Retrieve connection string:**
1. In Neon console: Click your project
2. Click: **Connection string**
3. Select: **nodejs** from dropdown
4. Copy the string (includes password)
5. Use as DATABASE_URL in Vercel

**Example:**
```
postgresql://user_123:abc123xyz@ep-cool-moon-12345.us-east-1.neon.tech/neondb?sslmode=require
```

### Step 2.3: Configure Database Schema

**Tables required:**

#### Table 1: donations
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

#### Table 2: shares
```sql
CREATE TABLE IF NOT EXISTS public.shares (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### Table 3: Auth Tables (Optional - for Better Auth)
```sql
-- Created automatically by Better Auth if used
-- Includes: user, session, account, verification, etc.
```

### Step 2.4: Create Indexes for Performance

**Add indexes to optimize queries:**
```sql
-- Donation indexes
CREATE INDEX IF NOT EXISTS idx_donations_is_processed 
  ON public.donations(is_processed);

CREATE INDEX IF NOT EXISTS idx_donations_is_duplicate 
  ON public.donations(is_duplicate);

CREATE INDEX IF NOT EXISTS idx_donations_is_anonymous 
  ON public.donations(is_anonymous);

CREATE INDEX IF NOT EXISTS idx_donations_transaction_type 
  ON public.donations(transaction_type);

CREATE INDEX IF NOT EXISTS idx_donations_donor_email 
  ON public.donations(donor_email);

CREATE INDEX IF NOT EXISTS idx_donations_created_at 
  ON public.donations(created_at DESC);

-- Share indexes
CREATE INDEX IF NOT EXISTS idx_shares_platform 
  ON public.shares(platform);
```

### Step 2.5: Run Initial Schema Setup

**Option A: Via Neon Console (Recommended)**

1. Go to: https://console.neon.tech
2. Click your project
3. Click: **SQL Editor**
4. Paste the migration SQL:
   ```sql
   -- Copy from: scripts/002-add-processing-columns.sql
   ```
5. Click: **Execute**

**Option B: Via Terminal**

```bash
# Set database URL
export DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Run migration script
psql $DATABASE_URL < scripts/002-add-processing-columns.sql

# Verify tables created
psql $DATABASE_URL -c "\dt public.*"
```

### Step 2.6: Verify Schema

**Check tables exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected output:**
```
 table_name
────────────
 donations
 shares
```

**Check columns in donations:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'donations' 
ORDER BY ordinal_position;
```

### Step 2.7: Initialize Data

**Populate shares table with platforms:**
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

**Verify data:**
```sql
SELECT * FROM public.shares;
```

### Step 2.8: Connection Pooling

**For better performance, configure:**

**In Neon console:**
1. Click your project
2. Click: **Connection pooling**
3. Set: **Pool mode**: "Transaction"
4. Set: **Pool size**: 10 (default)
5. Save

**In code (Drizzle ORM):**
Already configured via DATABASE_URL with pooling

### Step 2.9: Neon Environment Variables

**Set in Vercel:**
1. Go to: Vercel project settings
2. Environment Variables
3. Name: `DATABASE_URL`
4. Value: Your Neon connection string
5. Environment: Production, Preview, Development
6. Click: Save

**Verify in Vercel:**
```bash
vercel env pull
echo $DATABASE_URL
```

---

## SECTION 3: VERCEL BLOB STORAGE SETUP

### Step 3.1: Verify Blob Connection

**Status:**
- ✓ Connected to Vercel
- ✓ Token generated
- ✓ Ready to use

**Check Blob dashboard:**
1. Go to: https://vercel.com/dashboard
2. Click your project
3. Go to: **Storage → Blob**
4. Should show: "✓ Connected"

### Step 3.2: Get Blob Token

**Token status:**
- Automatically generated when Blob is added
- Token name: `BLOB_READ_WRITE_TOKEN`
- Should be in environment variables

**Verify in Vercel:**
1. Go to: **Settings → Environment Variables**
2. Look for: `BLOB_READ_WRITE_TOKEN`
3. Should show: `●●●●●●●●●●●● (already set)`

**If missing, regenerate:**
1. Go to: **Storage → Blob**
2. Click: **Settings**
3. Click: **Regenerate token**
4. Copy new token
5. Add to environment variables

### Step 3.3: Configure Blob Region

**Choose storage region:**
1. Go to: **Storage → Blob**
2. Click: **Settings**
3. View: **Region**
4. Regions available:
   - iad - US East (default)
   - pdx - US West
   - syd - Sydney
   - sin - Singapore
   - arn - Stockholm

**Region cannot be changed after creation!**

Recommended:
- US users: iad (US East)
- EU users: arn (Stockholm)
- Asia users: sin (Singapore)

### Step 3.4: Set Blob Environment Variable

**In Vercel:**
1. Go to: **Settings → Environment Variables**
2. Click: **Add New**
3. Name: `BLOB_READ_WRITE_TOKEN`
4. Value: Paste the token
5. Environment: Select all
6. Click: Save

**Verify it's set:**
```bash
vercel env pull
echo $BLOB_READ_WRITE_TOKEN
```

### Step 3.5: Configure File Retention

**Blob storage retention options:**
1. Go to: **Storage → Blob**
2. Click: **Settings**
3. Look for: **Retention policy**
4. Options:
   - Keep indefinitely (default)
   - Delete after 30 days
   - Custom retention

**For donation receipts: Recommend keeping indefinitely**

### Step 3.6: Monitor Blob Storage Usage

**View storage stats:**
1. Go to: **Storage → Blob**
2. See:
   - Total files
   - Total storage used
   - Bandwidth used

**Usage tracking:**
- Free tier: 1 GB included
- Paid: Pay for additional storage

### Step 3.7: Configure File Access

**File URLs are permanent:**
- Format: `https://[project].blob.vercel-storage.com/[pathname]`
- Are served directly from Blob
- Are read-only to outside users
- Can be downloaded via application

**In your code:**
```typescript
// Blob URL is auto-generated
const blobUrl = result.url  // e.g., https://...blob.vercel-storage.com/...
```

---

## SECTION 4: INTEGRATION TESTING

### Step 4.1: Test Database Connection

**From terminal:**
```bash
# Set DATABASE_URL
export DATABASE_URL="your_neon_connection_string"

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Should output: 1 (success)
```

**From Vercel:**
```bash
# Pull environment
vercel env pull

# Test
psql $DATABASE_URL -c "SELECT COUNT(*) FROM donations;"
```

### Step 4.2: Test Database Queries

**Insert test data:**
```sql
INSERT INTO public.donations 
(donor_name, donor_email, receipt_file_name, receipt_pathname, amount, transaction_type, is_processed)
VALUES 
('Test Donor', 'test@example.com', 'test.pdf', '/receipts/test.pdf', '5000', 'transaction', false);
```

**Query test data:**
```sql
SELECT * FROM public.donations WHERE donor_name = 'Test Donor';
```

**Expected output:** Your test record

**Clean up:**
```sql
DELETE FROM public.donations WHERE donor_name = 'Test Donor';
```

### Step 4.3: Test File Upload to Blob

**Via application:**
1. Go to: Your app homepage
2. Click: "Upload Receipt"
3. Upload a PDF or image file
4. Should see: Success message
5. File should appear in: Blob storage

**Verify in Blob:**
1. Go to: **Storage → Blob**
2. See your uploaded file in list
3. File details show:
   - Name
   - Size
   - Upload time

### Step 4.4: Test API Endpoints

**Test campaign stats endpoint:**
```bash
curl https://your-app.vercel.app/api/campaign-stats | jq
```

Expected response:
```json
{
  "donors": 5,
  "amountRaised": 250000,
  "shares": 42,
  "breakdown": {
    "whatsapp": 15,
    "facebook": 10,
    "twitter": 8,
    "linkedin": 5,
    "telegram": 3,
    "email": 1,
    "direct": 0
  }
}
```

**Test share tracking:**
```bash
curl -X POST https://your-app.vercel.app/api/shares \
  -H "Content-Type: application/json" \
  -d '{"platform":"whatsapp"}'
```

Expected response: Success

### Step 4.5: Test Admin Dashboard

**Access admin:**
1. Go to: `https://your-app.vercel.app/admin`
2. Enter: Your ADMIN_PASSWORD
3. Should see:
   - List of donations
   - Status badges
   - Download buttons
   - Filter options

**Test admin features:**
- [ ] View all donations
- [ ] Filter by status
- [ ] Download receipt
- [ ] See anonymous badge

---

## SECTION 5: MONITORING & MAINTENANCE

### Step 5.1: Monitor Database Performance

**Query slow queries:**
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Monitor connections:**
```sql
SELECT count(*) FROM pg_stat_activity;
```

**In Neon console:**
1. Click your project
2. Click: **Monitoring**
3. See:
   - CPU usage
   - Memory usage
   - Query count
   - Connection count

### Step 5.2: Backup Database

**Neon automatic backups:**
- Default: 7-day retention
- Daily snapshots
- Available in Neon console

**Manual backup:**
```bash
# Export data
pg_dump $DATABASE_URL > backup.sql

# Import data to new database
psql $NEW_DATABASE_URL < backup.sql
```

### Step 5.3: Monitor Blob Storage

**Check storage usage:**
1. Go to: **Storage → Blob**
2. Monitor:
   - Files count
   - Storage used
   - Bandwidth used

**Set alerts (optional):**
- Configure in Vercel project settings
- Alert when storage exceeds threshold

### Step 5.4: Database Maintenance

**Regular maintenance tasks:**

**Monthly:**
```bash
# Vacuum database
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Check for unused indexes
psql $DATABASE_URL -c "SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;"
```

**Quarterly:**
- Review slow query logs
- Remove old test data
- Optimize indexes

### Step 5.5: Log Monitoring

**View application logs:**

**In Vercel:**
```bash
vercel logs --follow
```

**Filter by function:**
```bash
vercel logs --follow /api/donations
```

**Search logs:**
```bash
vercel logs --follow | grep "error"
```

---

## SECTION 6: TROUBLESHOOTING

### Issue: "Cannot connect to database"

**Symptoms:**
- Application won't start
- 500 error on /api/donations
- Connection timeout error

**Solutions:**

```bash
# 1. Verify DATABASE_URL is set
vercel env pull
echo $DATABASE_URL

# 2. Test connection manually
psql $DATABASE_URL -c "SELECT 1;"

# 3. Check Neon console
# - Is project active?
# - Is database running?
# - Any connection limits?

# 4. Check firewall
# - Neon allows all IPs by default
# - No additional firewall rules needed

# 5. Verify connection string format
# Should be: postgresql://user:pass@host/db?sslmode=require
```

### Issue: "Blob storage not working"

**Symptoms:**
- File upload fails
- "Blob token not found" error
- Files not appearing in storage

**Solutions:**

```bash
# 1. Verify BLOB_READ_WRITE_TOKEN is set
vercel env list | grep BLOB

# 2. Check token hasn't expired
# In Vercel: Storage → Blob → Settings
# Regenerate if needed

# 3. Verify region is correct
# Check in Blob settings

# 4. Check file permissions
# Public URL should be accessible

# 5. Test manually
curl https://your-project.blob.vercel-storage.com/test-file
```

### Issue: "Database query timeout"

**Symptoms:**
- API requests hang
- 504 error
- Very slow response times

**Solutions:**

```bash
# 1. Check query performance
# In Neon console: Monitoring tab
# Look for slow queries

# 2. Optimize indexes
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS idx_name ON table(column);"

# 3. Check connection pool
# Neon console: Connection pooling
# Verify pool size and mode

# 4. Reduce query load
# Implement caching
# Reduce polling frequency

# 5. Scale if needed
# In Neon: Upgrade compute unit
```

### Issue: "Blob storage quota exceeded"

**Symptoms:**
- Upload fails with quota error
- Cannot store more files
- 413 error

**Solutions:**

```bash
# 1. Check current usage
# Vercel: Storage → Blob → Settings

# 2. Delete old files
# In Blob storage list
# Delete test/old receipts

# 3. Upgrade plan
# Vercel dashboard
# Billing → Upgrade storage

# 4. Implement cleanup policy
# Automatically delete old files after 30 days
```

---

## SECTION 7: SECURITY BEST PRACTICES

### Step 7.1: Secure Connection String

**Never:**
- ✗ Commit DATABASE_URL to GitHub
- ✗ Share connection string in chat
- ✗ Log connection string
- ✗ Put in frontend code

**Always:**
- ✓ Use environment variables
- ✓ Keep in .env.local (locally)
- ✓ Store in Vercel/GitHub secrets
- ✓ Rotate secrets periodically

### Step 7.2: Secure Blob Token

**Token security:**
- ✓ Token allows reading and writing
- ✓ Scope limited to Blob storage only
- ✓ Can be regenerated anytime
- ✓ Should be treated as secret

**If token leaked:**
```bash
# 1. Go to Vercel: Storage → Blob → Settings
# 2. Click: Regenerate token
# 3. Copy new token
# 4. Update Vercel environment variable
# 5. Old token immediately invalid
```

### Step 7.3: Row-Level Security (Optional)

**For multi-tenant applications:**
```sql
-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policy (example)
CREATE POLICY donations_admin_policy ON public.donations
  FOR ALL USING (current_user_id = admin_id);
```

**Currently:** Not required for this application

### Step 7.4: Backup Security

**Backup best practices:**
- [ ] Store backups encrypted
- [ ] Keep offsite backup
- [ ] Test backup restoration
- [ ] Document recovery procedure

---

## SECTION 8: FINAL CHECKLIST

### Integration Setup Complete?

**Neon PostgreSQL:**
- [ ] Connection string obtained
- [ ] DATABASE_URL set in Vercel
- [ ] Schema created (tables & indexes)
- [ ] Test data working
- [ ] Backups configured

**Vercel Blob:**
- [ ] Token obtained
- [ ] BLOB_READ_WRITE_TOKEN set in Vercel
- [ ] Region confirmed
- [ ] File upload working
- [ ] Usage monitoring set up

**Security:**
- [ ] Connection string not in code
- [ ] Secrets in environment variables
- [ ] No sensitive data logged
- [ ] Backups encrypted

**Testing:**
- [ ] Database connection verified
- [ ] File uploads working
- [ ] API endpoints responding
- [ ] Admin dashboard functional
- [ ] All features tested

**Monitoring:**
- [ ] Logs accessible
- [ ] Performance monitored
- [ ] Alerts configured
- [ ] Backup schedule verified

---

## NEXT STEPS

1. ✓ Complete all setup steps
2. ✓ Run integration tests
3. ✓ Monitor first 48 hours
4. ✓ Set up alerts/monitoring
5. ✓ Document backup procedure

**Support Resources:**
- Neon Docs: https://neon.tech/docs
- Vercel Blob Docs: https://vercel.com/docs/storage/vercel-blob
- PostgreSQL Docs: https://www.postgresql.org/docs/

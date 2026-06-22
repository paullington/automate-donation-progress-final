# QUICK REFERENCE - SETUP SUMMARY

## ⏱️ EXPRESS SETUP (45 minutes)

If you're in a hurry, follow this condensed version.

---

## STEP 1: VERCEL ENVIRONMENT VARIABLES (5 min)

**URL:** https://vercel.com/dashboard → Your project → Settings → Environment Variables

**Add these 5 variables:**

```
1. DATABASE_URL
   Value: Get from Neon console (Connection string → nodejs)
   Env: All

2. BLOB_READ_WRITE_TOKEN
   Value: Auto-set (verify exists)
   Env: All

3. ADMIN_PASSWORD
   Value: Your secure password (e.g., SecurePass123!@#)
   Env: All

4. NEXT_PUBLIC_SITE_URL
   Value: https://your-project.vercel.app
   Env: Production

5. NEON_AUTH_COOKIE_SECRET
   Value: Run: openssl rand -base64 32
   Env: All
```

**Verify:**
```bash
vercel env list
# Should show all 5 variables
```

---

## STEP 2: NEON DATABASE SETUP (10 min)

**URL:** https://console.neon.tech → Your project → SQL Editor

**Run this script:**
```sql
-- Create donations table
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

-- Create shares table
CREATE TABLE IF NOT EXISTS public.shares (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_donations_is_processed ON public.donations(is_processed);
CREATE INDEX IF NOT EXISTS idx_donations_is_duplicate ON public.donations(is_duplicate);
CREATE INDEX IF NOT EXISTS idx_donations_is_anonymous ON public.donations(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_type ON public.donations(transaction_type);
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON public.donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shares_platform ON public.shares(platform);

-- Initialize shares
INSERT INTO public.shares (platform, count, last_updated) VALUES
  ('whatsapp', 0, NOW()),
  ('facebook', 0, NOW()),
  ('twitter', 0, NOW()),
  ('linkedin', 0, NOW()),
  ('telegram', 0, NOW()),
  ('email', 0, NOW()),
  ('direct', 0, NOW());
```

**Verify:**
```sql
SELECT COUNT(*) FROM public.shares;
-- Should return: 7
```

---

## STEP 3: GITHUB PUSH (Already Done)

Your code is already pushed. Just verify:

```bash
git log --oneline | head -3
# Should show your commits

git remote -v
# Should show: origin https://github.com/paullington/automate-donation-tracking.git
```

---

## STEP 4: VERIFY DEPLOYMENT (3 min)

**Test 1: Homepage loads**
```bash
curl https://your-project.vercel.app | head -20
# Should return HTML
```

**Test 2: API responds**
```bash
curl https://your-project.vercel.app/api/campaign-stats | jq
# Should return JSON
```

**Test 3: Admin accessible**
Open: https://your-project.vercel.app/admin
- Password: Your ADMIN_PASSWORD
- Should see dashboard

---

## STEP 5: TEST FEATURES (10 min)

**Feature 1: Upload Receipt**
1. Go homepage
2. Fill form, upload file
3. Submit
4. Check Vercel: Storage → Blob → See file

**Feature 2: Share Tracking**
1. Click "Share on WhatsApp"
2. Homepage: Share count increases
3. API: `/api/campaign-stats` shows updated count

**Feature 3: Anonymous Donation**
1. Submit form WITHOUT name
2. Admin dashboard: Shows "Anonymous"
3. Email hidden from display

**Feature 4: Admin Features**
1. Login to admin
2. View all donations
3. Mark as "Processed"
4. Download receipt

---

## INTEGRATION CHECKLIST

### Neon PostgreSQL
- [ ] Schema created
- [ ] Tables exist: donations, shares
- [ ] Indexes created
- [ ] Shares initialized (7 rows)
- [ ] DATABASE_URL in Vercel
- [ ] Connection working

### Vercel Blob
- [ ] Token exists
- [ ] BLOB_READ_WRITE_TOKEN in Vercel
- [ ] File upload working
- [ ] Files appearing in storage

### GitHub
- [ ] Code pushed
- [ ] Main branch protected
- [ ] Auto-deploy working
- [ ] Vercel integration active

### Vercel
- [ ] All 5 env vars set
- [ ] Build settings correct
- [ ] Deployment live
- [ ] No errors

---

## 🚨 COMMON ISSUES

**Issue: "Cannot connect to database"**
```bash
export DATABASE_URL="your_neon_connection_string"
psql $DATABASE_URL -c "SELECT 1;"
# Should output: 1
```

**Issue: "File upload fails"**
- Verify BLOB_READ_WRITE_TOKEN set
- Check Vercel: Storage → Blob → Status
- Look at logs: `vercel logs --follow`

**Issue: "Admin login fails"**
- Verify ADMIN_PASSWORD set
- Try exact password (case-sensitive)
- Clear browser cache

**Issue: "API returning 500 error"**
```bash
vercel logs --follow
# Look for error message
# Fix in code and push to main
```

**Issue: "Build failing"**
```bash
vercel logs --follow
# Find error
# Fix locally: npm run build
# Push to main
```

---

## 📊 MONITORING

**View logs:**
```bash
vercel logs --follow
```

**Check deployment status:**
```bash
vercel status
```

**See environment variables:**
```bash
vercel env list
```

**Pull env vars locally:**
```bash
vercel env pull
```

---

## 🔒 SECURITY CHECKLIST

- [ ] No secrets in code
- [ ] .gitignore has `.env*`
- [ ] All secrets in environment variables
- [ ] Connection string uses SSL (sslmode=require)
- [ ] Tokens treated as sensitive
- [ ] GitHub secrets configured

---

## 📝 DOCUMENTATION

Read these files (in order) for complete setup:

1. **START_HERE.md** - Project overview (5 min)
2. **MASTER_SETUP_CHECKLIST.md** - Full checklist (45 min)
3. **VERCEL_COMPLETE_SETUP.md** - Detailed Vercel guide
4. **GITHUB_COMPLETE_SETUP.md** - Detailed GitHub guide
5. **INTEGRATIONS_COMPLETE_SETUP.md** - Integrations guide

---

## ✅ SUCCESS CRITERIA

Everything working if:

✓ Homepage loads at https://your-project.vercel.app
✓ Admin dashboard accessible with password
✓ File uploads appear in Blob storage
✓ Share counts update automatically
✓ Anonymous donations work
✓ API returns stats correctly
✓ No console errors
✓ No deployment errors
✓ Database queries fast
✓ All features tested

---

## 🎯 NEXT STEPS

1. Complete MASTER_SETUP_CHECKLIST.md
2. Monitor for 24 hours
3. Share URL with team
4. Set up alerts (optional)
5. Document any customizations

---

## 📞 QUICK LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Neon Console:** https://console.neon.tech
- **GitHub:** https://github.com/paullington/automate-donation-tracking
- **Your App:** https://your-project.vercel.app
- **Admin Panel:** https://your-project.vercel.app/admin

---

## 💡 TIPS

**Faster deployment:**
```bash
git add .
git commit -m "your message"
git push origin main
# Vercel auto-deploys within 30 seconds
```

**Local testing:**
```bash
vercel env pull  # Get env vars
npm install
npm run dev     # Runs on localhost:3000
```

**Force redeploy:**
```bash
vercel --prod
```

**View real-time logs:**
```bash
vercel logs --follow
```

---

Done! Your system is ready! 🚀

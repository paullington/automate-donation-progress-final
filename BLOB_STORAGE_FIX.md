# Fix: "Server is not configured for file storage" Error

## Problem
When uploading a donor document, you get the error:
```
Server is not configured for file storage. Please contact support.
```

This means the `BLOB_READ_WRITE_TOKEN` environment variable is not set in your Vercel deployment.

---

## Solution (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Select your project: `automate-donation-tracking`

### Step 2: Access Environment Variables
1. Click **Settings** (top menu)
2. Click **Environment Variables** (left sidebar)
3. Look for `BLOB_READ_WRITE_TOKEN`

### Step 3: Verify the Token Exists

**If `BLOB_READ_WRITE_TOKEN` is NOT listed:**

1. Click **Add New**
2. Fill in:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** Leave blank (Vercel will auto-populate)
3. Click **Add**
4. Vercel will automatically generate and set the token

**If `BLOB_READ_WRITE_TOKEN` IS listed but value is empty:**

1. Click the **three dots (...)** next to it
2. Select **Edit**
3. Click **Generate Token** or leave blank and save
4. Vercel will auto-populate the value

### Step 4: Deploy Changes
1. The environment variable change should trigger auto-deployment
2. Wait for deployment to complete (watch the status)
3. Visit your app: https://your-project.vercel.app

### Step 5: Test File Upload
1. Go to homepage
2. Scroll to donation form
3. Upload a PDF/JPG/PNG file
4. Should work now!

---

## Why This Happens

The `BLOB_READ_WRITE_TOKEN` is automatically provided by Vercel when you have the Blob integration. However, it needs to be explicitly added to your environment variables for the app to access it.

### What Vercel Blob Does:
- Provides private, secure file storage
- Token grants read/write access
- Automatically scales
- No additional setup needed

---

## Detailed Steps with Screenshots

### Access Vercel Environment Variables:

```
Vercel Dashboard
├── Select Project
├── Settings (top menu)
└── Environment Variables (left sidebar)
```

### Add BLOB_READ_WRITE_TOKEN:

```
Environment Variables Page
├── Click "Add New"
├── Name: BLOB_READ_WRITE_TOKEN
├── Value: (leave blank - auto-populate)
└── Click "Add"
```

### Verify Deployment:

```
After adding variable:
├── Auto-deployment starts
├── Watch Deployments tab
├── Wait for green checkmark ✓
└── Then test file upload
```

---

## Verification Checklist

- [ ] Navigated to Vercel Dashboard
- [ ] Found Settings → Environment Variables
- [ ] Confirmed `BLOB_READ_WRITE_TOKEN` is listed
- [ ] Value is not empty (Vercel auto-populated)
- [ ] Saved changes
- [ ] Deployment completed successfully
- [ ] Tested file upload on production app
- [ ] File upload successful

---

## Common Issues & Fixes

### Issue 1: Environment Variable Still Blank
**Solution:**
1. Delete the variable
2. Click "Add New"
3. Leave value field completely empty
4. Click "Add"
5. Vercel will auto-generate the token
6. Redeploy (should happen automatically)

### Issue 2: Deployment Shows "Failed"
**Solution:**
1. Go to Deployments tab
2. Click on failed deployment
3. Check logs for error
4. Usually it's a temporary issue
5. Click "Redeploy" button
6. Wait for it to complete

### Issue 3: Still Getting Error After Fix
**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Clear browser cache
3. Try uploading again
4. If still fails, check Vercel logs:
   ```
   Vercel Dashboard
   → Deployments
   → Select latest deployment
   → Click "Logs"
   ```

### Issue 4: Token Exists But Upload Still Fails
**Solution:**
1. Check Vercel logs for specific error
2. Verify database is also accessible
3. Check network tab in browser (F12)
4. Look for 500 error details
5. May indicate DATABASE_URL is missing instead

---

## All 5 Environment Variables Checklist

Make sure ALL 5 are set in Vercel:

- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- [ ] `ADMIN_PASSWORD` - Password for /admin dashboard
- [ ] `NEXT_PUBLIC_SITE_URL` - Your production URL
- [ ] `NEON_AUTH_COOKIE_SECRET` - Authentication secret

If any are missing, file uploads won't work properly.

---

## Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Environment Variables:** https://vercel.com/dashboard/[project]/settings/environment-variables
- **Vercel Blob Docs:** https://vercel.com/docs/storage/vercel-blob
- **Your App:** https://your-project.vercel.app

---

## After Fix: What Should Happen

When you upload a file:

1. File is validated (PDF, JPG, PNG only)
2. File is stored in Vercel Blob (private storage)
3. Metadata is stored in Neon database
4. Admin dashboard shows the upload
5. Share tracking updates
6. Stats refresh

All of this requires:
- ✓ BLOB_READ_WRITE_TOKEN (for storage)
- ✓ DATABASE_URL (for database)
- ✓ ADMIN_PASSWORD (for access control)

---

## Support

If you still have issues after following these steps:

1. Check Vercel logs (most helpful)
2. Check browser console (F12 → Console tab)
3. Check all 5 environment variables are set
4. Try re-deploying manually
5. Contact Vercel support if persistence issue

---

## Time Estimate
- Checking environment variables: 2 minutes
- Adding/fixing token: 1 minute
- Deployment: 2-3 minutes
- Testing: 1 minute
- **Total: ~5-10 minutes**

All done! 🎉 File uploads should work now.

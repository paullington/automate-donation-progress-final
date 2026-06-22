# BLOB Token Diagnostic and Fix Guide

## Problem
Error: "Server is not configured for file storage. Please contact support."

This means: `process.env.BLOB_READ_WRITE_TOKEN` is undefined at runtime in Vercel production.

---

## Root Cause Analysis

The upload route checks:
```typescript
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('[v0] BLOB_READ_WRITE_TOKEN is not set')
  return NextResponse.json(
    { error: 'Server is not configured for file storage. Please contact support.' },
    { status: 500 }
  )
}
```

**Why it fails:**
- Environment variable not added to Vercel
- Environment variable added but not to all environments
- Variable added but deployment didn't pick it up
- Vercel cache issue

---

## STEP-BY-STEP DIAGNOSTIC & FIX

### Step 1: Verify Variable Exists in Vercel

1. Go to: https://vercel.com/dashboard
2. Select: Your project
3. Click: Settings
4. Click: Environment Variables
5. Search for: `BLOB_READ_WRITE_TOKEN`

**Expected Result:**
- Variable should exist
- Value should NOT be empty
- Should apply to: Production, Preview, Development

**If NOT found:** Go to Step 3
**If empty value:** Go to Step 2
**If value exists:** Go to Step 4

---

### Step 2: Variable Exists but Empty - AUTO-GENERATE VALUE

1. In Environment Variables, find: `BLOB_READ_WRITE_TOKEN`
2. Click: three dots (...) → Edit
3. Leave Value field: **BLANK** (do not fill in)
4. Make sure selected: ☑ Production ☑ Preview ☑ Development
5. Click: Save

**Important:** Leave blank - Vercel auto-generates the value

**Wait:** 2-3 minutes for deployment
**Then:** Go to Step 5

---

### Step 3: Variable Not Found - CREATE NEW

1. In Environment Variables, click: Add New
2. Name: `BLOB_READ_WRITE_TOKEN` (exact spelling)
3. Value: **(leave completely blank)**
4. Environments: Select all three
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click: Add

**Wait:** 2-3 minutes for deployment
**Then:** Go to Step 5

---

### Step 4: Variable Exists with Value - CHECK & REDEPLOY

1. In Environment Variables, verify `BLOB_READ_WRITE_TOKEN`
2. Confirm all three environments selected:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
3. If any unchecked, click: Edit → select them → Save

**Force Redeploy:**
1. Go to: Deployments tab
2. Find: Latest deployment
3. Click: three dots (...) → Redeploy
4. Wait: Green checkmark ✓ (2-3 min)
5. Go to Step 5

---

### Step 5: Verify Fix - TEST UPLOAD

1. Go to your app: https://your-project.vercel.app
2. Try uploading a PDF/JPG/PNG file
3. Check result:
   - **Success:** File uploaded ✓ Go to Step 6
   - **Still fails:** Go to Step 7

---

### Step 6: Verify in Logs

1. Go to Vercel Dashboard
2. Click: Deployments tab
3. Click: Latest deployment
4. Click: Logs tab
5. Search for: `BLOB_READ_WRITE_TOKEN is not set`
6. Result: Should NOT appear ✓

**If message still there:**
- Logs are delayed (wait 5 min and check again)
- Or go to Step 7

---

### Step 7: Advanced Troubleshooting

#### Issue: Still Getting Error After All Steps

**Try these:**

**A. Hard Refresh Browser**
- Windows/Linux: Ctrl+Shift+R
- Mac: Cmd+Shift+R
- Wait 2 seconds, refresh

**B. Clear Browser Cache**
- Close all tabs
- Clear cache (Ctrl+Shift+Delete)
- Open new tab
- Go to app again

**C. Check Deployment Status**
- Deployments tab
- Is latest deployment GREEN? If not, wait
- If red, click Redeploy again

**D. Verify Vercel Blob Integration**
- Settings → Integrations
- Should see: Vercel Blob Storage
- If missing, add it (Blob integration)

**E. Check All Environment Variables**
```
DATABASE_URL = ✓ set and has value
BLOB_READ_WRITE_TOKEN = ✓ set and has value
ADMIN_PASSWORD = ✓ set
NEXT_PUBLIC_SITE_URL = ✓ set
NEON_AUTH_COOKIE_SECRET = ✓ set
```

If any missing, add them.

**F. Test with Console**
1. Open browser: F12 (DevTools)
2. Go to Console tab
3. Try uploading file
4. Look for errors in console
5. Share error message

**G. Manual Environment Variable Reset**
1. Delete: BLOB_READ_WRITE_TOKEN
2. Wait: 1 minute
3. Add New: BLOB_READ_WRITE_TOKEN
4. Value: (blank)
5. Environments: All three
6. Save and wait for deployment

---

## Quick Checklist - Before Contacting Support

- [ ] BLOB_READ_WRITE_TOKEN in Vercel env vars
- [ ] Value is NOT empty
- [ ] All three environments selected (Prod, Preview, Dev)
- [ ] Deployment completed (green checkmark)
- [ ] Waited 2-3 minutes after adding/changing
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tried uploading file again
- [ ] Checked browser console (F12) for errors
- [ ] Deployment logs show no BLOB_READ_WRITE_TOKEN error

---

## Expected Success State

When working correctly:

**File Upload:**
- Select file
- Click Upload
- File processes
- Success message appears
- File stored in Blob
- Database record created

**Vercel Logs:**
- No: "BLOB_READ_WRITE_TOKEN is not set"
- No: "Server is not configured"
- Shows: "[v0] About to insert donation with..."
- Shows: "[v0] Donation inserted successfully..."

**Browser Console (F12):**
- No errors
- Upload shows success

---

## Connection to Code

The upload route (`app/api/donations/upload/route.ts`) checks:

```typescript
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  return NextResponse.json(
    { error: 'Server is not configured for file storage. Please contact support.' },
    { status: 500 }
  )
}
```

**This error means:** Environment variable not detected by Node.js at runtime.

**To fix:** Variable must be:
1. In Vercel Environment Variables
2. Set to auto-generated value (not blank)
3. Applied to all environments
4. Deployment completed

---

## Still Having Issues?

**Check Vercel Blob Integration:**
1. Go to: https://vercel.com/dashboard
2. Settings → Integrations
3. Look for: Vercel Blob Storage
4. If missing, click Add Integration
5. Authorize and connect
6. Then add BLOB_READ_WRITE_TOKEN env var

**Check Deployment Logs:**
1. Deployments → Latest
2. Logs tab
3. Search for: `BLOB_READ_WRITE_TOKEN`
4. Share any errors you see

**Common Solutions:**
- Deployment not complete: Wait 5 minutes
- Cache issue: Hard refresh + clear cache
- Wrong environment selected: Select all three
- Integration missing: Add Blob integration
- Token auto-generation failed: Delete and re-add

---

## Success Indicators

When working:
- ✓ File upload starts
- ✓ File processes
- ✓ Receipt stored in Blob
- ✓ Donation record created in database
- ✓ Success message displayed
- ✓ Admin dashboard shows file
- ✓ No errors in logs
- ✓ No errors in browser console

---

## Next Steps

1. Follow Steps 1-6 above
2. Test file upload
3. Verify in logs
4. If still failing, check Advanced Troubleshooting (Step 7)
5. Share deployment logs if issue persists

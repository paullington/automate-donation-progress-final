# Fresh Vercel Deployment - Complete Step-by-Step Visual Guide

## Overview
This guide walks you through completely deleting the current Vercel project and deploying fresh from GitHub with proper integration setup.

**Total Time: 25-35 minutes**
**Difficulty: Easy (no coding, all dashboard clicks)**

---

## PART 1: DELETE CURRENT VERCEL PROJECT (5 minutes)

### Step 1.1: Open Vercel Dashboard
```
1. Go to: https://vercel.com/dashboard
2. You should see your projects list
3. Find: automate-donation-tracking
```

### Step 1.2: Enter Project Settings
```
Current view:
┌─────────────────────────────────────────────────────────┐
│  Vercel Dashboard                                       │
├─────────────────────────────────────────────────────────┤
│  Projects                                               │
│  ├─ automate-donation-tracking                          │
│  ├─ some-other-project                                  │
│  └─ another-project                                     │
└─────────────────────────────────────────────────────────┘

1. Click: automate-donation-tracking project
2. You're now in project overview
3. At top, you see tabs: Deployments | Settings | Analytics
4. Click: Settings tab
```

### Step 1.3: Find Danger Zone
```
Location: Settings page

Left sidebar menu:
├─ General
├─ Domains
├─ Environment Variables
├─ Git
├─ Build & Development Settings
├─ Functions
├─ Analytics
└─ Danger Zone ← SCROLL TO HERE

Scroll down to bottom of left menu.
Click: Danger Zone
```

### Step 1.4: Delete Project
```
Danger Zone content:

┌──────────────────────────────────────────┐
│  DANGER ZONE                             │
├──────────────────────────────────────────┤
│                                          │
│  Transfer Project (to another team)      │
│  [Transfer]                              │
│                                          │
│  Delete Project                          │
│  [Delete]  ← RED BUTTON                  │
│                                          │
└──────────────────────────────────────────┘

Steps:
1. Click: [Delete] button (red)
2. Dialog appears: "Delete project?"
3. Shows: "Type project name to confirm"
4. Text box appears
5. Type: automate-donation-tracking (exactly)
6. Click: [Delete Project] (final confirmation)
7. Dialog closes
8. You're redirected to dashboard
9. Wait: 10-30 seconds for update
10. Refresh page: F5
11. Project should be GONE ✓
```

### Step 1.5: Verify Deletion
```
Back on Vercel Dashboard:

Projects list:
├─ some-other-project
├─ another-project
└─ (automate-donation-tracking should NOT be here)

Result: ✓ Project completely deleted
```

---

## PART 2: IMPORT FRESH FROM GITHUB (5 minutes)

### Step 2.1: Create New Project
```
Location: Vercel Dashboard

At top right:
┌─────────────────────┐
│ [+ Add New]         │
│ [Import Project]    │
│ [Create Team]       │
└─────────────────────┘

Click: Add New → Import Project
(or click "Import Project" if visible)

Alternative:
- Click: "Create New" button
- Look for: "From Git Repository"
```

### Step 2.2: Search GitHub Repository
```
Dialog appears:

┌────────────────────────────────────────────┐
│  Import Git Repository                     │
├────────────────────────────────────────────┤
│                                            │
│  Search: [ github/repo name search box ]   │
│                                            │
│  Showing GitHub repositories:              │
│  ├─ (user) / some-repo                     │
│  ├─ (org) / other-repo                     │
│  └─ ...                                    │
│                                            │
└────────────────────────────────────────────┘

Steps:
1. In search box, type: automate-donation-tracking
2. Results appear
3. Look for: paullington/automate-donation-tracking
4. Click: Select it
```

### Step 2.3: Select MAIN Branch
```
Import dialog continues:

┌────────────────────────────────────────────┐
│  Repository: paullington/...               │
│                                            │
│  Branch: [ Dropdown - select branch ]      │
│          ├─ main ← SELECT THIS             │
│          ├─ v0/yetundeabla-8395-e3c893f7   │
│          └─ other branches                 │
│                                            │
└────────────────────────────────────────────┘

CRITICAL: 
Select: main branch (NOT the v0/... branch)

Why: main has clean production code
```

### Step 2.4: Configure Project
```
Form fields appear:

┌────────────────────────────────────────────┐
│  Project Settings                          │
├────────────────────────────────────────────┤
│                                            │
│  Project Name: automate-donation-tracking  │
│  (can keep as is)                          │
│                                            │
│  Framework: [auto-detected] Next.js        │
│  (usually auto-correct)                    │
│                                            │
│  Build Command: (leave default)            │
│                                            │
│  Output Directory: (leave default)         │
│                                            │
│  Root Directory: ./                        │
│  (usually correct)                         │
│                                            │
└────────────────────────────────────────────┘

Leave defaults. These are usually correct.
```

### Step 2.5: Skip Environment Variables
```
IMPORTANT: Skip this section!

┌────────────────────────────────────────────┐
│  Environment Variables (Optional)          │
│                                            │
│  [Don't add any now]                       │
│                                            │
│  We'll add these after integrations.       │
│                                            │
└────────────────────────────────────────────┘

Scroll down and click: [Deploy]

Deployment starts but will fail.
This is EXPECTED and OK.
```

### Step 2.6: Wait for Initial Deployment
```
Deployment tab appears:

Status sequence:
1. Building...
2. Analyzing...
3. Building functions...
4. ✗ FAIL (expected, no env vars yet)

Don't worry about failure. This is expected.
We're adding integrations next.
```

---

## PART 3: CONNECT NEON POSTGRESQL (5-8 minutes)

### Step 3.1: Access Storage/Integration
```
You're in project overview:
Left sidebar has menu:

├─ Deployments
├─ Settings
├─ Logs
├─ Analytics
└─ Storage ← CLICK HERE

Or:

Settings → Scroll down → Look for: Storage section
```

### Step 3.2: Create PostgreSQL Database
```
Storage section:

┌────────────────────────────────────────────┐
│  Storage                                   │
├────────────────────────────────────────────┤
│  Databases                                 │
│  [Create Database]  or [+ Create New]      │
│                                            │
│  (if empty)                                │
│  Select a database provider...             │
│  ├─ PostgreSQL by Neon                     │
│  ├─ MySQL by PlanetScale                   │
│  └─ Other options                          │
│                                            │
└────────────────────────────────────────────┘

Steps:
1. Click: [Create Database] or [+ Create New]
2. Select: PostgreSQL by Neon
3. Click: [Create]  or  [Next]
```

### Step 3.3: Authorize with Neon
```
Browser redirect to Neon:

┌────────────────────────────────────────────┐
│  Neon Authorization                        │
│                                            │
│  Vercel wants to access Neon               │
│  [Authorize]  [Deny]                       │
│                                            │
└────────────────────────────────────────────┘

Steps:
1. Click: [Authorize]
2. Neon login page appears
3. Sign in with:
   - GitHub account, or
   - Neon account, or
   - Create new account
4. Authorize Vercel access
5. Select/create database (usually auto-created)
6. Browser redirects back to Vercel
```

### Step 3.4: Verify Integration
```
Back in Vercel project:

Storage section:

┌────────────────────────────────────────────┐
│  Storage                                   │
│                                            │
│  PostgreSQL (Neon)                         │
│  ├─ Status: Connected ✓                    │
│  ├─ Database: automate-donation-tracking   │
│  └─ Region: (your region)                  │
│                                            │
│  [View Database]  [Delete]                 │
│                                            │
└────────────────────────────────────────────┘

Check:
✓ Status shows "Connected"
✓ Environment Variables added
  (Settings → Environment Variables)
  Should show: DATABASE_URL

You should see: DATABASE_URL in env vars
```

---

## PART 4: CONNECT VERCEL BLOB STORAGE (3-5 minutes)

### Step 4.1: Create Blob Storage
```
You're in Storage section (from Part 3):

┌────────────────────────────────────────────┐
│  Storage                                   │
│                                            │
│  PostgreSQL (Neon)                         │
│  ├─ Connected ✓                            │
│                                            │
│  [+ Create] or [+ Add New]  ← CLICK HERE   │
│                                            │
└────────────────────────────────────────────┘

Steps:
1. Click: [Create] or [+ Add New]
2. Select: Blob  (for file storage)
3. Name: blob-storage (or custom name)
4. Region: (select closest to you)
5. Click: [Create]
```

### Step 4.2: Authorize Blob Storage
```
Dialog might ask:

┌────────────────────────────────────────────┐
│  Create Blob Store                         │
│                                            │
│  Name: [blob-storage]                      │
│  Region: [us-east-1] (dropdown)            │
│                                            │
│  [Create]                                  │
│                                            │
└────────────────────────────────────────────┘

Steps:
1. Confirm name and region
2. Click: [Create]
3. Blob store created
4. Auto-adds: BLOB_READ_WRITE_TOKEN to env vars
```

### Step 4.3: Verify Blob Integration
```
Storage section now shows:

┌────────────────────────────────────────────┐
│  Storage                                   │
│                                            │
│  PostgreSQL (Neon)                         │
│  ├─ Connected ✓                            │
│                                            │
│  Blob (Vercel)                             │
│  ├─ Status: Ready ✓                        │
│  ├─ Name: blob-storage                     │
│  └─ Region: us-east-1                      │
│                                            │
│  [View Files]  [Delete]                    │
│                                            │
└────────────────────────────────────────────┘

Check Settings → Environment Variables:
✓ DATABASE_URL (from Neon)
✓ BLOB_READ_WRITE_TOKEN (from Blob)
```

---

## PART 5: CONFIGURE ENVIRONMENT VARIABLES (5-8 minutes)

### Step 5.1: Navigate to Environment Variables
```
You're in project settings:

Left sidebar:
├─ General
├─ Domains
├─ Environment Variables ← CLICK HERE
├─ Git
├─ Build & Development Settings
└─ Danger Zone

Click: Environment Variables
```

### Step 5.2: Check Auto-Added Variables
```
Environment Variables page:

List shows:
┌────────────────────────────────────────────┐
│  Environment Variables                     │
├────────────────────────────────────────────┤
│                                            │
│  DATABASE_URL      [value hidden] ●        │
│  BLOB_READ_WRITE_TOKEN [value hidden] ●   │
│                                            │
│  (others if any)                           │
│                                            │
└────────────────────────────────────────────┘

These were auto-added by integrations.
```

### Step 5.3: Verify DATABASE_URL SSL Mode
```
CRITICAL STEP

Steps:
1. Find: DATABASE_URL row
2. Click: ... (three dots) on right
3. Click: Edit
4. Value should show starting with:
   postgresql://...
5. At end, look for: ?sslmode=...
6. Should be: sslmode=verify-full
7. If shows: sslmode=require
   → Change require to verify-full
   → Click: Save
8. If correct, click: X (close) without change
```

### Step 5.4: Add ADMIN_PASSWORD
```
Steps:
1. Click: [+ Add New] button
2. Name: ADMIN_PASSWORD
3. Value: Choose a SECURE password
   Example: MySecure@Password2024!
   (make it strong with symbols)
4. Environments: Select all three
   ☑ Production
   ☑ Preview
   ☑ Development
5. Click: [Add]
```

### Step 5.5: Add NEXT_PUBLIC_SITE_URL
```
Steps:
1. Click: [+ Add New]
2. Name: NEXT_PUBLIC_SITE_URL
3. Value: Your production URL
   Format: https://your-project.vercel.app
   Or: https://your-custom-domain.com
4. Environments: Select all three
   ☑ Production
   ☑ Preview
   ☑ Development
5. Click: [Add]
```

### Step 5.6: Generate and Add NEON_AUTH_COOKIE_SECRET
```
This value must be generated:

On Mac/Linux terminal:
$ openssl rand -base64 32

On Windows (PowerShift):
[System.Convert]::ToBase64String([byte[]][System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

Copy the output string.

Steps:
1. Click: [+ Add New]
2. Name: NEON_AUTH_COOKIE_SECRET
3. Value: Paste the generated string
4. Environments: Select all three
   ☑ Production
   ☑ Preview
   ☑ Development
5. Click: [Add]
```

### Step 5.7: Final Environment Variables Check
```
Settings → Environment Variables

You should have:

┌────────────────────────────────────────────┐
│  Environment Variables                     │
├────────────────────────────────────────────┤
│  DATABASE_URL                  ●  (verify) │
│  BLOB_READ_WRITE_TOKEN         ●  (auto)   │
│  ADMIN_PASSWORD                ●  (added)  │
│  NEXT_PUBLIC_SITE_URL          ●  (added)  │
│  NEON_AUTH_COOKIE_SECRET       ●  (added)  │
└────────────────────────────────────────────┘

All 5 variables must be present.
All must have values (● indicator).
```

---

## PART 6: REDEPLOY WITH FRESH ENVIRONMENT (3-5 minutes)

### Step 6.1: Go to Deployments
```
Left sidebar:
├─ Deployments ← CLICK HERE
├─ Settings
├─ Logs
└─ ...

Or click: Deployments tab at top
```

### Step 6.2: Find Failed Deployment
```
Deployments list:

┌────────────────────────────────────────────┐
│  Deployments                               │
├────────────────────────────────────────────┤
│                                            │
│  Latest deployment (at top):               │
│  ├─ Status: ✗ FAILED                       │
│  ├─ Time: (timestamp)                      │
│  ├─ Branch: main                           │
│  └─ ... (three dots) [CLICK HERE]          │
│                                            │
│  [Click three dots on the right]           │
│                                            │
└────────────────────────────────────────────┘
```

### Step 6.3: Redeploy
```
Menu appears:

┌────────────────────────────────────────────┐
│  Deployment Menu                           │
├────────────────────────────────────────────┤
│  Redeploy...           ← CLICK HERE        │
│  Inspect                                   │
│  Promote to Production                     │
│  Delete                                    │
│  More                                      │
└────────────────────────────────────────────┘

Steps:
1. Click: Redeploy...
2. Dialog: "Redeploy deployment?"
3. Shows: Will use current environment vars
4. Click: [Redeploy]
```

### Step 6.4: Monitor Redeployment
```
Status updates:

┌────────────────────────────────────────────┐
│  Deployment Status                         │
├────────────────────────────────────────────┤
│                                            │
│  ⏳ Building...                             │
│  Analyzing dependencies...                 │
│                                            │
│  ⏳ Building functions...                   │
│  Setting up runtime environment...         │
│                                            │
│  ⏳ Finalizing...                           │
│  Optimizing assets...                      │
│                                            │
│  ✓ READY                                   │
│                                            │
└────────────────────────────────────────────┘

Wait: 3-5 minutes for green ✓ checkmark
Don't refresh or click until done.
```

### Step 6.5: Verify Success
```
Deployment complete:

✓ Green checkmark appears
✓ Status: Ready
✓ Your app URL works
✓ Homepage loads

Time complete: Should take 3-5 minutes total
```

---

## PART 7: POST-DEPLOYMENT TESTING (5-10 minutes)

### Step 7.1: Test Homepage
```
Steps:
1. Go to: https://your-project.vercel.app
2. Homepage should load
3. No errors in page
4. Styled correctly
5. All images load

If broken:
- Check Deployments → Logs for errors
```

### Step 7.2: Test Admin Dashboard
```
Steps:
1. Go to: https://your-project.vercel.app/admin
2. Should show: Login form
3. Enter: ADMIN_PASSWORD (you set earlier)
4. Click: Login
5. Should see: Admin dashboard
6. Database connected (data should load)

If fails:
- Check logs for DATABASE_URL errors
```

### Step 7.3: Test File Upload
```
Steps:
1. Go to: Donation form page
2. Select a file: PDF, JPG, or PNG
3. Click: Upload
4. Should see: Success message
5. No error about file storage

If fails with "Server is not configured":
- Check: BLOB_READ_WRITE_TOKEN in env vars
- Verify value is not empty
- Redeploy
- Hard refresh browser (Ctrl+Shift+R)
```

### Step 7.4: Check Logs for Errors
```
Steps:
1. Deployments → Latest deployment
2. Click: Logs tab
3. Search for: "BLOB_READ_WRITE_TOKEN"
   Should NOT appear
4. Search for: "SECURITY WARNING"
   Should NOT appear
5. Search for: "error" (lowercase)
   Should be minimal/none

Clean logs = Success!
```

### Step 7.5: Complete Feature Test
```
Test each feature:

☑ Homepage loads
☑ Admin dashboard works
☑ File upload successful
☑ Database saves records
☑ Can download receipts
☑ Share tracking works
☑ QR codes generate
☑ Statistics update
☑ No console errors (F12)
```

---

## PART 8: VERIFICATION CHECKLIST

```
Deployment Complete Checklist:

✓ Old project deleted from Vercel
✓ New project imported from GitHub main branch
✓ Neon PostgreSQL connected
✓ Vercel Blob storage connected
✓ All 5 environment variables set
✓ DATABASE_URL has sslmode=verify-full
✓ BLOB_READ_WRITE_TOKEN has value
✓ Deployment shows green checkmark
✓ Homepage loads without errors
✓ Admin dashboard accessible
✓ File upload works
✓ No BLOB token errors in logs
✓ No SSL warning in logs
✓ All features tested
✓ Production ready!
```

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Deployment keeps failing | Check logs, verify all 5 env vars |
| "Cannot import repository" | Verify GitHub account connected, check org access |
| "File upload still fails" | Hard refresh (Ctrl+Shift+R), check BLOB token exists |
| "Admin dashboard won't load" | Verify DATABASE_URL correct, check Neon connection |
| "Database queries slow" | Check Neon console, verify SSL mode |
| Still seeing SSL warning | Verify DATABASE_URL has verify-full (not require) |

---

## Success State

When everything works:

✅ Fresh Vercel project
✅ Clean GitHub deployment
✅ Proper integrations (Neon + Blob)
✅ All environment variables set correctly
✅ No errors in logs
✅ All features operational
✅ File uploads working
✅ Database connected
✅ Admin dashboard functional
✅ Production ready!

---

## Next Steps

1. Follow steps 1-7 above sequentially
2. Don't skip any steps
3. Wait for each deployment to complete
4. Test each feature after deployment
5. Monitor logs for errors
6. Your app is now fresh and fully operational!

**Total time: 25-35 minutes**

Start with Part 1: Delete Current Vercel Project


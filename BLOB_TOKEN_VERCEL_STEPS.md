# BLOB_READ_WRITE_TOKEN - Exact Vercel Dashboard Steps

## The Error
```
"Server is not configured for file storage. Please contact support."
```

**Means:** BLOB_READ_WRITE_TOKEN environment variable is missing or empty in Vercel production.

---

## EXACT STEPS IN VERCEL DASHBOARD

### Step 1: Open Vercel Dashboard
```
1. Go to: https://vercel.com/dashboard
2. Look for: Your project (automate-donation-tracking)
3. Click: On the project name
```

### Step 2: Navigate to Settings
```
1. You're in project overview
2. At the top, look for tabs:
   - Deployments | Settings | Analytics | etc.
3. Click: Settings tab
```

### Step 3: Find Environment Variables
```
1. You're in Settings
2. Left sidebar shows menu items:
   - General
   - Domains
   - Environment Variables  ← CLICK HERE
   - Git
   - etc.
3. Click: Environment Variables
```

### Step 4: Look for BLOB_READ_WRITE_TOKEN
```
You now see list of environment variables:
- DATABASE_URL
- ADMIN_PASSWORD
- NEXT_PUBLIC_SITE_URL
- NEON_AUTH_COOKIE_SECRET
- BLOB_READ_WRITE_TOKEN (or missing)

Action depends on what you see:
```

---

## SCENARIO A: BLOB_READ_WRITE_TOKEN is MISSING

```
Visual:
+─────────────────────────────────────────+
| Environment Variables                    |
+─────────────────────────────────────────+
| DATABASE_URL         [value hidden]      |
| ADMIN_PASSWORD       [value hidden]      |
| NEXT_PUBLIC_SITE_URL [value hidden]      |
| NEON_AUTH_COOKIE...  [value hidden]      |
| [+ Add New]                              |
+─────────────────────────────────────────+

Steps:
1. Click: [+ Add New] button (bottom right)
2. New form appears:
   
   Name:  BLOB_READ_WRITE_TOKEN
   Value: (LEAVE COMPLETELY BLANK)
   
   Environments: Select all three
   ☑ Production
   ☑ Preview  
   ☑ Development
   
3. Click: [Add] button
4. You should see success message
5. Auto-redeploy starts
6. Wait: 2-3 minutes for green checkmark
```

---

## SCENARIO B: BLOB_READ_WRITE_TOKEN EXISTS BUT EMPTY

```
Visual:
+─────────────────────────────────────────+
| Environment Variables                    |
+─────────────────────────────────────────+
| DATABASE_URL         [value hidden]      |
| ADMIN_PASSWORD       [value hidden]      |
| NEXT_PUBLIC_SITE_URL [value hidden]      |
| NEON_AUTH_COOKIE...  [value hidden]      |
| BLOB_READ_WRITE_... [empty / no value]  |
+─────────────────────────────────────────+

Steps:
1. Find: BLOB_READ_WRITE_TOKEN row
2. Right side of row, click: ... (three dots)
3. Menu appears with options:
   - Edit
   - Copy
   - Delete
4. Click: Edit
5. Form appears:
   
   Name:  BLOB_READ_WRITE_TOKEN
   Value: (EMPTY)
   
   Environments: Check all three
   ☑ Production
   ☑ Preview
   ☑ Development
   
6. Click: [Save] button
7. Should see: "Changes saved"
8. Auto-redeploy starts
9. Wait: 2-3 minutes for green checkmark
```

---

## SCENARIO C: BLOB_READ_WRITE_TOKEN EXISTS WITH VALUE

```
Visual:
+─────────────────────────────────────────+
| Environment Variables                    |
+─────────────────────────────────────────+
| DATABASE_URL         [value hidden] ●   |
| ADMIN_PASSWORD       [value hidden] ●   |
| NEXT_PUBLIC_SITE_URL [value hidden] ●   |
| NEON_AUTH_COOKIE...  [value hidden] ●   |
| BLOB_READ_WRITE_... [value hidden] ●    |
+─────────────────────────────────────────+

Steps:
1. Find: BLOB_READ_WRITE_TOKEN row
2. Verify environments (●):
   Should show: Green dot(s)
3. Hover over BLOB_READ_WRITE_TOKEN row
4. Click: ... (three dots)
5. Click: Edit
6. Verify:
   ☑ Production
   ☑ Preview
   ☑ Development
   (All three MUST be checked)
7. If any unchecked:
   - Check it
   - Click: Save
8. If all checked:
   - Go to: Deployments tab
   - Find: Latest deployment
   - Click: ... (three dots)
   - Click: Redeploy
   - Wait: Green checkmark ✓
```

---

## SCENARIO D: CAN'T FIND IT - SCROLL DOWN

```
If BLOB_READ_WRITE_TOKEN not visible:

1. You're in Environment Variables page
2. Scroll down - might be on next page
3. Search: Type "BLOB" in search box
4. Should highlight: BLOB_READ_WRITE_TOKEN

If still not found:
   → See SCENARIO A: BLOB_READ_WRITE_TOKEN is MISSING
```

---

## After Adding/Editing: Force Redeploy

```
1. Go to: Deployments tab (next to Settings)
2. Find: Latest deployment
   Should show: Recent timestamp
3. Click: ... (three dots) on the right
4. Click: Redeploy
5. Dialog: "Redeploy 'automate-donation-tracking'?"
6. Click: Redeploy
7. Deployment starts
8. Wait for: Green checkmark ✓ (2-3 min)
9. Check: "Deployment Status: Success"
```

---

## Verify It Worked

### Check 1: Deployment Shows Green
```
Deployments tab:
Latest deployment shows: ✓ (green checkmark)
Time: <1 minute ago
```

### Check 2: Variable Exists
```
Settings → Environment Variables:
BLOB_READ_WRITE_TOKEN should show: [value hidden] ●
```

### Check 3: Test Upload
```
1. Go to your app
2. Try uploading a file
3. Should work (no error)
```

### Check 4: Check Logs
```
1. Deployments → Latest
2. Click: Logs tab
3. Search: "BLOB_READ_WRITE_TOKEN is not set"
4. Should NOT appear
```

---

## Visual Environment Selector

When adding/editing, you MUST select environments:

```
Environments (select all):

☑ Production     ← Check this
☑ Preview        ← Check this
☑ Development    ← Check this

All three MUST be checked!
```

---

## If Still Getting Error After All This

### Step 1: Clear Browser Cache
```
1. Close your browser completely
2. Open new browser window
3. Go to app again
4. Try uploading
```

### Step 2: Check All Variables Are Set
```
Settings → Environment Variables:

Must have (verify all exist):
☑ DATABASE_URL
☑ BLOB_READ_WRITE_TOKEN
☑ ADMIN_PASSWORD
☑ NEXT_PUBLIC_SITE_URL
☑ NEON_AUTH_COOKIE_SECRET

Any missing? Add them.
```

### Step 3: Check Vercel Blob Integration
```
Settings → Integrations:

Should show: Vercel Blob Storage (Connected)

If missing:
1. Look for: Blob Storage in catalog
2. Click: Add
3. Authorize
4. Then verify BLOB_READ_WRITE_TOKEN env var
```

### Step 4: Full Reset
```
1. Delete: BLOB_READ_WRITE_TOKEN from env vars
2. Go to Deployments → Latest → Redeploy
3. Wait 2 minutes
4. Add: BLOB_READ_WRITE_TOKEN (blank value)
5. All environments selected
6. Click Add
7. Go to Deployments → Latest → Redeploy
8. Wait 3 minutes
9. Test upload
```

---

## Success = These Messages

When working correctly, you'll see:

**After upload:**
```
"Receipt uploaded successfully"
(or similar success message)
```

**In deployment logs:**
```
[v0] About to insert donation with: {...}
[v0] Donation inserted successfully: {...}
(no BLOB_READ_WRITE_TOKEN error)
```

**In browser (F12 console):**
```
(no red error messages)
(shows successful upload)
```

---

## Quick Reference

| Issue | Fix | Time |
|-------|-----|------|
| Variable missing | Add new env var | 2 min + 3 min deploy |
| Variable empty | Edit and save | 1 min + 3 min deploy |
| Not selected to all envs | Edit, select all, save | 1 min + 3 min deploy |
| Deployment not complete | Wait or manually redeploy | 3-5 min |
| Browser cache | Clear cache + refresh | 1 min |
| Still not working | Check all 5 env vars exist | 2 min |

---

## Helpful Links

Vercel Dashboard:
https://vercel.com/dashboard

Your Project Deployments:
https://vercel.com/dashboard/automate-donation-tracking/deployments

Environment Variables (direct):
https://vercel.com/dashboard/automate-donation-tracking/settings/environment-variables

---

## Next Steps

1. **Identify your scenario** (A, B, C, or D above)
2. **Follow exact steps** for your scenario
3. **Wait for deployment** (green checkmark)
4. **Test file upload**
5. **Check logs** for errors

Done! Should work in 5-10 minutes. 🎉

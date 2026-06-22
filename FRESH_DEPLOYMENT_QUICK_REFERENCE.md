# Fresh Vercel Deployment - Quick Reference Card

## The 8 Steps (25-35 minutes)

### 1. DELETE (5 min)
```
Vercel Dashboard → Project → Settings → Danger Zone → Delete
Confirm by typing: automate-donation-tracking
Refresh page - verify gone ✓
```

### 2. IMPORT (5 min)
```
Dashboard → Add New → Import Project
Search: automate-donation-tracking
Select: paullington/automate-donation-tracking
Branch: main (NOT v0/...)
Deploy (will fail - OK)
```

### 3. NEON (5-8 min)
```
Storage → Create Database → PostgreSQL by Neon
Authorize → Create
Result: DATABASE_URL added ✓
```

### 4. BLOB (3-5 min)
```
Storage → Create → Blob
Name: blob-storage
Create
Result: BLOB_READ_WRITE_TOKEN added ✓
```

### 5. ENV VARS (5-8 min)
```
DATABASE_URL:
  Verify: sslmode=verify-full (change require if needed)

BLOB_READ_WRITE_TOKEN:
  Verify: Has value (not empty) ✓

Add 3 new:
  ADMIN_PASSWORD = [secure password]
  NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
  NEON_AUTH_COOKIE_SECRET = [openssl rand -base64 32]

All environments: ☑ Production ☑ Preview ☑ Development
```

### 6. REDEPLOY (3-5 min)
```
Deployments → Latest → ... → Redeploy
Wait for green ✓ checkmark (3-5 min)
```

### 7. TEST (5-10 min)
```
Homepage: loads ✓
Admin: /admin accessible ✓
Upload: file works ✓
Logs: no BLOB or SSL errors ✓
```

### 8. VERIFY (checklist)
```
☑ Project deleted
☑ Project imported from main
☑ Neon connected
☑ Blob connected
☑ All 5 env vars set
☑ DATABASE_URL has verify-full
☑ Deployment green ✓
☑ All features work
☑ Logs clean
```

---

## Critical Points

| Point | Action |
|-------|--------|
| **Branch** | Select MAIN (not v0/...) |
| **Skip first time** | Don't add env vars initially |
| **Integrations first** | Neon then Blob - auto-generates vars |
| **SSL Mode** | DATABASE_URL must have verify-full |
| **Blob token** | Leave value blank - Vercel generates |
| **All environments** | Select all 3 for every var |
| **Redeploy** | After all 5 vars configured |
| **Wait for green** | Don't test before checkmark |

---

## 5 Environment Variables

```
1. DATABASE_URL (auto)
   Format: postgresql://...?sslmode=verify-full
   
2. BLOB_READ_WRITE_TOKEN (auto)
   Format: Long secure token
   
3. ADMIN_PASSWORD (manual)
   Format: Your secure password
   
4. NEXT_PUBLIC_SITE_URL (manual)
   Format: https://your-project.vercel.app
   
5. NEON_AUTH_COOKIE_SECRET (manual)
   Format: openssl rand -base64 32 output
```

All must be applied to Production + Preview + Development.

---

## Time Breakdown

| Step | Time |
|------|------|
| Delete | 5 min |
| Import | 5 min |
| Neon | 5-8 min |
| Blob | 3-5 min |
| Env Vars | 5-8 min |
| Redeploy | 3-5 min |
| Test | 5-10 min |
| **Total** | **25-35 min** |

---

## Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Deployment fails | Check logs, verify all 5 env vars |
| Upload error | Hard refresh (Ctrl+Shift+R), check Blob token |
| Admin won't load | Verify DATABASE_URL correct |
| SSL warning | Verify sslmode=verify-full |
| Can't find var | Scroll down or search in env vars page |

---

## Success Indicators

✓ Homepage loads instantly
✓ Admin dashboard accessible
✓ File upload successful
✓ Database saving records
✓ Logs show no errors
✓ No BLOB token errors
✓ No SSL warnings

---

## Links

- Vercel: https://vercel.com/dashboard
- GitHub: https://github.com/paullington/automate-donation-tracking
- Neon: https://console.neon.tech

---

**Full guide:** FRESH_DEPLOYMENT_COMPLETE_GUIDE.md (759 lines)
**Start:** Part 1 - Delete Current Vercel Project
**Ready:** Yes - Follow the 8 steps above!

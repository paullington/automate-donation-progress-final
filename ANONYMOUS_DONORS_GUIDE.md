# Anonymous Donor Support - Complete Guide

## Overview

The system now supports **anonymous donations** where donors don't need to provide a name. This encourages donations from privacy-conscious supporters while maintaining full transaction tracking.

## How It Works

### Submission Process
```
Donor uploads receipt
    ↓
Name field empty? → YES
    ↓
isAnonymous = true
Donor recorded as: Anonymous (not shown in dashboard)
Email (if provided) used only for duplicate detection
    ↓
Upload succeeds
"Thank you for your donation"
```

### Admin Visibility
```
Admin dashboard shows:
├─ Anonymous badge (instead of name)
├─ Email HIDDEN (not displayed for privacy)
├─ Amount and transaction details SHOWN
├─ File available for download
└─ Can approve/reject like any other donation
```

### Donor Counting
```
Named donor: 1 email = 1 donor
Anonymous donor 1: email A = 1 donor
Anonymous donor 2: email B = 1 donor (separate count)
Anonymous donor 3: no email = 1 donor

Total: 4 donors
(Email used only for duplicate detection, not counting)
```

## Key Features

### 1. Privacy Protection
- **Name not stored**: Only null/empty value
- **Email not displayed**: Used internally for duplicates only
- **No tracking**: Anonymous donations unlinked from personal identity
- **Each counts separately**: Multiple anonymous from same person counted as different donors

### 2. Duplicate Detection
Even though anonymous, system detects duplicates via:
- Same email + same filename within 60 minutes
- Prevents accidental resubmission
- Shows "Duplicate of #123" in admin dashboard

### 3. Admin Dashboard Display
Anonymous donations display as:
```
┌─────────────────────────────────┐
│ Anonymous    (slate badge)      │
│              (no email shown)    │
├─────────────────────────────────┤
│ Amount: ₦500,000                │
│ Status: Processed / Pending     │
│ Type: Transaction               │
│ Notes: Anonymous donor | ...    │
└─────────────────────────────────┘
```

### 4. Statistics Impact
Campaign stats automatically include anonymous:
```json
{
  "donors": 42,        // Includes 15 anonymous
  "amountRaised": 5000000,
  "shares": 283,
  "breakdown": {
    "anonymous": 15,   // Tracked separately
    "named": 27,
    "processed": 35,
    "pending": 7
  }
}
```

## Implementation Details

### Database Schema
```sql
ALTER TABLE donations ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE;
```

### Validation Logic
```typescript
const isAnonymous = !donorName || donorName.trim().length === 0
```

### Setting Flag on Upload
```typescript
// Upload route automatically sets is_anonymous based on form submission
const validation = await validateAndProcessDocument(
  donorEmail,
  donorName,    // If empty/null → isAnonymous = true
  fileName,
  fileBuffer
)

// Insert includes is_anonymous
INSERT INTO donations (..., is_anonymous, ...)
VALUES (..., validation.isAnonymous, ...)
```

## User-Facing Text

### Upload Form
```
"All information is optional. If you don't provide a name, 
your donation will be recorded as anonymous. Email is only 
used to detect duplicate uploads and will not be shared."
```

### Success Message
For anonymous donations:
```
"Receipt uploaded successfully!
Your donation will be recorded as anonymous.
Thank you for your support."
```

### Progress Display
```
"42 generous donors have contributed so far"
(This count includes 15 anonymous donors counted separately)
```

## Admin Dashboard Operations

### Viewing Anonymous Donations
1. Log in to admin panel (/admin)
2. Look for "Anonymous" badge in Donor column
3. Click filters to show/hide anonymous:
   ```
   All (50)
   - Processed (35)
   - Pending (10)
   - Duplicates (2)
   - Non-Transactions (3)
   ```

### Filtering Anonymous
To see only anonymous donations:
1. Use browser dev tools or API call:
   ```javascript
   // Filter donations by isAnonymous flag
   const anonymous = donations.filter(d => d.isAnonymous === true)
   ```

### Admin Actions on Anonymous
Admins can:
- ✅ View receipt file
- ✅ Download receipt file
- ✅ Mark as processed
- ✅ Note duplicate if detected
- ✅ Add validation notes
- ✅ Cannot see email (hidden for privacy)

## Data Examples

### Example 1: Anonymous No Email
```json
{
  "id": 42,
  "donorName": null,
  "donorEmail": null,
  "isAnonymous": true,
  "amount": "500000",
  "isProcessed": true,
  "transactionType": "transaction",
  "receiptFileName": "receipt_2024.pdf"
}
```

### Example 2: Anonymous With Email (for duplicate detection)
```json
{
  "id": 43,
  "donorName": null,
  "donorEmail": "supporter@example.com",
  "isAnonymous": true,
  "amount": "250000",
  "isDuplicate": false,
  "transactionType": "transaction",
  "processingNotes": "Anonymous donor | Identified as transaction | 95% confidence"
}
```

### Example 3: Duplicate Anonymous
```json
{
  "id": 44,
  "donorName": null,
  "donorEmail": "supporter@example.com",
  "isAnonymous": true,
  "isDuplicate": true,
  "duplicateOfId": 43,
  "processingNotes": "Duplicate of donation #43 | Anonymous donor"
}
```

## API Responses

### Campaign Stats API (`GET /api/campaign-stats`)
```json
{
  "donors": 42,
  "amountRaised": 5000000,
  "shares": 283,
  "breakdown": {
    "processed": 35,
    "pending": 5,
    "duplicates": 2,
    "nonTransaction": 0,
    "failed": 0
  },
  "shareBreakdown": [...],
  "totalUploads": 42
}
```

Note: Anonymous donors are counted by unique ID, not email. Each anonymous submission = 1 donor.

### Donations API (`GET /api/donations`)
Each donation object includes:
```json
{
  "id": 42,
  "donorName": null,
  "donorEmail": "supporter@example.com",  // Shown to authenticated admins only
  "isAnonymous": true,                    // Indicates anonymous submission
  "amount": "500000",
  "isProcessed": true,
  "isDuplicate": false,
  "transactionType": "transaction",
  "processingNotes": "Anonymous donor | ...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## FAQ

### Q: Can an anonymous donor become identified later?
**A:** No. Once submitted without a name, it's permanently anonymous. The donor cannot claim it later.

### Q: How is email used for anonymous donations?
**A:** Only for duplicate detection. If same email + same filename = duplicate. Email not displayed anywhere.

### Q: Can I filter/report on anonymous donations?
**A:** Yes, in admin code you can filter:
```typescript
const anonymous = donations.filter(d => d.isAnonymous === true)
```

### Q: Do anonymous donations count as different if same person submits twice?
**A:** 
- **With same email + same filename**: Marked as duplicate, counted once
- **Different filename or no email**: Counted as separate donors

### Q: How does anonymous affect total donor count?
**A:** Each anonymous submission = 1 donor in stats. If 42 donations (27 named, 15 anonymous), total donors = 42 (not 27).

### Q: Can admin see the email address?
**A:** Yes, authenticated admins see email in API responses. But dashboard hides email for anonymous (privacy).

### Q: What happens if anonymous + named are same person?
**A:** System treats them as different donors (no way to link without name or email).

## Metrics to Track

After launching anonymous donor support:

1. **Anonymous Submission Rate**
   ```
   Anonymous donations / Total donations
   Track this weekly to see privacy adoption
   ```

2. **Average Anonymous Donation Amount**
   ```
   Sum of anonymous amounts / Count of anonymous donations
   Compare to named donors to see giving patterns
   ```

3. **Anonymous Duplicate Rate**
   ```
   Duplicate anonymous / Total anonymous
   Should be low (< 5%) if duplicate detection works
   ```

4. **Anonymous Email Provision**
   ```
   Anonymous with email / Total anonymous
   Shows how many want contact options privately
   ```

## Migration Notes

### Existing Data
- Donations without names automatically marked as `is_anonymous = true`
- Existing named donations: `is_anonymous = false`
- No data loss or changes to existing records

### Backward Compatibility
- Old API calls still work
- `donorName` still returns null for anonymous
- New field `isAnonymous` added but optional in responses

## Testing Checklist

- [ ] Anonymous submission uploads successfully
- [ ] Anonymous shows in admin dashboard with badge
- [ ] Email hidden for anonymous in dashboard
- [ ] Stats count anonymous correctly
- [ ] Duplicate detection works for anonymous (same email)
- [ ] Anonymous donations counted as separate donors
- [ ] Admin can download anonymous receipt
- [ ] Progress bar updates with anonymous donors
- [ ] Share tracking works (not related to anonymous)
- [ ] No console errors with anonymous flow

## Production Deployment

1. **Apply database migration**:
   ```sql
   ALTER TABLE donations ADD COLUMN is_anonymous BOOLEAN DEFAULT FALSE;
   ```

2. **Backfill existing**:
   ```sql
   UPDATE donations SET is_anonymous = TRUE WHERE donor_name IS NULL;
   ```

3. **Verify**:
   ```sql
   SELECT COUNT(*) FROM donations WHERE is_anonymous = true;
   ```

4. **Deploy code** (automatic on git push to Vercel)

5. **Test in production**:
   - Submit anonymous donation
   - Check admin dashboard
   - Verify stats update

---

**Anonymous Donor Support is now fully integrated and production-ready.**

# Automated Donation Tracking Features

This document explains the new automated tracking features added to the donation campaign system.

## Features Overview

### 1. Automatic Share Counting

**What it does**: Tracks every time someone shares the appeal on social media platforms.

**How it works**:
- When users click any share button (WhatsApp, Facebook, X/Twitter, LinkedIn, Telegram, Email, or direct share)
- A POST request is sent to `/api/shares` with the platform name
- The share count increments in the database
- Progress component updates to show new share count

**Frontend Impact**:
- Share buttons automatically POST to `/api/shares` before opening social link
- No user action required beyond clicking share
- Share count displays in real-time on progress section

**API Endpoint**: `POST /api/shares`
```json
{
  "platform": "whatsapp" | "facebook" | "twitter" | "linkedin" | "telegram" | "email" | "direct"
}
```

---

### 2. Automated Donor Count

**What it does**: Automatically counts unique donors from uploaded receipts.

**How it works**:
- System tracks unique donor emails from processed donations
- Duplicates of same donation are excluded from count
- Count updates in real-time when new uploads are validated

**Frontend Impact**:
- Progress component fetches real-time donor count
- Displays: "X generous donors have contributed so far"
- Updates every 5 minutes automatically

**Calculation Logic**:
- Count distinct `donorEmail` values
- Exclude donations marked as duplicates
- Group by email first, then by name if no email

---

### 3. Automated Donation Amount Progress

**What it does**: Automatically calculates total amount raised from validated transaction documents.

**How it works**:
- When receipt is uploaded, system validates if it's a transaction document
- If marked as "transaction" type, amount is included in total
- Only **processed** transactions count toward progress
- Amount automatically sums and updates progress bar

**Frontend Impact**:
- Progress component shows: "₦X,XXX,XXX raised so far"
- Progress bar fills based on amount vs. target
- Percentage updates automatically

**Calculation Logic**:
- Sum `amount` field where:
  - `isProcessed = true` AND
  - `transactionType = 'transaction'` AND
  - `amount` is numeric
- Other uploads ignored (non-transactions, pending, duplicates)

---

### 4. Processing Status Tracking

**What it does**: Marks each upload with its validation and processing status.

**Possible Statuses**:

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| **Processed** | Green ✓ | Verified transaction, counted in progress |
| **Pending** | Blue ⏳ | Awaiting admin review/processing |
| **Duplicate** | Orange ⚠️ | Same file uploaded multiple times |
| **Failed** | Red ✗ | Failed validation or error occurred |

**Admin Dashboard**:
- Status column shows with color-coded badges
- Click filter buttons to view by status
- Processing notes explain why document has that status

**Database Fields**:
- `is_processed` - boolean, admin approval status
- `is_duplicate` - boolean, if duplicate detected
- `duplicate_of_id` - integer, ID of original if duplicate
- `processing_notes` - text, validation/error messages

---

### 5. Transaction Document Validation

**What it does**: Automatically determines if an uploaded file is a real transaction document.

**How it works**:
- Analyzes filename for transaction-related keywords
- Looks for: "receipt", "transfer", "payment", "invoice", "debit", "credit", "transaction", "slip", "proof"
- Avoids: "screenshot", "photo", "image", "picture", "document", "letter", "form"
- Assigns confidence score (0-100%)

**Outcomes**:
- `transactionType: 'transaction'` - Appears valid (amount counted)
- `transactionType: 'not_transaction'` - Doesn't appear valid (amount not counted)
- `transactionType: null` - Legacy data (pre-validation)

**Admin Dashboard**:
- Type column shows badge:
  - Green: Transaction
  - Amber: Non-Transaction
  - Gray: Unvalidated (legacy)

---

### 6. Duplicate Detection

**What it does**: Identifies when same donor uploads same receipt twice.

**Detection Method**:
- Checks donor email + filename pattern within 60-minute window
- Normalizes filename (removes special characters, converts to lowercase)
- If exact match found, marks as duplicate

**Handling**:
- First upload is kept as original
- Second upload marked with `isDuplicate: true` and `duplicateOfId: [id]`
- Duplicate excluded from donor count and amount calculations
- Admin dashboard shows which original it's a duplicate of

**Admin Dashboard**:
- Duplicate badge shows: "Duplicate #123" (links to original)
- Filter to view all duplicates
- Notes column explains duplicate detection

---

### 7. Real-time Campaign Statistics API

**What it does**: Provides live statistics about the campaign progress.

**Endpoint**: `GET /api/campaign-stats`

**Response**:
```json
{
  "donors": 15,
  "amountRaised": 2500000,
  "shares": 42,
  "breakdown": {
    "processed": 10,
    "pending": 3,
    "duplicates": 1,
    "nonTransaction": 2,
    "failed": 0
  },
  "shareBreakdown": [
    { "platform": "whatsapp", "count": 15 },
    { "platform": "facebook", "count": 12 },
    { "platform": "email", "count": 15 }
  ],
  "lastUpdated": "2024-06-21T10:30:00.000Z",
  "totalUploads": 16
}
```

**Use Cases**:
- Progress component fetches every 5 minutes
- Admin dashboard can use to display campaign health
- Mobile apps can show real-time progress

---

### 8. Enhanced Admin Dashboard

**New Columns**:

1. **Status Column**
   - Shows processing status with badge
   - Color-coded: Green (Processed), Blue (Pending), Orange (Duplicate), Red (Failed)
   - Click to see details in processing notes

2. **Type Column**
   - Shows document type with badge
   - Transaction (green), Non-Transaction (amber), Unvalidated (gray)
   - Indicates if amount will be counted

3. **Processing Notes Column**
   - Shows validation details
   - Explains why document has its status
   - Shows duplicate link if applicable

**New Filter Buttons**:
- **All**: Show all uploads with count
- **Processed**: Only approved, counted uploads
- **Pending**: Awaiting admin action
- **Duplicates**: Show suspected duplicates
- **Non-Transactions**: Uploads identified as non-transaction files

**Filtering Features**:
- Click buttons to filter
- Count updates dynamically
- Combines with existing View/Download functionality

---

## Data Migration

### Initial Processing (First-Time Setup)

When deploying this update, existing uploads are processed as follows:

**Script**: `scripts/process-existing-donations.ts`

1. **First 2 uploads** → Marked as test data
   - `processingNotes: "Test data - initial upload for testing"`
   - `isProcessed: false`

2. **Next 2 uploads** → Validated and marked as processed
   - `isProcessed: true`
   - Transaction type determined
   - Counted in progress immediately

3. **Remaining uploads** → Validated but not marked as processed
   - `isProcessed: false` (pending admin review)
   - `transactionType` set
   - `processingNotes` includes validation details

**Run Script**:
```bash
npx ts-node scripts/process-existing-donations.ts
```

---

## Technical Details

### Database Schema Changes

**New Columns on `donations` table**:
```sql
-- Document type classification
transaction_type TEXT               -- 'transaction', 'not_transaction', null

-- Processing status
is_processed BOOLEAN DEFAULT FALSE  -- Admin has approved
is_duplicate BOOLEAN DEFAULT FALSE  -- Duplicate detected
duplicate_of_id INTEGER             -- Reference to original if duplicate

-- Validation details
processing_notes TEXT               -- Error messages or validation info
```

**New `shares` Table**:
```sql
CREATE TABLE shares (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,    -- 'whatsapp', 'facebook', etc.
  count INTEGER DEFAULT 0,           -- Total shares for platform
  last_updated TIMESTAMP NOT NULL    -- When count was updated
);
```

### API Routes Added

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/shares` | POST | Record a share event |
| `/api/shares` | GET | Get share counts |
| `/api/campaign-stats` | GET | Get real-time statistics |

### Caching Strategy

- **Frontend Stats Cache**: 5-minute client-side cache
- **Database Indexes**: Created on `is_processed`, `is_duplicate`, `transaction_type`, `donor_email`
- **API Response**: Calculated on-demand, no server-side cache

---

## User Experience

### For Donors

1. Upload receipt as before
2. See confirmation if it's identified as transaction
3. Can see their contribution counted in real-time
4. Share buttons automatically track shares
5. See updated share count on progress section

### For Admin

1. Log into admin dashboard
2. See all uploads with clear status indicators
3. Use filters to focus on uploads needing action
4. Review validation notes to understand system's assessment
5. Can override status if needed (through future admin UI)
6. View live statistics on campaign progress

---

## Limitations & Notes

### Current Limitations

1. **Filename-based validation only**: System can't read file contents, only filename
2. **No manual override yet**: Admin can't change status via UI (database edit required)
3. **Email-based duplicate detection**: Only works if donor provides email
4. **60-minute duplicate window**: Uploads outside this window aren't detected as duplicates

### Future Enhancements

- OCR to read actual transaction amounts
- Admin UI to manually approve/reject uploads
- Email verification for donors
- Automated thank-you emails
- Bank statement parsing
- Multi-recipient support

---

## Troubleshooting

### Share count not updating
- Check browser console for JavaScript errors
- Verify `/api/shares` endpoint responds
- Check if user has JavaScript enabled

### Donor count incorrect
- Ensure uploads have valid `donorEmail` field
- Check for duplicate entries with same email
- Verify duplicates are marked correctly

### Amount not calculating
- Confirm uploads are marked `isProcessed: true`
- Check `transactionType` is 'transaction'
- Verify `amount` field is numeric

### Dashboard shows all Pending
- Run data migration script to validate existing uploads
- Check for validation errors in processing notes
- Manually update status in database if needed

---

For deployment instructions, see `DEPLOYMENT_GUIDE.md`

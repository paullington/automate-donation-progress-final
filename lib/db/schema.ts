import { pgTable, text, timestamp, serial, boolean, integer } from 'drizzle-orm/pg-core'

export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donorName: text('donor_name'),
  donorEmail: text('donor_email'),
  receiptFileName: text('receipt_file_name').notNull(),
  receiptPathname: text('receipt_pathname').notNull(),
  receiptUrl: text('receipt_url'),
  amount: text('amount'),
  notes: text('notes'),
  // New fields for processing status and validation
  transactionType: text('transaction_type'), // 'transaction', 'not_transaction', null for legacy
  isProcessed: boolean('is_processed').default(false),
  isDuplicate: boolean('is_duplicate').default(false),
  isAnonymous: boolean('is_anonymous').default(false), // True if no donor name provided
  duplicateOfId: integer('duplicate_of_id'), // References another donation id
  processingNotes: text('processing_notes'), // Error messages or validation notes
  fileHash: text('file_hash'), // SHA-256 hash for exact duplicate detection
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const shares = pgTable('shares', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // 'whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'email', 'direct'
  count: integer('count').default(0),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
})

export type Donation = typeof donations.$inferSelect
export type NewDonation = typeof donations.$inferInsert
export type Share = typeof shares.$inferSelect
export type NewShare = typeof shares.$inferInsert

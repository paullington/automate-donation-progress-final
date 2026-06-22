'use client'

import { useState, useRef } from 'react'
import { Upload, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Reveal } from './reveal'

export function ReceiptUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Only PDF, JPG, and PNG files are allowed')
        setFile(null)
        return
      }

      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-accent')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-accent')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-accent')
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      const event = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileChange(event)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (donorName.trim()) formData.append('donorName', donorName.trim())
      if (donorEmail.trim()) formData.append('donorEmail', donorEmail.trim())
      if (amount.trim()) formData.append('amount', amount.trim())
      if (notes.trim()) formData.append('notes', notes.trim())

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90))
      }, 200)

      const response = await fetch('/api/donations/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess(true)
      setFile(null)
      setDonorName('')
      setDonorEmail('')
      setAmount('')
      setNotes('')
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setProgress(0)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Reveal>
      <div className="w-full max-w-2xl" suppressHydrationWarning>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="relative rounded-xl border-2 border-dashed border-border transition-colors hover:border-accent"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={uploading}
              className="hidden"
              aria-label="Upload receipt file"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full p-8 text-center transition-opacity disabled:opacity-50"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-accent/10 p-3">
                  <Upload className="size-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {file ? file.name : 'Upload your transfer receipt'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, JPG, or PNG • Max 5MB
                  </p>
                </div>
                {file && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground hover:bg-border"
                  >
                    <X className="size-4" />
                    Remove
                  </button>
                )}
              </div>
            </button>
          </div>

          {/* Donor Info */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Donor Information <span className="text-muted-foreground">(optional)</span>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={uploading}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder-muted-foreground disabled:opacity-50"
              />
              <input
                type="email"
                placeholder="Your email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                disabled={uploading}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder-muted-foreground disabled:opacity-50"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Amount (optional)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={uploading}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder-muted-foreground disabled:opacity-50"
              />
              <textarea
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={uploading}
                rows={1}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder-muted-foreground disabled:opacity-50"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              All information is optional. If you don&apos;t provide a name, your donation will be recorded as anonymous. Email is only used to detect duplicate uploads and will not be shared.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 rounded-lg border border-urgent/20 bg-urgent/5 p-4">
              <AlertTriangle className="mt-0.5 size-5 flex-shrink-0 text-urgent" />
              <p className="text-sm text-urgent">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          {uploading && progress > 0 && (
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Uploading... {progress}%
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex gap-3 rounded-lg border border-success/20 bg-success/5 p-4">
              <CheckCircle2 className="mt-0.5 size-5 flex-shrink-0 text-success" />
              <div>
                <p className="font-medium text-success">Receipt uploaded successfully!</p>
                <p className="text-sm text-success/80">Thank you for your donation.</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full rounded-lg bg-teal px-6 py-3 font-medium text-teal-foreground transition-all hover:shadow-lg hover:shadow-teal/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Receipt'}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Your receipt is secure and will only be viewed by authorized personnel.
          </p>
        </form>
      </div>
    </Reveal>
  )
}

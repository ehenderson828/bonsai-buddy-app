"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  initialValue?: string
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
}

export function CommentForm({
  onSubmit,
  onCancel,
  initialValue = "",
  placeholder = "Write a comment...",
  submitLabel = "Comment",
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(content.trim())
      setContent("")
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const characterCount = content.length
  const maxChars = 500
  const isOverLimit = characterCount > maxChars

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        autoFocus={autoFocus}
        disabled={isSubmitting}
        className={isOverLimit ? "border-destructive" : ""}
      />
      <div className="flex items-center justify-between">
        <span className={cn("text-xs", isOverLimit ? "text-destructive" : "text-muted-foreground")}>
          {characterCount}/{maxChars}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm" disabled={!content.trim() || isOverLimit || isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

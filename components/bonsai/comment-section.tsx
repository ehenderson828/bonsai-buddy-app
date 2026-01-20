"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { CommentWithDetails } from "@/lib/supabase/types"
import { getCommentsByPost, createComment } from "@/lib/supabase/queries"
import { CommentForm } from "./comment-form"
import { CommentItem } from "./comment-item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CommentSectionProps {
  postId: string
  postOwnerId: string
  onCommentCountChange?: () => void
}

type SortOrder = "newest" | "oldest" | "most-liked"

export function CommentSection({ postId, postOwnerId, onCommentCountChange }: CommentSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<CommentWithDetails[]>([])
  const [sortedComments, setSortedComments] = useState<CommentWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  useEffect(() => {
    sortComments()
  }, [comments, sortOrder])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const data = await getCommentsByPost(postId)
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Could not load comments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sortComments = () => {
    const sorted = [...comments]

    const sortRecursive = (commentList: CommentWithDetails[]): CommentWithDetails[] => {
      return commentList
        .sort((a, b) => {
          if (sortOrder === "newest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          } else if (sortOrder === "oldest") {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          } else {
            // most-liked
            return b.likes - a.likes
          }
        })
        .map((comment) => ({
          ...comment,
          replies: comment.replies ? sortRecursive(comment.replies) : [],
        }))
    }

    setSortedComments(sortRecursive(sorted))
  }

  const handleCreateComment = async (content: string) => {
    try {
      await createComment({
        post_id: postId,
        content,
      })
      toast({
        title: "Comment posted",
      })
      await fetchComments()
      onCommentCountChange?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleCreateReply = async (content: string) => {
    if (!replyingTo) return

    try {
      await createComment({
        post_id: postId,
        content,
        parent_comment_id: replyingTo,
      })
      toast({
        title: "Reply posted",
      })
      setReplyingTo(null)
      await fetchComments()
      onCommentCountChange?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
  }

  const handleCommentUpdate = async () => {
    await fetchComments()
    onCommentCountChange?.()
  }

  const totalComments = countComments(comments)

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
        </h3>
        {totalComments > 0 && (
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="most-liked">Most liked</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {user && (
        <div>
          <CommentForm onSubmit={handleCreateComment} placeholder="Write a comment..." />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sortedComments.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No comments yet. {user ? "Be the first to comment!" : "Login to comment."}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                postOwnerId={postOwnerId}
                onReply={handleReply}
                onUpdate={handleCommentUpdate}
              />
              {replyingTo === comment.id && user && (
                <div className="ml-11 mt-2">
                  <CommentForm
                    onSubmit={handleCreateReply}
                    onCancel={() => setReplyingTo(null)}
                    placeholder={`Reply to ${comment.author?.name}...`}
                    submitLabel="Reply"
                    autoFocus
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper to count total comments including replies
function countComments(comments: CommentWithDetails[]): number {
  let count = 0
  for (const comment of comments) {
    if (!comment.is_deleted) count++
    if (comment.replies) {
      count += countComments(comment.replies)
    }
  }
  return count
}

"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Reply, Trash2, Pencil, MoreVertical } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { CommentWithDetails } from "@/lib/supabase/types"
import { likeComment, unlikeComment, updateComment, deleteComment } from "@/lib/supabase/queries"
import { CommentForm } from "./comment-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CommentItemProps {
  comment: CommentWithDetails
  postOwnerId: string
  onReply: (parentId: string) => void
  onUpdate: () => void
  depth?: number
}

export function CommentItem({ comment, postOwnerId, onReply, onUpdate, depth = 0 }: CommentItemProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(comment.is_liked || false)
  const [likesCount, setLikesCount] = useState(comment.likes)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwnComment = user && comment.user_id === user.id
  const isPostOwner = user && postOwnerId === user.id
  const canModerate = isOwnComment || isPostOwner

  const handleLike = async () => {
    if (!user) return

    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    try {
      if (isLiked) {
        await unlikeComment(comment.id)
      } else {
        await likeComment(comment.id)
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
      toast({
        title: "Error",
        description: "Could not update like. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (content: string) => {
    try {
      await updateComment(comment.id, content)
      setIsEditing(false)
      toast({
        title: "Comment updated",
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteComment(comment.id)
      toast({
        title: "Comment deleted",
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  // Soft deleted comments show placeholder
  if (comment.is_deleted) {
    return (
      <div className={cn("space-y-2", depth > 0 && "ml-8")}>
        <div className="text-sm text-muted-foreground italic">[Comment deleted]</div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postOwnerId={postOwnerId}
                onReply={onReply}
                onUpdate={onUpdate}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", depth > 0 && "ml-8")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.author?.avatar || "/placeholder.svg"} alt={comment.author?.name} />
          <AvatarFallback>{comment.author?.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{comment.author?.name || "Unknown"}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
                {comment.edited_at && <span className="text-xs text-muted-foreground italic">(edited)</span>}
              </div>

              {isEditing ? (
                <div className="mt-2">
                  <CommentForm
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    initialValue={comment.content}
                    submitLabel="Save"
                    autoFocus
                  />
                </div>
              ) : (
                <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
              )}
            </div>

            {canModerate && !isEditing && (
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwnComment && (
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-3 w-3" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will show "[Comment deleted]" but preserve the conversation thread and replies.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={!user}
                className={cn("h-6 gap-1 px-2 -ml-2", isLiked && "text-primary")}
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
                {likesCount > 0 && <span className="text-xs">{likesCount}</span>}
              </Button>

              {user && (
                <Button variant="ghost" size="sm" onClick={() => onReply(comment.id)} className="h-6 gap-1 px-2">
                  <Reply className="h-3 w-3" />
                  <span className="text-xs">Reply</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postOwnerId={postOwnerId}
              onReply={onReply}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

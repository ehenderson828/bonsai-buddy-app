"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Heart, MessageCircle, Lock, Eye, EyeOff, Trash2, MoreVertical, Pencil, Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { BonsaiPostWithDetails } from "@/lib/supabase/types"
import { formatDistanceToNow, format } from "date-fns"
import { updatePostPrivacy, deletePost, updatePost, getCommentCountByPost } from "@/lib/supabase/queries"
import { CommentSection } from "./comment-section"
import { uploadImage, validateImageFile, compressImage } from "@/lib/supabase/storage"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PostCardProps {
  post: BonsaiPostWithDetails
  onLike?: (postId: string, isLiked: boolean) => void
  onPrivacyChange?: () => void
  onDelete?: () => void
  className?: string
}

export function PostCard({ post, onLike, onPrivacyChange, onDelete, className }: PostCardProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [isPublic, setIsPublic] = useState(post.is_public)
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Comment section state
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(post.comments || 0)

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editCaption, setEditCaption] = useState(post.caption || "")
  const [editIsPublic, setEditIsPublic] = useState(post.is_public)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const isOwnPost = user && post.user_id === user.id

  const handleLike = () => {
    if (!isAuthenticated) return

    // Optimistic UI update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    onLike?.(post.id, isLiked)
  }

  const handlePrivacyToggle = async (checked: boolean) => {
    if (!isOwnPost) return

    setIsUpdatingPrivacy(true)
    try {
      await updatePostPrivacy(post.id, checked)
      setIsPublic(checked)
      toast({
        title: checked ? "Post is now public" : "Post is now private",
        description: checked
          ? "This post will appear in the community feed"
          : "This post is now only visible to you",
      })
      onPrivacyChange?.()
    } catch (error) {
      console.error("Error updating post privacy:", error)
      toast({
        title: "Error",
        description: "Failed to update post privacy",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPrivacy(false)
    }
  }

  const handleDelete = async () => {
    if (!isOwnPost) return

    setIsDeleting(true)
    try {
      await deletePost(post.id)
      toast({
        title: "Post deleted",
        description: "Your post has been permanently deleted",
      })
      onDelete?.()
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast({
          title: "Invalid image",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      setEditImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditSubmit = async () => {
    if (!isOwnPost || !user) return

    setIsUpdating(true)
    try {
      const updates: { image_url?: string; caption?: string; is_public?: boolean } = {
        caption: editCaption,
        is_public: editIsPublic,
      }

      // Upload new image if changed
      if (editImageFile) {
        toast({
          title: "Uploading image...",
          description: "Please wait while we upload your image",
        })
        const compressedImage = await compressImage(editImageFile)
        const imageUrl = await uploadImage(compressedImage, user.id)
        updates.image_url = imageUrl
      }

      await updatePost(post.id, updates)

      toast({
        title: "Post updated!",
        description: "Your post has been successfully updated",
      })

      setIsEditDialogOpen(false)
      onPrivacyChange?.() // Refresh to show updates
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const refreshCommentCount = async () => {
    try {
      const count = await getCommentCountByPost(post.id)
      setCommentCount(count)
    } catch (error) {
      console.error("Error refreshing comment count:", error)
    }
  }

  const handleToggleComments = () => {
    if (!isPublic) return // No comments on private posts
    setShowComments(!showComments)
  }

  const ownerName = post.owner?.name || "Unknown"
  const ownerAvatar = post.owner?.avatar || undefined
  const specimenName = post.specimen?.name || "Bonsai"
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
  const isPrivateAccount = post.owner?.is_private || false

  return (
    <Card className={cn("overflow-hidden", !isPublic && "bg-card/60 dark:bg-card/40", className)}>
      <CardContent className="p-0">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ownerAvatar || "/placeholder.svg"} alt={ownerName} />
              <AvatarFallback>{ownerName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link href={`/user/${post.user_id}`} className="font-semibold text-sm hover:underline flex items-center gap-1">
                {ownerName}
                {isPrivateAccount && <Lock className="h-3 w-3 text-muted-foreground" />}
              </Link>
              <p className="text-xs text-muted-foreground">
                {timeAgo}
                {isOwnPost && post.edited_at && (
                  <span className="ml-1">
                    • Edited on {format(new Date(post.edited_at), "MMM d, yyyy")}
                  </span>
                )}
              </p>
            </div>
            {isOwnPost && (
              <>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DialogTrigger asChild>
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Post
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Post
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post from the community feed.
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
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Post</DialogTitle>
                      <DialogDescription>Update your post details below</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Image upload */}
                      <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="flex items-center gap-4">
                          {editImagePreview || post.image_url ? (
                            <div className="relative">
                              <img
                                src={editImagePreview || post.image_url || "/placeholder.svg"}
                                alt="Preview"
                                className="h-32 w-32 object-cover rounded-lg"
                              />
                              {editImagePreview && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={() => {
                                    setEditImagePreview(null)
                                    setEditImageFile(null)
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ) : null}
                          <label
                            htmlFor="edit-image"
                            className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary"
                          >
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="mt-2 text-xs text-muted-foreground">
                              {editImagePreview ? "Change" : "Upload new"}
                            </span>
                          </label>
                          <Input
                            id="edit-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleEditImageChange}
                          />
                        </div>
                      </div>

                      {/* Caption */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-caption">Caption</Label>
                        <Textarea
                          id="edit-caption"
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          placeholder="Add a caption to your post..."
                          rows={4}
                        />
                      </div>

                      {/* Privacy */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-privacy" className="text-base font-semibold">
                          Post Privacy
                        </Label>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label htmlFor="edit-privacy" className="font-medium cursor-pointer">
                              {editIsPublic ? "Public Post" : "Private Post"}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {editIsPublic
                                ? "This post will appear in the community feed"
                                : "This post will only be visible to you"}
                            </p>
                          </div>
                          <Switch
                            id="edit-privacy"
                            checked={editIsPublic}
                            onCheckedChange={setEditIsPublic}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEditSubmit} disabled={isUpdating}>
                        {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {isUpdating ? "Updating..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        <Link href={`/specimen/${post.specimen_id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={post.image_url || "/placeholder.svg"}
              alt={specimenName}
              fill
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </Link>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn("gap-2 px-2", isLiked && "text-destructive")}
              onClick={handleLike}
              disabled={!isAuthenticated}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              <span className="text-sm font-medium">{likesCount}</span>
            </Button>
            {isPublic && (
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2 px-2", showComments && "text-primary")}
                onClick={handleToggleComments}
              >
                <MessageCircle className={cn("h-5 w-5", showComments && "fill-current")} />
                <span className="text-sm font-medium">{commentCount}</span>
              </Button>
            )}
          </div>

          <div>
            <Link href={`/specimen/${post.specimen_id}`} className="font-semibold text-sm hover:underline">
              {specimenName}
            </Link>
            {post.caption && <p className="text-sm text-muted-foreground mt-1 text-balance">{post.caption}</p>}
          </div>

          {showComments && isPublic && (
            <CommentSection
              postId={post.id}
              postOwnerId={post.user_id}
              onCommentCountChange={refreshCommentCount}
            />
          )}

          {isOwnPost && (
            <div className="flex items-center justify-between pt-3 mt-3 border-t">
              <div className="flex items-center gap-2">
                <Label htmlFor={`privacy-${post.id}`} className="text-sm font-medium cursor-pointer">
                  {isPublic ? (
                    <>
                      <Eye className="h-4 w-4 inline mr-1" />
                      Public
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 inline mr-1" />
                      Private
                    </>
                  )}
                </Label>
              </div>
              <Switch
                id={`privacy-${post.id}`}
                checked={isPublic}
                onCheckedChange={handlePrivacyToggle}
                disabled={isUpdatingPrivacy}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/auth-provider"
import type { BonsaiPostWithDetails } from "@/lib/supabase/types"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: BonsaiPostWithDetails
  onLike?: (postId: string, isLiked: boolean) => void
  className?: string
}

export function PostCard({ post, onLike, className }: PostCardProps) {
  const { isAuthenticated } = useAuth()
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    if (!isAuthenticated) return

    // Optimistic UI update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    onLike?.(post.id, isLiked)
  }

  const ownerName = post.owner?.name || "Unknown"
  const ownerAvatar = post.owner?.avatar || undefined
  const specimenName = post.specimen?.name || "Bonsai"
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={ownerAvatar || "/placeholder.svg"} alt={ownerName} />
              <AvatarFallback>{ownerName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link href={`/user/${post.user_id}`} className="font-semibold text-sm hover:underline">
                {ownerName}
              </Link>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
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
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <MessageCircle className="h-5 w-5" />
              {post.comments !== undefined && <span className="text-sm font-medium">{post.comments}</span>}
            </Button>
          </div>

          <div>
            <Link href={`/specimen/${post.specimen_id}`} className="font-semibold text-sm hover:underline">
              {specimenName}
            </Link>
            {post.caption && <p className="text-sm text-muted-foreground mt-1 text-balance">{post.caption}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

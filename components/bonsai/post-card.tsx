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

export interface BonsaiPost {
  id: string
  specimenId: string
  specimenName: string
  imageUrl: string
  caption?: string
  owner: string
  ownerId: string
  ownerAvatar?: string
  likes: number
  isLiked: boolean
  timestamp: string
  comments?: number
}

interface PostCardProps {
  post: BonsaiPost
  onLike?: (postId: string) => void
  className?: string
}

export function PostCard({ post, onLike, className }: PostCardProps) {
  const { isAuthenticated } = useAuth()
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likes)

  const handleLike = () => {
    if (!isAuthenticated) return

    // Optimistic UI update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)

    onLike?.(post.id)
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.ownerAvatar || "/placeholder.svg"} alt={post.owner} />
              <AvatarFallback>{post.owner[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link href={`/user/${post.ownerId}`} className="font-semibold text-sm hover:underline">
                {post.owner}
              </Link>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>
        </div>

        <Link href={`/specimen/${post.specimenId}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.specimenName}
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
            <Link href={`/specimen/${post.specimenId}`} className="font-semibold text-sm hover:underline">
              {post.specimenName}
            </Link>
            {post.caption && <p className="text-sm text-muted-foreground mt-1 text-balance">{post.caption}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

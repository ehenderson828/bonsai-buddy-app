"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PostCard } from "@/components/bonsai/post-card"
import { getAllPosts, likePost, unlikePost } from "@/lib/supabase/queries"
import type { BonsaiPostWithDetails } from "@/lib/supabase/types"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { BonsaiLogo } from "@/components/ui/bonsai-logo"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<BonsaiPostWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      fetchPosts()
    }
  }, [authLoading])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getAllPosts()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error loading posts",
        description: "Could not load the community feed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      if (isLiked) {
        await unlikePost(postId)
      } else {
        await likePost(postId)
      }

      // Refresh posts to get updated like count
      await fetchPosts()
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Could not update like. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {!isAuthenticated && (
          <section className="border-b border-border/50 bg-card/30 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <div className="flex justify-center">
                  <BonsaiLogo className="h-[72px] w-[72px] text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-balance">Welcome to Bonsai Buddy</h1>
                <p className="text-lg text-muted-foreground text-balance">
                  Join a thriving community of bonsai enthusiasts. Track your collection, share updates, and learn from
                  fellow cultivators.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button size="lg" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                {isAuthenticated ? "Recent Updates" : "Community Feed"}
              </h2>
              {isAuthenticated && (
                <Button asChild>
                  <Link href="/profile/add">Share Update</Link>
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <p className="text-muted-foreground">No posts yet. Be the first to share your bonsai!</p>
                  {isAuthenticated && (
                    <Button asChild>
                      <Link href="/profile/add">Share Your Bonsai</Link>
                    </Button>
                  )}
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onLike={handleLike} onPrivacyChange={fetchPosts} onDelete={fetchPosts} />
                ))
              )}
            </div>

            {!isAuthenticated && posts.length > 0 && (
              <div className="bg-card/50 border border-border rounded-lg p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">Want to like posts and share your own bonsai journey?</p>
                <Button asChild>
                  <Link href="/signup">Create an Account</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

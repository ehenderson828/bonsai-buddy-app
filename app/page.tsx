"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PostCard } from "@/components/bonsai/post-card"
import { mockPosts } from "@/lib/mock-data"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sprout } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  const handleLike = (postId: string) => {
    console.log("[v0] Liked post:", postId)
    // In a real app, this would call an API
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
                  <Sprout className="h-12 w-12 text-primary" />
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
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>

            {!isAuthenticated && mockPosts.length > 0 && (
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

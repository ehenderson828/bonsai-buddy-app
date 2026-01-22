"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BonsaiSpecimenCard } from "@/components/bonsai/bonsai-specimen-card"
import { PostCard } from "@/components/bonsai/post-card"
import { getProfile, getSpecimensByUser, getPostsByUser, likePost, unlikePost } from "@/lib/supabase/queries"
import type { Profile, BonsaiSpecimen, BonsaiPostWithDetails } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Lock, Loader2, User } from "lucide-react"
import { BonsaiLogo } from "@/components/ui/bonsai-logo"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentUser, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [specimens, setSpecimens] = useState<BonsaiSpecimen[]>([])
  const [posts, setPosts] = useState<BonsaiPostWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params.id as string

  useEffect(() => {
    // If viewing own profile, redirect to /profile
    if (currentUser && currentUser.id === userId) {
      router.replace("/profile")
      return
    }

    fetchUserData()
  }, [userId, currentUser])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const profileData = await getProfile(userId)
      setProfile(profileData)

      // If account is private, don't fetch specimens/posts
      if (profileData.is_private) {
        setSpecimens([])
        setPosts([])
        return
      }

      const [specimensData, postsData] = await Promise.all([
        getSpecimensByUser(userId),
        getPostsByUser(userId),
      ])

      setSpecimens(specimensData)
      // Only show public posts
      setPosts(postsData.filter((p: any) => p.is_public))
    } catch (err: any) {
      console.error("Error fetching user data:", err)
      setError("User not found")
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
      const postsData = await getPostsByUser(userId)
      setPosts(postsData.filter((p: any) => p.is_public))
    } catch (err) {
      console.error("Error liking post:", err)
      toast({
        title: "Error",
        description: "Could not update like. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <User className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">User not found</h2>
            <p className="text-muted-foreground">This user doesn't exist or has been removed.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const totalAge = specimens.reduce((sum, s) => sum + s.age, 0)
  const avgAge = specimens.length > 0 ? Math.round(totalAge / specimens.length) : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Back button */}
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-auto">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  {profile.name}
                  {profile.is_private && <Lock className="h-5 w-5 text-muted-foreground" />}
                </h1>
              </div>

              {/* Stats - only show if not private */}
              {!profile.is_private && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 pb-4 text-center">
                      <BonsaiLogo className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{specimens.length}</div>
                      <div className="text-xs text-muted-foreground">Bonsai Trees</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 pb-4 text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{avgAge}</div>
                      <div className="text-xs text-muted-foreground">Avg. Age (years)</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 pb-4 text-center">
                      <BonsaiLogo className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{posts.length}</div>
                      <div className="text-xs text-muted-foreground">Public Posts</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Private Account Message */}
          {profile.is_private ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">This Account is Private</h3>
                <p className="text-muted-foreground">
                  This user has chosen to keep their profile and bonsai collection private.
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Tabs for Collection and Posts */
            <Tabs defaultValue="collection" className="space-y-6">
              <TabsList>
                <TabsTrigger value="collection">Collection</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="collection">
                {specimens.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BonsaiLogo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {profile.name} hasn't added any bonsai to their collection yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specimens.map((specimen) => (
                      <BonsaiSpecimenCard key={specimen.id} specimen={specimen} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="posts">
                {posts.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BonsaiLogo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {profile.name} hasn't shared any public posts yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="max-w-2xl space-y-6">
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

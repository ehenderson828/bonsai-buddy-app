"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BonsaiSpecimenCard } from "@/components/bonsai/bonsai-specimen-card"
import { getSpecimensByUser, getPostsByUser } from "@/lib/supabase/queries"
import type { BonsaiSpecimen, BonsaiPost } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Calendar, Heart, Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { BonsaiLogo } from "@/components/ui/bonsai-logo"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [specimens, setSpecimens] = useState<BonsaiSpecimen[]>([])
  const [posts, setPosts] = useState<BonsaiPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      fetchData()
    } else if (!authLoading && !isAuthenticated) {
      redirect("/login")
    }
  }, [authLoading, isAuthenticated, user])

  const fetchData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const [specimensData, postsData] = await Promise.all([
        getSpecimensByUser(user.id),
        getPostsByUser(user.id),
      ])
      setSpecimens(specimensData)
      setPosts(postsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error loading data",
        description: "Could not load your profile data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalAge = specimens.reduce((sum, s) => sum + s.age, 0)
  const avgAge = specimens.length > 0 ? Math.round(totalAge / specimens.length) : 0
  const publicPosts = posts.filter((p) => p.is_public).length
  const privatePosts = posts.filter((p) => !p.is_public).length

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-auto">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-2xl">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  {user?.name}
                  {user?.is_private && <Lock className="h-5 w-5 text-muted-foreground" />}
                </h1>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                    <Heart className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {specimens.filter((s) => s.health === "excellent").length}
                    </div>
                    <div className="text-xs text-muted-foreground">Excellent Health</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 pb-4 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{totalAge}</div>
                    <div className="text-xs text-muted-foreground">Total Years</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 pb-4 text-center">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{publicPosts}</div>
                    <div className="text-xs text-muted-foreground">Public Posts</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 pb-4 text-center">
                    <EyeOff className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{privatePosts}</div>
                    <div className="text-xs text-muted-foreground">Private Posts</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">My Bonsai Collection</h2>
              <Button asChild>
                <Link href="/profile/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bonsai
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : specimens.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {specimens.map((specimen) => (
                  <BonsaiSpecimenCard key={specimen.id} specimen={specimen} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <BonsaiLogo className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">No bonsai yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Add your first bonsai to start tracking your collection
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/profile/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Bonsai
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

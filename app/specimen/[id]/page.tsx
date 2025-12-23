"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSpecimenById, getPostsBySpecimen, subscribeToSpecimen, unsubscribeFromSpecimen, isSubscribedToSpecimen } from "@/lib/supabase/queries"
import type { BonsaiSpecimenWithOwner, BonsaiPostWithDetails } from "@/lib/supabase/types"
import { useAuth } from "@/components/providers/auth-provider"
import { ArrowLeft, Bell, BellOff, Heart, Calendar, Activity, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

export default function SpecimenDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [specimen, setSpecimen] = useState<BonsaiSpecimenWithOwner | null>(null)
  const [posts, setPosts] = useState<BonsaiPostWithDetails[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    fetchSpecimenData()
  }, [params.id])

  useEffect(() => {
    if (user && specimen) {
      checkSubscription()
    }
  }, [user, specimen])

  const fetchSpecimenData = async () => {
    try {
      setIsLoading(true)
      const [specimenData, postsData] = await Promise.all([
        getSpecimenById(params.id as string),
        getPostsBySpecimen(params.id as string),
      ])
      setSpecimen(specimenData)
      setPosts(postsData)
    } catch (error) {
      console.error("Error fetching specimen:", error)
      toast({
        title: "Error",
        description: "Could not load bonsai details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkSubscription = async () => {
    if (!user || !specimen) return
    try {
      const subscribed = await isSubscribedToSpecimen(specimen.id)
      setIsSubscribed(subscribed)
    } catch (error) {
      console.error("Error checking subscription:", error)
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated || !specimen) {
      router.push("/login")
      return
    }

    setIsSubscribing(true)
    try {
      if (isSubscribed) {
        await unsubscribeFromSpecimen(specimen.id)
        setIsSubscribed(false)
        toast({
          title: "Unsubscribed",
          description: `You will no longer receive updates about ${specimen.name}`,
        })
      } else {
        await subscribeToSpecimen(specimen.id)
        setIsSubscribed(true)
        toast({
          title: "Subscribed!",
          description: `You'll receive updates when ${specimen.name} is updated`,
        })
      }
    } catch (error: any) {
      console.error("Error toggling subscription:", error)
      toast({
        title: "Error",
        description: error.message || "Could not update subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubscribing(false)
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

  if (!specimen) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold">Bonsai not found</h2>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const healthConfig = {
    excellent: { label: "Excellent", className: "bg-primary/20 text-primary border-primary/30" },
    good: { label: "Good", className: "bg-accent/20 text-accent border-accent/30" },
    fair: { label: "Fair", className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
    "needs-attention": { label: "Needs Care", className: "bg-destructive/20 text-destructive border-destructive/30" },
  }

  const healthInfo = healthConfig[specimen.health]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={specimen.image_url || "/placeholder.svg"}
                  alt={specimen.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {posts.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.specimen?.name || "Bonsai"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-balance">{specimen.name}</h1>
                    <p className="text-lg text-muted-foreground">{specimen.species}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-sm px-3 py-1", healthInfo.className)}>
                    {healthInfo.label}
                  </Badge>
                </div>

                <Link href={`/user/${specimen.user_id}`} className="flex items-center gap-3 group">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={specimen.owner?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{specimen.owner?.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium group-hover:underline">{specimen.owner?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">Owner</p>
                  </div>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{specimen.age}</div>
                        <div className="text-xs text-muted-foreground">Years Old</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{posts.length}</div>
                        <div className="text-xs text-muted-foreground">Updates</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleSubscribe}
                variant={isSubscribed ? "outline" : "default"}
                className="w-full gap-2"
                disabled={!isAuthenticated || isSubscribing}
              >
                {isSubscribed ? (
                  <>
                    <BellOff className="h-4 w-4" />
                    Unsubscribe
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    Subscribe to Updates
                  </>
                )}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-center text-muted-foreground">
                  <Link href="/login" className="text-primary hover:underline">
                    Login
                  </Link>{" "}
                  to subscribe to updates
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Update Timeline</h2>
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 aspect-square shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={post.image_url || "/placeholder.svg"}
                            alt={post.specimen?.name || "Bonsai"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                              </p>
                              {post.caption && <p className="mt-2 text-balance">{post.caption}</p>}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No updates yet for this bonsai</p>
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

"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BonsaiSpecimenCard } from "@/components/bonsai/bonsai-specimen-card"
import { mockSpecimens } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Sprout, Calendar, Heart } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect("/login")
  }

  const userSpecimens = mockSpecimens.filter((s) => s.ownerId === user?.id)
  const totalAge = userSpecimens.reduce((sum, s) => sum + s.age, 0)
  const avgAge = userSpecimens.length > 0 ? Math.round(totalAge / userSpecimens.length) : 0

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
                <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 pb-4 text-center">
                    <Sprout className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{userSpecimens.length}</div>
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
                      {userSpecimens.filter((s) => s.health === "excellent").length}
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

            {userSpecimens.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userSpecimens.map((specimen) => (
                  <BonsaiSpecimenCard key={specimen.id} specimen={specimen} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <Sprout className="h-12 w-12 text-muted-foreground" />
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

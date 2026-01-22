"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BonsaiSpecimenCard } from "@/components/bonsai/bonsai-specimen-card"
import { getAllSpecimens, searchSpecimens, searchUsers } from "@/lib/supabase/queries"
import type { BonsaiSpecimenWithOwner, Profile } from "@/lib/supabase/types"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Search, Loader2, User } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const { toast } = useToast()
  const [query, setQuery] = useState(queryParam)
  const [specimenResults, setSpecimenResults] = useState<BonsaiSpecimenWithOwner[]>([])
  const [userResults, setUserResults] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("bonsai")

  useEffect(() => {
    fetchResults()
  }, [query])

  const fetchResults = async () => {
    try {
      setIsLoading(true)

      if (query.trim()) {
        // Search both specimens and users in parallel
        const [specimens, users] = await Promise.all([
          searchSpecimens(query),
          searchUsers(query),
        ])
        setSpecimenResults(specimens)
        setUserResults(users)
      } else {
        // No query - just get all specimens, no users
        const specimens = await getAllSpecimens()
        setSpecimenResults(specimens)
        setUserResults([])
      }
    } catch (error) {
      console.error("Error searching:", error)
      toast({
        title: "Error searching",
        description: "Could not complete search. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Search</h1>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bonsai or users..."
                className="pl-10 h-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="bonsai">
                Bonsai {specimenResults.length > 0 && `(${specimenResults.length})`}
              </TabsTrigger>
              <TabsTrigger value="users">
                Users {userResults.length > 0 && `(${userResults.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bonsai" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {specimenResults.length} {specimenResults.length === 1 ? "bonsai" : "bonsai"}
                {query && ` matching "${query}"`}
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : specimenResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {specimenResults.map((specimen) => (
                    <BonsaiSpecimenCard key={specimen.id} specimen={specimen} showOwner={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {query ? "No bonsai found matching your search." : "Search for bonsai by name or species."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {userResults.length} {userResults.length === 1 ? "user" : "users"}
                {query && ` matching "${query}"`}
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !query ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Enter a name to search for users.</p>
                </div>
              ) : userResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userResults.map((user) => (
                    <Link key={user.id} href={`/user/${user.id}`}>
                      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar || undefined} alt={user.name} />
                            <AvatarFallback>
                              {user.name?.[0]?.toUpperCase() || <User className="h-5 w-5" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground">View profile</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No users found matching "{query}".</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

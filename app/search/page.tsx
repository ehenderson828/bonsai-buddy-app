"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BonsaiSpecimenCard } from "@/components/bonsai/bonsai-specimen-card"
import { mockSpecimens } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const [query, setQuery] = useState(queryParam)
  const [results, setResults] = useState(mockSpecimens)

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockSpecimens.filter(
        (specimen) =>
          specimen.name.toLowerCase().includes(query.toLowerCase()) ||
          specimen.species.toLowerCase().includes(query.toLowerCase()) ||
          specimen.owner.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
    } else {
      setResults(mockSpecimens)
    }
  }, [query])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Search Bonsai</h1>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, species, or owner..."
                className="pl-10 h-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "result" : "results"}
              {query && ` for "${query}"`}
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((specimen) => (
                  <BonsaiSpecimenCard key={specimen.id} specimen={specimen} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bonsai found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

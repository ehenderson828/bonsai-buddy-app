"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { redirect } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Loader2 } from "lucide-react"
import { createSpecimen, createPost } from "@/lib/supabase/queries"
import { uploadImage, validateImageFile, compressImage } from "@/lib/supabase/storage"
import type { HealthStatus } from "@/lib/supabase/types"

export default function AddBonsaiPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [health, setHealth] = useState<HealthStatus>("good")
  const [isPublic, setIsPublic] = useState(true)

  if (!isAuthenticated) {
    redirect("/login")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast({
          title: "Invalid image",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("name") as string
      const species = formData.get("species") as string
      const age = parseInt(formData.get("age") as string)
      const careNotes = formData.get("notes") as string

      // Validate image
      if (!imageFile) {
        toast({
          title: "Image required",
          description: "Please upload an image of your bonsai",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Compress and upload image
      toast({
        title: "Uploading image...",
        description: "Please wait while we upload your image",
      })

      const compressedImage = await compressImage(imageFile)
      const imageUrl = await uploadImage(compressedImage, user.id)

      // Create specimen
      const specimen = await createSpecimen({
        name,
        species,
        age,
        health,
        image_url: imageUrl,
        care_notes: careNotes || undefined,
      })

      // Create associated post with auto-generated caption
      const caption = `Just added ${name} (${species}) to my collection!`
      await createPost({
        specimen_id: specimen.id,
        image_url: imageUrl,
        caption,
        is_public: isPublic,
      })

      toast({
        title: "Bonsai added!",
        description: isPublic
          ? "Your bonsai has been added to your collection and shared with the community."
          : "Your bonsai has been added to your collection (private).",
      })

      router.push("/profile")
    } catch (error: any) {
      console.error("Error adding bonsai:", error)
      toast({
        title: "Failed to add bonsai",
        description: error.message || "Could not add bonsai. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Add New Bonsai</CardTitle>
              <CardDescription>Share your bonsai specimen with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => setImagePreview(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="image"
                        className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-xs text-muted-foreground">Upload</span>
                      </label>
                    )}
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Bonsai Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Ancient Pine" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                  <Input id="species" name="species" placeholder="e.g., Japanese Black Pine" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input id="age" name="age" type="number" min="1" placeholder="e.g., 15" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="health">Health Status</Label>
                  <Select value={health} onValueChange={(value) => setHealth(value as HealthStatus)}>
                    <SelectTrigger id="health">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="needs-attention">Needs Attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Care Notes (Optional)</Label>
                  <Textarea id="notes" name="notes" placeholder="Share any care tips or notes about this bonsai..." rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy" className="text-base font-semibold">Post Privacy</Label>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="privacy" className="font-medium cursor-pointer">
                        {isPublic ? "Public Post" : "Private Post"}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {isPublic
                          ? "This post will appear in the community feed"
                          : "This post will only be visible to you"}
                      </p>
                    </div>
                    <Switch id="privacy" checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isLoading ? "Adding..." : "Add Bonsai"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

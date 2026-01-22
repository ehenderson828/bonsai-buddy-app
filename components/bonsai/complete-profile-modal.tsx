"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, User } from "lucide-react"
import { uploadAvatar, compressAvatar, validateImageFile } from "@/lib/supabase/storage"
import { updateProfile } from "@/lib/supabase/queries"

const DISMISSED_KEY = "bonsai_profile_prompt_dismissed"

export function CompleteProfileModal() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    // Check if we should show the modal
    if (isAuthenticated && user) {
      const wasDismissed = localStorage.getItem(DISMISSED_KEY)
      const hasNoAvatar = !user.avatar

      // Show modal if user has no avatar and hasn't dismissed
      if (hasNoAvatar && !wasDismissed) {
        // Small delay to let the page load first
        const timer = setTimeout(() => setIsOpen(true), 500)
        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated, user])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      toast({
        title: "Invalid image",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSkip = () => {
    localStorage.setItem(DISMISSED_KEY, "true")
    setIsOpen(false)
  }

  const handleSave = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)
    try {
      const compressedFile = await compressAvatar(selectedFile)
      const avatarUrl = await uploadAvatar(compressedFile, user.id)
      await updateProfile(user.id, { avatar: avatarUrl })

      // Mark as completed so modal doesn't show again
      localStorage.setItem(DISMISSED_KEY, "true")

      toast({
        title: "Profile picture saved!",
        description: "Your profile is now complete",
      })

      setIsOpen(false)

      // Reload to update avatar in navbar
      window.location.reload()
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload failed",
        description: "Could not save profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (!isAuthenticated || !user) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Add a profile picture so other bonsai enthusiasts can recognize you!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={previewUrl || undefined} alt={user.name} />
              <AvatarFallback className="text-4xl">
                {user.name?.[0]?.toUpperCase() || <User className="h-12 w-12" />}
              </AvatarFallback>
            </Avatar>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <Label htmlFor="profile-photo" className="sr-only">
              Choose profile photo
            </Label>
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById("profile-photo")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {previewUrl ? "Choose Different Photo" : "Choose Photo"}
            </Button>
            <Input
              id="profile-photo"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, or WebP. Max 5MB.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isUploading}
            className="sm:order-first"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedFile || isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile Picture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

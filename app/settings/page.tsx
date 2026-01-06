"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Moon, Sun, Mail, Bell, Lock } from "lucide-react"
import {
  getUserPreferences,
  updateUserTheme,
  updateEmailPreferences,
  updateNotificationSettings,
  updateAccountPrivacy,
} from "@/lib/supabase/queries"
import type { EmailPreferences, NotificationSettings } from "@/lib/supabase/types"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Preferences state
  const [emailPrefs, setEmailPrefs] = useState<EmailPreferences>({
    marketing: false,
    updates: true,
    community: true,
    weekly_digest: false,
  })

  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
    post_likes: true,
    new_followers: true,
    comments: true,
    specimen_subscriptions: true,
  })

  const [isPrivate, setIsPrivate] = useState(false)

  // Load user preferences
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      loadPreferences()
    }
  }, [user, isAuthenticated, authLoading, router])

  const loadPreferences = async () => {
    if (!user) return

    try {
      const prefs = await getUserPreferences(user.id)
      if (prefs) {
        setEmailPrefs(prefs.email_preferences)
        setNotifSettings(prefs.notification_settings)
        setIsPrivate(prefs.is_private)
      }
    } catch (error) {
      console.error("Error loading preferences:", error)
      toast({
        title: "Error",
        description: "Failed to load your preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    if (!user) return

    setTheme(newTheme)

    try {
      await updateUserTheme(user.id, newTheme)
      toast({
        title: "Theme updated",
        description: `Switched to ${newTheme} mode`,
      })
    } catch (error) {
      console.error("Error updating theme:", error)
      toast({
        title: "Error",
        description: "Failed to save theme preference",
        variant: "destructive",
      })
    }
  }

  const handleEmailPrefChange = async (key: keyof EmailPreferences, value: boolean) => {
    if (!user) return

    const newPrefs = { ...emailPrefs, [key]: value }
    setEmailPrefs(newPrefs)

    setIsSaving(true)
    try {
      await updateEmailPreferences(user.id, newPrefs)
      toast({
        title: "Email preferences updated",
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error("Error updating email preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save email preferences",
        variant: "destructive",
      })
      // Revert on error
      setEmailPrefs(emailPrefs)
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotifChange = async (key: keyof NotificationSettings, value: boolean) => {
    if (!user) return

    const newSettings = { ...notifSettings, [key]: value }
    setNotifSettings(newSettings)

    setIsSaving(true)
    try {
      await updateNotificationSettings(user.id, newSettings)
      toast({
        title: "Notification settings updated",
        description: "Your changes have been saved",
      })
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      })
      // Revert on error
      setNotifSettings(notifSettings)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrivacyChange = async (value: boolean) => {
    if (!user) return

    setIsPrivate(value)

    setIsSaving(true)
    try {
      await updateAccountPrivacy(user.id, value)
      toast({
        title: "Privacy setting updated",
        description: value ? "Your account is now private" : "Your account is now public",
      })
    } catch (error) {
      console.error("Error updating privacy:", error)
      toast({
        title: "Error",
        description: "Failed to save privacy setting",
        variant: "destructive",
      })
      // Revert on error
      setIsPrivate(!value)
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <BackButton />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize how Bonsai Buddy looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  disabled={isSaving}
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  disabled={isSaving}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Preferences</CardTitle>
            </div>
            <CardDescription>
              Choose which emails you want to receive from Bonsai Buddy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive promotional content and special offers
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={emailPrefs.marketing}
                onCheckedChange={(checked) => handleEmailPrefChange("marketing", checked)}
                disabled={isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-updates">Product Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Stay informed about new features and improvements
                </p>
              </div>
              <Switch
                id="email-updates"
                checked={emailPrefs.updates}
                onCheckedChange={(checked) => handleEmailPrefChange("updates", checked)}
                disabled={isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-community">Community Activity</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about community highlights and trending posts
                </p>
              </div>
              <Switch
                id="email-community"
                checked={emailPrefs.community}
                onCheckedChange={(checked) => handleEmailPrefChange("community", checked)}
                disabled={isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-digest">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your collection and activity
                </p>
              </div>
              <Switch
                id="email-digest"
                checked={emailPrefs.weekly_digest}
                onCheckedChange={(checked) => handleEmailPrefChange("weekly_digest", checked)}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>
              Manage your in-app notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-likes">Post Likes</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone likes your posts
                </p>
              </div>
              <Switch
                id="notif-likes"
                checked={notifSettings.post_likes}
                onCheckedChange={(checked) => handleNotifChange("post_likes", checked)}
                disabled={isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-followers">New Followers</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone follows you
                </p>
              </div>
              <Switch
                id="notif-followers"
                checked={notifSettings.new_followers}
                onCheckedChange={(checked) => handleNotifChange("new_followers", checked)}
                disabled={isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-comments">Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone comments on your posts
                </p>
              </div>
              <Switch
                id="notif-comments"
                checked={notifSettings.comments}
                onCheckedChange={(checked) => handleNotifChange("comments", checked)}
                disabled={isSaving}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-subscriptions">Specimen Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about updates to specimens you follow
                </p>
              </div>
              <Switch
                id="notif-subscriptions"
                checked={notifSettings.specimen_subscriptions}
                onCheckedChange={(checked) => handleNotifChange("specimen_subscriptions", checked)}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Privacy</CardTitle>
            </div>
            <CardDescription>
              Control who can see your profile and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="private-account">Private Account</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile and collection visible only to you
                </p>
              </div>
              <Switch
                id="private-account"
                checked={isPrivate}
                onCheckedChange={handlePrivacyChange}
                disabled={isSaving}
              />
            </div>
            {isPrivate && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  🔒 Your account is private. Your profile and bonsai collection are only visible to you.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

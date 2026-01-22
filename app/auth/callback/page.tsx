"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { BonsaiLogo } from "@/components/ui/bonsai-logo"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash (Supabase sets this)
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/login?error=auth_failed")
          return
        }

        if (session?.user) {
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .single()

          // If profile doesn't exist, create it from OAuth data
          if (profileError && profileError.code === "PGRST116") {
            const { user } = session
            const name = user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        user.email?.split("@")[0] ||
                        "User"
            const avatar = user.user_metadata?.avatar_url ||
                          user.user_metadata?.picture ||
                          null

            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: user.id,
                  name,
                  email: user.email,
                  avatar,
                  is_private: false,
                },
              ])

            if (insertError) {
              console.error("Error creating profile:", insertError)
            }
          }

          // Redirect to home page
          router.push("/")
        } else {
          // No session, redirect to login
          router.push("/login")
        }
      } catch (error) {
        console.error("Callback error:", error)
        router.push("/login?error=callback_failed")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <BonsaiLogo className="h-12 w-12 mx-auto text-primary animate-pulse" />
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-muted-foreground">Completing sign in...</span>
        </div>
      </div>
    </div>
  )
}

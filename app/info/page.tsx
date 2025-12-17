import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Sprout, Users, Heart, Bell } from "lucide-react"

export default function InfoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Sprout className="h-12 w-12 mx-auto text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-balance">About Bonsai Buddy</h1>
            <p className="text-lg text-muted-foreground text-balance">
              A modern platform dedicated to helping bonsai enthusiasts track, manage, and share their precious
              collections with a passionate community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Community Driven</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Connect with fellow bonsai enthusiasts, share your journey, and learn from experienced cultivators
                  around the world.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Sprout className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Track Your Collection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Maintain detailed records of each bonsai including species, age, health status, and care notes all in
                  one place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Heart className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Share & Inspire</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Post updates about your bonsai's growth, styling sessions, and seasonal changes to inspire and educate
                  others.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Bell className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Stay Updated</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Subscribe to specific bonsai specimens and receive updates when your favorite trees reach new
                  milestones.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-center">The Art of Bonsai</h2>
            <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Bonsai is the ancient Japanese art of growing miniature trees in containers, combining horticultural
                techniques with aesthetic principles to create living sculptures that capture the essence of nature.
              </p>
              <p>
                At Bonsai Buddy, we believe that every tree has a story, and every cultivator is both student and
                teacher. Whether you're just beginning your bonsai journey or you've been practicing for decades, our
                platform provides the tools to document your progress and share your wisdom with the community.
              </p>
              <p>
                Join us in celebrating the patience, dedication, and artistry that makes bonsai cultivation such a
                rewarding practice.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

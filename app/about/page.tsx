import type { Metadata } from "next"
import { BackButton } from "@/components/ui/back-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sprout, Users, Search, Bell, Camera, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "About | Bonsai Buddy",
  description: "Learn about Bonsai Buddy - A platform for bonsai enthusiasts to track their collections and connect with the community",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <BackButton />
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Bonsai Buddy</h1>
          <p className="text-xl text-muted-foreground">
            Your companion for tracking, managing, and sharing your bonsai journey with a passionate community of enthusiasts.
          </p>
        </div>

        {/* Mission */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bonsai Buddy was created to bring together bonsai enthusiasts of all levels—from curious beginners to seasoned masters—in a shared space where they can document their trees&apos; growth, exchange knowledge, and celebrate the art of bonsai cultivation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe that growing bonsai is more than just a hobby; it&apos;s a journey of patience, artistry, and connection with nature. Bonsai Buddy makes it easy to keep tabs on your own specimens&apos; development while staying in touch with fellow enthusiasts who share your passion.
          </p>
        </section>

        {/* Origin Story */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">The Story Behind Bonsai Buddy</h2>
          <div className="rounded-lg border border-border bg-card p-6 space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              Bonsai Buddy was created by <strong className="text-foreground">Eric Henderson</strong>, a developer with a deep love for both web development and bonsai trees. Eric has been growing his collection of specimens since 2017, and has been hooked ever since that first tree.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Like many bonsai enthusiasts, Eric found himself taking countless photos, jotting down care notes in various places, and wishing there was a better way to track each tree&apos;s progress over time. As a developer, the solution was clear: build a platform that combines the joy of bonsai cultivation with the power of technology.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              What started as a personal project quickly evolved into something bigger—a community platform where bonsai lovers could not only manage their collections but also connect, learn from each other, and share in the journey of nurturing these living works of art.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How Bonsai Buddy Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bonsai Buddy is designed to be intuitive and powerful, giving you everything you need to manage your bonsai collection and engage with the community.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            {/* Track Your Collection */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Track Your Collection</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create detailed profiles for each bonsai in your collection. Record essential information like species, age, health status, and personalized care notes. Upload photos to document your trees&apos; transformation over time.
              </p>
            </div>

            {/* Share Updates */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Share Updates</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Post updates about your bonsai to the community feed. Share milestones, styling decisions, seasonal changes, or ask for advice. Every post becomes part of your specimen&apos;s timeline.
              </p>
            </div>

            {/* Connect with Community */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Connect with Community</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore what other bonsai enthusiasts are growing. Like and comment on posts, learn new techniques, and get inspired by the diverse specimens in the community.
              </p>
            </div>

            {/* Subscribe & Follow */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Subscribe & Follow</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Subscribe to specific specimens you find interesting to stay updated on their progress. Follow along as others share their bonsai journeys and development stories.
              </p>
            </div>

            {/* Search & Discover */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Search & Discover</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Search for specific species, browse by owner, or explore the full gallery of bonsai. Discover new species you might want to grow or find experts in particular styles.
              </p>
            </div>

            {/* Engage & Learn */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Engage & Learn</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                View specimen timelines to see how trees develop over months and years. Learn from the community&apos;s collective experience and share your own knowledge with others.
              </p>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Who Is Bonsai Buddy For?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bonsai Buddy is designed for enthusiasts of all levels:
          </p>
          <div className="space-y-3">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <h3 className="font-semibold mb-2">Beginners</h3>
              <p className="text-sm text-muted-foreground">
                Just starting your bonsai journey? Track your first trees, learn from experienced growers, and build confidence as you develop your skills.
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <h3 className="font-semibold mb-2">Intermediate Growers</h3>
              <p className="text-sm text-muted-foreground">
                Expanding your collection? Document your growing portfolio, experiment with new species, and share your progress with the community.
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <h3 className="font-semibold mb-2">Experienced Masters</h3>
              <p className="text-sm text-muted-foreground">
                Years of experience? Showcase your refined specimens, mentor newcomers, and connect with fellow masters to discuss advanced techniques.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Core Values</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your data belongs to you. We never sell or share your personal information with third parties for marketing purposes.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Bonsai is best enjoyed together. We foster a supportive community where knowledge, encouragement, and appreciation flow freely.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Simplicity & Beauty</h3>
                <p className="text-sm text-muted-foreground">
                  Like bonsai itself, great design is about removing the unnecessary. We focus on clean, intuitive experiences that let your trees shine.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Continuous Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Just as bonsai require constant care and refinement, we&apos;re committed to continuously improving the platform based on community feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="space-y-4">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">Join the Community</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Whether you&apos;re nurturing your first seedling or managing a collection of mature specimens, Bonsai Buddy is here to support your journey. Join our growing community of bonsai enthusiasts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore the Community
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              No credit card required. Start tracking your bonsai collection in minutes.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-muted-foreground leading-relaxed">
            Have questions, feedback, or suggestions? We&apos;d love to hear from you.
          </p>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-medium">Email: henderson.develop@gmail.com</p>
            <p className="text-sm text-muted-foreground mt-1">
              We typically respond within 1-2 business days.
            </p>
          </div>
        </section>

        {/* Footer Note */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground leading-relaxed text-center">
            Thank you for being part of Bonsai Buddy. Here&apos;s to many years of growth—both for your trees and our community. Happy growing!
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Send } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      // Success!
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon!",
      })

      // Clear form
      handleClearForm()
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <BackButton />
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or suggestions? We&apos;d love to hear from
            you. Fill out the form below and we&apos;ll get back to you as soon as
            possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                We&apos;ll use this to respond to your message
              </p>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us what's on your mind..."
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.message.length} characters
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClearForm}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                Clear Form
              </Button>
            </div>

            {/* Required Fields Note */}
            <p className="text-xs text-muted-foreground text-center pt-2">
              <span className="text-destructive">*</span> Required fields
            </p>
          </form>
        </div>

        {/* Additional Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
            <h3 className="font-semibold mb-2">Direct Email</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Prefer to email directly? You can reach us at:
            </p>
            <a
              href="mailto:henderson.develop@gmail.com"
              className="text-sm text-primary hover:underline font-medium"
            >
              henderson.develop@gmail.com
            </a>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
            <h3 className="font-semibold mb-2">Response Time</h3>
            <p className="text-sm text-muted-foreground">
              We typically respond to all inquiries within 1-2 business days.
              Thank you for your patience!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

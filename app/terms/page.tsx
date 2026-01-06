import type { Metadata } from "next"
import { BackButton } from "@/components/ui/back-button"

export const metadata: Metadata = {
  title: "Terms of Use | Bonsai Buddy",
  description: "Terms of Use for Bonsai Buddy - Your bonsai tracking and community platform",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <BackButton />
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Use</h1>
          <p className="text-muted-foreground">
            Last updated: January 6, 2026
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Bonsai Buddy! By accessing or using our platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Bonsai Buddy is operated as an individual project to provide bonsai enthusiasts with tools to track, manage, and share their bonsai collections.
          </p>
        </section>

        {/* User Accounts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. User Accounts and Responsibilities</h2>
          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              To access certain features of Bonsai Buddy, you must create an account. You agree to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Not share your account credentials with others</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              <strong>You must be at least 13 years of age to use Bonsai Buddy. By creating an account, you represent that you meet this age requirement.</strong>
            </p>
          </div>
        </section>

        {/* User-Generated Content */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. User-Generated Content</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">3.1 Your Content Ownership</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain all ownership rights to the content you post on Bonsai Buddy, including photos, descriptions, care notes, and other materials (&quot;User Content&quot;). We do not claim ownership of your bonsai photos or information.
            </p>

            <h3 className="text-xl font-medium">3.2 License to Use</h3>
            <p className="text-muted-foreground leading-relaxed">
              By posting User Content, you grant Bonsai Buddy a limited, non-exclusive, royalty-free license to display, store, and distribute your content solely for the purpose of operating and providing the platform&apos;s services. This license allows us to show your content to other users as part of the community features.
            </p>

            <h3 className="text-xl font-medium">3.3 Content Standards</h3>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to post content that:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Violates any applicable laws or regulations</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains hateful, discriminatory, or offensive material</li>
              <li>Includes spam, advertising, or promotional content without permission</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>Impersonates another person or entity</li>
              <li>Harasses, threatens, or abuses other users</li>
            </ul>

            <h3 className="text-xl font-medium">3.4 Content Removal</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to remove any User Content that violates these terms or is otherwise objectionable, without prior notice. However, we are not obligated to monitor all User Content.
            </p>
          </div>
        </section>

        {/* Privacy and Data */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Privacy and Data Protection</h2>
          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. We are committed to protecting your personal information:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>We do not sell or share your personal data</strong> with third parties for marketing purposes
              </li>
              <li>Your bonsai collection data, photos, and account information remain private unless you choose to share them through the platform&apos;s community features</li>
              <li>We use industry-standard security measures to protect your data</li>
              <li>You have the right to delete your account and associated data at any time</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              For more details on how we collect, use, and protect your information, please review our Privacy Policy.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Bonsai Buddy platform, including its design, features, functionality, and branding (excluding User Content), is owned by Bonsai Buddy and protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You may not copy, modify, distribute, or create derivative works based on the platform without express written permission.
          </p>
        </section>

        {/* Disclaimers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Disclaimers and Limitations</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">6.1 Service Availability</h3>
            <p className="text-muted-foreground leading-relaxed">
              Bonsai Buddy is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee uninterrupted, secure, or error-free service.
            </p>

            <h3 className="text-xl font-medium">6.2 Horticultural Advice</h3>
            <p className="text-muted-foreground leading-relaxed">
              Any bonsai care information, tips, or advice shared on the platform (whether by us or other users) is for informational purposes only. We are not responsible for the health or condition of your bonsai trees. Always consult professional horticulturists for specific care advice.
            </p>

            <h3 className="text-xl font-medium">6.3 Limitation of Liability</h3>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Bonsai Buddy and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
            </p>
          </div>
        </section>

        {/* Account Termination */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Account Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate your account at any time if you violate these Terms of Use or engage in conduct we deem harmful to the platform or other users.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You may delete your account at any time through your profile settings. Upon deletion, your User Content will be removed from the platform, though cached or backup copies may persist for a reasonable period.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update these Terms of Use from time to time. The &quot;Last updated&quot; date at the top of this page indicates when the terms were last revised. Continued use of the platform after changes constitutes acceptance of the updated terms.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            For significant changes, we will make reasonable efforts to notify users through the platform or via email.
          </p>
        </section>

        {/* Governing Law */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Governing Law and Jurisdiction</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms of Use shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of Bonsai Buddy shall be subject to the exclusive jurisdiction of the courts located in the United States.
          </p>
        </section>

        {/* Severability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Severability</h2>
          <p className="text-muted-foreground leading-relaxed">
            If any provision of these Terms of Use is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Contact Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms of Use, please contact us at:
          </p>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-medium">Email: henderson.develop@gmail.com</p>
            <p className="text-sm text-muted-foreground">Project: Bonsai Buddy</p>
          </div>
        </section>

        {/* Footer Note */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            By using Bonsai Buddy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. Thank you for being part of our bonsai community!
          </p>
        </div>
      </div>
    </div>
  )
}

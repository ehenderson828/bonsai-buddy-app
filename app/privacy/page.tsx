import type { Metadata } from "next"
import { BackButton } from "@/components/ui/back-button"

export const metadata: Metadata = {
  title: "Privacy Policy | Bonsai Buddy",
  description: "Privacy Policy for Bonsai Buddy - How we collect, use, and protect your data",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <BackButton />
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: January 6, 2026
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Bonsai Buddy. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform.
          </p>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="font-medium text-foreground">
              Our Privacy Commitment:
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <strong>We do not sell or share your personal data</strong> with third parties for marketing purposes. Your bonsai collection, photos, and personal information are yours alone.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">2.1 Information You Provide</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you create an account and use Bonsai Buddy, we collect:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Account Information:</strong> Name, email address, and password (encrypted)</li>
              <li><strong>Profile Information:</strong> Optional profile photo/avatar</li>
              <li><strong>Bonsai Data:</strong> Specimen names, species, age, health status, care notes, and photos you upload</li>
              <li><strong>User-Generated Content:</strong> Posts, comments, and other content you create on the platform</li>
              <li><strong>Interaction Data:</strong> Likes, subscriptions to specimens, and other engagement activities</li>
            </ul>

            <h3 className="text-xl font-medium">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you use our platform, we automatically collect:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Usage Data:</strong> Pages visited, features used, and time spent on the platform (via Vercel Analytics)</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device type</li>
              <li><strong>Log Data:</strong> IP address, access times, and referring URLs</li>
            </ul>

            <h3 className="text-xl font-medium">2.3 Cookies and Similar Technologies</h3>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to maintain your session and improve your experience:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Authentication Cookies:</strong> Supabase Auth session cookies to keep you logged in</li>
              <li><strong>Analytics Cookies:</strong> Vercel Analytics to understand how users interact with our platform</li>
              <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              You can control cookies through your browser settings, but disabling certain cookies may affect platform functionality.
            </p>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li><strong>Provide Services:</strong> To operate and maintain your account and bonsai collection</li>
            <li><strong>Community Features:</strong> To display your shared content to other users (posts, public specimens)</li>
            <li><strong>Communication:</strong> To send you important updates about the platform or respond to your inquiries</li>
            <li><strong>Improvement:</strong> To analyze usage patterns and improve our platform&apos;s features and performance</li>
            <li><strong>Security:</strong> To protect against unauthorized access, fraud, and abuse</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            <strong>We will never:</strong> Sell your data, use your photos for advertising without permission, or share your personal information with third parties for their marketing purposes.
          </p>
        </section>

        {/* Data Sharing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. How We Share Your Information</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">4.1 Within the Platform</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you choose to share content publicly on Bonsai Buddy (posts, community updates), that information is visible to other users of the platform. Your private collection data remains private unless you explicitly share it.
            </p>

            <h3 className="text-xl font-medium">4.2 Third-Party Service Providers</h3>
            <p className="text-muted-foreground leading-relaxed">
              We use the following trusted third-party services to operate our platform:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Supabase:</strong> Provides our database, authentication, and file storage infrastructure. Supabase may access your data to provide these services. View their privacy policy at{" "}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  supabase.com/privacy
                </a>
              </li>
              <li>
                <strong>Vercel Analytics:</strong> Provides privacy-friendly analytics to help us understand platform usage. No personal data is shared. View their privacy policy at{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  vercel.com/legal/privacy-policy
                </a>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              These service providers are contractually obligated to protect your data and use it only for providing their services to us.
            </p>

            <h3 className="text-xl font-medium">4.3 Legal Requirements</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may disclose your information if required by law, legal process, or governmental request, or to protect the rights, property, or safety of Bonsai Buddy, our users, or others.
            </p>

            <h3 className="text-xl font-medium">4.4 Business Transfers</h3>
            <p className="text-muted-foreground leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your data is transferred and becomes subject to a different privacy policy.
            </p>
          </div>
        </section>

        {/* Data Storage and Security */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Data Storage and Security</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">5.1 Data Storage</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using Supabase&apos;s infrastructure, which uses industry-standard security practices. Data is stored in secure data centers with encryption at rest and in transit.
            </p>

            <h3 className="text-xl font-medium">5.2 Security Measures</h3>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Passwords are encrypted using industry-standard hashing algorithms</li>
              <li>All data transmission uses HTTPS/SSL encryption</li>
              <li>Access to user data is restricted to authorized systems only</li>
              <li>Regular security updates and monitoring</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              While we strive to protect your data, no method of transmission or storage is 100% secure. We cannot guarantee absolute security but take all reasonable precautions.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Data Retention and Deletion</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your personal information for as long as your account is active or as needed to provide you services.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Account Deletion:</strong> You may delete your account at any time through your profile settings. Upon deletion, your personal data, bonsai collection, and user-generated content will be <strong>immediately deleted</strong> from our active database. Some data may persist in backup systems for a short period for technical reasons, but will not be accessible or used.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We may retain certain information as required by law or for legitimate business purposes (e.g., fraud prevention, legal compliance).
          </p>
        </section>

        {/* Your Rights */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Your Privacy Rights</h2>
          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              You have the following rights regarding your personal data:
            </p>

            <h3 className="text-xl font-medium">7.1 General Rights</h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information through your profile settings</li>
              <li><strong>Deletion:</strong> Delete your account and associated data at any time</li>
              <li><strong>Export:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain data processing activities</li>
            </ul>

            <h3 className="text-xl font-medium">7.2 GDPR Rights (European Users)</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Right to Restriction:</strong> Request restriction of processing of your data</li>
              <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where we rely on consent</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Legal Basis for Processing:</strong> We process your data based on your consent, performance of our contract with you, and our legitimate interests in providing and improving our services.
            </p>

            <h3 className="text-xl font-medium">7.3 CCPA Rights (California Users)</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Right to Know:</strong> Request information about what personal data we collect, use, and share</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal data (with certain exceptions)</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal data (we do not sell personal data)</li>
              <li><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your CCPA rights</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To exercise any of these rights, please contact us at henderson.develop@gmail.com. We will respond to your request within 30 days (or as required by applicable law).
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bonsai Buddy is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately, and we will delete the information.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Users between 13 and 18 should obtain parental consent before using the platform.
          </p>
        </section>

        {/* International Users */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. International Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bonsai Buddy is operated in the United States. If you are accessing the platform from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers and service providers are located.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By using Bonsai Buddy, you consent to the transfer of your information to the United States. We take appropriate safeguards to protect your data in accordance with this Privacy Policy and applicable laws.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. The &quot;Last updated&quot; date at the top indicates when the policy was last revised.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            For material changes, we will provide notice through the platform or via email. We encourage you to review this Privacy Policy periodically. Continued use of the platform after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Do Not Track */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Do Not Track Signals</h2>
          <p className="text-muted-foreground leading-relaxed">
            Some web browsers have a &quot;Do Not Track&quot; feature. Currently, there is no industry standard for how to respond to these signals. At this time, Bonsai Buddy does not respond to Do Not Track browser settings.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-medium">Email: henderson.develop@gmail.com</p>
            <p className="text-sm text-muted-foreground">Project: Bonsai Buddy</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We will respond to all requests within 30 days or as required by applicable law.
            </p>
          </div>
        </section>

        {/* Footer Note */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your privacy matters to us. We are committed to transparency in how we handle your data and to protecting your rights. Thank you for trusting Bonsai Buddy with your bonsai journey!
          </p>
        </div>
      </div>
    </div>
  )
}

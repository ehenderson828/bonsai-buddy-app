import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { firstName, lastName, email, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || "Bonsai Buddy Contact Form <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL_TO || "henderson.develop@gmail.com"],
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 20px;
              }
              .field-label {
                font-weight: 600;
                color: #374151;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .field-value {
                background: white;
                padding: 12px 16px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
                color: #1f2937;
              }
              .message-box {
                background: white;
                padding: 16px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
                white-space: pre-wrap;
                word-wrap: break-word;
                color: #1f2937;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
              }
              .reply-button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background: #22c55e;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌳 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">${firstName} ${lastName}</div>
              </div>

              <div class="field">
                <div class="field-label">Email Address</div>
                <div class="field-value">
                  <a href="mailto:${email}" style="color: #22c55e; text-decoration: none;">${email}</a>
                </div>
              </div>

              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${message}</div>
              </div>

              <div style="text-align: center;">
                <a href="mailto:${email}" class="reply-button">Reply to ${firstName}</a>
              </div>

              <div class="footer">
                <p>This message was sent from the Bonsai Buddy contact form.</p>
                <p>Submitted on ${new Date().toLocaleString("en-US", {
                  dateStyle: "full",
                  timeStyle: "short"
                })}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    // Handle Resend error
    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        emailId: data?.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}

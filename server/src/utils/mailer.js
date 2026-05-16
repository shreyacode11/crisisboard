import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`
  
  const { data, error } = await resend.emails.send({
    from: 'CrisisBoard <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your CrisisBoard account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Welcome to CrisisBoard!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;border-radius:8px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
        <p style="color:#888;font-size:12px;margin-top:24px">Link expires in 24 hours.</p>
      </div>
    `,
  })

  if (error) throw new Error(error.message)
  console.log('Email sent:', data)
}
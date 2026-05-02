import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS }
})

export const sendVerificationEmail = async (to, token) => {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`
  await transporter.sendMail({
    from: `"CrisisBoard" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Verify your CrisisBoard account',
    html: `<h2>Welcome to CrisisBoard!</h2><p>Click the link below to verify your email:</p><a href="${link}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">Verify Email</a><p>Link expires in 24 hours.</p>`
  })
}
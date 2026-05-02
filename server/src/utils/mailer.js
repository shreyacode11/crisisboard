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
    subject: 'Verify your email',
    html: `<h2>Welcome to CrisisBoard!</h2><p>Click to verify:</p><a href="${link}">${link}</a><p>Link expires in 24 hours.</p>`
  })
}
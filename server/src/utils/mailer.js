import nodemailer from 'nodemailer'  // ← this line is missing

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
})

transporter.verify((error, success) => {
  if (error) console.error('BREVO CONNECTION ERROR:', error)
  else console.log('Brevo SMTP ready')
})

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`
  await transporter.sendMail({
    from: '"CrisisBoard" <shreyabsaboji@gmail.com>',
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
}
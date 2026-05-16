// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   service: 'gmail',         
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASS,  
//   },
// })

// export const sendVerificationEmail = async (email, token) => {
//   const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`
//   await transporter.sendMail({
//     from: `"CrisisBoard" <${process.env.GMAIL_USER}>`,
//     to: email,
//     subject: 'Verify your CrisisBoard account',
//     html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
//   })
// }

// import nodemailer from 'nodemailer'

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASS,
//   },
// })

// export const sendVerificationEmail = async (email, token) => {
//  const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`
//   await transporter.sendMail({
//     from: `"CrisisBoard" <${process.env.GMAIL_USER}>`,
//     to: email,
//     subject: 'Verify your CrisisBoard account',
//     html: `
//       <div style="font-family:sans-serif;max-width:480px;margin:auto">
//         <h2>Welcome to CrisisBoard!</h2>
//         <p>Click the button below to verify your email:</p>
//         <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;border-radius:8px;text-decoration:none;font-weight:600">
//           Verify Email
//         </a>
//         <p style="color:#888;font-size:12px;margin-top:24px">Link expires in 24 hours.</p>
//       </div>
//     `,
//   })
// }

import nodemailer from 'nodemailer'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first')  // ← force IPv4

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',   // explicit host instead of service:'gmail'
  port: 587,                // 587 instead of 465
  secure: false,            // false for 587
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
})

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`
  await transporter.sendMail({
    from: `"CrisisBoard" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verify your CrisisBoard account',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Welcome to CrisisBoard!</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;border-radius:8px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
        <p style="color:#888;font-size:12px;margin-top:24px">Link expires in 24 hours.</p>
      </div>
    `,
  })
}
import nodemailer from 'nodemailer'

export const sendEmail = async (email, url) => {
  const account = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass
    }
  })

  const mailOptions = {
    from: '"Fred Foo 👻" <devo@gmail.com>',
    to: email, // list of receivers
    subject: 'Email Confirmation ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<a href=${url}>Confirm your email</a>`
  }
  const info = await transporter.sendMail(mailOptions)

  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async (email, url) => {
  const msg = {
    to: email,
    from: 'devo@example.com',
    subject: 'Email confirmation',
    text: `Confirm your email`,
    html: `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Email confirmation</title>
          </head>
          <body>
            <p>Conifrm your email by clicking <a target="_blank" href="${url}">here</a></p>
          </body>
        </html>
    `
  }
  await sgMail.send(msg)
}

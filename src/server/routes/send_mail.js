require('dotenv').config()
const nodemailer = require('nodemailer')

module.exports = {
  route: "mail",
  method: 'POST',
  run: async (req, res) => {
    const { recipient, subject, msg } = req.query

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mailData = {
      from: `Octave <${process.env.EMAIL_ID}>`,
      to: recipient,
      subject: subject,
      html: msg,
    }

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          res
            .status(200)
            .json({
              from: `Octave <${process.env.EMAIL_ID}>`,
              to: recipient,
              subject: subject,
              text: msg,
            })
          resolve(info)
        }
      })
    })

  }
}
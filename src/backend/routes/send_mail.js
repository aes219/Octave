require('dotenv').config()
const nodemailer = require('nodemailer')

module.exports = {
  route: "mail",
  method: 'POST',
  run: async (req, res) => {
    const { recipient, subject, msg } = req.query

    let transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    transporter.sendMail({
      from: process.env.EMAIL_ID,
      to: recipient,
      subject: subject,
      text: msg,
    })
      .then(
        res
          .status(200)
          .json({
            from: process.env.EMAIL_ID,
            to: recipient,
            subject: subject,
            text: msg,
          }))
      .catch((e) => {
        console.log(e)
      })
  }
}
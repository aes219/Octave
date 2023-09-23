require('dotenv').config()

const nodemailer = require('nodemailer')

module.exports = {
  route: "mail",
  method: 'POST',
  run: async (req, res) => {
    const { recipient, subject, msg } = req.query

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "rungtavaidik@gmail.com",
        accessToken: process.env.ACCESS_TOKEN,
      },
    })
    transporter.sendMail({
      from: "rungtavaidik@gmail.com",
      to: recipient,
      subject: subject,
      text: msg,
    })
      .then(
        res
          .status(200)
          .json({
            from: "rungtavaidik@gmail.com",
            to: recipient,
            subject: subject,
            text: msg,
          }))
      .catch((e) => {
        console.log(e)
      })
  }
}
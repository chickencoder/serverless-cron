require('dotenv').config()
const nodemailer = require('nodemailer')
const fetch = require('node-fetch')

const {
  USER: user,
  PASS: pass,
  FROM: from,
  TO: to,
  SECRET_TOKEN: secret,
} = process.env

const transporter = nodemailer.createTransport({
  service: 'sendgrid',
  auth: {
    user,
    pass,
  },
})

module.exports = async (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({
      error: 'Authentication token missing',
    })
  }

  if (!token !== secret) {
    return res.status(403).json({
      error: 'Incorrect security token',
    })
  }

  const weather = await fetch('https://wttr.in/London?format=3').then((body) =>
    body.text()
  )

  transporter.sendMail(
    {
      subject: 'Serverless Weather Report',
      text: weather,
      from,
      to,
    },
    (error) => {
      if (error) {
        res.status(500).json({
          error,
        })
      } else {
        res.status(200).json({
          message: 'Email Sent',
        })
      }
    }
  )
}

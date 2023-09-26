require('dotenv').config()
const MessageModel = require('../models/Message')
const UserModel = require('../models/user')
const nodemailer = require('nodemailer')

const postMessage = async (req, res) => {
  try {
    const { message } = req.body

    let transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      auth: {
        user: process.env.USER_AUTH_FOR_MAILER,
        pass: process.env.PASS_AUTH_FOR_MAILER,
      },
    })

    const newMessage = new MessageModel({
      message,
    })

    await newMessage.save()
    await newMessage.addUserMessage(req.user.id)

    const mailOptions = {
      to: process.env.MY_EMAIL,
      from: req.user.email,
      subject: 'User Queries!',
      text: `From ${req.user.email}\nName: ${req.user.name}\nMessage/Query: ${newMessage.message}`,
    }

    await transporter.sendMail(mailOptions)
    const user = await UserModel.findById(req.user.id)

    user.messages.push(newMessage.id)
    await user.save()

    res.redirect('/user/profile')
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = postMessage

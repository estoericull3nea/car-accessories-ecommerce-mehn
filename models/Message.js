const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

MessageSchema.methods.addUserMessage = async function (userId) {
  this.userMessage = userId
  return this.save()
}

module.exports = new mongoose.model('Message', MessageSchema)

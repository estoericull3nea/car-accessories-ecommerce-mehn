const mongoose = require('mongoose')
const Product = require('../models/product')

const empSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    cart: {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          qty: {
            type: Number,
            required: true,
          },
        },
      ],
      totalPrice: Number,
    },
  },
  { timestamps: true }
)

empSchema.methods.addToCart = async function (productId) {
  const product = await Product.findById(productId)

  if (product) {
    const cart = this.cart
    const isExisting = cart.items.findIndex(
      (objInItems) =>
        new String(objInItems.productId).trim() ===
        new String(product._id).trim()
    )

    if (isExisting >= 0) {
      cart.items[isExisting].qty += 1
    } else {
      cart.items.push({ productId: product._id, qty: 1 })
    }
    if (!cart.totalPrice) {
      cart.totalPrice = 0
    }
    cart.totalPrice += product.price
    return this.save()
  }
}

empSchema.methods.removeCart = async function (productId) {
  const cart = this.cart
  const isExisting = cart.items.findIndex(
    (objInItems) =>
      new String(objInItems.productId).trim() === new String(productId).trim()
  )
  if (isExisting >= 0) {
    const prod = await Product.findById(productId)
    cart.totalPrice -= prod.price * cart.items[isExisting].qty
    cart.items.splice(isExisting, 1)
    return this.save()
  }
}

empSchema.methods.removeAllCart = async function (productId) {
  const cart = this.cart
  cart.items.splice(0, cart.items.length)
  this.cart.totalPrice = 0
  return this.save()
}

const Register = new mongoose.model('Register', empSchema)
module.exports = Register

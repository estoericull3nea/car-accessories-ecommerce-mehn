const mongoose = require('mongoose')
const Product = require('../models/product')
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    address: {
      type: String,
    },
    bookmarkId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
)

UserSchema.methods.addToCart = async function (productId) {
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

UserSchema.methods.addToBookmark = async function (productId) {
  const product = await Product.findById(productId)
  if (product) {
    if (!this.bookmarkId.includes(productId)) {
      this.bookmarkId.push(productId)
    }

    return this.save()
  }
}

UserSchema.methods.removeCart = async function (productId) {
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

UserSchema.methods.removeAllCart = async function () {
  const cart = this.cart
  cart.items.splice(0, cart.items.length)
  this.cart.totalPrice = 0
  return this.save()
}

module.exports = new mongoose.model('User', UserSchema)

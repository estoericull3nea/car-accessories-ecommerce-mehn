const Products = require('../models/Product')
const UserModel = require('../models/User')
// getting
const getAllProducts = async (req, res) => {
  try {
    // const user = await UserModel.findById({ _id: req.session.user._id })
    // const cartCount = user.cart.items.length

    // search item
    const searchOneItem = req.query.search

    const productBasedOnSearch = await Products.find({
      title: { $regex: `${searchOneItem}`, $options: 'i' },
    })

    // price
    const inputPriceRange = req.query.priceRange
    const optionForPrice = req.query.option
    let findThisPriceRange

    if (optionForPrice === 'less') {
      findThisPriceRange = await Products.find({
        price: { $lt: inputPriceRange },
      })
    } else if (optionForPrice === 'greater') {
      findThisPriceRange = await Products.find({
        price: { $gt: inputPriceRange },
      })
    }

    // filter many
    const { value1, value2, value3, value4, value5, value6, value7 } = req.query
    const pickedObject = {}

    if (value1) pickedObject.value1 = 'battery'
    if (value2) pickedObject.value2 = 'brake'
    if (value3) pickedObject.value3 = 'engine'
    if (value4) pickedObject.value4 = 'mags'
    if (value5) pickedObject.value5 = 'muffler'
    if (value6) pickedObject.value6 = 'radiator'
    if (value7) pickedObject.value7 = 'steering'

    const haveLength = Object.keys(pickedObject).length > 0 ? true : false

    if (haveLength) {
      const pickedArray = []

      for (const [key, value] of Object.entries(pickedObject)) {
        pickedArray.push(value)
      }

      const arrayProduct = []
      for (let i = 0; i < pickedArray.length; i++) {
        arrayProduct.push(await Products.find({ typeOfItem: pickedArray[i] }))
      }

      const anotherArray = []
      for (let i = 0; i < arrayProduct.length; i++) {
        for (let j = 0; j < arrayProduct[i].length; j++) {
          anotherArray.push(arrayProduct[i][j])
        }
      }

      const product = await Products.find({})

      const token = req.cookies['access_token']

      if (req.user) {
        const user = await UserModel.findById({ _id: req.session.user._id })
        const cartCount = user.cart.items.length

        res.render('products', {
          pageTitle: 'Products',
          token,
          anotherArray,
          haveLength,
          product,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount,
        })
      } else {
        res.render('products', {
          pageTitle: 'Products',
          token,
          anotherArray,
          haveLength,
          product,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount: 0,
        })
      }
    } else {
      const product = await Products.find()
      const token = req.cookies['access_token']

      if (req.user) {
        const user = await UserModel.findById({ _id: req.session.user._id })
        const cartCount = user.cart.items.length

        res.render('products', {
          pageTitle: 'Products',
          token,
          product,
          haveLength,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount,
        })
      } else {
        res.render('products', {
          pageTitle: 'Products',
          token,
          product,
          haveLength,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount: 0,
        })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProduct = async (req, res) => {
  try {
    // const user = await UserModel.findById({ _id: req.session.user._id })
    // const cartCount = user.cart.items.length
    const { id } = req.params

    const product = await Products.findById({ _id: id })
    const findThis = product.typeOfItem

    const similarProds = await Products.find({ typeOfItem: findThis })

    const token = req.cookies['access_token']

    if (req.user) {
      const user = await UserModel.findById({ _id: req.session.user._id })
      const cartCount = user.cart.items.length

      res.render('viewOne', {
        pageTitle: 'Product',
        token,
        product,
        similarProds,
        cartCount,
      })
    } else {
      res.render('viewOne', {
        pageTitle: 'Product',
        token,
        product,
        similarProds,
        cartCount: 0,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllProducts,
  getProduct,
}

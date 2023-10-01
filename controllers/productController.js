const Products = require('../models/product')
const UserModel = require('../models/user')
// getting
const getAllProducts = async (req, res) => {
  try {
    const prod1 = await Products.find().limit(14)
    const prod2 = await Products.find().limit(14).skip(14)
    const prod3 = await Products.find().limit(16).skip(28)

    const { page } = req.query

    let displayProductsBasedOnPage
    if (+page === 1) {
      displayProductsBasedOnPage = prod1
    } else if (+page === 2) {
      displayProductsBasedOnPage = prod2
    } else if (+page === 3) {
      displayProductsBasedOnPage = prod3
    }

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

      if (req.user) {
        const user = await UserModel.findById({ _id: req.session.user._id })
        const cartCount = user.cart.items.length

        res.render('products', {
          pageTitle: 'Products',
          displayProductsBasedOnPage,
          anotherArray,
          haveLength,
          product,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount,
          user,
        })
      } else {
        res.render('products', {
          pageTitle: 'Products',
          displayProductsBasedOnPage,
          anotherArray,
          haveLength,
          product,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount: 0,
          user: null,
        })
      }
    } else {
      let product = await Products.find()
      // this

      if (req.user) {
        const user = await UserModel.findById({ _id: req.session.user._id })
        const cartCount = user.cart.items.length

        res.render('products', {
          pageTitle: 'Products',
          product,
          displayProductsBasedOnPage,
          haveLength,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount,
          user,
        })
      } else {
        res.render('products', {
          pageTitle: 'Products',
          displayProductsBasedOnPage,
          product,
          haveLength,
          findThisPriceRange,
          productBasedOnSearch,
          cartCount: 0,
          user: null,
        })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Products.findById({ _id: id })
    const findThis = product.typeOfItem

    const similarProds = await Products.find({ typeOfItem: findThis })

    if (req.user) {
      const user = await UserModel.findById({ _id: req.session.user._id })
      const cartCount = user.cart.items.length

      res.render('viewOne', {
        pageTitle: 'Product',
        product,
        similarProds,
        cartCount,
        user,
      })
    } else {
      res.render('viewOne', {
        pageTitle: 'Product',
        product,
        similarProds,
        cartCount: 0,
        user: null,
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

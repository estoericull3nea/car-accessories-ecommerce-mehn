const Products = require('../models/Product')

// getting
const getAllProducts = async (req, res) => {
  try {
    const product = await Products.find() // all items
    const token = req.cookies['access_token'] // checking token purposes if valid token, logout will be display, get started otherwise
    res.render('products', { pageTitle: 'Products', token, product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Products.findById({ _id: id }) // find item by id

    const token = req.cookies['access_token'] // checking token purposes if valid token, logout will be display, get started otherwise
    res.render('viewOne', { pageTitle: 'test', token, product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllProducts,
  getProduct,
}

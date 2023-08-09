const Products = require('../models/Product')

const getAllProducts = async (req, res) => {
  try {
    const product = await Products.find()
    const token = req.cookies['access_token']
    res.render('products', { pageTitle: 'Products', token, product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProduct = (req, res) => {}

module.exports = {
  getAllProducts,
  getProduct,
}

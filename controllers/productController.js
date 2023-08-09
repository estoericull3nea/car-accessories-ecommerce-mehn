const Products = require('../models/Product')

const getAllProducts = async (req, res) => {
  const prods = await Products.find()
  if (prods.length === 0) {
    console.log('empty products')
  }
  console.log(prods)
}

const getProduct = (req, res) => {}

module.exports = {
  getAllProducts,
  getProduct,
}

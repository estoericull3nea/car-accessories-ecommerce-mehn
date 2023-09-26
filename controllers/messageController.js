const postMessage = (req, res) => {
  try {
    const { name, email, message } = req.body
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = postMessage

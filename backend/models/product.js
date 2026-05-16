const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  categorySlug: String,
  price: Number,
  image: String,
  description: String,
});

module.exports = mongoose.model("Product", productSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String},
    category: {type: String, required: true}
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product; 
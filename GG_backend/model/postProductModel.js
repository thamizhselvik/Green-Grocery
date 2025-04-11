const mongoose = require('mongoose');

const postProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    quantity: {type: Number, required: true},
    delivery_time: {type: String, required: true},
    price: {type: Number, required: true},
    expired: {type: String},
    product_desc: {type: String},
    color: {type: String},
    size: {type: String},
    farmer:{ type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true},
    image: {type: String},
    category: {type: String},
    rating: {
        totalRating: { type: Number, default: 0 },
        numberOfRatings: { type: Number, default: 0 },
        avgRating: {type: Number, default: 0}
    }
})

const PostProduct = mongoose.model("PostProduct", postProductSchema);
module.exports = PostProduct;
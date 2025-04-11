const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true},
    products: { 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "PostProduct", required: true }, 
        quantity: { type: Number, required: true } 
    },
    totalPrice: {type: Number}
})

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
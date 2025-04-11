const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: {type: mongoose.Schema.Types.ObjectId, ref:"Vendor", required: true},
    seller: {type: mongoose.Schema.Types.ObjectId, ref:"Farmer", required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref:"PostProduct", required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    time: {type: Date, default: Date.now},
    status: {type: String, default: "ordered"},
    address: {type: String, required: true},
    method_of_payment: {type: String}
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order; 
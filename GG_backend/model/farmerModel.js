const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    contact_no: {type: Number, required: true},
    aadhar: {type: Number, required: true},
    address: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    uzhavan: {type: String, required: true},
    role: {type: String, default: "ROLE_FARMER"},
    upiId: {type: String},
    image: {type: String}
})

const Farmer = mongoose.model("Farmer", farmerSchema);
module.exports = Farmer;
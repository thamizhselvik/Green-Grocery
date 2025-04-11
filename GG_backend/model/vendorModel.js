const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    contact_no: {type: Number, required: true},
    aadhar: {type: Number, required: true},
    address: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    fssai: {type: String, required: true},
    role: {type: String, default: "ROLE_VENDOR"},
    image: {type: String}
})

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: {type: String,required: true },
    password: {type: String,required: true },
    role: {type: String, default: 'ROLE_ADMIN'}
}); 

const Admin = mongoose.model("Admin", adminSchema); 
module.exports = Admin;
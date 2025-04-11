const Razorpay = require('razorpay');
require('dotenv').config({ path: './config/config.env' });

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECERT_KEY
});

module.exports = instance;
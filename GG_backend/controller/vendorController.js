const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator");
const Vendor = require("../model/vendorModel");
const jwt = require("jsonwebtoken");
const PostProduct = require("../model/postProductModel");
const Farmer = require('../model/farmerModel');
const Order = require("../model/orderModel");
const mongoose = require('mongoose');

exports.addVendor = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ err: errors.array() });

        const { name, username, password, contact_no, aadhar, address, state, city, fssai } = req.body;

        const verify = await Vendor.findOne({ 'username': username })
        if (verify)
            return res.status(400).json({ 'msg': 'Username already exist' });

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        let vendor = new Vendor({ name, username, 'password': hashedPassword, contact_no, aadhar, address, state, city, fssai });
        vendor = await vendor.save();
        return res.status(200).json(vendor);
    }
    catch (err) {
        res.status(400).json({ 'msg': `Error in api ${err}` });
    }
}

exports.login = async (req, res) => {
    try {
        let { username, password } = req.body;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor)
            return res.status(400).json({ 'msg': 'Invalid Credentials..!!' })

        const isValid = await bcrypt.compare(password, vendor.password)
        if (!isValid)
            return res.status(400).json({ 'msg': 'Invalid Credentials..!!' })

        const SECRET_KEY = '47222636';
        let vendorObj = {
            'username': vendor.username
        }

        const token = jwt.sign(vendorObj, SECRET_KEY)
        res.status(200).json({ 'token': token })
    }
    catch (err) {
        res.status(400).json({ 'msg': `Error in api ${err}` });
    }
}

exports.getAllproducts = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor)
            return res.status(401).json({ "msg": "Unauthorized" })

        const product = await PostProduct.find();
        if (!product)
            return res.status(400).json('No product available')

        return res.status(200).json(product)
    }
    catch (err) {
        res.status(400).json({ 'msg': `Error in api ${err}` });
    }
}

exports.getProductByCategory = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor) {
            return res.status(401).json(username);
        }

        let { category } = req.params;

        const categoryMap = {
            'grainsdals': 'grains/dals',
            'leavesspinach': 'leaves/spinach',
            'ricewheat': 'rice/wheat',
            'seedsnuts': 'seeds/nuts'
        };

        category = categoryMap[category] || category;

        const products = await PostProduct.find({ 'category': category });

        res.status(200).json(products);
    }
    catch (err) {
        res.status(400).json({ 'msg': `Error in API: ${err.message}` });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor) {
            return res.status(401).json(username);
        }

        const { id } = req.params;

        const product = await PostProduct.findById(id).populate("farmer");

        res.status(200).json(product);
    }
    catch (err) {
        res.status(400).json({ 'msg': `Error in API: ${err.message}` });
    }
}

exports.checkUsername = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await Vendor.findOne({ username });

        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        res.status(200).json({ message: 'Username is available' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.checkContact_no = async (req, res) => {
    const { contact_no } = req.body;

    try {
        const user = await Vendor.findOne({ contact_no });

        if (user) {
            return res.status(400).json({ message: 'phone number already exists' });
        }

        res.status(200).json({ message: 'phone number is available' });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.checkAadhar = async (req, res) => {
    const { aadhar } = req.body;

    try {
        const user = await Vendor.findOne({ aadhar });

        if (user) {
            return res.status(400).json({ message: 'Aadhar already exists' });
        }

        res.status(200).json({ message: 'aadhar is available' });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.checkfssai_id = async (req, res) => {
    const { fssai } = req.body;

    try {
        const user = await Vendor.findOne({ fssai });

        if (user) {
            return res.status(400).json({ message: 'fssai_id already exists' });
        }

        res.status(200).json({ message: 'fssai_id is available' });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getVendor = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const vendor = await Vendor.findOne({ 'username': username });
        if (!vendor) {
            return res.status(401).json(username);
        }

        res.status(200).json(vendor);
    }
    catch (err) {
        res.status(400).json({ 'msg': 'Error in API' });
    }
}

exports.uploadProfilePic = async (req, res) => {
    try {
        let obj = req.user;
        let username = obj.username;

        let vendor = await Vendor.findOne({ 'username': username })

        if (vendor === undefined || vendor == null)
            return res.status(401).json({ 'msg': 'Unauthorized!!' })

        if (!req.file) {
            return res.status(400).json({ 'msg': 'No File detected!!' })
        }

        const multerFileName = req.file.filename;
        const mimeType = req.file.mimetype;
        const fileExtension = mimeType.split("/")[1];

        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ 'msg': 'File Not allowed!! Allowed Types ' + allowedExtensions })
        }

        vendor.image = multerFileName;

        vendor = await vendor.save(vendor);

        res.json(vendor);

    }
    catch (err) {
        return res.status(400).json(err)
    }
}

exports.bestSeller = async (req, res) => {
    try {
        const username = req.user.username;
        const vendor = await Vendor.findOne({ username });

        if (!vendor) {
            return res.status(401).json('unauthorized');
        }

        const orders = await Order.find();
        console.log('Total Orders:', orders.length);

        const productCountMap = {};

        orders.forEach(order => {
            const productId = order.product?.toString();
            if (productId) {
                productCountMap[productId] = (productCountMap[productId] || 0) + 1;
            }
        });

        console.log('Product Count Map:', productCountMap);

        const topProductIds = Object.entries(productCountMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([productId]) => new mongoose.Types.ObjectId(productId));

        console.log('Top Product IDs:', topProductIds);

        const topProducts = await PostProduct.find({ _id: { $in: topProductIds } });
        console.log('Top Products:', topProducts);

        return res.status(200).json(topProducts);
    } catch (err) {
        console.error('Error in bestSeller:', err);
        return res.status(400).json('error ' + err);
    }
};

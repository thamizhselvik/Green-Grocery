const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const Admin = require("../model/adminModel");
const Product = require("../model/productModul");

exports.addAdmin = async(req, res) => {
    try
    {
        const {username, password} = req.body;

        const verify = await Admin.findOne({'username': username})
        if(verify)
            return res.status(400).json({'msg': 'Username already exist'});
    
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
    
        let admin = new Admin({username, 'password': hashedPassword});
        admin = await admin.save();
        return res.status(200).json(admin);
    }
    catch(err)
    {
        res.status(400).json({'msg': `Error in api ${err}`});
    }
}

exports.login = async(req, res) => {
    try
    {
        let {username, password} = req.body;

        const admin = await Admin.findOne({'username': username});
        if(!admin)
            return res.status(400).json({'msg':'Invalid Credentials..!!'})

        const isValid = await bcrypt.compare(password, admin.password)
        if(!isValid)
            return res.status(400).json({'msg':'Invalid Credentials..!!'})

        const SECRET_KEY = '47222636';
        let adminObj = {
            'username': admin.username
        }

        const token = jwt.sign(adminObj, SECRET_KEY)
        res.status(200).json({'token': token})
    }
    catch(err)
    {
        res.status(400).json({'msg': `Error in api ${err}`});
    }
}

exports.addProduct = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
    
        const admin = await Admin.findOne({'username': username});
        if(!admin)
            return res.status(401).json({"msg":"Unauthorized"})

        const {title, category} = req.body;

        const verify = await Product.findOne({'title': title})
        if(verify)
            return res.status(400).json({'msg': 'product already exist'});

        let product = new Product({title, category});
        product = await product.save();
        return res.status(200).json(product);
    }
    catch(err)
    {
        return res.status(400).json(err)
    }
}


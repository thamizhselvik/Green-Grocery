const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const Farmer = require("../model/farmerModel");
const jwt = require('jsonwebtoken');
const PostProduct = require("../model/postProductModel");
const mongoose = require("mongoose");
const Product = require("../model/productModul");

exports.addFarmer = async(req, res) => {
    try
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).json({err: errors.array()});

        const {name, username, password, contact_no, aadhar, address, state, city, uzhavan} = req.body;

        const verify = await Farmer.findOne({'username': username})
        if(verify)
            return res.status(400).json({'msg': 'Username already taken'});

        const verifyContact = await Farmer.findOne({'contact_no': contact_no})
        if(verifyContact)
            return res.status(400).json({'msg': 'contact already exist'});

        const verifyAadhar = await Farmer.findOne({'aadhar': aadhar})
        if(verifyAadhar)
            return res.status(400).json({'msg': 'aadhar already exist'});

        const verifyUzhavan = await Farmer.findOne({'uzhavan': uzhavan})
        if(verifyUzhavan)
            return res.status(400).json({'msg': 'uzhavan ID already exist'});
        
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
    
        let farmer = new Farmer({name, username, 'password': hashedPassword, contact_no, aadhar, address, state, city, uzhavan});
        farmer = await farmer.save();
        return res.status(200).json(farmer);
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

        const farmer = await Farmer.findOne({'username': username});
        if(!farmer)
            return res.status(400).json({'msg':'Invalid Credentials..!!'})

        const isValid = await bcrypt.compare(password, farmer.password)
        if(!isValid)
            return res.status(400).json({'msg':'Invalid Credentials..!!'})

        const SECRET_KEY = '47222636';
        let farmerObj = {
            'username': farmer.username
        }

        const token = jwt.sign(farmerObj, SECRET_KEY)
        res.status(200).json({'token': token})
    }
    catch(err)
    {
        res.status(400).json({'msg': `Error in api ${err}`});
    }
}

exports.postProduct = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
    
        const farmer = await Farmer.findOne({'username': username});
        if(!farmer)
            return res.status(401).json({"msg":"Unauthorized"})

        const {title, quantity, delivery_time, price, expired, product_desc, color, size } = req.body;

        const categoryObj = await Product.findOne({'title': title});
        const categoryData = categoryObj.category;

        let product = new PostProduct({title, quantity, delivery_time, price, expired, product_desc, color, size, 'farmer': farmer._id, 'category': categoryData });
        product = await product.save();
        return res.status(200).json(product);
    }
    catch(err)
    {
        res.status(400).json({'msg': `Error in api ${err}`});
    }
}

exports.postProductPic = async (req, res) => {
    try 
    {
        let obj = req.user;
        let username = obj.username;

        let farmer = await Farmer.findOne({ 'username': username });

        if (!farmer) 
            return res.status(401).json({ 'msg': 'Unauthorized!!' });

        const { id } = req.params;

        const product = await PostProduct.findById(id);
        if (!product) 
            return res.status(404).json({ 'msg': 'Product not found!' });

        if (!req.file) {
            return res.status(400).json({ 'msg': 'No File detected!!' });
        }

        const multerFileName = req.file.filename;
        const mimeType = req.file.mimetype;
        const fileExtension = mimeType.split("/")[1];

        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ 'msg': `File Not allowed!! Allowed Types: ${allowedExtensions.join(", ")}` });
        }

        product.image = multerFileName;

        await product.save();

        res.json(product);
    } 
    catch (err) 
    {
        res.status(400).json({ 'msg': `Error in API: ${err.message}` });
    }
};


exports.uploadProfilePic = async(req, res) => {
    try{
        let obj = req.user; 
        let username = obj.username; 

        let farmer = await Farmer.findOne({'username': username})
 
        if(farmer === undefined || farmer == null) 
            return res.status(401).json({'msg': 'Unauthorized!!'})

        if(!req.file){
            return res.status(400).json({'msg': 'No File detected!!'})
        }

        const multerFileName = req.file.filename;
        const mimeType = req.file.mimetype;
        const fileExtension = mimeType.split("/")[1];

        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']; 
        if(!allowedExtensions.includes(fileExtension)){
            return res.status(400).json({'msg': 'File Not allowed!! Allowed Types ' + allowedExtensions})
        }

        farmer.image = multerFileName;

        farmer = await farmer.save(farmer);

        res.json(farmer);

    }
    catch(err)
    {
        return res.status(400).json(err)
    }
}

exports.getProductById = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
            
        const farmer = await Farmer.findOne({'username': username});
        if(!farmer)
            return res.status(401).json({"msg":"Unauthorized"})
        
        const product = await PostProduct.find({'farmer': farmer._id});
        if(!product)
            return res.status(400).json('No product available')
        
        return res.status(200).json(product)
    }
    catch(err)
    {
        return res.status(400).json(err)
    }
    
}

exports.deleteProduct = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
        
        const farmer = await Farmer.findOne({'username': username});
        if(!farmer)
            return res.status(401).json({"msg":"Unauthorized"})
    
        const id = req.params.id;
    
        await PostProduct.findByIdAndDelete(id)
    
        res.status(200).json({'msg': 'Deleted Successfully'})
    }
    catch(err)
    {
        res.status(400).json({'msg': `Error in api ${err}`});
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const farmer = await Farmer.findOne({ username });
        if (!farmer) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Product ID" });
        }

        const updateFields = {};
        const allowedFields = ["quantity", "delivery_time", "price", "color", "size"];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: "No valid fields provided for update" });
        }

        const updatedProduct = await PostProduct.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
};


exports.getAllProduct = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;
    
        const farmer = await Farmer.findOne({'username': username});
        if(!farmer)
            return res.status(401).json({"msg":"Unauthorized"})

        const products = await Product.find();
        res.status(200).json(products);
    }
    catch(err)
    {
        return res.status(400).json(err)
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const obj = req.user;
        const username = obj.username;

        const farmer = await Farmer.findOne({ username });
        if (!farmer) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Product ID" });
        }

        const updateFields = {};
        const allowedFields = ["quantity", "delivery_time", "price", "color", "size"];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: "No valid fields provided for update" });
        }

        const updatedProduct = await PostProduct.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
};

exports.checkUsername =  async (req, res) => {
    const { username } = req.body;
    
    try {
      const user = await Farmer.findOne({ username });
      
      if (user) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      res.status(200).json({ message: 'Username is available' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
exports.checkContact_no =  async (req, res) => {
    const { contact_no } = req.body;
      
    try {
        const user = await Farmer.findOne({ contact_no });
        
        if (user) {
          return res.status(400).json({ message: 'phone number already exists' });
        }
        
        res.status(200).json({ message: 'phone number is available' });
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};
  
exports.checkAadhar =  async (req, res) => {
    const { aadhar } = req.body;
      
    try {
        const user = await Farmer.findOne({ aadhar });
        
        if (user) {
          return res.status(400).json({ message: 'Aadhar already exists' });
        }
        
        res.status(200).json({ message: 'aadhar is available' });
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};
  
exports.checkUzhavar_id =  async (req, res) => {
    const { uzhavan } = req.body;
      
    try {
        const user = await Farmer.findOne({ uzhavan });
        
        if (user) {
          return res.status(400).json({ message: 'uzhavar_id already exists' });
        }
        
        res.status(200).json({ message: 'uzhavar_id is available' });
    } 
    catch (err) 
    {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getFarmer = async(req, res) => {
    try
    {
        const obj = req.user;
        const username = obj.username;

        const farmer = await Farmer.findOne({ username });
        if (!farmer) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        res.status(200).json(farmer);
    }
    catch(err)
    {
        res.status(400).json({ 'msg': 'Error in API' });
    }
}
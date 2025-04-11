const express = require("express");
const { body } = require('express-validator');
const { addFarmer, login, postProduct, uploadProfilePic, postProductPic, getProductById, deleteProduct, updateProduct, getAllProduct, checkUsername, checkAadhar, checkContact_no, checkUzhavar_id, getFarmer } = require("../controller/farmerController");
const auth = require("../middleware/auth");
const multer = require('multer');

const uploadProfile = multer({ dest: 'C:/Users/ThamizhSelvi/Desktop/ggfrontend/public/image/profile/farmer' }); //replace it with your file address
const uploadProduct = multer({ dest: 'C:/Users/ThamizhSelvi/Desktop/ggfrontend/public/image/product' }); //replace it with your file address

const router = express.Router();

router.post("/add", [
    body('username').not().isEmpty(),
    body('password').isLength({ min: 6, max: 14 }),
    body('aadhar').isLength(12),
    body('contact_no').isLength(10)
], addFarmer);

router.post("/login", [
    body('username').not().isEmpty(),
    body('password').not().isEmpty()
], login);

router.post("/postProduct", auth, postProduct);
router.post("/postProduct/pic/:id", auth, uploadProduct.single('file'), postProductPic);
router.post("/uploadProfilePic", auth, uploadProfile.single('file'), uploadProfilePic);
router.get("/myProduct", auth, getProductById)
router.delete("/deleteProduct/:id",auth,deleteProduct)
router.put("/updateProduct/:id",auth,updateProduct)
router.get("/getAllProducts", auth, getAllProduct)
router.put("/updateProduct/:id",auth,updateProduct)
router.post("/farmer/checkusername", checkUsername);
router.post("/farmer/checkaadhar", checkAadhar);
router.post("/farmer/checkcontact", checkContact_no);
router.post("/farmer/checkuzhavar", checkUzhavar_id);
router.get("/getFarmer", auth, getFarmer);

module.exports = router;

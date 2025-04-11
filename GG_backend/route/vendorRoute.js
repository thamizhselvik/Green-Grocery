const express = require("express");
const { body } = require('express-validator');
const { addVendor, login, getAllproducts, getProductByCategory, checkUsername, checkAadhar, checkContact_no, checkfssai_id, getVendor, uploadProfilePic, bestSeller } = require("../controller/vendorController");
const auth = require("../middleware/auth");
const multer = require('multer')
const { getProductById } = require("../controller/vendorController");
const uploadProfile = multer({ dest: 'C:/Users/Suriya/Desktop/ggfrontend/public/image/profile/vendor' });

const router = express.Router();

router.post("/add",[
    body('username').not().isEmpty(),
    body('password').isLength({min: 6, max: 14})
], addVendor);

router.post("/login", [
    body('username').not().isEmpty(),
    body('password').not().isEmpty()
], login);

router.get("/getProduct", auth, getAllproducts);
router.get("/getProductByCat/:category", auth, getProductByCategory);
router.get("/getProductById/:id", auth, getProductById);
router.post("/vendor/checkusername", checkUsername);
router.post("/vendor/checkaadhar", checkAadhar);
router.post("/vendor/checkcontact", checkContact_no);
router.post("/vendor/checkfssai", checkfssai_id);
router.get("/getVendor", auth, getVendor);
router.post("/uploadPic", auth, uploadProfile.single('file'), uploadProfilePic);
router.get("/bestSeller", auth, bestSeller);

module.exports = router;
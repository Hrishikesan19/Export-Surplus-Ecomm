const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// Middleware for validating required fields
const validateSellerFields = (req, res, next) => {
  const { name, email, password, address, phoneNumber, zipCode } = req.body;
  if (!name || !email || !password || !address || !phoneNumber || !zipCode) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }
  next();
};

// create shop
router.post("/create-shop", validateSellerFields, catchAsyncErrors(async (req, res, next) => {
  const { email, avatar, name, password, address, phoneNumber, zipCode } = req.body;

  // Check if seller already exists
  const existingSeller = await Shop.findOne({ email });
  if (existingSeller) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Upload avatar to cloudinary
  const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars" });

  const sellerData = {
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    address,
    phoneNumber,
    zipCode,
  };

  const activationToken = createActivationToken(sellerData);
  const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

  // Send activation email
  try {
    await sendMail({
      email: sellerData.email,
      subject: "Activate your Shop",
      message: `Hello ${sellerData.name}, please click on the link to activate your shop: ${activationUrl}`,
    });
    res.status(201).json({
      success: true,
      message: `Please check your email: ${sellerData.email} to activate your shop!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

// activate user
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  const { activation_token } = req.body;
  try {
    const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    console.log(newSeller)
    // Check if seller already exists
    const { email } = newSeller;
    const existingSeller = await Shop.findOne({ email });
    if (existingSeller) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Create new seller
    const seller = await Shop.create(newSeller);
    sendShopToken(seller, 201, res);
  } catch (error) {
    return next(new ErrorHandler("Invalid token or token expired", 400));
  }
}));

// login shop
router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new ErrorHandler("Please provide all fields!", 400));
  }

  const user = await Shop.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 400));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Incorrect password", 400));
  }

  sendShopToken(user, 201, res);
}));

// load shop
router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {
  const seller = await Shop.findById(req.seller._id);
  if (!seller) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }
  res.status(200).json({ success: true, seller });
}));

// log out from shop
router.get("/logout", catchAsyncErrors(async (req, res) => {
  res.cookie("seller_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ success: true, message: "Log out successful!" });
}));

// get shop info
router.get("/get-shop-info/:id", catchAsyncErrors(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) {
    return next(new ErrorHandler("Shop not found", 404));
  }
  res.status(200).json({ success: true, shop });
}));

// update shop profile picture
router.put("/update-shop-avatar", isSeller, catchAsyncErrors(async (req, res, next) => {
  const existsSeller = await Shop.findById(req.seller._id);
  if (!existsSeller) {
    return next(new ErrorHandler("User not found", 404));
  }

  const imageId = existsSeller.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
  });

  existsSeller.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await existsSeller.save();
  res.status(200).json({ success: true, seller: existsSeller });
}));

// update seller info
router.put("/update-seller-info", isSeller, catchAsyncErrors(async (req, res, next) => {
  const { name, description, address, phoneNumber, zipCode } = req.body;
  const shop = await Shop.findById(req.seller._id);
  
  if (!shop) {
    return next(new ErrorHandler("User not found", 404));
  }

  shop.name = name;
  shop.description = description;
  shop.address = address;
  shop.phoneNumber = phoneNumber;
  shop.zipCode = zipCode;

  await shop.save();
  res.status(200).json({ success: true, shop });
}));

// all sellers --- for admin
router.get("/admin-all-sellers", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res) => {
  const sellers = await Shop.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, sellers });
}));

module.exports = router;

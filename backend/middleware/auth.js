const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

// Middleware to check if the user is authenticated
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Fetch the user from the User collection
    req.user = await User.findById(decoded.id);

    // If user does not exist
    if (!req.user) {
        return next(new ErrorHandler("User not found", 404));
    }

    next();
});

// Middleware to check if the seller is authenticated
exports.isSeller = catchAsyncErrors(async (req, res, next) => {
    const { seller_token } = req.cookies;

    if (!seller_token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    // Verify the seller token
    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
    // Fetch the seller from the Shop collection
    req.seller = await Shop.findById(decoded.id);

    // If seller does not exist
    if (!req.seller) {
        return next(new ErrorHandler("Seller not found", 404));
    }

    next();
});

// Middleware to check if the user has admin privileges
exports.isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} cannot access this resource!`, 403));
        }
        next();
    };
};

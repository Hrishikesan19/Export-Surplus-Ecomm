# Export Surplus eCommerce Platform

This project is an Export Surplus eCommerce Platform designed for sellers to list products and for buyers to purchase them securely. It includes features such as user and seller registration, authentication, product management, order handling, and payment integration. The backend is built with Node.js, Express, MongoDB, and Cloudinary for image handling, while the frontend can be built with any framework you choose (e.g., React, Angular, etc.).

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Features

- **User Management**: User registration, login, avatar uploads, and password reset.
- **Seller Management**: Seller registration, shop creation, and shop activation email.
- **Product Management**: CRUD operations for products, image uploads using Cloudinary.
- **Review and Rating**: Users can review products they’ve purchased.
- **Order Handling**: Order creation, cart handling, and order completion.
- **Admin Control**: Admin access to manage users, sellers, and products.
- **Payment Integration**: Secure payment processing with Stripe.

## Technologies Used

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React (suggested)
- **Authentication**: JSON Web Tokens (JWT)
- **Image Hosting**: Cloudinary
- **Payment Processing**: Stripe
- **Email**: Nodemailer
- **Validation & Error Handling**: Joi, custom error handler

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Hrishikesan19/Export-Surplus-Ecomm
   cd Export-Surplus-Ecomm
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following environment variables:

   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ACTIVATION_SECRET=your_activation_token_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_email
   SMTP_PASS=your_smtp_password
   STRIPE_API_KEY=your_stripe_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Run the Server**
   ```bash
   npm start
   ```

5. **Frontend Setup** (optional, if you want to use React as the frontend)
   - Navigate to the frontend directory, install dependencies, and start the frontend server.

## Environment Variables

The `.env` file should include the following variables:

```plaintext
MONGO_URI=        # MongoDB connection string
JWT_SECRET=       # Secret key for JWT token generation
ACTIVATION_SECRET=# Secret key for user activation
CLOUDINARY_NAME=  # Cloudinary cloud name
CLOUDINARY_API_KEY= # Cloudinary API key
CLOUDINARY_API_SECRET= # Cloudinary API secret
SMTP_HOST=        # SMTP server host (for email)
SMTP_PORT=        # SMTP server port
SMTP_USER=        # SMTP user email address
SMTP_PASS=        # SMTP password
STRIPE_API_KEY=   # Stripe API key for payments
STRIPE_SECRET_KEY= # Stripe secret key for payments
```

## API Endpoints

### User Endpoints

- **POST** `/api/v1/create-user` - Register a new user
- **POST** `/api/v1/login-user` - User login
- **GET** `/api/v1/logout` - User logout
- **GET** `/api/v1/getuser` - Get user info (protected)
- **PUT** `/api/v1/update-user-info` - Update user info
- **PUT** `/api/v1/update-user-password` - Update user password
- **PUT** `/api/v1/update-avatar` - Update user avatar

### Seller Endpoints

- **POST** `/api/v1/create-shop` - Create a new seller shop
- **POST** `/api/v1/login-shop` - Seller login
- **GET** `/api/v1/logout` - Seller logout
- **GET** `/api/v1/getSeller` - Get seller info (protected)
- **PUT** `/api/v1/update-shop-avatar` - Update shop avatar
- **PUT** `/api/v1/update-seller-info` - Update seller information

### Product Endpoints

- **POST** `/api/v1/create-product` - Create a new product
- **GET** `/api/v1/products` - Get all products
- **PUT** `/api/v1/product/:id` - Update product details
- **DELETE** `/api/v1/product/:id` - Delete a product

### Order and Review Endpoints

- **POST** `/api/v1/create-new-review` - Add or update a product review
- **PUT** `/api/v1/update-order-status` - Update order status
- **GET** `/api/v1/order/:id` - Retrieve order details

### Admin Endpoints

- **GET** `/api/v1/admin-all-users` - Get all users
- **DELETE** `/api/v1/delete-user/:id` - Delete a user


## Future Enhancements

- **User Notifications**: Notify users on order updates, promotions, etc.
- **Enhanced Admin Dashboard**: Comprehensive analytics and reporting.
- **Order Tracking**: Integration with delivery services for real-time order tracking.
- **Customer Support Chat**: Live chat feature for customer support.
- **Promotions and Coupons**: Allow admin to create discount codes.

This README gives a detailed overview of the project, setup instructions, and API endpoints, making it easy for new developers to understand and work with the project.

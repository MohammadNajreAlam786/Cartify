# Cartify - E-Commerce Platform

Cartify is a full-featured, modern E-Commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a complete shopping experience from product browsing to secure checkout, complete with an administrative dashboard for managing the store.

## Features

### For Customers
* **Product Catalog**: Browse products with search and pagination capabilities.
* **Shopping Cart**: Add, remove, and update quantities of items in the cart.
* **User Authentication**: Secure login and registration with JWT (JSON Web Tokens).
* **Checkout Process**: Secure payment integration using Stripe and PayPal.
* **Order History**: View past orders and current order status (Paid, Delivered).
* **Product Reviews**: Logged-in users can write reviews and rate products.
* **Responsive Design**: Beautiful, modern UI that works on desktops, tablets, and mobile devices.

### For Administrators
* **User Management**: View all users, edit user details, and assign admin privileges.
* **Product Management**: Create, edit, and delete products. Upload product images.
* **Order Management**: View all orders across the platform and mark them as delivered.

## Tech Stack

* **Frontend**: React.js, Vite, Redux Toolkit, TailwindCSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JWT & HTTP-Only Cookies
* **Payments**: Stripe & PayPal APIs

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* MongoDB (Local or Atlas)
* Stripe Account (for payments)
* PayPal Developer Account (for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohammadNajreAlam786/Cartify.git
   cd Cartify
   ```

2. **Install dependencies for both backend and frontend:**
   ```bash
   npm run build
   ```
   *(This custom script installs all dependencies and builds the frontend for production).*

3. **Environment Variables:**
   Create a `.env` file in the `backend/` directory and add the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Seed the database (Optional):**
   To populate the database with sample products and users, run:
   ```bash
   npm run data:import
   ```
   *(Admin login for seeded data: admin@example.com / 123456)*

5. **Run the application:**
   To run both the frontend and backend concurrently in development mode:
   ```bash
   npm run dev
   ```

## Deployment

The application is configured to serve the frontend from the backend in production, making it incredibly easy to deploy as a single service on platforms like Render or Heroku.

1. Ensure `NODE_ENV` is set to `production` in your environment variables on the hosting platform.
2. The build command should be `npm run build`.
3. The start command should be `npm start`.

## License

This project is licensed under the MIT License.

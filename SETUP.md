# Setup Instructions

This document provides step-by-step instructions to get your shopping web app running.

## Prerequisites

### 1. Install Node.js
- Download from: https://nodejs.org (recommended: LTS version 18+)
- Or use Homebrew: `brew install node`
- Verify installation: `node --version` and `npm --version`

### 2. Navigate to Project Directory
```bash
cd "/Users/ingenium/Desktop/untitled folder"
```

## Installation Steps

### Option A: Using VS Code Tasks (Recommended)
1. Open the project in VS Code
2. Use Terminal → Run Task (Shift+Alt+T)
3. Select "Install All Dependencies" and run

### Option B: Manual Installation
```bash
# Backend setup
cd server
npm install
npm run dev

# In another terminal - Frontend setup
cd client
npm install
npm start
```

## Running the Application

### Using VS Code Tasks
1. **Start Backend**: Terminal → Run Task → "Start Backend Server"
2. **Start Frontend**: Terminal → Run Task → "Start Frontend App"

### Manual Command Line
**Terminal 1:**
```bash
cd server
npm run dev
```

**Terminal 2:**
```bash
cd client
npm start
```

### Expected Results
- Backend: Running on `http://localhost:5000`
- Frontend: Running on `http://localhost:3000` (automatic browser open)

## Features Available

### Product Browsing
- View 6 sample products
- See product details with images and prices

### Shopping Cart
- Add/remove items
- Update quantities
- View cart total

### Checkout
- Enter shipping information
- Enter payment details
- Process order

## Project Files

### Frontend (`/client`)
- **src/components/** - Reusable React components
  - `Header.js` - Navigation header with cart count
  - `ProductCard.js` - Individual product card component

- **src/pages/** - Full page components
  - `ProductList.js` - Browse all products
  - `Cart.js` - Shopping cart view
  - `Checkout.js` - Payment & order form

- **src/App.js** - Main application component with routing

### Backend (`/server`)
- **controllers/** - Business logic
  - `productController.js` - Product CRUD operations
  - `checkoutController.js` - Order processing

- **routes/** - API endpoints
  - `products.js` - Product endpoints
  - `checkout.js` - Payment & order endpoints

- **server.js** - Express application setup

## API Endpoints

### GET /api/products
Returns all available products

### GET /api/products/:id
Returns a specific product by ID

### POST /api/checkout
Processes a payment order
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "address": "string",
  "cardNumber": "string",
  "expiryDate": "string",
  "cvv": "string",
  "items": "array",
  "total": "number"
}
```

### GET /api/orders
Retrieves all orders (admin endpoint)

## Troubleshooting

### npm: command not found
- Install Node.js from https://nodejs.org
- Restart terminal/VS Code after installation

### Port 3000 or 5000 already in use
- Kill process: `lsof -ti:3000 | xargs kill -9`
- Or change port in server/.env

### CORS errors
- Ensure backend is running on port 5000
- Frontend should be on port 3000

### Dependencies not installing
- Delete `node_modules` folder
- Run `npm install` again
- Try `npm install --legacy-peer-deps`

## Next Steps

1. **Install Node.js** if not already done
2. **Run installation** as described above
3. **Test the application** at http://localhost:3000
4. **Customize** products, styling, and features as needed

## Database Integration (Optional)

To connect to a database instead of in-memory data:
1. Install MongoDB or PostgreSQL
2. Update `controllers/productController.js` and `controllers/checkoutController.js`
3. Create `.env` variables for database connection

## Payment Gateway Integration (Optional)

To integrate real payments:
1. Create account at Stripe (https://stripe.com) or PayPal
2. Install payment library: `npm install stripe` or `npm install paypal-rest-sdk`
3. Update `controllers/checkoutController.js` with gateway logic
4. Add API keys to `.env`

## Support

For issues or questions:
- Check the README.md file
- Review the .github/copilot-instructions.md file
- Check VS Code integrated terminal for error messages

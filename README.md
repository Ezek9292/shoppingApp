# Shopping Web App

A full-stack e-commerce web application built with React (frontend) and Node.js/Express (backend). Users can browse products, add items to cart, and complete purchases with JWT authentication.

## Features

- 🛍️ Product browsing with grid layout
- 🛒 Shopping cart with quantity management
- 🔐 User authentication with JWT
- 💳 Secure checkout (authentication required)
- 📱 Responsive design
- 🔄 Real-time cart updates
- 🎨 Modern UI with CSS styling
- 👤 User profiles and order history

## Tech Stack

### Frontend
- React 18
- React Router DOM for navigation
- Context API for state management
- CSS3 for styling
- JWT token storage in localStorage

### Backend
- Node.js
- Express.js
- JWT authentication (jsonwebtoken)
- Password hashing (bcryptjs)
- CORS for cross-origin requests
- dotenv for environment variables

## Project Structure

```
shopping-app/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductCard.css
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── ProductList.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── [CSS files]
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                    # Express backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── checkoutController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── checkout.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or extract the project**

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd client
npm start
```
The app will open at `http://localhost:3000`

## Authentication System

### User Registration
- Create new account with email, password, first name, and last name
- Passwords are hashed using bcryptjs
- Minimum password length: 6 characters

### User Login
- Login with email and password
- JWT token is generated and stored in localStorage
- Token expires in 24 hours

### Protected Routes
- `/checkout` - Requires authentication
- Users are redirected to login if trying to access protected routes
- Token is automatically sent in Authorization header

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Checkout
- `POST /api/checkout` - Process payment (requires auth)
- `GET /api/user-orders` - Get user's orders (requires auth)
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID

## Sample Products

The app comes with 6 sample products:
- Laptop ($999.99)
- Mouse ($29.99)
- Keyboard ($79.99)
- Monitor ($399.99)
- Headphones ($199.99)
- Webcam ($89.99)

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Product search and filtering
- [ ] Product reviews and ratings
- [ ] Order tracking
- [ ] Wishlist feature
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Refresh token rotation

## Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
```

### Important Security Notes
- **Change JWT_SECRET in production** - Use a strong, random string
- **Never commit .env to version control**
- **Use HTTPS in production**
- **Never store full card details** - Use a payment gateway
- **Implement rate limiting** for auth endpoints
- **Add CSRF protection** in production

## User Session Management

- Tokens are stored in localStorage
- On page refresh, user session persists (if token valid)
- Logout clears token and user data
- Expired tokens trigger re-login

## Testing

### Test Credentials
Use these to test the app:

**Register a new account:**
- Go to `/register`
- Fill in any email, password, and names

**Login:**
- Go to `/login`
- Use your registered credentials

### Testing Checkout
1. Login/Register
2. Browse products
3. Add items to cart
4. Go to cart
5. Click "Proceed to Checkout"
6. Fill in shipping and payment info
7. Submit order

## Notes

- This is a demo application with in-memory user and order storage
- For production, implement a proper database (MongoDB/PostgreSQL)
- Password hashing uses bcryptjs with salt rounds of 10
- JWT tokens include userId and email

## License

MIT License


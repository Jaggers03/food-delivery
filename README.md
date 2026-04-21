# 🍽️ FeastFlow — Full-Stack Food Delivery App

A complete food delivery web application built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 📁 Project Structure

```
food-delivery/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Profile
│   │   ├── menuController.js      # CRUD for menu items
│   │   └── orderController.js     # Place & manage orders
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt password)
│   │   ├── MenuItem.js            # Menu item schema
│   │   └── Order.js               # Order schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── menuRoutes.js          # /api/menu/*
│   │   ├── cartRoutes.js          # /api/cart/validate
│   │   └── orderRoutes.js         # /api/orders/*
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Navigation bar
│   │   │   └── ProtectedRoute.js  # Auth + admin route guard
│   │   ├── context/
│   │   │   ├── AuthContext.js     # Global auth state
│   │   │   └── CartContext.js     # Global cart state
│   │   ├── pages/
│   │   │   ├── Home.js            # Landing page
│   │   │   ├── Login.js           # Login form
│   │   │   ├── Register.js        # Sign-up form
│   │   │   ├── Menu.js            # Browse food menu
│   │   │   ├── Cart.js            # Cart + checkout
│   │   │   ├── Orders.js          # User order history
│   │   │   └── Admin.js           # Admin dashboard
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + all API calls
│   │   ├── App.js                 # Router + providers
│   │   ├── App.css                # Global styles
│   │   └── index.js               # React entry point
│   └── package.json
│
├── package.json                   # Root (run both together)
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

Make sure you have installed:
- **Node.js** v18 or higher — https://nodejs.org
- **MongoDB** (local) or a **MongoDB Atlas** account — https://mongodb.com/atlas
- **npm** (comes with Node.js)

---

### Step 1 — Clone & Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or use the shortcut from the root folder:
```bash
npm run install-all
```

---

### Step 2 — Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/fooddelivery`

---

### Step 3 — Run Backend

```bash
cd backend
npm run dev        # development (nodemon auto-reload)
# OR
npm start          # production
```

Backend runs at: **http://localhost:5000**

---

### Step 4 — Run Frontend

Open a **new terminal**:

```bash
cd frontend
npm start
```

Frontend runs at: **http://localhost:3000**

---

### Step 5 — Run Both Together (Optional)

From the root folder:

```bash
npm run dev
```

This uses `concurrently` to start both backend and frontend simultaneously.

---

## 📡 REST API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login & receive JWT |
| GET | `/api/auth/profile` | Protected | Get logged-in user profile |

**Register body:**
```json
{ "name": "John", "email": "john@mail.com", "password": "secret123" }
```

**Login body:**
```json
{ "email": "john@mail.com", "password": "secret123" }
```

---

### Menu Routes — `/api/menu`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/menu` | Public | Get all menu items |
| GET | `/api/menu?category=Pizza` | Public | Filter by category |
| GET | `/api/menu/:id` | Public | Get single item |
| POST | `/api/menu` | Admin only | Add new menu item |
| PUT | `/api/menu/:id` | Admin only | Update menu item |
| DELETE | `/api/menu/:id` | Admin only | Delete menu item |

**Add menu item body (Admin):**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic tomato and mozzarella",
  "price": 349,
  "category": "Pizza",
  "image": "https://example.com/pizza.jpg"
}
```

---

### Order Routes — `/api/orders`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Protected | Place a new order |
| GET | `/api/orders/my` | Protected | Get my orders |
| GET | `/api/orders` | Admin only | Get all orders |
| PUT | `/api/orders/:id/status` | Admin only | Update order status |

**Place order body:**
```json
{
  "items": [{ "menuItem": "<menuItemId>", "quantity": 2 }],
  "deliveryAddress": "123 Main Street, Chennai",
  "paymentMethod": "Cash on Delivery"
}
```

---

### Cart Routes — `/api/cart`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/cart/validate` | Protected | Validate cart items & prices |

---

## 🔐 Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned from `/api/auth/login` and `/api/auth/register`.

---

## 👤 Creating an Admin User

To create an admin account, register normally then update the user role in MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or register with the `role` field directly (via API, not the UI):
```json
{ "name": "Admin", "email": "admin@mail.com", "password": "admin123", "role": "admin" }
```

---

## 🌟 Features

- ✅ User registration & login (JWT authentication)
- ✅ Browse food menu with category filtering
- ✅ Add to cart with quantity controls
- ✅ Place orders with delivery address & payment method
- ✅ View personal order history with real-time status
- ✅ Admin dashboard to add/delete menu items
- ✅ Admin can view & update all order statuses
- ✅ Protected routes (user & admin)
- ✅ Input validation (frontend + backend)
- ✅ Password hashing with bcrypt
- ✅ Toast notifications for all actions
- ✅ Responsive mobile-friendly design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Validation | express-validator (backend), client-side validation |

---

## 📦 Menu Item Categories

`Burgers` · `Pizza` · `Sushi` · `Salads` · `Desserts` · `Drinks` · `Sides`

---

## 🐛 Troubleshooting

**MongoDB connection failed?**
- Make sure MongoDB service is running: `mongod` or start via system service
- Check your `MONGO_URI` in `.env`

**CORS errors?**
- The backend uses the `cors` package with default settings (all origins)
- For production, restrict to your frontend domain in `server.js`

**Port already in use?**
- Change `PORT` in backend `.env`
- For frontend, React will prompt you to use a different port automatically

# 👟 SHOERACK - Modern E-commerce Platform

A modern, full-stack e-commerce platform for selling shoes with a beautiful UI, built with React, Node.js, and MongoDB.

## ✨ Features

- 🎨 **Modern UI Design** with glassmorphism effects and smooth animations
- 📱 **Responsive Design** - works perfectly on all devices
- 🛒 **Shopping Cart** with local storage persistence
- 👤 **User Authentication** with JWT tokens
- 🔍 **Advanced Product Filtering** by category, brand, price
- 💳 **Secure Checkout Process** with Razorpay integration
- 👨‍💼 **Admin Panel** for managing products, orders, and users
- 🎯 **Real-time Updates** and smooth user experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SHOERACK
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   
   Backend (.env in /backend folder):
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/shoerack
   JWT_SECRET=your_jwt_secret_key_here
   ```
   
   Frontend (.env in /frontend folder):
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

4. **Start the application**
   ```bash
   npm start
   ```
   
   This will:
   - Seed the database with sample data
   - Start the backend server on port 5001
   - Start the frontend server on port 3000

### Alternative: Manual Start

1. **Seed database with sample data**
   ```bash
   npm run seed
   ```

2. **Start both servers**
   ```bash
   npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Admin Panel**: http://localhost:3000/admin (login with admin credentials)

## 🔑 Default Admin Credentials

After seeding, you can create an admin user by running:
```bash
cd backend
node createAdmin.js
```

## 📁 Project Structure

```
SHOERACK/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── utils/          # Utility functions
│   └── public/
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/              # Utility functions
└── README.md
```

## 🎨 UI Features

### Modern Design Elements
- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** and smooth transitions
- **Animated components** with staggered loading
- **Responsive grid layouts** for all screen sizes
- **Interactive hover effects** and micro-animations

### Components
- **Header**: Modern navigation with search and user menu
- **Footer**: Gradient design with organized sections
- **Product Cards**: Enhanced with hover effects and ratings
- **Filters**: Glassmorphism sidebar with advanced filtering
- **Cart**: Persistent shopping cart with local storage

## 🛠️ API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

## 🔧 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run seed` - Seed database with sample data
- `npm run install-deps` - Install all dependencies

### Database Seeding

The application includes sample data for:
- **Products**: Nike, Adidas, and other popular shoe brands
- **Categories**: Sneakers, Sports, Formal, Casual
- **Brands**: Major shoe manufacturers

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred database
2. Update MONGODB_URI in environment variables
3. Deploy to Heroku, Vercel, or your preferred platform

### Frontend Deployment
1. Update REACT_APP_API_URL to your backend URL
2. Build the project: `npm run build`
3. Deploy to Netlify, Vercel, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Port Already in Use**
   - Change PORT in backend .env file
   - Update REACT_APP_API_URL accordingly

3. **CSS Compilation Errors**
   - Ensure all Tailwind classes are valid
   - Check for syntax errors in CSS files

4. **API Connection Issues**
   - Verify backend server is running
   - Check CORS configuration
   - Ensure API URLs match in frontend

### Getting Help

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check that MongoDB is running and accessible

---

**Happy coding! 🎉**
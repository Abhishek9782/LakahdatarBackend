# 🍽️ Lakhdatar Restaurant - MERN Stack E-Commerce Platform

## 📋 Table of Contents
- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Installation](#-installation)
- [⚙️ Environment Variables](#️-environment-variables)
- [📚 API Documentation](#-api-documentation)
- [👥 Roles & Permissions](#-roles--permissions)
- [💳 Payment Integration](#-payment-integration)
- [🎯 Key Functionalities](#-key-functionalities)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)

## 🏢 Overview
**Lakhdatar Restaurant** is a comprehensive restaurant management and food delivery platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform features a multi-role architecture supporting **Customers, Vendors (Restaurant Owners), and Administrators** with complete restaurant listing, online ordering, payment processing, and management capabilities.

## ✨ Features

### 🎭 Multi-Role System
| Role | Description | Key Capabilities |
|------|-------------|------------------|
| 👑 **Admin** | System administrator with full control | User management, vendor approvals, analytics, CMS |
| 🏪 **Vendor** | Restaurant owner/manager | Menu management, order processing, earnings tracking |
| 👤 **Customer** | End-user ordering food | Browse restaurants, order food, track deliveries |

### 🛒 Customer Features
- 🔐 **Secure Authentication**: JWT-based login/registration with OTP verification
- 🍽️ **Restaurant Discovery**: Browse multiple restaurants with filters and search
- 🛍️ **Smart Cart**: Add items from different restaurants with quantity management
- 💰 **Secure Payments**: Razorpay integration for seamless transactions
- 📊 **Order Tracking**: Real-time order status updates
- ⭐ **Reviews & Ratings**: Rate restaurants and dishes
- 📍 **Address Management**: Multiple delivery addresses
- 🔔 **Notifications**: Real-time order updates

### 🏪 Vendor Features
- 🏢 **Restaurant Dashboard**: Complete business overview
- 📝 **Menu Management**: Add/edit/delete food items with images
- 📊 **Order Management**: Process and track customer orders
- 💸 **Earnings Dashboard**: View sales analytics and revenue
- ⭐ **Review Management**: Moderate customer reviews
- 🏷️ **Category Management**: Organize menu items
- 🔔 **Real-time Updates**: Instant order notifications

### ⚙️ Admin Features
- 👥 **User Management**: Activate/deactivate users and vendors
- 📦 **Product Oversight**: Monitor all restaurant products
- 📧 **Email Templates**: Customize system email templates
- 📊 **Analytics Dashboard**: System-wide performance metrics
- 🏪 **Vendor Approvals**: Approve/reject restaurant registrations
- ⚙️ **System Configuration**: Manage platform settings

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite build tool
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **Tailwind CSS** with custom themes
- **Material-UI** components
- **Axios** for API calls
- **Formik & Yup** for form validation
- **React Icons** for iconography

### Backend
- **Node.js** with **Express.js** framework
- **MongoDB** with **Mongoose** ODM
- **JWT** for secure authentication
- **Bcrypt.js** for password hashing
- **Multer & Cloudinary** for file uploads
- **Nodemailer** for email services
- **Express Validator** for input validation
- **Socket.io** for real-time features

### Payment & Services
- **Razorpay** for payment processing
- **Cloudinary** for image storage
- **Firebase** for notifications
- **Redis** for caching (optional)

## 📁 Project Structure

### Frontend Structure (`LakhdatarFrontend/`)
```
src/
├── admin/                    # Admin panel components
│   ├── AdminPages/          # Admin pages (Dashboard, Products, Users, etc.)
│   └── Components/          # Admin reusable components
├── api/                     # API service files
├── Components/              # Shared components
│   ├── common/              # Common UI components
│   ├── dashboard/           # Dashboard components
│   └── vendor/              # Vendor-specific components
├── context/                 # React Context providers
├── guard/                   # Route protection components
├── layout/                  # Layout components for different roles
├── pages/                   # Main application pages
├── services/                # Service layer
├── sockets/                 # Socket.io configuration
├── store/                   # Redux store and slices
├── theme/                   # Theme configuration
└── utils/                   # Utility functions
```

### Backend Structure (`Lakhdatar_Backend/`)
```
src/
├── config/                  # Configuration files
├── controllers/             # Route controllers
├── middleware/              # Custom middleware
├── models/                  # MongoDB models
├── routes/                  # API routes
├── services/               # Business logic
├── utils/                  # Helper functions
└── validators/             # Request validators
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn** package manager
- **Razorpay Account** (for payment processing)
- **Cloudinary Account** (for image storage)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/abhishek-mishra-mern/LakahdatarBackend.git
cd Lakhdatar_Backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd ../LakhdatarFrontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

## ⚙️ Environment Variables

### Backend Configuration (`.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
API_VERSION=/v1/api

# Database
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/lakhdatar
MONGODB_LOCAL=mongodb://localhost:27017/lakhdatar

# JWT Secrets
JWT_SECRET_KEY=your_user_jwt_secret
ADMIN_JWT_SECRET_KEY=your_admin_jwt_secret
VENDOR_JWT_SECRET_KEY=your_vendor_jwt_secret
ADMIN_TOKEN_EXPIRE=2h

# Frontend URLs
LOCAL_URL=http://localhost:5173
LIVE_URL=https://yourdomain.com

# Email Configuration (Nodemailer)
EMAIL_PORT=587
EMAIL=your_email@gmail.com
EMAIL_PASS=your_email_password

# Payment Gateway (Razorpay)
RAZORPAY_ID=your_razorpay_id
RAZORPAY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary (Image Storage)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

### Frontend Configuration (`.env.local`)
```env
VITE_API_URL=http://localhost:5000/v1/api
VITE_ADMIN_API_URL=http://localhost:5000/lakhdatar/admin
VITE_VENDOR_API_URL=http://localhost:5000/v1/api/vendor
VITE_RAZORPAY_KEY=your_razorpay_key_id
VITE_SITE_NAME=Lakhdatar Restaurant
VITE_FIREBASE_CONFIG={your_firebase_config}
```

## 📚 API Documentation

### 📋 Base URLs
- **Main API**: `http://localhost:5000/v1/api`
- **Admin API**: `http://localhost:5000/lakhdatar/admin`
- **Vendor API**: `http://localhost:5000/v1/api/vendor`

### 👤 User Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user-register` | Register new customer | No |
| POST | `/user-login` | Customer login | No |
| POST | `/verifyOtp` | Verify OTP | No |
| POST | `/forgotPassword` | Password recovery | No |
| POST | `/changePassword` | Change password | Yes (User) |
| GET | `/getProfile/:userId` | Get user profile | Yes (User) |
| POST | `/logout` | User logout | Yes (User) |

### 🛒 Cart Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/addToCart/:productId` | Add to cart | Yes (User) |
| GET | `/getAllCarts` | Get cart items | Yes (User) |
| POST | `/cartIncreaseQty/:cartItemId` | Increase quantity | Yes (User) |
| POST | `/cartDecreaseQty/:cartItemId` | Decrease quantity | Yes (User) |

### 🍽️ Product Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/food` | Get all products (paginated) | No |
| GET | `/food/getProduct/:id` | Get product details | No |
| GET | `/food/featureProducts` | Get featured products | No |
| GET | `/food/type/:type` | Get by type (breakfast/lunch/dinner) | No |
| GET | `/food/our-special` | Get special products | No |
| POST | `/food/favProduct` | Get favorite products | Yes (User) |

### 📦 Order Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Get user orders (with filters) | Yes (User) |
| POST | `/orders/:orderId` | Get order details | Yes (User) |

### 🏪 Vendor Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Vendor registration | No |
| POST | `/login` | Vendor login | No |
| POST | `/otp-verified` | Verify vendor OTP | No |
| GET | `/profile` | Get vendor profile | Yes (Vendor) |
| POST | `/food-create` | Create food item | Yes (Vendor) |
| POST | `/orders` | Get vendor orders | Yes (Vendor) |
| POST | `/update-order-status` | Update order status | Yes (Vendor) |
| GET | `/dashboard` | Vendor dashboard | Yes (Vendor) |
| GET | `/my-earnings` | Vendor earnings | Yes (Vendor) |

### 👑 Admin Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/access/login` | Admin login | No |
| GET | `/allusers` | Get all users | Yes (Admin) |
| POST | `/changeuserStatus` | Change user status | Yes (Admin) |
| POST | `/product/productadd` | Add product | Yes (Admin) |
| POST | `/category/create-category` | Create category | Yes (Admin) |
| POST | `/email-templates/addTemplate` | Add email template | Yes (Admin) |

### 📊 Dashboard Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Vendor dashboard | Yes (Vendor) |
| GET | `/recentOrders` | Recent orders | Yes (Vendor) |
| GET | `/total-pending` | Pending orders count | Yes (Vendor) |

## 👥 Roles & Permissions

### 👑 Administrator
- **Full System Control**: Complete access to all features
- **User Management**: Activate/deactivate users and vendors
- **Content Moderation**: Approve/reject products and reviews
- **Analytics**: Access to comprehensive sales and user analytics
- **Email Templates**: Customize system email communications
- **System Settings**: Configure platform-wide settings

### 🏪 Vendor/Restaurant Owner
- **Restaurant Profile**: Complete restaurant information management
- **Menu Management**: Add, edit, and organize food items
- **Order Processing**: Accept/reject orders, update status
- **Inventory Control**: Track stock and availability
- **Earnings Dashboard**: View sales reports and analytics
- **Review Management**: Respond to customer reviews

### 👤 Customer
- **Account Management**: Profile creation and management
- **Restaurant Browsing**: Search and filter restaurants
- **Order Placement**: Add to cart and checkout
- **Payment Processing**: Secure online payments
- **Order Tracking**: Real-time order status
- **Reviews & Ratings**: Share dining experiences

## 💳 Payment Integration

### Razorpay Payment Flow
1. **Order Creation**: Backend creates Razorpay order with amount details
2. **Checkout Initiation**: Frontend opens Razorpay modal with order details
3. **Payment Processing**: User completes payment via Razorpay
4. **Verification**: Backend verifies payment signature
5. **Order Confirmation**: System updates order status and notifies parties

### Webhook Events
- `payment.captured`: Successful payment
- `payment.failed`: Payment failure
- `order.paid`: Order completion
- `refund.processed`: Refund processed

### Security Features
- **Signature Verification**: All payments verified with Razorpay signatures
- **SSL/TLS Encryption**: Secure data transmission
- **PCI DSS Compliance**: Razorpay handles sensitive card data
- **Webhook Security**: HMAC signature verification for webhooks

## 🎯 Key Functionalities

### 🔐 Authentication System
- JWT-based authentication with role-specific tokens
- OTP verification for email and mobile
- Password reset with secure token validation
- Session management with refresh tokens

### 🛍️ Shopping Experience
- Multi-restaurant cart system
- Real-time price calculation
- Delivery address management
- Order history with detailed tracking
- Favorite restaurants and dishes

### 📊 Vendor Management
- Real-time order notifications
- Inventory management system
- Pricing and discount management
- Performance analytics dashboard
- Customer feedback system

### 📱 Admin Panel
- Real-time dashboard with key metrics
- User activity monitoring
- Sales and revenue reports
- System health monitoring
- Email template editor

## 🚢 Deployment

### Backend Deployment (Recommended: Render/AWS/Heroku)
```bash
# Build for production
npm run build

# Set production environment
NODE_ENV=production

# Start production server
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build production bundle
npm run build

# Deploy to hosting service
# The build folder will be deployed
```

### Database Deployment (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Configure IP whitelisting
3. Set up database user with appropriate permissions
4. Enable backups and monitoring
5. Configure connection string in environment variables

### Environment Setup Checklist
- [ ] Configure all environment variables
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure domain and DNS settings
- [ ] Set up backup strategy
- [ ] Configure monitoring and alerts
- [ ] Test payment gateway in production mode
- [ ] Configure email service
- [ ] Set up CDN for static assets

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create Feature Branch**: `git checkout -b feature/AmazingFeature`
3. **Commit Changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to Branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Update documentation for new features
- Add tests for new functionality
- Ensure backward compatibility
- Follow security best practices

### Code Quality Standards
- ESLint configuration for consistent code style
- Prettier for code formatting
- Comprehensive error handling
- Input validation and sanitization
- Security headers and CORS configuration
- Performance optimization

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support
For support, please contact:
- **Email**: support@lakhdatar.com
- **Issues**: [GitHub Issues](https://github.com/abhishek-mishra-mern/lakhdatar/issues)
- **Documentation**: [API Documentation](#api-documentation)

## 🙏 Acknowledgments
- [MongoDB](https://www.mongodb.com/) for database
- [Express.js](https://expressjs.com/) for backend framework
- [React](https://reactjs.org/) for frontend library
- [Node.js](https://nodejs.org/) for runtime
- [Razorpay](https://razorpay.com/) for payment processing
- [Cloudinary](https://cloudinary.com/) for image management
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

## 🚀 Quick Start Commands

### Development
```bash
# Start backend development server
cd Lakhdatar_Backend && npm run dev

# Start frontend development server
cd LakhdatarFrontend && npm run dev
```

### Production
```bash
# Build frontend for production
cd LakhdatarFrontend && npm run build

# Start production server
cd Lakhdatar_Backend && npm start
```

### Testing
```bash
# Run backend tests
cd Lakhdatar_Backend && npm test

# Run frontend tests
cd LakhdatarFrontend && npm test
```

---

**Made with ❤️ by Abhishek Mishra using MERN Stack**

---

## 📸 Screenshots

*(Add your application screenshots here)*
- **Home Page**: Showcase of restaurants and featured dishes
- **Admin Dashboard**: System analytics and management
- **Vendor Panel**: Restaurant management interface
- **Customer App**: Ordering and tracking interface
- **Mobile Views**: Responsive design on different devices

## 🔮 Future Enhancements
- [ ] Mobile app (React Native)
- [ ] AI-based recommendations
- [ ] Loyalty program integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice search capability
- [ ] AR menu viewing
- [ ] Blockchain for supply chain tracking

---
*Last Updated: December 2025*

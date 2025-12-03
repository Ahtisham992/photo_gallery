# Photo Gallery Application

A full-stack photo gallery application built with React and Node.js, designed for cloud deployment on AWS.

## 🚀 Features

### Backend (Node.js + Express)
- **User Authentication**: JWT-based authentication with secure password hashing
- **Photo Management**: Complete CRUD operations for photos
- **File Upload**: Multer-based file upload with validation
- **Database**: MySQL/PostgreSQL support via Sequelize ORM
- **Security**: Input validation, authentication middleware, and secure file handling
- **RESTful API**: Well-structured API endpoints

### Frontend (React + Vite)
- **Modern UI**: Built with React 18, TailwindCSS, and Lucide icons
- **Authentication**: Login and registration with protected routes
- **Photo Gallery**: Browse all public photos with search functionality
- **My Photos**: Manage your personal photo collection
- **Upload**: Upload photos with title, description, and tags
- **Photo Details**: View, edit, and delete photos
- **Responsive Design**: Mobile-first responsive design

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL or PostgreSQL database
- npm or yarn package manager

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
cd "d:/Software enginner/university/sem7/Cloud/Project"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=photo_gallery
# JWT_SECRET=your_secret_key

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Database Setup

The application will automatically create the required tables when you start the backend server for the first time. Make sure your MySQL/PostgreSQL server is running and the database exists.

```sql
CREATE DATABASE photo_gallery;
```

## 📁 Project Structure

```
Project/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── upload.js            # File upload middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Photo.js             # Photo model
│   │   └── index.js             # Model associations
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── photos.js            # Photo CRUD routes
│   ├── uploads/                 # Uploaded files directory
│   ├── .env.example             # Environment variables template
│   ├── Dockerfile               # Docker configuration
│   ├── package.json
│   └── server.js                # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   └── PhotoCard.jsx    # Photo card component
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Gallery page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── MyPhotos.jsx     # User's photos page
│   │   │   ├── Upload.jsx       # Upload page
│   │   │   └── PhotoDetail.jsx  # Photo detail page
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Photos
- `GET /api/photos` - Get all photos (with pagination and search)
- `GET /api/photos/:id` - Get single photo
- `POST /api/photos` - Upload a new photo
- `PUT /api/photos/:id` - Update photo details
- `DELETE /api/photos/:id` - Delete photo

## 🐳 Docker Deployment

### Build Backend Docker Image

```bash
cd backend
docker build -t photo-gallery-backend .
```

### Run Backend Container

```bash
docker run -p 5000:5000 \
  -e DB_HOST=your_db_host \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e DB_NAME=photo_gallery \
  -e JWT_SECRET=your_secret \
  photo-gallery-backend
```

## ☁️ AWS Deployment Guide

### Prerequisites for AWS Deployment

1. AWS Account
2. AWS CLI configured
3. IAM user with appropriate permissions

### Architecture Overview

- **Frontend**: AWS Elastic Beanstalk
- **Backend**: EC2 with Docker
- **Database**: Amazon RDS (MySQL/PostgreSQL)
- **Storage**: Amazon S3 for photo uploads
- **Security**: VPC, Security Groups, IAM Roles

### Step-by-Step AWS Deployment

#### 1. Database Setup (RDS)

1. Create RDS MySQL/PostgreSQL instance
2. Configure security group to allow EC2 access
3. Note down the endpoint, username, and password

#### 2. S3 Bucket Setup

1. Create S3 bucket for photo storage
2. Configure bucket policy for public read access (for public photos)
3. Enable CORS if needed

#### 3. Backend Deployment (EC2)

1. Launch EC2 instance (Amazon Linux 2 or Ubuntu)
2. Install Docker on EC2
3. Configure Security Group (allow ports 22, 5000)
4. Create IAM role with S3 and RDS access
5. Deploy Docker container with environment variables

```bash
# On EC2 instance
docker run -d -p 5000:5000 \
  -e DB_HOST=your-rds-endpoint \
  -e DB_USER=admin \
  -e DB_PASSWORD=your_password \
  -e DB_NAME=photo_gallery \
  -e JWT_SECRET=your_secret \
  -e USE_S3=true \
  -e S3_BUCKET_NAME=your-bucket \
  -e AWS_REGION=us-east-1 \
  --restart unless-stopped \
  photo-gallery-backend
```

#### 4. Frontend Deployment (Elastic Beanstalk)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Create Elastic Beanstalk application
3. Upload the `build` folder
4. Configure environment variables (API endpoint)

### Environment Variables for Production

#### Backend (.env)
```
NODE_ENV=production
PORT=5000
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_secure_password
DB_NAME=photo_gallery
JWT_SECRET=your_very_secure_jwt_secret
USE_S3=true
S3_BUCKET_NAME=your-photo-bucket
AWS_REGION=us-east-1
```

#### Frontend
Update API endpoint in production build to point to EC2 public IP or domain.

## 🔒 Security Best Practices

- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation on all endpoints
- ✅ File type and size validation
- ✅ SQL injection protection via Sequelize ORM
- ✅ CORS configuration
- ✅ Environment variables for sensitive data
- ✅ Security groups for network isolation
- ✅ IAM roles for AWS resource access

## 📝 Testing the Application

### Register a New User
1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form
3. Submit to create account

### Upload Photos
1. Login to your account
2. Click "Upload" in navigation
3. Select an image file
4. Add title, description, and tags
5. Submit to upload

### Browse Gallery
1. View all public photos on the home page
2. Search photos by title, description, or tags
3. Click on a photo to view details

## 🤝 Contributing

This project is for educational purposes as part of a Cloud Computing course.

## 📄 License

ISC

## 👥 Team Members

- [Team Member 1]
- [Team Member 2]
- [Team Member 3]

## 📞 Support

For issues or questions, please create an issue in the repository.

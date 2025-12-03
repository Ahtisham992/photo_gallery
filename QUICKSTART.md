# Quick Start Guide

This guide will help you get the Photo Gallery application running locally in under 5 minutes.

## Prerequisites

- Node.js (v16 or higher)
- MySQL or PostgreSQL installed and running
- npm or yarn

## Option 1: Manual Setup (Recommended for Development)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment

```bash
# Copy the example environment file
copy .env.example .env
```

Edit `.env` file with your database credentials:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=photo_gallery
DB_PORT=3306

JWT_SECRET=my_super_secret_jwt_key_12345

UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
USE_S3=false
```

### Step 3: Create Database

Open MySQL and run:

```sql
CREATE DATABASE photo_gallery;
```

### Step 4: Start Backend

```bash
# Still in backend directory
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 5: Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### Step 6: Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 7: Test the Application

1. Open browser to `http://localhost:3000`
2. Click "Sign up" to create an account
3. Fill in the registration form
4. Login with your credentials
5. Upload a photo!

## Option 2: Docker Compose (Easiest)

If you have Docker installed:

```bash
# From project root directory
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- Backend API on port 5000
- Frontend on port 3000

Access the app at `http://localhost:3000`

To stop:
```bash
docker-compose down
```

## Troubleshooting

### Backend won't start

**Error: "Access denied for user"**
- Check your MySQL credentials in `.env`
- Make sure MySQL is running
- Verify the database exists

**Error: "Port 5000 already in use"**
- Change PORT in `.env` to another port (e.g., 5001)
- Update frontend proxy in `vite.config.js`

### Frontend won't start

**Error: "Cannot connect to backend"**
- Make sure backend is running on port 5000
- Check `vite.config.js` proxy configuration

**Error: "Port 3000 already in use"**
- Change port in `vite.config.js` server section

### Database connection issues

**Error: "Unknown database 'photo_gallery'"**
```sql
CREATE DATABASE photo_gallery;
```

**Error: "Client does not support authentication protocol"**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

## Default Test Credentials

After registration, you can create your own account. There are no default credentials.

## API Testing

You can test the API using curl or Postman:

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Next Steps

1.  Application is running locally
2.  Upload some photos
3.  Customize the UI (optional)
4.  Follow `DEPLOYMENT.md` for AWS deployment
5.  Read `README.md` for detailed documentation

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes to React files auto-refresh
- Backend: Using nodemon, changes restart server automatically

### Database Reset

To reset the database:

```sql
DROP DATABASE photo_gallery;
CREATE DATABASE photo_gallery;
```

Then restart the backend - tables will be recreated automatically.

### View Uploaded Photos

Photos are stored in `backend/uploads/` directory. You can access them via:
```
http://localhost:5000/uploads/[filename]
```

## Common Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Project Structure Quick Reference

```
Project/
├── backend/           # Node.js + Express API
│   ├── config/       # Database configuration
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth & upload middleware
│   └── server.js     # Entry point
│
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app
│   └── index.html
│
└── README.md         # Full documentation
```

## Need Help?

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for AWS deployment
- Check the troubleshooting section above
- Review error messages in terminal

Happy coding! 

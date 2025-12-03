# Testing Guide

This guide helps you test all features of the Photo Gallery application locally before deploying to AWS.

## Prerequisites

- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- MySQL database created and connected

## 🧪 Manual Testing Checklist

### 1. User Registration

**Steps:**
1. Open http://localhost:3000
2. Click "Sign up" link
3. Fill in the form:
   - Full Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Click "Create Account"

**Expected Result:**
- ✅ Redirected to home page (gallery)
- ✅ Navbar shows "Test User" or "testuser"
- ✅ Toast notification: "Registration successful!"

**Database Check:**
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

---

### 2. User Login

**Steps:**
1. Logout if logged in
2. Click "Sign in" link
3. Enter credentials:
   - Email: test@example.com
   - Password: password123
4. Click "Sign In"

**Expected Result:**
- ✅ Redirected to home page
- ✅ User is authenticated
- ✅ Toast notification: "Login successful!"

---

### 3. Photo Upload

**Steps:**
1. Make sure you're logged in
2. Click "Upload" in navbar
3. Click the upload area or drag an image
4. Select an image file (JPG, PNG, GIF)
5. Fill in details:
   - Title: "Beautiful Sunset"
   - Description: "A stunning sunset over the ocean"
   - Tags: "nature, sunset, ocean"
   - Check "Make this photo public"
6. Click "Upload Photo"

**Expected Result:**
- ✅ Redirected to "My Photos" page
- ✅ Photo appears in the grid
- ✅ Toast notification: "Photo uploaded successfully!"
- ✅ File saved in `backend/uploads/` directory

**Database Check:**
```sql
SELECT * FROM photos WHERE title = 'Beautiful Sunset';
```

**File Check:**
- Check `backend/uploads/` folder for the uploaded image

---

### 4. View All Photos (Gallery)

**Steps:**
1. Click "Gallery" in navbar
2. Scroll through photos

**Expected Result:**
- ✅ All public photos displayed in grid
- ✅ Each photo shows:
  - Image preview
  - Title
  - Description (truncated)
  - Username
  - Date
  - Tags
- ✅ Photos are clickable

---

### 5. Search Photos

**Steps:**
1. On Gallery page
2. Type in search box: "sunset"
3. Press Enter or wait

**Expected Result:**
- ✅ Only photos matching "sunset" in title, description, or tags are shown
- ✅ Search works in real-time

---

### 6. View Photo Details

**Steps:**
1. Click on any photo card
2. View the detail page

**Expected Result:**
- ✅ Full-size image displayed
- ✅ Complete title and description shown
- ✅ All tags displayed
- ✅ Upload date and time shown
- ✅ Username shown
- ✅ Public/Private status shown
- ✅ If your photo: Edit and Delete buttons visible

---

### 7. Edit Photo

**Steps:**
1. Go to "My Photos"
2. Click on one of your photos
3. Click "Edit" button
4. Change details:
   - Title: "Updated Title"
   - Description: "Updated description"
   - Tags: "updated, tags"
   - Uncheck "Public photo"
5. Click "Save Changes"

**Expected Result:**
- ✅ Photo details updated
- ✅ Toast notification: "Photo updated successfully"
- ✅ Changes reflected immediately
- ✅ Photo no longer appears in public gallery (if made private)

**Database Check:**
```sql
SELECT * FROM photos WHERE title = 'Updated Title';
```

---

### 8. Delete Photo

**Steps:**
1. Go to "My Photos"
2. Click on a photo
3. Click "Delete" button
4. Confirm deletion in popup

**Expected Result:**
- ✅ Redirected to "My Photos" page
- ✅ Photo removed from list
- ✅ Toast notification: "Photo deleted successfully"
- ✅ File deleted from `backend/uploads/` directory

**Database Check:**
```sql
SELECT * FROM photos WHERE id = [deleted_photo_id];
-- Should return no results
```

---

### 9. My Photos Page

**Steps:**
1. Click "My Photos" in navbar

**Expected Result:**
- ✅ Only your uploaded photos shown
- ✅ Count displayed: "X photos in your collection"
- ✅ Both public and private photos shown
- ✅ Empty state if no photos

---

### 10. Logout

**Steps:**
1. Click "Logout" in navbar

**Expected Result:**
- ✅ Redirected to login page
- ✅ Cannot access protected pages
- ✅ Toast notification: "Logged out successfully"

---

## 🔍 API Testing with cURL

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"apiuser\",\"email\":\"api@test.com\",\"password\":\"password123\",\"fullName\":\"API User\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"api@test.com\",\"password\":\"password123\"}"
```

Save the token from response.

### Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Photos
```bash
curl http://localhost:5000/api/photos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Upload Photo
```bash
curl -X POST http://localhost:5000/api/photos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "photo=@/path/to/image.jpg" \
  -F "title=Test Photo" \
  -F "description=Test Description" \
  -F "tags=test,api" \
  -F "isPublic=true"
```

### Get Single Photo
```bash
curl http://localhost:5000/api/photos/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Photo
```bash
curl -X PUT http://localhost:5000/api/photos/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Updated Title\",\"description\":\"Updated Description\"}"
```

### Delete Photo
```bash
curl -X DELETE http://localhost:5000/api/photos/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Error Testing

### 1. Invalid Login
**Test:** Login with wrong password
**Expected:** Error message "Invalid credentials"

### 2. Duplicate Email
**Test:** Register with existing email
**Expected:** Error message "User already exists"

### 3. File Too Large
**Test:** Upload file > 5MB
**Expected:** Error message "File size too large"

### 4. Invalid File Type
**Test:** Upload a .txt file
**Expected:** Error message "Only image files are allowed"

### 5. Unauthorized Access
**Test:** Try to edit someone else's photo
**Expected:** Error message "Access denied"

### 6. Missing Required Fields
**Test:** Upload photo without title
**Expected:** Validation error

---

## 📊 Database Verification

### Check Users Table
```sql
SELECT id, username, email, fullName, createdAt FROM users;
```

### Check Photos Table
```sql
SELECT id, title, filename, userId, isPublic, createdAt FROM photos;
```

### Check User's Photos
```sql
SELECT p.*, u.username 
FROM photos p 
JOIN users u ON p.userId = u.id 
WHERE u.email = 'test@example.com';
```

### Check Public Photos
```sql
SELECT * FROM photos WHERE isPublic = 1;
```

---

## 🔐 Security Testing

### 1. Protected Routes
**Test:** Access http://localhost:3000/ without logging in
**Expected:** Redirected to login page

### 2. JWT Expiration
**Test:** Use an expired token
**Expected:** 401 Unauthorized error

### 3. SQL Injection
**Test:** Try SQL in search: `'; DROP TABLE users; --`
**Expected:** No SQL injection (Sequelize protects)

### 4. XSS Prevention
**Test:** Upload photo with title: `<script>alert('XSS')</script>`
**Expected:** Script not executed, displayed as text

---

## 📱 Responsive Design Testing

Test on different screen sizes:
- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

**What to check:**
- Navigation menu (hamburger on mobile)
- Photo grid (responsive columns)
- Forms (proper sizing)
- Buttons (touch-friendly on mobile)

---

## ⚡ Performance Testing

### 1. Multiple Photos
- Upload 20+ photos
- Check gallery loading time
- Verify pagination works

### 2. Large Images
- Upload high-resolution images
- Check upload time
- Verify image display

### 3. Search Performance
- Search with various terms
- Check response time
- Verify results accuracy

---

## 🎯 User Flow Testing

### Complete User Journey
1. ✅ Visit site
2. ✅ Register account
3. ✅ Upload 3 photos
4. ✅ View gallery
5. ✅ Search for photos
6. ✅ View photo details
7. ✅ Edit a photo
8. ✅ Delete a photo
9. ✅ View "My Photos"
10. ✅ Logout
11. ✅ Login again
12. ✅ Verify photos still there

---

## 📝 Test Results Template

Use this template to document your testing:

```
Test Date: ___________
Tester: ___________

| Feature | Status | Notes |
|---------|--------|-------|
| Registration | ✅/❌ | |
| Login | ✅/❌ | |
| Upload Photo | ✅/❌ | |
| View Gallery | ✅/❌ | |
| Search | ✅/❌ | |
| Photo Details | ✅/❌ | |
| Edit Photo | ✅/❌ | |
| Delete Photo | ✅/❌ | |
| My Photos | ✅/❌ | |
| Logout | ✅/❌ | |

Issues Found:
1. 
2. 
3. 

Overall Status: ✅ PASS / ❌ FAIL
```

---

## 🚀 Pre-Deployment Testing

Before deploying to AWS, ensure:

- [ ] All features work locally
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] Database queries are efficient
- [ ] File uploads work correctly
- [ ] Authentication is secure
- [ ] All validations work
- [ ] Responsive design works
- [ ] Error handling is proper
- [ ] API endpoints return correct status codes

---

## 💡 Tips

1. **Use Browser DevTools** - Check Network tab for API calls
2. **Check Console** - Look for JavaScript errors
3. **Monitor Backend** - Watch terminal for errors
4. **Test Edge Cases** - Empty inputs, special characters, etc.
5. **Test Different Browsers** - Chrome, Firefox, Edge
6. **Clear Cache** - Test with fresh browser cache
7. **Test Incognito** - Verify without cached data

---

## 🆘 Common Issues

### "Cannot connect to backend"
- Check if backend is running on port 5000
- Verify CORS is enabled
- Check proxy in vite.config.js

### "Database connection failed"
- Verify MySQL is running
- Check .env credentials
- Ensure database exists

### "File upload failed"
- Check uploads directory exists
- Verify file size < 5MB
- Ensure file is an image

### "Photos not displaying"
- Check file path in database
- Verify uploads directory is accessible
- Check image URL in browser

---

**Happy Testing! 🧪**

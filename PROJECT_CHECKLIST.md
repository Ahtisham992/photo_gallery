# Cloud Computing Project Checklist

Use this checklist to ensure you meet all project requirements.

## ✅ Application Architecture Requirements

### Backend Service
- [x] User authentication and session handling (JWT-based)
- [x] CRUD functionality for Photos entity
  - [x] Create (Upload photo)
  - [x] Read (Get photos, Get single photo)
  - [x] Update (Edit photo details)
  - [x] Delete (Remove photo)
- [x] Database layer (Sequelize ORM with MySQL/PostgreSQL support)
- [x] File/image upload functionality (Multer with S3 support ready)

### Frontend Application
- [x] Modern JavaScript framework (React 18 with Vite)
- [x] RESTful API interaction with backend
- [x] Separate deployment from backend
- [x] Modern UI with TailwindCSS

## ✅ AWS Deployment Requirements

### 1. Frontend Hosting
- [ ] Deploy frontend using AWS Elastic Beanstalk
- [ ] Frontend is publicly accessible
- [ ] Proper environment configuration

### 2. Backend Hosting
- [ ] Deploy backend on Amazon EC2
- [ ] Backend runs inside Docker container
- [ ] EC2 instance inside VPC
- [ ] Security Groups properly configured
- [ ] IAM roles attached to EC2

### 3. Database Layer
- [ ] Amazon RDS (MySQL/PostgreSQL) set up
- [ ] Database in private subnet
- [ ] Proper security group rules
- [ ] Connection from EC2 working

### 4. Media Storage
- [ ] Amazon S3 bucket created
- [ ] Bucket policies configured
- [ ] Public/private access separation
- [ ] CORS configured for uploads

### 5. Security and IAM
- [ ] IAM roles for EC2 created
- [ ] IAM policies for S3 access
- [ ] IAM policies for RDS access
- [ ] Security Groups with minimal ports open
- [ ] HTTPS support (optional but recommended)
- [ ] Least-privilege access implemented

## 📋 Submission Requirements

### GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or accessible
- [ ] README.md with deployment instructions
- [ ] All configuration files included
- [ ] .env.example files provided

### Public URLs
- [ ] Frontend URL (Elastic Beanstalk)
- [ ] Backend URL (EC2 public IP or domain)
- [ ] Both URLs are accessible and working

### PDF Report
- [ ] AWS architecture diagram included
- [ ] IAM policies screenshots
- [ ] Deployment screenshots:
  - [ ] EC2 instance running
  - [ ] RDS database active
  - [ ] S3 bucket with files
  - [ ] Elastic Beanstalk environment
  - [ ] Security Groups configuration
  - [ ] IAM roles and policies
- [ ] Configuration evidence
- [ ] Testing screenshots (app working)

## 🔍 Testing Checklist

### Local Testing
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] User registration works
- [ ] User login works
- [ ] Photo upload works
- [ ] Photo viewing works
- [ ] Photo editing works
- [ ] Photo deletion works
- [ ] Search functionality works

### AWS Testing
- [ ] Frontend accessible via Elastic Beanstalk URL
- [ ] Backend accessible via EC2 public IP
- [ ] User registration works on cloud
- [ ] Photo upload to S3 works
- [ ] Photos stored in S3 bucket
- [ ] Database stores user and photo data
- [ ] All CRUD operations work
- [ ] Authentication persists across sessions

## 📊 Architecture Diagram Elements

Your diagram should include:
- [ ] User/Client
- [ ] AWS Cloud boundary
- [ ] Elastic Beanstalk (Frontend)
- [ ] EC2 Instance (Backend with Docker)
- [ ] Amazon RDS (Database)
- [ ] Amazon S3 (Photo Storage)
- [ ] VPC with subnets
- [ ] Security Groups
- [ ] IAM Roles
- [ ] Data flow arrows
- [ ] HTTPS/HTTP protocols

## 🔐 Security Checklist

- [ ] No hardcoded credentials in code
- [ ] Environment variables used for secrets
- [ ] Database in private subnet
- [ ] S3 bucket not fully public
- [ ] Security groups follow least privilege
- [ ] IAM roles follow least privilege
- [ ] JWT secrets are secure
- [ ] Password hashing implemented
- [ ] Input validation on all endpoints
- [ ] File upload validation (type, size)

## 📝 Documentation Checklist

- [ ] README.md is comprehensive
- [ ] DEPLOYMENT.md has step-by-step instructions
- [ ] QUICKSTART.md for local setup
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Architecture explained
- [ ] Screenshots included
- [ ] Troubleshooting guide included

## 👥 Team Information

- [ ] Team members listed (3 members)
- [ ] Contribution breakdown documented
- [ ] Contact information provided

## 🎯 Bonus Points (Optional)

- [ ] Custom domain name configured
- [ ] HTTPS with SSL certificate (ACM)
- [ ] CloudFront CDN for frontend
- [ ] Load Balancer for backend
- [ ] Auto-scaling configured
- [ ] CloudWatch monitoring
- [ ] Automated backups
- [ ] CI/CD pipeline
- [ ] Multiple environments (dev/prod)

## 📅 Before Submission

- [ ] All code committed and pushed
- [ ] All AWS resources are running
- [ ] All URLs are accessible
- [ ] PDF report is complete
- [ ] Screenshots are clear and labeled
- [ ] Architecture diagram is professional
- [ ] README is updated with final URLs
- [ ] Team members verified submission
- [ ] Deadline: 7th Dec, 2025, 11:59 pm

## 💰 Cost Management

- [ ] Using AWS Free Tier where possible
- [ ] Monitoring AWS billing dashboard
- [ ] No unnecessary resources running
- [ ] Resources tagged properly
- [ ] Shutdown plan after grading (if needed)

## 🚀 Final Verification

Before submitting, verify:
1. [ ] Clone repo in fresh directory and follow README
2. [ ] All URLs work in incognito browser
3. [ ] Complete user flow works (register → login → upload → view → edit → delete)
4. [ ] PDF report has all required elements
5. [ ] GitHub repository is accessible
6. [ ] All team members reviewed submission

---

## Notes

Use this space for notes, issues, or reminders:

```
[Your notes here]
```

---

**Good luck with your project! 🎓**

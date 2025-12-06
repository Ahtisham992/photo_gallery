# AWS Deployment instructions.
All these deployement steps are followed to completely deploy system to cloud.
## Step 1: Database Setup (Amazon RDS)

### 1.1 Create RDS Instance

1. Go to AWS RDS Console
2. Click "Create database"
3. Choose MySQL or PostgreSQL
4. Select "Free tier" template
5. Configure:
   - DB instance identifier: `photo-gallery-db`
   - Master username: `admin`
   - Master password: `[secure-password]`
   - DB instance class: `db.t3.micro` (Free tier)
   - Storage: 20 GB
   - VPC: Default or create new
   - Public access: No
   - Database name: `photo_gallery`

6. Create database

### 1.2 Configure Security Group

1. Go to RDS instance details
2. Click on the VPC security group
3. Add inbound rule:
   - Type: MySQL/Aurora (or PostgreSQL)
   - Port: 3306 (or 5432 for PostgreSQL)
   - Source: EC2 security group (will create later)

### 1.3 Note Database Endpoint

Save the endpoint URL (e.g., `photo-gallery-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`)
## Step 2: S3 Bucket Setup

### 2.1 Create S3 Bucket

1. Go to S3 Console
2. Click "Create bucket"
3. Bucket name: `photo-gallery-uploads-[unique-id]`
4. Region: `us-east-1` (or your preferred region)
5. Uncheck "Block all public access" (we'll configure specific access)
6. Create bucket

### 2.2 Configure Bucket Policy

1. Go to bucket → Permissions → Bucket Policy
2. Add policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::photo-gallery-uploads-[unique-id]/*"
        }
    ]
}
```

### 2.3 Configure CORS

1. Go to bucket → Permissions → CORS
2. Add configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Step 3: IAM Roles and Policies

### 3.1 Create IAM Role for EC2

1. Go to IAM Console → Roles → Create role
2. Select "AWS service" → "EC2"
3. Attach policies:
   - `AmazonS3FullAccess` (or create custom policy)
   - `AmazonRDSFullAccess` (or create custom policy)
4. Role name: `PhotoGalleryEC2Role`
5. Create role

### 3.2 Custom S3 Policy (Recommended)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::photo-gallery-uploads-[unique-id]/*"
        }
    ]
}
```

## Step 4: Backend Deployment (EC2 with Docker)

### 4.1 Launch EC2 Instance

1. Go to EC2 Console → Launch Instance
2. Configure:
   - Name: `photo-gallery-backend`
   - AMI: Amazon Linux 2 or Ubuntu 22.04
   - Instance type: `t2.micro` (Free tier)
   - Key pair: Create new or use existing
   - Network settings:
     - VPC: Same as RDS
     - Auto-assign public IP: Enable
     - Security group: Create new
3. Configure security group:
   - SSH (22): Your IP
   - Custom TCP (5000): 0.0.0.0/0 (or specific IPs)
4. Advanced details:
   - IAM instance profile: `PhotoGalleryEC2Role`
5. Launch instance

### 4.2 Connect to EC2 and Install Docker

```bash
# Connect via SSH
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose (optional)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
```

### 4.3 Deploy Backend

```bash
# Connect again
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Clone repository or upload files
# For this example, we'll create files manually

# Create app directory
mkdir -p ~/photo-gallery-backend
cd ~/photo-gallery-backend

# Upload your backend code (use scp or git)
scp -i your-key.pem -r ./backend/* ec2-user@your-ec2-public-ip:~/photo-gallery-backend/

# Build Docker image
docker build -t photo-gallery-backend .

# Run container
docker run -d \
  --name photo-gallery-api \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e DB_HOST=your-rds-endpoint.rds.amazonaws.com \
  -e DB_USER=admin \
  -e DB_PASSWORD=your-secure-password \
  -e DB_NAME=photo_gallery \
  -e DB_PORT=3306 \
  -e JWT_SECRET=your-very-secure-jwt-secret-key \
  -e USE_S3=true \
  -e S3_BUCKET_NAME=photo-gallery-uploads-[unique-id] \
  -e AWS_REGION=us-east-1 \
  --restart unless-stopped \
  photo-gallery-backend

# Check logs
docker logs photo-gallery-api
```

### 4.4 Test Backend

```bash
curl http://your-ec2-public-ip:5000/api/health
```

## Step 5: Frontend Deployment (Elastic Beanstalk)

### 5.1 Prepare Frontend Build

On your local machine:

```bash
cd frontend

# Update API endpoint in production
# Create .env.production file
echo "VITE_API_URL=http://16.16.65.200:5000" > .env.production

# Build
npm run build

# Create deployment package
cd build
zip -r ../frontend-deploy.zip .
cd ..
```

### 5.2 Create Elastic Beanstalk Application

1. Go to Elastic Beanstalk Console
2. Click "Create Application"
3. Configure:
   - Application name: `photo-gallery-frontend`
   - Platform: Node.js
   - Platform branch: Node.js 18
   - Application code: Upload `frontend-deploy.zip`
4. Configure more options:
   - Instances: t2.micro
   - Capacity: Single instance
   - Environment properties:
     - `VITE_API_URL`: `http://your-ec2-public-ip:5000`
5. Create application

### 5.3 Add package.json for Elastic Beanstalk

Create a `package.json` in your build folder:

```json
{
  "name": "photo-gallery-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "npx serve -s . -l 8080"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

Then rebuild the zip file.


## 🔧 Nginx Config (.ebextensions/00_nginx.config)

```yaml
files:
  "/etc/nginx/conf.d/00_elastic_beanstalk_proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      server {
          listen 8080;
          
          location / {
              root /var/app/current;
              try_files $uri $uri/ /index.html;
          }
      }
```

This ensures:
- All routes go to `index.html` (for React Router)
- SPA routing works correctly
- No 404 errors on refresh

---
# Photo Gallery Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file by copying `.env.example`:
```bash
copy .env.example .env
```

3. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=photo_gallery
JWT_SECRET=your_secret_key_here
```
//public ip of backend as deployed on ec2.
http://16.16.65.200:5000/

4. Make sure MySQL/PostgreSQL is running and create the database:
```sql
CREATE DATABASE photo_gallery;
```

5. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

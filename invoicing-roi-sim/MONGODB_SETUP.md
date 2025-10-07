# MongoDB Setup Guide

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new project

### 2. Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred region
4. Name your cluster (e.g., "roi-simulator")
5. Click "Create Cluster"

### 3. Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `roi-user` (or your choice)
5. Password: Generate secure password
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

### 6. Update Environment Variables

**For Local Development:**
```bash
# In server/.env file
MONGODB_URI=mongodb+srv://roi-user:YOUR_PASSWORD@cluster0.abc123.mongodb.net/roi-simulator?retryWrites=true&w=majority
```

**For Render Deployment:**
Add environment variable in Render dashboard:
- Key: `MONGODB_URI`
- Value: Your connection string

## 🧪 Test Connection

### Local Testing:
```bash
cd server
npm install
npm run dev
```

Check console for: ✅ Connected to MongoDB

### API Testing:
```bash
# Test server health
curl http://localhost:5000/api/health

# Test database status
curl http://localhost:5000/api/db-status
```

## 📊 Database Structure

Your MongoDB will automatically create:

**Database:** `roi-simulator`
**Collection:** `roicalculations`

**Document Structure:**
```json
{
  "_id": "ObjectId",
  "monthlyInvoices": 100,
  "timePerInvoice": 15,
  "hourlyRate": 25,
  "errorRate": 5,
  "errorCost": 50,
  "solutionCost": 500,
  "results": {
    "currentAnnualCost": 6250,
    "newAnnualCost": 1100,
    "annualSavings": 5150,
    "roi": 930,
    "paybackMonths": 1.2
  },
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Troubleshooting

### Connection Issues:
1. **Check credentials** - Username/password correct?
2. **Check IP whitelist** - Is 0.0.0.0/0 added?
3. **Check connection string** - No spaces or special characters?

### Common Errors:
- `MongoNetworkError`: Check network access settings
- `Authentication failed`: Check username/password
- `Connection timeout`: Check IP whitelist

## 🚀 Production Deployment

### Render Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roi-simulator?retryWrites=true&w=majority
PORT=5000
```

### Netlify Environment Variables:
```
VITE_API_URL=https://your-render-app.onrender.com
```

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write access
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied and updated in .env
- [ ] Server starts without connection errors
- [ ] API endpoints return data
- [ ] Frontend connects to backend successfully

Your MongoDB database is now ready for production use! 🎉
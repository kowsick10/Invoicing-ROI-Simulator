# Invoicing ROI Simulator

A full-stack web application to calculate ROI for invoicing automation solutions.

## Tech Stack
- **Frontend**: React + Vite (deployed on Netlify)
- **Backend**: Node.js + Express (deployed on Render)
- **Database**: MongoDB

## Features
- Real-time ROI calculations
- Data persistence with MongoDB
- Calculation history
- Responsive design
- Professional UI

## Setup Instructions

### Backend Setup (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 5000

### Frontend Setup (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/dist`
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Create a database user
3. Get connection string
4. Add to Render environment variables

### Local Development
1. Clone repository
2. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Set up environment variables
4. Run backend: `cd server && npm run dev`
5. Run frontend: `cd client && npm run dev`

## API Endpoints
- `POST /api/calculate-roi` - Calculate and save ROI
- `GET /api/calculations` - Get calculation history
- `GET /api/health` - Health check

## Deployment URLs
- Frontend: https://your-app.netlify.app
- Backend: https://your-app.onrender.com
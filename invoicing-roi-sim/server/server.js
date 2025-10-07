const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roi-simulator', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

// ROI Calculation Schema
const roiCalculationSchema = new mongoose.Schema({
  monthlyInvoices: Number,
  timePerInvoice: Number,
  hourlyRate: Number,
  errorRate: Number,
  errorCost: Number,
  solutionCost: Number,
  results: {
    currentAnnualCost: Number,
    newAnnualCost: Number,
    annualSavings: Number,
    roi: Number,
    paybackMonths: Number
  },
  createdAt: { type: Date, default: Date.now }
});

const ROICalculation = mongoose.model('ROICalculation', roiCalculationSchema);

// Routes
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    message: 'Server is running!',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  const status = {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
  res.json(status);
});

// Calculate and save ROI
app.post('/api/calculate-roi', async (req, res) => {
  try {
    const { monthlyInvoices, timePerInvoice, hourlyRate, errorRate, errorCost, solutionCost } = req.body;

    // Calculations
    const currentMonthlyCost = (monthlyInvoices * timePerInvoice / 60 * hourlyRate) + 
                              (monthlyInvoices * errorRate / 100 * errorCost);
    const currentAnnualCost = currentMonthlyCost * 12;
    const newMonthlyCost = solutionCost / 12 + (monthlyInvoices * 2 / 60 * hourlyRate);
    const newAnnualCost = newMonthlyCost * 12;
    const annualSavings = currentAnnualCost - newAnnualCost;
    const roi = ((annualSavings - solutionCost) / solutionCost * 100);
    const paybackMonths = solutionCost / (currentMonthlyCost - newMonthlyCost);

    const results = {
      currentAnnualCost: Math.round(currentAnnualCost),
      newAnnualCost: Math.round(newAnnualCost),
      annualSavings: Math.round(annualSavings),
      roi: Math.round(roi * 10) / 10,
      paybackMonths: Math.round(paybackMonths * 10) / 10
    };

    // Save to database
    const calculation = new ROICalculation({
      monthlyInvoices,
      timePerInvoice,
      hourlyRate,
      errorRate,
      errorCost,
      solutionCost,
      results
    });

    await calculation.save();

    res.json({ success: true, results, id: calculation._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all calculations
app.get('/api/calculations', async (req, res) => {
  try {
    const calculations = await ROICalculation.find().sort({ createdAt: -1 }).limit(10);
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
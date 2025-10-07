import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { ROICharts } from './components/Charts'
import { PDFButton } from './components/PDFReport'
import { ScenarioComparison } from './components/ScenarioComparison'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [inputs, setInputs] = useState({
    monthlyInvoices: 100,
    timePerInvoice: 15,
    hourlyRate: 25,
    errorRate: 5,
    errorCost: 50,
    solutionCost: 500
  })
  
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/calculations`)
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }, [])

  const calculateROI = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/calculate-roi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      })
      
      const data = await response.json()
      if (data.success) {
        setResults(data.results)
        fetchHistory()
      }
    } catch (error) {
      console.error('Error calculating ROI:', error)
    } finally {
      setLoading(false)
    }
  }, [inputs, fetchHistory])

  useEffect(() => {
    calculateROI()
    fetchHistory()
  }, [calculateROI, fetchHistory])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateROI()
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [inputs, calculateROI])

  return (
    <div className="app">
      <header>
        <h1>Invoicing ROI Simulator</h1>
        <p>Calculate return on investment for automating </p>
      </header>

      <div className="container">
        <div className="inputs-section">
          <h2>Current Situation</h2>
          
          <div className="input-group">
            <label>Monthly Invoices</label>
            <input 
              type="number" 
              value={inputs.monthlyInvoices}
              onChange={(e) => handleInputChange('monthlyInvoices', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Time per Invoice (minutes)</label>
            <input 
              type="number" 
              value={inputs.timePerInvoice}
              onChange={(e) => handleInputChange('timePerInvoice', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Hourly Rate ($)</label>
            <input 
              type="number" 
              value={inputs.hourlyRate}
              onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Error Rate (%)</label>
            <input 
              type="number" 
              value={inputs.errorRate}
              onChange={(e) => handleInputChange('errorRate', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Cost per Error ($)</label>
            <input 
              type="number" 
              value={inputs.errorCost}
              onChange={(e) => handleInputChange('errorCost', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Solution Cost ($)</label>
            <input 
              type="number" 
              value={inputs.solutionCost}
              onChange={(e) => handleInputChange('solutionCost', e.target.value)}
            />
          </div>
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>ROI Analysis {loading && <span className="loading">⏳</span>}</h2>
            <PDFButton inputs={inputs} results={results} />
          </div>
          
          {results ? (
            <>
              <div className="result-card">
                <h3>Current Annual Cost</h3>
                <div className="value">${results.currentAnnualCost.toLocaleString()}</div>
              </div>

              <div className="result-card">
                <h3>New Annual Cost</h3>
                <div className="value">${results.newAnnualCost.toLocaleString()}</div>
              </div>

              <div className="result-card highlight">
                <h3>Annual Savings</h3>
                <div className="value">${results.annualSavings.toLocaleString()}</div>
              </div>

              <div className="result-card highlight">
                <h3>ROI</h3>
                <div className="value">{results.roi}%</div>
              </div>

              <div className="result-card">
                <h3>Payback Period</h3>
                <div className="value">{results.paybackMonths} months</div>
              </div>
            </>
          ) : (
            <div className="loading-state">Calculating...</div>
          )}
        </div>
      </div>
      
      {results && (
        <div className="charts-section">
          <ROICharts results={results} inputs={inputs} />
        </div>
      )}
      
      {results && (
        <div className="scenario-section">
          <ScenarioComparison baseInputs={inputs} baseResults={results} />
        </div>
      )}
      
      {history.length > 0 && (
        <div className="history-section">
          <h2>Recent Calculations</h2>
          <div className="history-grid">
            {history.slice(0, 5).map((calc) => (
              <div key={calc._id} className="history-card">
                <div className="history-header">
                  <span className="history-date">
                    {new Date(calc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="history-details">
                  <div>Invoices: {calc.monthlyInvoices}/month</div>
                  <div>ROI: {calc.results.roi}%</div>
                  <div>Savings: ${calc.results.annualSavings.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
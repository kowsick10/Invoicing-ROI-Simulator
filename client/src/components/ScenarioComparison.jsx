import { useState } from 'react'

export function ScenarioComparison({ baseInputs, baseResults }) {
  const [scenarios, setScenarios] = useState([
    { name: 'Conservative', multiplier: 0.7 },
    { name: 'Realistic', multiplier: 1.0 },
    { name: 'Optimistic', multiplier: 1.3 }
  ])

  const calculateScenario = (multiplier) => {
    if (!baseResults) return null
    
    return {
      currentAnnualCost: Math.round(baseResults.currentAnnualCost * multiplier),
      newAnnualCost: Math.round(baseResults.newAnnualCost * multiplier),
      annualSavings: Math.round(baseResults.annualSavings * multiplier),
      roi: Math.round(baseResults.roi * multiplier * 10) / 10,
      paybackMonths: Math.round(baseResults.paybackMonths / multiplier * 10) / 10
    }
  }

  if (!baseResults) return null

  return (
    <div className="scenario-comparison">
      <h2>Scenario Analysis</h2>
      <div className="scenarios-grid">
        {scenarios.map((scenario) => {
          const results = calculateScenario(scenario.multiplier)
          return (
            <div key={scenario.name} className={`scenario-card ${scenario.name.toLowerCase()}`}>
              <h3>{scenario.name} Case</h3>
              <div className="scenario-metrics">
                <div className="metric">
                  <span className="label">Annual Savings</span>
                  <span className="value">${results.annualSavings.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span className="label">ROI</span>
                  <span className="value">{results.roi}%</span>
                </div>
                <div className="metric">
                  <span className="label">Payback</span>
                  <span className="value">{results.paybackMonths} months</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="scenario-summary">
        <p>
          <strong>Analysis:</strong> Even in the conservative scenario, 
          you achieve {calculateScenario(0.7).roi}% ROI with payback in {calculateScenario(0.7).paybackMonths} months.
        </p>
      </div>
    </div>
  )
}
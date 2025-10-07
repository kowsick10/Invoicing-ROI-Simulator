import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c']

export function ROICharts({ results, inputs }) {
  if (!results) return null

  const costData = [
    { name: 'Current', value: results.currentAnnualCost },
    { name: 'With Solution', value: results.newAnnualCost }
  ]

  const breakdownData = [
    { name: 'Labor Cost', value: inputs.monthlyInvoices * inputs.timePerInvoice / 60 * inputs.hourlyRate * 12 },
    { name: 'Error Cost', value: inputs.monthlyInvoices * inputs.errorRate / 100 * inputs.errorCost * 12 },
    { name: 'Solution Cost', value: inputs.solutionCost }
  ]

  const timelineData = Array.from({ length: 5 }, (_, i) => ({
    year: `Year ${i + 1}`,
    savings: results.annualSavings * (i + 1),
    investment: inputs.solutionCost
  }))

  return (
    <div className="charts-container">
      <div className="chart-section">
        <h3>Cost Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="value" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Cost Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={breakdownData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {breakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>5-Year Savings Timeline</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Line type="monotone" dataKey="savings" stroke="#667eea" strokeWidth={3} />
            <Line type="monotone" dataKey="investment" stroke="#f5576c" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
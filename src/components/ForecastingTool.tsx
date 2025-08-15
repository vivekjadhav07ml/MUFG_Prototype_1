import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Target, DollarSign, Calendar, BarChart3, Download, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UserProfile } from '../App';

interface ForecastData {
  year: number;
  value: number;
  contributions: number;
  growth: number;
  totalContributions: number;
}

interface ForecastingToolProps {
  userProfile: UserProfile;
}

export const ForecastingTool: React.FC<ForecastingToolProps> = ({ userProfile }) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'moderate' | 'optimistic'>('moderate');
  const [customInputs, setCustomInputs] = useState({
    initialAmount: userProfile.currentSuper || 50000,
    monthlyContribution: userProfile.monthlyContribution || 500,
    annualReturn: 7.5,
    inflationRate: 2.5,
    yearsToForecast: (userProfile.retirementAge || 65) - (userProfile.age || 30),
    contributionIncrease: 3.0 // Annual increase in contributions
  });

  const scenarios = {
    conservative: { return: 5.5, inflation: 3.0, label: 'Conservative (5.5% return)' },
    moderate: { return: 7.5, inflation: 2.5, label: 'Moderate (7.5% return)' },
    optimistic: { return: 9.5, inflation: 2.0, label: 'Optimistic (9.5% return)' }
  };

  useEffect(() => {
    calculateForecast();
  }, [selectedScenario, customInputs]);

  const calculateForecast = () => {
    const scenario = scenarios[selectedScenario];
    const annualReturn = scenario.return / 100;
    const inflationRate = scenario.inflation / 100;
    const monthlyReturn = annualReturn / 12;
    const contributionGrowthRate = customInputs.contributionIncrease / 100;

    const data: ForecastData[] = [];
    let currentValue = customInputs.initialAmount;
    let monthlyContribution = customInputs.monthlyContribution;
    let totalContributions = customInputs.initialAmount;

    for (let year = 0; year <= customInputs.yearsToForecast; year++) {
      if (year > 0) {
        // Calculate growth for the year
        for (let month = 0; month < 12; month++) {
          currentValue = currentValue * (1 + monthlyReturn) + monthlyContribution;
          totalContributions += monthlyContribution;
        }
        
        // Increase monthly contribution annually
        monthlyContribution *= (1 + contributionGrowthRate);
      }

      const growth = currentValue - totalContributions;
      
      data.push({
        year: new Date().getFullYear() + year,
        value: Math.round(currentValue),
        contributions: Math.round(totalContributions),
        growth: Math.round(growth),
        totalContributions: Math.round(totalContributions)
      });
    }

    setForecastData(data);
  };

  const finalValue = forecastData[forecastData.length - 1]?.value || 0;
  const totalContributions = forecastData[forecastData.length - 1]?.totalContributions || 0;
  const totalGrowth = finalValue - totalContributions;
  const monthlyRetirementIncome = (finalValue * 0.04) / 12; // 4% withdrawal rule

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const renderScenarioComparison = () => {
    const comparisonData = Object.entries(scenarios).map(([key, scenario]) => {
      const annualReturn = scenario.return / 100;
      const monthlyReturn = annualReturn / 12;
      let value = customInputs.initialAmount;
      let monthlyContribution = customInputs.monthlyContribution;
      
      for (let year = 0; year < customInputs.yearsToForecast; year++) {
        for (let month = 0; month < 12; month++) {
          value = value * (1 + monthlyReturn) + monthlyContribution;
        }
        monthlyContribution *= (1 + customInputs.contributionIncrease / 100);
      }
      
      return {
        scenario: scenario.label,
        value: Math.round(value),
        monthlyIncome: Math.round((value * 0.04) / 12)
      };
    });

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Scenario Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparisonData.map((data, index) => (
            <div key={data.scenario} className={`p-4 rounded-lg border-2 ${
              index === 0 ? 'border-red-200 bg-red-50' :
              index === 1 ? 'border-blue-200 bg-blue-50' :
              'border-green-200 bg-green-50'
            }`}>
              <h4 className="font-medium text-slate-900 mb-2">{data.scenario}</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-slate-600">Final Value</span>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(data.value)}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Monthly Income</span>
                  <p className="text-lg font-semibold text-slate-700">{formatCurrency(data.monthlyIncome)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Investment Forecasting Tool</h1>
          <p className="text-slate-600">Project your investment growth and plan for retirement</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scenario Selection */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Forecast Scenario</h3>
              <div className="space-y-3">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key as any)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                      selectedScenario === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-900">{scenario.label}</div>
                    <div className="text-sm text-slate-600">
                      {scenario.inflation}% inflation assumed
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Customize Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Initial Amount</label>
                  <input
                    type="number"
                    value={customInputs.initialAmount}
                    onChange={(e) => setCustomInputs(prev => ({ ...prev, initialAmount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Contribution</label>
                  <input
                    type="number"
                    value={customInputs.monthlyContribution}
                    onChange={(e) => setCustomInputs(prev => ({ ...prev, monthlyContribution: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years to Forecast</label>
                  <input
                    type="number"
                    value={customInputs.yearsToForecast}
                    onChange={(e) => setCustomInputs(prev => ({ ...prev, yearsToForecast: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Annual Contribution Increase (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customInputs.contributionIncrease}
                    onChange={(e) => setCustomInputs(prev => ({ ...prev, contributionIncrease: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-slate-600">Final Value</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(finalValue)}</h3>
            <p className="text-slate-600 text-sm">At retirement</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-slate-600">Monthly Income</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(monthlyRetirementIncome)}</h3>
            <p className="text-slate-600 text-sm">4% withdrawal rule</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-slate-600">Total Growth</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalGrowth)}</h3>
            <p className="text-slate-600 text-sm">Investment returns</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calculator className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-slate-600">Contributions</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalContributions)}</h3>
            <p className="text-slate-600 text-sm">Total invested</p>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Growth Projection</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Total Value</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Contributions</span>
              </div>
              <button className="flex items-center space-x-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'value' ? 'Total Value' : 
                    name === 'contributions' ? 'Total Contributions' : 
                    'Growth'
                  ]}
                  labelFormatter={(label) => `Year: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="contributions"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="growth"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scenario Comparison */}
        {renderScenarioComparison()}

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Year-by-Year Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Total Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contributions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Growth</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Annual Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {forecastData.filter((_, index) => index % 5 === 0 || index === forecastData.length - 1).map((data, index, filteredData) => {
                  const prevData = index > 0 ? filteredData[index - 1] : { value: customInputs.initialAmount };
                  const annualReturn = prevData.value > 0 ? ((data.value - prevData.value) / prevData.value) * 100 : 0;
                  
                  return (
                    <tr key={data.year} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{data.year}</td>
                      <td className="px-4 py-4 text-slate-900">{formatCurrency(data.value)}</td>
                      <td className="px-4 py-4 text-slate-900">{formatCurrency(data.totalContributions)}</td>
                      <td className="px-4 py-4 text-green-600 font-medium">{formatCurrency(data.growth)}</td>
                      <td className="px-4 py-4 text-blue-600 font-medium">
                        {index > 0 ? `${annualReturn.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
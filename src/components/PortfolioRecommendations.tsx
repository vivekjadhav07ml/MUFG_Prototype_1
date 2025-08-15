import React, { useState } from 'react';
import { TrendingUp, PieChart, BarChart3, Target, AlertCircle, CheckCircle, ArrowRight, Info } from 'lucide-react';
import { UserProfile } from '../App';

interface PortfolioRecommendationsProps {
  userProfile: UserProfile | null;
}

export const PortfolioRecommendations: React.FC<PortfolioRecommendationsProps> = ({ userProfile }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'current' | 'recommended' | 'aggressive'>('recommended');

  if (!userProfile) return null;

  const strategies = {
    current: {
      name: 'Current Portfolio',
      description: 'Your existing allocation',
      expectedReturn: 6.8,
      risk: 'Medium',
      allocation: [
        { name: 'Australian Shares', percentage: 35, color: 'bg-blue-500' },
        { name: 'International Shares', percentage: 25, color: 'bg-green-500' },
        { name: 'Bonds', percentage: 25, color: 'bg-purple-500' },
        { name: 'Property', percentage: 10, color: 'bg-orange-500' },
        { name: 'Cash', percentage: 5, color: 'bg-gray-500' },
      ],
      projectedBalance: 750000,
      monthlyIncome: 2500
    },
    recommended: {
      name: 'AI Recommended',
      description: 'Optimized for your goals and risk profile',
      expectedReturn: 8.2,
      risk: 'Medium-High',
      allocation: [
        { name: 'Australian Shares', percentage: 40, color: 'bg-blue-500' },
        { name: 'International Shares', percentage: 35, color: 'bg-green-500' },
        { name: 'Bonds', percentage: 15, color: 'bg-purple-500' },
        { name: 'Property', percentage: 8, color: 'bg-orange-500' },
        { name: 'Cash', percentage: 2, color: 'bg-gray-500' },
      ],
      projectedBalance: 920000,
      monthlyIncome: 3067
    },
    aggressive: {
      name: 'Growth Focused',
      description: 'Maximum growth potential for long-term investors',
      expectedReturn: 9.1,
      risk: 'High',
      allocation: [
        { name: 'Australian Shares', percentage: 45, color: 'bg-blue-500' },
        { name: 'International Shares', percentage: 45, color: 'bg-green-500' },
        { name: 'Bonds', percentage: 5, color: 'bg-purple-500' },
        { name: 'Property', percentage: 5, color: 'bg-orange-500' },
        { name: 'Cash', percentage: 0, color: 'bg-gray-500' },
      ],
      projectedBalance: 1050000,
      monthlyIncome: 3500
    }
  };

  const currentStrategy = strategies[selectedStrategy];
  const yearsToRetirement = userProfile.retirementAge - userProfile.age;

  const recommendations = [
    {
      title: 'Increase International Exposure',
      description: 'Add 10% more international shares for better diversification and growth potential.',
      impact: '+$45,000 at retirement',
      priority: 'high',
      reasoning: 'International markets offer different growth cycles and currency diversification benefits.'
    },
    {
      title: 'Reduce Cash Holdings',
      description: 'Move excess cash into growth assets to combat inflation and improve returns.',
      impact: '+$25,000 at retirement',
      priority: 'medium',
      reasoning: 'Cash provides security but loses purchasing power over time due to inflation.'
    },
    {
      title: 'Consider ESG Options',
      description: 'Sustainable investing options that align with your values without sacrificing returns.',
      impact: 'Neutral to positive',
      priority: 'low',
      reasoning: 'ESG funds have shown competitive performance while supporting sustainable practices.'
    }
  ];

  const riskMetrics = {
    volatility: selectedStrategy === 'current' ? 12.5 : selectedStrategy === 'recommended' ? 15.2 : 18.7,
    maxDrawdown: selectedStrategy === 'current' ? -18 : selectedStrategy === 'recommended' ? -22 : -28,
    sharpeRatio: selectedStrategy === 'current' ? 0.54 : selectedStrategy === 'recommended' ? 0.61 : 0.58
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Portfolio Recommendations</h1>
          <p className="text-slate-600">AI-powered investment strategies tailored to your goals and risk profile</p>
        </div>

        {/* Strategy Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Compare Investment Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(strategies).map(([key, strategy]) => (
              <button
                key={key}
                onClick={() => setSelectedStrategy(key as any)}
                className={`p-6 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedStrategy === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900">{strategy.name}</h3>
                  {key === 'recommended' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      AI Pick
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-sm mb-4">{strategy.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Expected Return</span>
                    <span className="font-medium text-green-600">{strategy.expectedReturn}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Risk Level</span>
                    <span className="font-medium">{strategy.risk}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Projected Balance</span>
                    <span className="font-medium">${strategy.projectedBalance.toLocaleString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Allocation */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Asset Allocation</h2>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <PieChart className="w-4 h-4" />
                <span>{currentStrategy.name}</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {currentStrategy.allocation.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${asset.color}`} />
                    <span className="font-medium text-slate-900">{asset.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${asset.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${asset.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-8">{asset.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Projections */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-900 mb-4">Performance Projections</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    ${currentStrategy.projectedBalance.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Balance at Retirement</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    ${currentStrategy.monthlyIncome.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Monthly Income</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Risk Analysis</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Expected Return</span>
                  <span className="text-sm font-bold text-green-600">{currentStrategy.expectedReturn}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(currentStrategy.expectedReturn / 12) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Volatility</span>
                  <span className="text-sm font-bold text-orange-600">{riskMetrics.volatility}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(riskMetrics.volatility / 25) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Max Drawdown</span>
                  <span className="text-sm font-bold text-red-600">{riskMetrics.maxDrawdown}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${Math.abs(riskMetrics.maxDrawdown / 35) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Sharpe Ratio</span>
                  <span className="text-sm font-bold text-blue-600">{riskMetrics.sharpeRatio}</span>
                </div>
                <p className="text-xs text-slate-500">Risk-adjusted return measure</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">Risk Assessment</p>
                    <p className="text-xs text-slate-600">
                      This portfolio aligns with your {userProfile.riskTolerance} risk tolerance and 
                      {yearsToRetirement}-year investment horizon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">AI Optimization Recommendations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-slate-900">{rec.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' : 
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-4">{rec.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">{rec.impact}</span>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">{rec.reasoning}</p>
                  </div>
                  
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <span className="text-sm font-medium">Apply Recommendation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Implementation Steps</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Review and Approve Strategy</h3>
                <p className="text-slate-600 text-sm">Confirm your selected portfolio allocation matches your goals and risk tolerance.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Contact Your Super Fund</h3>
                <p className="text-slate-600 text-sm">Request investment option changes through your fund's website or customer service.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Monitor and Rebalance</h3>
                <p className="text-slate-600 text-sm">Set up quarterly reviews to ensure your portfolio stays aligned with your strategy.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold mb-1">Ready to optimize your portfolio?</h3>
                <p className="text-blue-100 text-sm">Our AI will continue monitoring and provide updates as market conditions change.</p>
              </div>
              <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
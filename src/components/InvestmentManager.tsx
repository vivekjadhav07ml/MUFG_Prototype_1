import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Edit3, Trash2, Eye, Calculator } from 'lucide-react';
import { UserProfile } from '../App';

interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: 'ETF' | 'Stock' | 'Bond' | 'Property' | 'Cash';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  value: number;
  gain: number;
  gainPercent: number;
}

interface InvestmentManagerProps {
  userProfile: UserProfile;
}

export const InvestmentManager: React.FC<InvestmentManagerProps> = ({ userProfile }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'performance'>('overview');
  
  const [newInvestment, setNewInvestment] = useState({
    symbol: '',
    name: '',
    type: 'ETF' as const,
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Mock current prices - in real app, fetch from market data service
  const mockCurrentPrices: { [key: string]: number } = {
    'VAS.AX': 89.45,
    'VGS.AX': 102.67,
    'VAF.AX': 51.23,
    'VGE.AX': 67.89,
    'VDHG.AX': 58.34,
    'VAP.AX': 78.92
  };

  useEffect(() => {
    // Load investments from localStorage or API
    const savedInvestments = localStorage.getItem('userInvestments');
    if (savedInvestments) {
      const parsed = JSON.parse(savedInvestments);
      setInvestments(updateInvestmentPrices(parsed));
    } else {
      // Initialize with some sample data
      const sampleInvestments = [
        {
          id: '1',
          symbol: 'VAS.AX',
          name: 'Vanguard Australian Shares Index ETF',
          type: 'ETF' as const,
          quantity: 100,
          purchasePrice: 85.00,
          currentPrice: 89.45,
          purchaseDate: '2024-01-15',
          value: 8945,
          gain: 445,
          gainPercent: 5.24
        },
        {
          id: '2',
          symbol: 'VGS.AX',
          name: 'Vanguard MSCI Index International Shares ETF',
          type: 'ETF' as const,
          quantity: 50,
          purchasePrice: 98.50,
          currentPrice: 102.67,
          purchaseDate: '2024-02-01',
          value: 5133.50,
          gain: 208.50,
          gainPercent: 4.23
        }
      ];
      setInvestments(sampleInvestments);
    }
  }, []);

  const updateInvestmentPrices = (investmentList: Investment[]): Investment[] => {
    return investmentList.map(investment => {
      const currentPrice = mockCurrentPrices[investment.symbol] || investment.currentPrice;
      const value = investment.quantity * currentPrice;
      const gain = value - (investment.quantity * investment.purchasePrice);
      const gainPercent = (gain / (investment.quantity * investment.purchasePrice)) * 100;

      return {
        ...investment,
        currentPrice,
        value,
        gain,
        gainPercent
      };
    });
  };

  const handleAddInvestment = () => {
    if (!newInvestment.symbol || !newInvestment.name || newInvestment.quantity <= 0 || newInvestment.purchasePrice <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const currentPrice = mockCurrentPrices[newInvestment.symbol] || newInvestment.purchasePrice;
    const value = newInvestment.quantity * currentPrice;
    const gain = value - (newInvestment.quantity * newInvestment.purchasePrice);
    const gainPercent = (gain / (newInvestment.quantity * newInvestment.purchasePrice)) * 100;

    const investment: Investment = {
      id: Date.now().toString(),
      ...newInvestment,
      currentPrice,
      value,
      gain,
      gainPercent
    };

    const updatedInvestments = [...investments, investment];
    setInvestments(updatedInvestments);
    localStorage.setItem('userInvestments', JSON.stringify(updatedInvestments));

    setNewInvestment({
      symbol: '',
      name: '',
      type: 'ETF',
      quantity: 0,
      purchasePrice: 0,
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
  };

  const handleDeleteInvestment = (id: string) => {
    const updatedInvestments = investments.filter(inv => inv.id !== id);
    setInvestments(updatedInvestments);
    localStorage.setItem('userInvestments', JSON.stringify(updatedInvestments));
  };

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalGain = investments.reduce((sum, inv) => sum + inv.gain, 0);
  const totalGainPercent = totalValue > 0 ? (totalGain / (totalValue - totalGain)) * 100 : 0;

  const assetAllocation = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.value;
    return acc;
  }, {} as { [key: string]: number });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-slate-600">Total Value</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</h3>
          <p className="text-slate-600 text-sm">Portfolio Value</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${totalGain >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {totalGain >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
            <span className="text-sm text-slate-600">Total Gain/Loss</span>
          </div>
          <h3 className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(totalGain).toLocaleString()}
          </h3>
          <p className={`text-sm ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGain >= 0 ? '+' : '-'}{Math.abs(totalGainPercent).toFixed(2)}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-slate-600">Holdings</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{investments.length}</h3>
          <p className="text-slate-600 text-sm">Active Investments</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <PieChart className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-slate-600">Diversification</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{Object.keys(assetAllocation).length}</h3>
          <p className="text-slate-600 text-sm">Asset Types</p>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Asset Allocation</h3>
        <div className="space-y-4">
          {Object.entries(assetAllocation).map(([type, value]) => {
            const percentage = (value / totalValue) * 100;
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${
                    type === 'ETF' ? 'bg-blue-500' :
                    type === 'Stock' ? 'bg-green-500' :
                    type === 'Bond' ? 'bg-purple-500' :
                    type === 'Property' ? 'bg-orange-500' : 'bg-gray-500'
                  }`} />
                  <span className="font-medium text-slate-900">{type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        type === 'ETF' ? 'bg-blue-500' :
                        type === 'Stock' ? 'bg-green-500' :
                        type === 'Bond' ? 'bg-purple-500' :
                        type === 'Property' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 w-12">{percentage.toFixed(1)}%</span>
                  <span className="text-sm text-slate-600 w-20">${value.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Investments */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Your Investments</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Investment</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Asset</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Purchase Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gain/Loss</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-slate-900">{investment.symbol}</div>
                      <div className="text-sm text-slate-500">{investment.type}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-900">{investment.quantity}</td>
                  <td className="px-4 py-4 text-slate-900">${investment.purchasePrice.toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-900">${investment.currentPrice.toFixed(2)}</td>
                  <td className="px-4 py-4 font-medium text-slate-900">${investment.value.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <div className={`font-medium ${investment.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investment.gain >= 0 ? '+' : ''}${investment.gain.toFixed(2)}
                    </div>
                    <div className={`text-sm ${investment.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investment.gain >= 0 ? '+' : ''}{investment.gainPercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingInvestment(investment)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvestment(investment.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Investment Manager</h1>
          <p className="text-slate-600">Track and manage your investment portfolio</p>
        </div>

        {/* View Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'detailed', label: 'Detailed View', icon: Eye },
              { id: 'performance', label: 'Performance', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedView(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {selectedView === 'overview' && renderOverview()}

        {/* Add Investment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Add New Investment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Symbol</label>
                  <input
                    type="text"
                    value={newInvestment.symbol}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, symbol: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., VAS.AX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newInvestment.name}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Investment name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={newInvestment.type}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ETF">ETF</option>
                    <option value="Stock">Stock</option>
                    <option value="Bond">Bond</option>
                    <option value="Property">Property</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={newInvestment.quantity}
                      onChange={(e) => setNewInvestment(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newInvestment.purchasePrice}
                      onChange={(e) => setNewInvestment(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={newInvestment.purchaseDate}
                    onChange={(e) => setNewInvestment(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddInvestment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Investment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
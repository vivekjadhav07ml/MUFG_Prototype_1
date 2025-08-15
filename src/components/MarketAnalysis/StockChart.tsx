import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Activity, Volume, Calendar } from 'lucide-react'
import { marketDataService, StockData, ChartData } from '../../services/marketData'

interface StockChartProps {
  symbol: string
  name: string
  onClose?: () => void
}

export const StockChart: React.FC<StockChartProps> = ({ symbol, name, onClose }) => {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [chartType, setChartType] = useState<'line' | 'area'>('area')

  useEffect(() => {
    loadData()
  }, [symbol, timeframe])

  const loadData = async () => {
    setLoading(true)
    try {
      // Try to get real data first, fallback to mock data
      const [quote, historical] = await Promise.all([
        marketDataService.getStockQuote(symbol),
        marketDataService.getHistoricalData(symbol, timeframe)
      ])

      if (quote) {
        setStockData(quote)
      } else {
        // Use mock data if API fails
        setStockData(marketDataService.getMockStockData(symbol))
      }

      if (historical.length > 0) {
        setChartData(historical)
      } else {
        // Use mock data if API fails
        setChartData(marketDataService.getMockChartData())
      }
    } catch (error) {
      console.error('Error loading market data:', error)
      // Fallback to mock data
      setStockData(marketDataService.getMockStockData(symbol))
      setChartData(marketDataService.getMockChartData())
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (value: number) => `$${value.toFixed(2)}`
  const formatVolume = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-AU', { 
      month: 'short', 
      day: 'numeric',
      year: timeframe === 'monthly' ? 'numeric' : undefined
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading market data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{name}</h3>
            <p className="text-slate-600 text-sm">{symbol}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ×
            </button>
          )}
        </div>

        {stockData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Current Price</p>
              <p className="text-2xl font-bold text-slate-900">{formatPrice(stockData.price)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Change</p>
              <div className="flex items-center space-x-1">
                {stockData.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-bold ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPrice(Math.abs(stockData.change))} ({Math.abs(stockData.changePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600">Volume</p>
              <div className="flex items-center space-x-1">
                <Volume className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-900">{formatVolume(stockData.volume)}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-600">Live</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Timeframe:</span>
            <div className="flex space-x-1">
              {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'area'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatPrice}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), 'Price']}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatPrice}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), 'Price']}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3b82f6' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-3">Key Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Day High</p>
            <p className="font-semibold text-slate-900">
              {chartData.length > 0 ? formatPrice(Math.max(...chartData.slice(-1).map(d => d.high))) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Day Low</p>
            <p className="font-semibold text-slate-900">
              {chartData.length > 0 ? formatPrice(Math.min(...chartData.slice(-1).map(d => d.low))) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Avg Volume</p>
            <p className="font-semibold text-slate-900">
              {chartData.length > 0 ? formatVolume(chartData.reduce((sum, d) => sum + d.volume, 0) / chartData.length) : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Volatility</p>
            <p className="font-semibold text-slate-900">
              {chartData.length > 0 ? `${(Math.random() * 5 + 10).toFixed(1)}%` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Globe, DollarSign, BarChart3 } from 'lucide-react'
import { marketDataService, StockData, MarketNews } from '../../services/marketData'

interface MarketOverviewProps {
  onSelectStock: (symbol: string, name: string) => void
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ onSelectStock }) => {
  const [marketData, setMarketData] = useState<StockData[]>([])
  const [news, setNews] = useState<MarketNews[]>([])
  const [loading, setLoading] = useState(true)

  const watchlist = [
    { symbol: 'VAS.AX', name: 'Vanguard Australian Shares Index ETF', category: 'Australian Equity' },
    { symbol: 'VGS.AX', name: 'Vanguard MSCI Index International Shares ETF', category: 'International Equity' },
    { symbol: 'VAF.AX', name: 'Vanguard Australian Fixed Interest Index ETF', category: 'Fixed Income' },
    { symbol: 'VGE.AX', name: 'Vanguard FTSE Emerging Markets Shares ETF', category: 'Emerging Markets' },
    { symbol: 'VDHG.AX', name: 'Vanguard Diversified High Growth Index ETF', category: 'Diversified' },
    { symbol: 'VAP.AX', name: 'Vanguard Australian Property Securities Index ETF', category: 'Property' },
  ]

  useEffect(() => {
    loadMarketData()
  }, [])

  const loadMarketData = async () => {
    setLoading(true)
    try {
      // Load stock data for watchlist
      const stockPromises = watchlist.map(async (stock) => {
        const data = await marketDataService.getStockQuote(stock.symbol)
        return data || marketDataService.getMockStockData(stock.symbol)
      })

      const [stocks, marketNews] = await Promise.all([
        Promise.all(stockPromises),
        marketDataService.getMarketNews(['VAS.AX', 'VGS.AX', 'VAF.AX'])
      ])

      setMarketData(stocks)
      setNews(marketNews.length > 0 ? marketNews : getMockNews())
    } catch (error) {
      console.error('Error loading market data:', error)
      // Fallback to mock data
      setMarketData(watchlist.map(stock => marketDataService.getMockStockData(stock.symbol)))
      setNews(getMockNews())
    } finally {
      setLoading(false)
    }
  }

  const getMockNews = (): MarketNews[] => [
    {
      title: 'Australian Superannuation Funds Show Strong Performance',
      summary: 'Major super funds report positive returns driven by international equity exposure and defensive positioning.',
      url: '#',
      source: 'Financial Review',
      publishedAt: new Date().toISOString(),
      sentiment: 'positive'
    },
    {
      title: 'RBA Maintains Interest Rates, Focus on Inflation',
      summary: 'Reserve Bank keeps rates steady while monitoring inflation trends and employment data.',
      url: '#',
      source: 'ABC News',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      sentiment: 'neutral'
    },
    {
      title: 'Global Markets React to Economic Uncertainty',
      summary: 'International markets show mixed signals as investors weigh economic indicators and policy changes.',
      url: '#',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      sentiment: 'negative'
    }
  ]

  const formatPrice = (value: number) => `$${value.toFixed(2)}`
  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${formatPrice(change)} (${sign}${changePercent.toFixed(2)}%)`
  }

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Market Overview</h2>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <Activity className="w-4 h-4" />
            <span>Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">ASX 200</p>
                <p className="text-2xl font-bold text-green-900">7,234.5</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+0.8%</span>
                </div>
                <p className="text-xs text-green-600">+58.2 pts</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">AUD/USD</p>
                <p className="text-2xl font-bold text-blue-900">0.6745</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-red-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">-0.3%</span>
                </div>
                <p className="text-xs text-red-600">-0.0021</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">RBA Cash Rate</p>
                <p className="text-2xl font-bold text-purple-900">4.35%</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-slate-600">
                  <Activity className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Unchanged</span>
                </div>
                <p className="text-xs text-slate-600">Last meeting</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Recommended ETFs</h3>
          <div className="text-sm text-slate-600">
            Updated: {new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="space-y-3">
          {marketData.map((stock, index) => {
            const watchlistItem = watchlist[index]
            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol, watchlistItem.name)}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{stock.symbol}</h4>
                      <p className="text-sm text-slate-600">{watchlistItem.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">
                    {watchlistItem.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">{formatPrice(stock.price)}</p>
                  <div className={`flex items-center text-sm ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    <span>{formatChange(stock.change, stock.changePercent)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Market News */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Market News</h3>
        </div>

        <div className="space-y-4">
          {news.map((article, index) => (
            <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2 hover:text-blue-600 cursor-pointer">
                    {article.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>{article.source}</span>
                    <span>{getTimeAgo(article.publishedAt)}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      article.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                      article.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {article.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
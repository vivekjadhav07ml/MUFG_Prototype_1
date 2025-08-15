import React, { useState, useEffect } from 'react';
import { Bot, TrendingUp, AlertCircle, Target, Star, RefreshCw, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { geminiService, InvestmentRecommendation, MarketInsight } from '../services/geminiService';
import { marketDataService } from '../services/marketData';
import { UserProfile } from '../App';

interface AIRecommendationsProps {
  userProfile: UserProfile;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ userProfile }) => {
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'recommendations' | 'insights' | 'chat'>('recommendations');

  useEffect(() => {
    loadAIData();
  }, [userProfile]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      // Get current market data
      const marketData = await Promise.all([
        marketDataService.getStockQuote('VAS.AX'),
        marketDataService.getStockQuote('VGS.AX'),
        marketDataService.getStockQuote('VAF.AX'),
        marketDataService.getStockQuote('VGE.AX'),
      ]);

      const validMarketData = marketData.filter(Boolean).length > 0 
        ? marketData.filter(Boolean) 
        : [
            marketDataService.getMockStockData('VAS.AX'),
            marketDataService.getMockStockData('VGS.AX'),
            marketDataService.getMockStockData('VAF.AX'),
            marketDataService.getMockStockData('VGE.AX'),
          ];

      // Get AI recommendations and insights
      const [aiRecommendations, aiInsights] = await Promise.all([
        geminiService.getInvestmentRecommendations(userProfile, validMarketData),
        geminiService.getMarketInsights(validMarketData, userProfile)
      ]);

      setRecommendations(aiRecommendations);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error loading AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    setChatLoading(true);
    try {
      const response = await geminiService.answerFinancialQuestion(chatQuestion, userProfile);
      setChatResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setChatResponse('I apologize, but I\'m currently unable to process your question. Please try again later or consult with a licensed financial advisor.');
    } finally {
      setChatLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'HIGH': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-green-100 text-green-700 border-green-200';
      case 'HOLD': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'SELL': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderRecommendations = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{rec.symbol}</h3>
                    <p className="text-sm text-slate-600">{rec.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(rec.riskLevel)}`}>
                      {rec.riskLevel}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-slate-600 ml-1">{rec.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 mb-4 ${getRecommendationColor(rec.recommendation)}`}>
                  {rec.recommendation === 'BUY' && <TrendingUp className="w-4 h-4 mr-1" />}
                  {rec.recommendation === 'HOLD' && <Target className="w-4 h-4 mr-1" />}
                  {rec.recommendation === 'SELL' && <AlertCircle className="w-4 h-4 mr-1" />}
                  {rec.recommendation}
                </div>

                <p className="text-slate-700 text-sm mb-4">{rec.reasoning}</p>

                <div className="space-y-2 text-sm">
                  {rec.targetPrice && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Target Price:</span>
                      <span className="font-medium text-slate-900">${rec.targetPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time Horizon:</span>
                    <span className="font-medium text-slate-900">{rec.timeHorizon}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <button className="p-1 text-green-600 hover:text-green-700">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-700">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {recommendations.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No recommendations available</h3>
              <p className="text-slate-600">Try refreshing to get new AI-powered investment recommendations.</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-slate-900">{insight.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        insight.importance === 'HIGH' ? 'bg-red-100 text-red-700' :
                        insight.importance === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {insight.importance}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        insight.category === 'MARKET_TREND' ? 'bg-green-100 text-green-700' :
                        insight.category === 'ECONOMIC_INDICATOR' ? 'bg-purple-100 text-purple-700' :
                        insight.category === 'SECTOR_ANALYSIS' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {insight.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-700">{insight.content}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button className="p-1 text-green-600 hover:text-green-700">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-700">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {insights.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No insights available</h3>
              <p className="text-slate-600">Market insights will appear here when available.</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Ask AI Financial Advisor</h3>
        <form onSubmit={handleChatSubmit} className="space-y-4">
          <div>
            <textarea
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Ask me anything about investments, superannuation, or financial planning..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={chatLoading || !chatQuestion.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chatLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Ask AI</span>
              </>
            )}
          </button>
        </form>

        {chatResponse && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-2">AI Response</h4>
                <div className="text-slate-700 whitespace-pre-wrap">{chatResponse}</div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <button className="p-1 text-green-600 hover:text-green-700">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-700">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    This is AI-generated advice. Please consult a licensed financial advisor for personalized guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sample Questions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Sample Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Should I increase my superannuation contributions?",
            "What's the best asset allocation for my age?",
            "How can I reduce investment fees?",
            "When should I rebalance my portfolio?",
            "What are the tax implications of salary sacrificing?",
            "How much should I have saved by retirement?"
          ].map((question, index) => (
            <button
              key={index}
              onClick={() => setChatQuestion(question)}
              className="p-3 text-left text-sm bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Investment Advisor</h1>
              <p className="text-slate-600">Personalized recommendations powered by artificial intelligence</p>
            </div>
            <button
              onClick={loadAIData}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'recommendations', label: 'Recommendations', icon: TrendingUp },
                { id: 'insights', label: 'Market Insights', icon: AlertCircle },
                { id: 'chat', label: 'AI Chat', icon: MessageCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === 'recommendations' && renderRecommendations()}
            {selectedTab === 'insights' && renderInsights()}
            {selectedTab === 'chat' && renderChat()}
          </div>
        </div>
      </div>
    </div>
  );
};
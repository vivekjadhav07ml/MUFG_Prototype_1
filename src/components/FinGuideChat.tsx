import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, BarChart3, PieChart, Calculator, Lightbulb, RefreshCw, Download, MessageCircle } from 'lucide-react';
import { finGuideService, ChatMessage, InvestmentComparison, FinancialAnalysis } from '../services/finGuideService';
import { UserProfile } from '../App';

interface FinGuideChatProps {
  userProfile: UserProfile;
}

export const FinGuideChat: React.FC<FinGuideChatProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Hello ${userProfile?.name || 'there'}! I'm FinGuide AI, your intelligent financial advisor. I specialize in Australian investments including stocks, bonds, REITs, and ETFs.

**What I can help you with:**
📈 **Investment Analysis** - Detailed breakdowns of stocks, ETFs, and funds
📊 **Portfolio Comparison** - Compare different investment options
🎯 **Personalized Strategies** - Tailored advice based on your profile
💰 **Superannuation Guidance** - Maximize your retirement savings
📚 **Financial Education** - Explain complex concepts simply

**Your Profile Summary:**
• Age: ${userProfile?.age} | Retirement: ${userProfile?.retirementAge}
• Risk Tolerance: ${userProfile?.riskTolerance}
• Current Super: $${userProfile?.currentSuper?.toLocaleString()}
• Monthly Contribution: $${userProfile?.monthlyContribution}

What would you like to explore today?`,
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        'Analyze my current portfolio allocation',
        'Compare VAS.AX vs VGS.AX for my profile',
        'How can I optimize my super contributions?',
        'Explain REITs vs direct property investment'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState<FinancialAnalysis | null>(null);
  const [showComparison, setShowComparison] = useState<InvestmentComparison | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await finGuideService.processMessage(text, userProfile, true);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleQuickAction = async (action: string) => {
    setIsTyping(true);
    try {
      switch (action) {
        case 'analyze':
          const analysis = await finGuideService.analyzeInvestment('VAS.AX', userProfile);
          setShowAnalysis(analysis);
          break;
        case 'compare':
          const comparison = await finGuideService.compareInvestments('VAS.AX', 'VGS.AX', userProfile);
          setShowComparison(comparison);
          break;
        case 'portfolio':
          handleSendMessage('Analyze my current portfolio and suggest improvements');
          break;
        case 'super':
          handleSendMessage('How can I optimize my superannuation strategy?');
          break;
      }
    } catch (error) {
      console.error('Error with quick action:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.sender.toUpperCase()}: ${msg.text}\n`
    ).join('\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finguide-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    finGuideService.clearHistory();
    setMessages([messages[0]]); // Keep welcome message
    setShowAnalysis(null);
    setShowComparison(null);
  };

  const renderAnalysisModal = () => {
    if (!showAnalysis) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Investment Analysis</h3>
              <button
                onClick={() => setShowAnalysis(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-slate-900">{showAnalysis.symbol}</h4>
              <p className="text-slate-600">{showAnalysis.name}</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${showAnalysis.currentPrice.toFixed(2)}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                showAnalysis.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                showAnalysis.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {showAnalysis.riskLevel} Risk
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">1 Year</p>
                <p className="text-xl font-bold text-slate-900">
                  {showAnalysis.historicalPerformance.oneYear}%
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">3 Year</p>
                <p className="text-xl font-bold text-slate-900">
                  {showAnalysis.historicalPerformance.threeYear}%
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">5 Year</p>
                <p className="text-xl font-bold text-slate-900">
                  {showAnalysis.historicalPerformance.fiveYear}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-green-700 mb-3">✅ Pros</h5>
                <ul className="space-y-2">
                  {showAnalysis.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-slate-700">• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-red-700 mb-3">⚠️ Cons</h5>
                <ul className="space-y-2">
                  {showAnalysis.cons.map((con, index) => (
                    <li key={index} className="text-sm text-slate-700">• {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-2">Suitability</h5>
              <p className="text-slate-700 text-sm">{showAnalysis.suitability}</p>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 mb-2">Diversification Benefits</h5>
              <ul className="space-y-1">
                {showAnalysis.diversificationBenefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-slate-700">• {benefit}</li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                ⚠️ This is educational guidance only, not personal financial advice. 
                Please consult a licensed financial advisor for personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonModal = () => {
    if (!showComparison) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Investment Comparison</h3>
              <button
                onClick={() => setShowComparison(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold text-slate-900">
                {showComparison.asset1} vs {showComparison.asset2}
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Criteria</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-700">{showComparison.asset1}</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-700">{showComparison.asset2}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">Risk Level</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.riskLevel.asset1}</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.riskLevel.asset2}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">Expected Returns</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.returns.asset1}</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.returns.asset2}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">Liquidity</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.liquidity.asset1}</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.liquidity.asset2}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-slate-900">Diversification</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.diversification.asset1}</td>
                    <td className="px-4 py-3 text-center">{showComparison.comparison.diversification.asset2}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">Recommendation</h5>
              <p className="text-blue-800 text-sm">{showComparison.comparison.recommendation}</p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                ⚠️ This is educational guidance only, not personal financial advice. 
                Please consult a licensed financial advisor for personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">FinGuide AI</h1>
                <p className="text-slate-600">Your Intelligent Financial Advisor</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportChat}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
              <button
                onClick={clearChat}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleQuickAction('analyze')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-slate-700">Analyze Investment</span>
            </button>
            <button
              onClick={() => handleQuickAction('compare')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <PieChart className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-slate-700">Compare Options</span>
            </button>
            <button
              onClick={() => handleQuickAction('portfolio')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-slate-700">Portfolio Review</span>
            </button>
            <button
              onClick={() => handleQuickAction('super')}
              className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
            >
              <Calculator className="w-6 h-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-slate-700">Super Strategy</span>
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-br from-green-500 to-blue-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={`p-4 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <div className="whitespace-pre-line">{message.text}</div>
                    </div>
                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 text-xs bg-white border border-slate-300 text-slate-700 rounded-full hover:bg-slate-50 transition-colors duration-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Ask me about investments, superannuation, or financial strategies..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              FinGuide AI provides educational guidance only, not personal financial advice. Always consult a licensed advisor.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderAnalysisModal()}
      {renderComparisonModal()}
    </div>
  );
};
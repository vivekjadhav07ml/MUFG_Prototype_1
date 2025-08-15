import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react';
import { UserProfile } from '../App';

interface ChatInterfaceProps {
  userProfile: UserProfile | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${userProfile?.name}! I'm your AI Investment Advisor. I can help you optimize your superannuation strategy, analyze market trends, and answer any investment questions you have. What would you like to know?`,
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        'How can I maximize my retirement savings?',
        'Should I increase my risk tolerance?',
        'What are the best performing investment options?',
        'How much should I contribute monthly?'
      ]
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('maximize') || message.includes('increase') || message.includes('savings')) {
      return `Based on your ${userProfile?.riskTolerance} risk profile and ${userProfile?.retirementAge! - userProfile?.age!} years to retirement, I recommend:

1. **Increase Contributions**: Consider boosting your monthly contribution by $200-300. This could add $45,000+ to your retirement balance.

2. **Salary Sacrifice**: Use pre-tax contributions to maximize tax benefits - potentially saving you $1,200 annually.

3. **Asset Allocation**: With your timeframe, consider increasing growth assets to 70-75% for higher long-term returns.

4. **Regular Reviews**: Market conditions change - I recommend quarterly portfolio reviews to stay optimized.

Would you like me to calculate specific projections for any of these strategies?`;
    }
    
    if (message.includes('risk') || message.includes('tolerance')) {
      return `Your current ${userProfile?.riskTolerance} risk profile suits your ${userProfile?.retirementAge! - userProfile?.age!}-year investment horizon well. Here's what this means:

**Current Allocation Benefits:**
- Balanced growth potential with managed volatility
- Diversification across asset classes
- Appropriate for medium to long-term goals

**Consider This:**
Given your age (${userProfile?.age}) and time to retirement, you might benefit from a slightly more growth-oriented approach. This could potentially increase your retirement balance by 15-20%.

**Risk vs. Reward:**
- Higher risk = potential for $75,000+ more at retirement
- Lower risk = more predictable but potentially smaller returns

Would you like me to model different risk scenarios for your specific situation?`;
    }
    
    if (message.includes('contribute') || message.includes('monthly') || message.includes('much')) {
      const current = userProfile?.monthlyContribution || 500;
      const recommended = Math.round(current * 1.4);
      const difference = recommended - current;
      
      return `Based on your goals and current balance of $${userProfile?.currentSuper.toLocaleString()}, here's my analysis:

**Current Contribution:** $${current}/month
**Recommended:** $${recommended}/month (+$${difference})

**Impact of Increase:**
- Additional retirement savings: ~$${Math.round(difference * 12 * (userProfile?.retirementAge! - userProfile?.age!) * 1.07).toLocaleString()}
- Tax benefits: Save ~$${Math.round(difference * 12 * 0.15)}/year
- Retirement income boost: +$${Math.round(difference * 12 * (userProfile?.retirementAge! - userProfile?.age!) * 1.07 * 0.04 / 12)}/month

**Ways to Increase:**
1. Salary sacrifice (pre-tax)
2. After-tax contributions
3. Government co-contributions (if eligible)

Should I help you calculate the optimal contribution strategy?`;
    }
    
    return `I understand you're asking about ${message}. Based on your profile:

- Current Balance: $${userProfile?.currentSuper.toLocaleString()}
- Risk Profile: ${userProfile?.riskTolerance}
- Years to Retirement: ${userProfile?.retirementAge! - userProfile?.age!}

Let me provide personalized advice. The superannuation landscape offers many opportunities for optimization, from asset allocation adjustments to contribution strategies and tax-effective structures.

Could you be more specific about what aspect of your investment strategy you'd like to focus on? I can provide detailed analysis on portfolio performance, risk management, or retirement income projections.`;
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: simulateAIResponse(text),
        sender: 'ai',
        timestamp: new Date(),
        suggestions: [
          'Tell me more about this strategy',
          'Show me the calculations',
          'What are the risks?',
          'Compare with other options'
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const quickActions = [
    { icon: TrendingUp, text: 'Portfolio Performance', color: 'bg-blue-500' },
    { icon: DollarSign, text: 'Increase Contributions', color: 'bg-green-500' },
    { icon: Target, text: 'Retirement Goals', color: 'bg-purple-500' },
    { icon: AlertCircle, text: 'Risk Assessment', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[700px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Investment Advisor</h2>
                <p className="text-blue-100 text-sm">Personalized superannuation guidance</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(action.text)}
                      className="flex flex-col items-center p-3 rounded-lg border border-slate-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className={`p-2 rounded-lg ${action.color} mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-slate-700 text-center">{action.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                      <p className="whitespace-pre-line">{message.text}</p>
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
                placeholder="Ask me about your superannuation strategy..."
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
              AI responses are educational and not personalized financial advice. Consult a licensed advisor for specific guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marketDataService } from './marketData';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  data?: any; // For structured data like tables, charts
}

export interface InvestmentComparison {
  asset1: string;
  asset2: string;
  comparison: {
    riskLevel: { asset1: string; asset2: string };
    returns: { asset1: string; asset2: string };
    liquidity: { asset1: string; asset2: string };
    diversification: { asset1: string; asset2: string };
    recommendation: string;
  };
}

export interface FinancialAnalysis {
  symbol: string;
  name: string;
  currentPrice: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  historicalPerformance: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  pros: string[];
  cons: string[];
  suitability: string;
  diversificationBenefits: string[];
}

class FinGuideService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  private conversationHistory: ChatMessage[] = [];

  private readonly SYSTEM_PROMPT = `
You are FinGuide AI, an intelligent financial advisor chatbot specializing in Australian investments, particularly superannuation, stocks, bonds, REITs, and ETFs. Your goal is to provide personalized, accurate, and easy-to-understand financial insights.

Key Responsibilities:
1. Use real-time market data to provide current insights
2. Understand user profiles (risk appetite, time horizon, goals)
3. Suggest suitable investment strategies
4. Compare investment options with structured analysis
5. Explain concepts in simple, clear language
6. Always remind users this is educational guidance, not official financial advice

Output Format:
- Use structured responses with headings and bullet points
- Include pros, cons, and risk factors
- Provide specific data when available
- Keep tone professional but friendly
- Focus on Australian market and superannuation context

Always end responses with: "⚠️ This is educational guidance only, not personal financial advice. Please consult a licensed financial advisor for personalized recommendations."
`;

  async processMessage(
    message: string, 
    userProfile?: any, 
    includeMarketData: boolean = true
  ): Promise<ChatMessage> {
    try {
      let marketContext = '';
      
      if (includeMarketData) {
        // Fetch relevant market data
        const marketData = await this.getRelevantMarketData(message);
        if (marketData.length > 0) {
          marketContext = `\n\nCurrent Market Data:\n${marketData.map(stock => 
            `${stock.symbol}: $${stock.price} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`
          ).join('\n')}`;
        }
      }

      const userContext = userProfile ? `\n\nUser Profile:
- Age: ${userProfile.age}
- Risk Tolerance: ${userProfile.riskTolerance}
- Current Super Balance: $${userProfile.currentSuper?.toLocaleString()}
- Monthly Contribution: $${userProfile.monthlyContribution}
- Years to Retirement: ${userProfile.retirementAge - userProfile.age}
- Financial Goals: ${userProfile.financialGoals?.join(', ')}` : '';

      const conversationContext = this.conversationHistory.length > 0 
        ? `\n\nRecent Conversation:\n${this.conversationHistory.slice(-3).map(msg => 
            `${msg.sender}: ${msg.text}`
          ).join('\n')}` 
        : '';

      const fullPrompt = `${this.SYSTEM_PROMPT}

User Question: ${message}${userContext}${marketContext}${conversationContext}

Please provide a comprehensive, structured response that addresses the user's question with specific, actionable insights.`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const aiResponse = response.text();

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: this.generateSuggestions(message, aiResponse)
      };

      // Add to conversation history
      this.conversationHistory.push({
        id: (Date.now() - 1).toString(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      });
      this.conversationHistory.push(aiMessage);

      // Keep only last 10 messages for context
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return aiMessage;
    } catch (error) {
      console.error('Error processing message:', error);
      return this.getFallbackResponse(message);
    }
  }

  async compareInvestments(asset1: string, asset2: string, userProfile?: any): Promise<InvestmentComparison> {
    try {
      const prompt = `Compare ${asset1} vs ${asset2} for Australian investors. Provide a detailed comparison including:
1. Risk levels
2. Expected returns
3. Liquidity
4. Diversification benefits
5. Suitability for different investor profiles

${userProfile ? `Consider this user profile:
- Risk Tolerance: ${userProfile.riskTolerance}
- Age: ${userProfile.age}
- Investment Experience: ${userProfile.investmentExperience}` : ''}

Format as JSON with the structure:
{
  "asset1": "${asset1}",
  "asset2": "${asset2}",
  "comparison": {
    "riskLevel": {"asset1": "Medium", "asset2": "Low"},
    "returns": {"asset1": "7-9% annually", "asset2": "3-5% annually"},
    "liquidity": {"asset1": "High", "asset2": "Medium"},
    "diversification": {"asset1": "Good", "asset2": "Excellent"},
    "recommendation": "Based on your profile..."
  }
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      try {
        return JSON.parse(response.text());
      } catch {
        return this.getFallbackComparison(asset1, asset2);
      }
    } catch (error) {
      console.error('Error comparing investments:', error);
      return this.getFallbackComparison(asset1, asset2);
    }
  }

  async analyzeInvestment(symbol: string, userProfile?: any): Promise<FinancialAnalysis> {
    try {
      const marketData = await marketDataService.getStockQuote(symbol);
      const historicalData = await marketDataService.getHistoricalData(symbol, 'monthly');

      const prompt = `Analyze ${symbol} for Australian investors. Provide:
1. Risk assessment
2. Historical performance analysis
3. Pros and cons
4. Suitability assessment
5. Diversification benefits

Current price: ${marketData?.price || 'N/A'}
${userProfile ? `User profile: ${userProfile.riskTolerance} risk tolerance, ${userProfile.age} years old` : ''}

Format as JSON with this structure:
{
  "symbol": "${symbol}",
  "name": "Full name",
  "currentPrice": ${marketData?.price || 0},
  "riskLevel": "Medium",
  "historicalPerformance": {
    "oneYear": 8.5,
    "threeYear": 7.2,
    "fiveYear": 9.1
  },
  "pros": ["Pro 1", "Pro 2"],
  "cons": ["Con 1", "Con 2"],
  "suitability": "Suitable for...",
  "diversificationBenefits": ["Benefit 1", "Benefit 2"]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      try {
        return JSON.parse(response.text());
      } catch {
        return this.getFallbackAnalysis(symbol, marketData);
      }
    } catch (error) {
      console.error('Error analyzing investment:', error);
      return this.getFallbackAnalysis(symbol);
    }
  }

  private async getRelevantMarketData(message: string): Promise<any[]> {
    const symbols = ['VAS.AX', 'VGS.AX', 'VAF.AX', 'VGE.AX'];
    const relevantSymbols = symbols.filter(symbol => 
      message.toLowerCase().includes(symbol.toLowerCase()) ||
      message.toLowerCase().includes(symbol.replace('.AX', '').toLowerCase())
    );

    if (relevantSymbols.length === 0 && this.isMarketRelatedQuery(message)) {
      // If no specific symbols mentioned but market-related, get top ETFs
      const marketData = await Promise.all(
        symbols.slice(0, 3).map(symbol => marketDataService.getStockQuote(symbol))
      );
      return marketData.filter(Boolean);
    }

    if (relevantSymbols.length > 0) {
      const marketData = await Promise.all(
        relevantSymbols.map(symbol => marketDataService.getStockQuote(symbol))
      );
      return marketData.filter(Boolean);
    }

    return [];
  }

  private isMarketRelatedQuery(message: string): boolean {
    const marketKeywords = [
      'market', 'stock', 'etf', 'investment', 'portfolio', 'price', 'performance',
      'return', 'dividend', 'asx', 'shares', 'fund', 'super', 'superannuation'
    ];
    return marketKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private generateSuggestions(userMessage: string, aiResponse: string): string[] {
    const suggestions = [];
    
    if (userMessage.toLowerCase().includes('compare')) {
      suggestions.push('Tell me more about the risks');
      suggestions.push('What about tax implications?');
      suggestions.push('Show me historical performance');
    } else if (userMessage.toLowerCase().includes('portfolio')) {
      suggestions.push('How should I rebalance?');
      suggestions.push('What about diversification?');
      suggestions.push('Analyze my risk exposure');
    } else if (userMessage.toLowerCase().includes('super')) {
      suggestions.push('How can I maximize contributions?');
      suggestions.push('What about salary sacrifice?');
      suggestions.push('Compare super fund options');
    } else {
      suggestions.push('Explain this in simpler terms');
      suggestions.push('What are the risks?');
      suggestions.push('How does this fit my profile?');
      suggestions.push('Show me alternatives');
    }

    return suggestions.slice(0, 4);
  }

  private getFallbackResponse(message: string): ChatMessage {
    return {
      id: Date.now().toString(),
      text: `I understand you're asking about "${message}". While I'm currently experiencing technical difficulties accessing real-time data, I can provide some general guidance:

**For Investment Questions:**
• Consider your risk tolerance and time horizon
• Diversification across asset classes is key
• Australian ETFs like VAS.AX (ASX 200) and VGS.AX (International) are popular choices
• Fixed income options like VAF.AX provide stability

**For Superannuation:**
• Maximize employer contributions (currently 11%)
• Consider salary sacrifice for tax benefits
• Review your investment options annually
• Ensure appropriate insurance coverage

**Next Steps:**
• Review your current portfolio allocation
• Consider your investment timeline
• Assess your risk capacity

⚠️ This is educational guidance only, not personal financial advice. Please consult a licensed financial advisor for personalized recommendations.`,
      sender: 'ai',
      timestamp: new Date(),
      suggestions: [
        'Tell me about portfolio diversification',
        'How do I choose the right super fund?',
        'Compare stocks vs bonds',
        'Explain investment risk levels'
      ]
    };
  }

  private getFallbackComparison(asset1: string, asset2: string): InvestmentComparison {
    return {
      asset1,
      asset2,
      comparison: {
        riskLevel: { asset1: 'Medium', asset2: 'Medium' },
        returns: { asset1: '6-8% annually', asset2: '5-7% annually' },
        liquidity: { asset1: 'High', asset2: 'High' },
        diversification: { asset1: 'Good', asset2: 'Good' },
        recommendation: 'Both assets have merit depending on your specific goals and risk tolerance. Consider consulting a financial advisor for personalized advice.'
      }
    };
  }

  private getFallbackAnalysis(symbol: string, marketData?: any): FinancialAnalysis {
    return {
      symbol,
      name: `${symbol} Investment`,
      currentPrice: marketData?.price || 0,
      riskLevel: 'Medium',
      historicalPerformance: {
        oneYear: 7.5,
        threeYear: 6.8,
        fiveYear: 8.2
      },
      pros: [
        'Diversified exposure',
        'Low management fees',
        'Liquid investment'
      ],
      cons: [
        'Market volatility',
        'No guaranteed returns',
        'Currency risk (if international)'
      ],
      suitability: 'Suitable for medium to long-term investors with moderate risk tolerance',
      diversificationBenefits: [
        'Broad market exposure',
        'Reduces single-stock risk'
      ]
    };
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }
}

export const finGuideService = new FinGuideService();
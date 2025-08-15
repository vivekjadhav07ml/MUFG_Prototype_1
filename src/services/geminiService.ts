import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface InvestmentRecommendation {
  symbol: string;
  name: string;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  confidence: number;
  reasoning: string;
  targetPrice?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeHorizon: 'SHORT' | 'MEDIUM' | 'LONG';
}

export interface MarketInsight {
  title: string;
  content: string;
  category: 'MARKET_TREND' | 'ECONOMIC_INDICATOR' | 'SECTOR_ANALYSIS' | 'RISK_ALERT';
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async getInvestmentRecommendations(userProfile: any, marketData: any[]): Promise<InvestmentRecommendation[]> {
    try {
      const prompt = `
        As a professional financial advisor, analyze the following user profile and current market data to provide investment recommendations:

        User Profile:
        - Age: ${userProfile.age}
        - Risk Tolerance: ${userProfile.riskTolerance}
        - Annual Income: $${userProfile.annualIncome}
        - Current Super Balance: $${userProfile.currentSuper}
        - Monthly Contribution: $${userProfile.monthlyContribution}
        - Retirement Age: ${userProfile.retirementAge}
        - Financial Goals: ${userProfile.financialGoals?.join(', ')}
        - Investment Experience: ${userProfile.investmentExperience || 'beginner'}

        Current Market Data:
        ${marketData.map(stock => `
        - ${stock.symbol}: $${stock.price} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)
        `).join('')}

        Please provide 5-7 specific investment recommendations in JSON format with the following structure:
        {
          "recommendations": [
            {
              "symbol": "VAS.AX",
              "name": "Vanguard Australian Shares Index ETF",
              "recommendation": "BUY",
              "confidence": 85,
              "reasoning": "Strong fundamentals and aligns with user's risk profile...",
              "targetPrice": 95.50,
              "riskLevel": "MEDIUM",
              "timeHorizon": "LONG"
            }
          ]
        }

        Focus only on Australian ETFs and superannuation-appropriate investments. Consider the user's age, risk tolerance, and time to retirement.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const parsed = JSON.parse(text);
        return parsed.recommendations || [];
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        return this.getFallbackRecommendations(userProfile);
      }
    } catch (error) {
      console.error('Error getting recommendations from Gemini:', error);
      return this.getFallbackRecommendations(userProfile);
    }
  }

  async getMarketInsights(marketData: any[], userProfile?: any): Promise<MarketInsight[]> {
    try {
      const prompt = `
        As a financial market analyst, provide 3-5 key market insights based on the current market data:

        Market Data:
        ${marketData.map(stock => `
        - ${stock.symbol}: $${stock.price} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)
        `).join('')}

        ${userProfile ? `
        User Context:
        - Risk Tolerance: ${userProfile.riskTolerance}
        - Investment Experience: ${userProfile.investmentExperience || 'beginner'}
        ` : ''}

        Provide insights in JSON format:
        {
          "insights": [
            {
              "title": "Australian Market Outlook",
              "content": "The ASX is showing strong momentum...",
              "category": "MARKET_TREND",
              "importance": "HIGH",
              "timestamp": "${new Date().toISOString()}"
            }
          ]
        }

        Focus on actionable insights relevant to Australian superannuation investors.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const parsed = JSON.parse(text);
        return parsed.insights || [];
      } catch (parseError) {
        console.error('Error parsing Gemini insights response:', parseError);
        return this.getFallbackInsights();
      }
    } catch (error) {
      console.error('Error getting insights from Gemini:', error);
      return this.getFallbackInsights();
    }
  }

  async answerFinancialQuestion(question: string, userProfile?: any, context?: string): Promise<string> {
    try {
      const prompt = `
        As a qualified financial advisor specializing in Australian superannuation and investments, answer the following question:

        Question: ${question}

        ${userProfile ? `
        User Context:
        - Age: ${userProfile.age}
        - Risk Tolerance: ${userProfile.riskTolerance}
        - Current Super Balance: $${userProfile.currentSuper}
        - Annual Income: $${userProfile.annualIncome}
        - Years to Retirement: ${userProfile.retirementAge - userProfile.age}
        ` : ''}

        ${context ? `Additional Context: ${context}` : ''}

        Please provide a comprehensive, personalized answer that:
        1. Addresses the specific question
        2. Considers the user's profile and circumstances
        3. Provides actionable advice
        4. Mentions any relevant risks or considerations
        5. Stays within Australian financial regulations and best practices

        Keep the response conversational but professional, and limit to 300-400 words.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting answer from Gemini:', error);
      return this.getFallbackAnswer(question);
    }
  }

  private getFallbackRecommendations(userProfile: any): InvestmentRecommendation[] {
    const baseRecommendations = [
      {
        symbol: 'VAS.AX',
        name: 'Vanguard Australian Shares Index ETF',
        recommendation: 'BUY' as const,
        confidence: 80,
        reasoning: 'Broad Australian market exposure with low fees, suitable for long-term growth.',
        targetPrice: 92.00,
        riskLevel: 'MEDIUM' as const,
        timeHorizon: 'LONG' as const
      },
      {
        symbol: 'VGS.AX',
        name: 'Vanguard MSCI Index International Shares ETF',
        recommendation: 'BUY' as const,
        confidence: 85,
        reasoning: 'International diversification with exposure to global markets.',
        targetPrice: 105.00,
        riskLevel: 'MEDIUM' as const,
        timeHorizon: 'LONG' as const
      },
      {
        symbol: 'VAF.AX',
        name: 'Vanguard Australian Fixed Interest Index ETF',
        recommendation: 'HOLD' as const,
        confidence: 70,
        reasoning: 'Provides stability and income, good for defensive allocation.',
        targetPrice: 52.00,
        riskLevel: 'LOW' as const,
        timeHorizon: 'MEDIUM' as const
      }
    ];

    // Adjust recommendations based on risk tolerance
    if (userProfile.riskTolerance === 'conservative') {
      baseRecommendations[2].recommendation = 'BUY';
      baseRecommendations[2].confidence = 85;
    } else if (userProfile.riskTolerance === 'aggressive') {
      baseRecommendations.push({
        symbol: 'VGE.AX',
        name: 'Vanguard FTSE Emerging Markets Shares ETF',
        recommendation: 'BUY' as const,
        confidence: 75,
        reasoning: 'Higher growth potential through emerging markets exposure.',
        riskLevel: 'HIGH' as const,
        timeHorizon: 'LONG' as const
      });
    }

    return baseRecommendations;
  }

  private getFallbackInsights(): MarketInsight[] {
    return [
      {
        title: 'Australian Market Resilience',
        content: 'The ASX continues to show resilience amid global uncertainties, with strong performance in the resources and financial sectors.',
        category: 'MARKET_TREND',
        importance: 'HIGH',
        timestamp: new Date().toISOString()
      },
      {
        title: 'Interest Rate Environment',
        content: 'Current interest rate levels present opportunities for both growth and defensive investments in superannuation portfolios.',
        category: 'ECONOMIC_INDICATOR',
        importance: 'MEDIUM',
        timestamp: new Date().toISOString()
      },
      {
        title: 'Diversification Benefits',
        content: 'International exposure through ETFs continues to provide valuable diversification benefits for Australian investors.',
        category: 'SECTOR_ANALYSIS',
        importance: 'MEDIUM',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private getFallbackAnswer(question: string): string {
    return `Thank you for your question about "${question}". While I'm currently unable to provide a personalized response due to technical limitations, I recommend consulting with a licensed financial advisor for specific investment advice. 

    For general superannuation guidance, consider:
    - Reviewing your current asset allocation
    - Ensuring adequate diversification
    - Regular portfolio rebalancing
    - Taking advantage of contribution caps
    - Considering your risk tolerance and time horizon

    Please note that this is general information only and not personal financial advice.`;
  }
}

export const geminiService = new GeminiService();
# AI Investment Advisor for Superannuation

A comprehensive financial advisory web application that provides AI-powered investment guidance for Australian superannuation users.

## Features

### 🔐 Authentication System
- Professional login and signup pages with form validation
- Secure session management with Supabase
- Password reset functionality
- Responsive design across all authentication components

### 📊 User Financial Data Collection
- Multi-step onboarding process collecting:
  - Personal information (age, retirement goals)
  - Financial details (income, savings, superannuation balance)
  - Investment preferences (risk tolerance, sectors, ESG preferences)
  - Tax considerations and employment status

### 🤖 AI Chatbot Integration
- Conversational data collection through natural chat flow
- Personalized investment advice based on user profile
- Real-time market analysis integration
- Secure data storage in Supabase

### 📈 Real-time Market Analysis
- Integration with Alpha Vantage API for live market data
- Interactive charts for stocks, bonds, and REITs
- Side-by-side view: AI recommendations with live market data
- Key metrics: price movements, volume, technical indicators

### 💼 Portfolio Management
- Personalized portfolio recommendations
- Risk analysis and optimization suggestions
- Performance tracking and projections
- Educational resources and market insights

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Market Data**: Alpha Vantage API
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Alpha Vantage API key (optional, falls back to mock data)

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd ai-investment-advisor
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

### 3. Supabase Setup
1. Create a new Supabase project
2. Run the migration file in the Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
   ```
3. Enable email authentication in Supabase Auth settings

### 4. Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Production Build
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Auth/                 # Authentication components
│   ├── MarketAnalysis/       # Market data and charts
│   ├── ChatInterface.tsx     # AI chatbot interface
│   ├── Dashboard.tsx         # User dashboard
│   ├── OnboardingFlow.tsx    # Multi-step user onboarding
│   └── ...
├── hooks/
│   ├── useAuth.ts           # Authentication hook
│   └── useUserProfile.ts    # User profile management
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── services/
│   └── marketData.ts        # Market data API service
└── ...
```

## Key Features Explained

### Authentication Flow
1. **Landing Page**: Professional introduction with clear value proposition
2. **Sign Up/Login**: Secure authentication with form validation
3. **Onboarding**: 6-step process collecting comprehensive user data
4. **Dashboard**: Personalized investment overview and recommendations

### AI Chat Integration
- Natural language processing for investment queries
- Context-aware responses based on user profile
- Real-time market data integration
- Conversational data collection for missing profile information

### Market Analysis
- Live stock quotes and historical data
- Interactive charts with multiple timeframes
- Market news and sentiment analysis
- ETF recommendations based on user preferences

### Security & Privacy
- Row Level Security (RLS) in Supabase
- Encrypted data transmission
- Secure session management
- GDPR-compliant data handling

## API Integration

### Alpha Vantage API
The application integrates with Alpha Vantage for real-time market data:
- Stock quotes and historical prices
- Market news and sentiment
- Technical indicators
- Automatic fallback to mock data if API is unavailable

### Supabase Integration
- User authentication and session management
- Real-time database with PostgreSQL
- Automatic data synchronization
- Secure API endpoints with RLS

## Deployment

### Netlify Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard
4. Set up redirects for SPA routing

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy with automatic builds on push

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation for integration details

---

**Note**: This application is for educational and demonstration purposes. Always consult with licensed financial advisors for personal investment decisions.
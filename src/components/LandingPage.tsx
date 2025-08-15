import React from 'react';
import { TrendingUp, Shield, Users, Award, ChevronRight, CheckCircle, Star, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Powered Investment Advice',
      description: 'Get personalized superannuation strategies powered by advanced AI algorithms and market analysis.'
    },
    {
      icon: Shield,
      title: 'Risk-Optimized Portfolios',
      description: 'Tailored investment allocations based on your risk tolerance and retirement timeline.'
    },
    {
      icon: Users,
      title: 'Expert-Backed Insights',
      description: 'Our AI is trained on decades of financial expertise and real market performance data.'
    }
  ];

  const benefits = [
    'Maximize your retirement savings potential',
    'Reduce investment fees through smart allocation',
    'Get 24/7 access to personalized advice',
    'Track performance with real-time analytics',
    'Educational resources to build financial literacy',
    'Secure, bank-level data protection'
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Teacher, 34',
      content: 'The AI advisor helped me increase my super contributions and optimize my portfolio. I\'m now on track for a comfortable retirement.',
      rating: 5
    },
    {
      name: 'Michael K.',
      role: 'Engineer, 42',
      content: 'Finally, investment advice that makes sense! The personalized recommendations have already improved my returns.',
      rating: 5
    },
    {
      name: 'Emma L.',
      role: 'Nurse, 28',
      content: 'As someone new to investing, this platform made everything clear and actionable. Highly recommend!',
      rating: 5
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Active Users' },
    { value: '$2.1B+', label: 'Assets Under Advice' },
    { value: '8.7%', label: 'Average Annual Return' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SuperAI Advisor</h1>
                <p className="text-xs text-slate-600">Your AI Investment Guide</p>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              
              
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Maximize Your
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Retirement </span>
                with AI
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Get personalized superannuation advice powered by artificial intelligence. 
                Optimize your portfolio, reduce fees, and secure your financial future with 
                expert-backed strategies tailored just for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={onGetStarted}
                  className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Start Your Free Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 font-semibold text-lg">
                  Watch Demo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  No hidden fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Bank-level security
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Portfolio Analysis</h3>
                    <p className="text-slate-600 text-sm">Real-time insights</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-slate-900">Current Balance</span>
                    <span className="font-bold text-green-600">$127,450</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-slate-900">Projected Growth</span>
                    <span className="font-bold text-blue-600">+$45,200</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-medium text-slate-900">Retirement Goal</span>
                    <span className="font-bold text-purple-600">$850,000</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white">
                  <p className="text-sm opacity-90 mb-1">AI Recommendation</p>
                  <p className="font-semibold">Increase contributions by $150/month to reach your goal 3 years earlier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Why Choose SuperAI Advisor?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven investment strategies 
              to help you make smarter decisions about your superannuation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
                  Everything You Need to Succeed
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="font-bold text-slate-900 mb-4">Sample AI Insights</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Portfolio Optimization</p>
                    <p className="text-blue-700">Rebalance to 70% growth assets for better long-term returns</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Tax Strategy</p>
                    <p className="text-green-700">Salary sacrifice $200/month to save $1,200 in tax annually</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-900">Fee Reduction</p>
                    <p className="text-purple-700">Switch to low-cost index funds to save $800/year in fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Retirement Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of Australians who are already using AI to maximize their superannuation. 
            Get started with your free personalized analysis today.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl"
          >
            Start Your Free Analysis
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required • Free forever • Secure & confidential
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SuperAI Advisor</h3>
                  <p className="text-slate-400 text-sm">Your AI Investment Guide</p>
                </div>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Empowering Australians to make smarter superannuation decisions through 
                AI-powered insights and personalized investment strategies.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 SuperAI Advisor. All rights reserved. | AFSL 123456 | This is educational content and not personal financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
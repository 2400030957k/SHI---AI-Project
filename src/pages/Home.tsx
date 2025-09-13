import React, { useState, useEffect } from 'react';
import { Camera, Ruler, ShoppingBag, Users, Star, LogIn, UserPlus, Moon, Sun } from 'lucide-react';

interface HomeProps {
  onOpenCamera: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenCamera, onLogin, onRegister }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI Measurement",
      description: "Advanced computer vision technology captures your exact measurements"
    },
    {
      icon: <Ruler className="w-8 h-8" />,
      title: "Precise Sizing",
      description: "Get accurate size recommendations for thousands of clothing brands"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Smart Shopping",
      description: "Personalized recommendations based on your unique body measurements"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Finally found clothes that actually fit! The AI measurements are incredibly accurate.",
      rating: 5
    },
    {
      name: "Michael Chen",
      text: "No more guessing sizes online. This app has revolutionized my shopping experience.",
      rating: 5
    },
    {
      name: "Emma Davis",
      text: "Love how easy it is to use. The recommendations are spot on every time.",
      rating: 5
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navigation */}
      <nav className={`${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md shadow-sm ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Ruler className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>FitAI</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={onLogin}
                className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} font-medium transition-colors`}
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={onRegister}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className={`text-5xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              Perfect Fit,
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Every Time
              </span>
            </h1>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
              Revolutionary AI-powered clothing measurement technology that ensures you never buy ill-fitting clothes again. 
              Get accurate measurements and personalized size recommendations instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={onRegister}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg py-4 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-3"
              >
                <UserPlus className="w-6 h-6" />
                <span>Get Started Free</span>
              </button>
              <button
                onClick={onLogin}
                className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-indigo-400 border-indigo-400' : 'bg-white hover:bg-gray-50 text-indigo-600 border-indigo-600'} font-semibold text-lg py-4 px-8 rounded-full border-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-3`}
              >
                <LogIn className="w-6 h-6" />
                <span>Sign In</span>
              </button>
            </div>
            
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
              No credit card required • Free forever • Get started in 30 seconds
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-96 h-96 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className={`py-20 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>How It Works</h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Our cutting-edge technology makes getting the perfect fit easier than ever
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${isDarkMode ? 'bg-indigo-900/50 group-hover:bg-indigo-800/50' : 'bg-indigo-100 group-hover:bg-indigo-200'} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-200`}>
                  <div className="text-indigo-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{feature.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">1M+</div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Measurements Taken</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Partner Brands</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>What Our Users Say</h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Join thousands of satisfied customers who found their perfect fit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200`}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 italic`}>"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Perfect Fit?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who never worry about sizing again
          </p>
          <button
            onClick={onRegister}
            className="bg-white hover:bg-gray-100 text-indigo-600 font-semibold text-lg py-4 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};
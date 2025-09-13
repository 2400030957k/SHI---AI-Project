import React from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  recommendedSize: string;
  fit: 'Perfect' | 'Good' | 'Loose';
  brand: string;
}

interface RecommendationsProps {
  items: ClothingItem[];
  onBack: () => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ items, onBack }) => {
  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'Perfect': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Loose': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Recommendations</h1>
            <p className="text-gray-600">Clothing items perfectly matched to your measurements</p>
          </div>
          <button
            onClick={onBack}
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg shadow-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Image */}
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
                
                {/* Fit Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFitColor(item.fit)}`}>
                    {item.fit} Fit
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({item.rating})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Recommended Size</p>
                    <p className="text-lg font-bold text-indigo-600">{item.recommendedSize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="text-sm font-medium text-gray-900">{item.category}</p>
                  </div>
                </div>

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Capture your measurements first to get personalized clothing recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
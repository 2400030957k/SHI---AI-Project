import React, { useState, useEffect } from 'react';
import { User, Camera, History, LogOut, TrendingUp, ShoppingBag } from 'lucide-react';
import { api, getAuthToken, removeAuthToken } from '../utils/api';
import { type Measurements } from '../utils/measurementSimulator';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onOpenCamera: () => void;
  onViewRecommendations: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onLogout, 
  onOpenCamera, 
  onViewRecommendations 
}) => {
  const [measurements, setMeasurements] = useState<Measurements[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const response = await api.getUserMeasurements(token);
          if (response.success) {
            setMeasurements(response.measurements);
          }
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  const latestMeasurement = measurements[measurements.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
                <p className="text-gray-600">Your personalized fitting dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">New Measurement</h3>
                <p className="text-indigo-100">Capture your latest body measurements</p>
              </div>
              <Camera className="w-12 h-12 text-white/80" />
            </div>
            <button
              onClick={onOpenCamera}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Camera
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Recommendations</h3>
                <p className="text-green-100">View clothing suggestions for you</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-white/80" />
            </div>
            <button
              onClick={onViewRecommendations}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              disabled={!latestMeasurement}
            >
              {latestMeasurement ? 'View Suggestions' : 'Take Measurements First'}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Measurements</p>
                <p className="text-3xl font-bold text-gray-900">{measurements.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Latest Size</p>
                <p className="text-3xl font-bold text-gray-900">
                  {latestMeasurement ? 'M' : '-'}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recommendations</p>
                <p className="text-3xl font-bold text-gray-900">{measurements.length * 5}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-3xl font-bold text-gray-900">98%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Recent Measurements */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Measurements</h2>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          ) : measurements.length > 0 ? (
            <div className="p-8">
              <div className="space-y-6">
                {measurements.slice(-3).reverse().map((measurement, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Measurement #{measurements.length - index}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(measurement).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {typeof value === 'number' 
                              ? `${value.toFixed(1)} ${key === 'weight' ? 'kg' : 'cm'}` 
                              : value
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No measurements yet</h3>
              <p className="text-gray-600 mb-6">Take your first measurement to get started with personalized recommendations</p>
              <button
                onClick={onOpenCamera}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Take First Measurement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
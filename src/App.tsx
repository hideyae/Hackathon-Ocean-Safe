import { CommunitySection } from './components/CommunitySection';
import { useState, useEffect } from 'react';
import {
  Waves,
  Calendar,
  Search,
  TrendingUp,
  Download,
  RefreshCw,
  Activity,
  Anchor,
  LogIn,
  LogOut,
  Cloud,
  Leaf,
  MapPin,
  Navigation
} from 'lucide-react';
import { ActivityType, OceanVariable, ActivityCondition, LocationCoordinates } from './types';
import { ActivityCard } from './components/ActivityCard';
import { OceanVariableCard } from './components/OceanVariableCard';
import { AuthModal } from './components/AuthModal';
import { LocationSearch } from './components/LocationSearch';
import { ActivityHistory } from './components/ActivityHistory';
import { MapView } from './components/MapView';
import { ConservationAlerts } from './components/ConservationAlerts';
import { ClimateProtection } from './components/ClimateProtection';
import MarineChatbot from './components/MarineChatbot';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { generateOceanData, calculateActivityConditions } from './utils/oceanData';
import { exportToCSV } from './utils/export';
import { supabase } from './lib/supabase';
import { fetchNasaWeatherStats } from './services/nasaService';
import { calculateProbabilities } from './utils/probability';
import ProbabilityChart from './components/ProbabilityChart';

function AppContent() {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<'planner' | 'dashboard' | 'history' | 'climate' | 'reports' | 'community' | 'alert'>('planner');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('surfing');
  const [location, setLocation] = useState('Santa Monica, CA');
  const [locationCoords, setLocationCoords] = useState<LocationCoordinates | undefined>();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActivityCondition | null>(null);
  const [oceanData, setOceanData] = useState<OceanVariable[]>([]);
  const [selectedVariable, setSelectedVariable] = useState<OceanVariable | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [probabilities, setProbabilities] = useState<{ hot: number; cold: number } | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    loadOceanData();
    const interval = setInterval(() => {
      loadOceanData();
    }, 30000);
    return () => clearInterval(interval);
  }, [locationCoords]);

  const loadOceanData = async () => {
    const data = await generateOceanData(locationCoords);
    setOceanData(data);
  };

  const activities: ActivityType[] = ['surfing', 'fishing', 'diving', 'sailing', 'kayaking', 'swimming'];

  const handleCheckConditions = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const conditions = await calculateActivityConditions(selectedActivity, location, date, locationCoords);
    setResult(conditions);

    if (user) {
      await saveActivityHistory(conditions);
    }

    setLoading(false);
  };

  const saveActivityHistory = async (conditions: ActivityCondition) => {
    if (!user) return;

    const { error } = await supabase
      .from('activity_history')
      .insert([{
        user_id: user.id,
        activity_type: conditions.activity,
        location: conditions.location,
        latitude: conditions.latitude,
        longitude: conditions.longitude,
        date: conditions.date,
        score: conditions.score,
        overall_status: conditions.overall,
        conditions_data: {
          variables: conditions.variables,
          weather: conditions.weather,
          tide: conditions.tide
        }
      }]);

    if (error) {
      console.error('Error saving activity history:', error);
    }
  };

  const handleRefresh = async () => {
    await loadOceanData();
  };

  const handleLocationChange = (newLocation: string, coords?: LocationCoordinates) => {
    setLocation(newLocation);
    setLocationCoords(coords);
  };

  const handleFetchProbabilities = async () => {
    if (!locationCoords) return;
    const start = '20240101'; // Example: Jan 1, 2024
    const end = '20241231';   // Example: Dec 31, 2024
    const nasaData = await fetchNasaWeatherStats(locationCoords.latitude, locationCoords.longitude, start, end);
    setProbabilities(calculateProbabilities(nasaData));
  };

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lng = (x / rect.width) * 360 - 180;
    const lat = 90 - (y / rect.height) * 180;

    setClickPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      const data = await response.json();
      const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      setLocation(locationName);
      setLocationCoords({ latitude: lat, longitude: lng });
    } catch (error) {
      const locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setLocation(locationName);
      setLocationCoords({ latitude: lat, longitude: lng });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <header className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-6">
          <div className="flex items-center justify-start gap-8">
            <div className="flex items-center gap-3">
              <img
                src="src/assets/Logo_Ocean_safe.png"
                alt="OceanSafe Logo"
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold">OceanSafe</h1>
                <p className="text-cyan-100 text-sm">Real-time Ocean Safety & Activity Planner</p>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="flex gap-2">
                <button
                  onClick={() => setView('planner')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'planner'
                    ? 'bg-white text-cyan-700 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                >
                  Planner
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'dashboard'
                    ? 'bg-white text-cyan-700 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                >
                  Dashboard
                </button>
                {user && (
                  <button
                    onClick={() => setView('history')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'history'
                      ? 'bg-white text-cyan-700 shadow-lg'
                      : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                      }`}
                  >
                    History
                  </button>
                )}
                <button
                  onClick={() => setView('climate')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'climate'
                    ? 'bg-white text-cyan-700 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                >
                  <Leaf className="w-4 h-4 inline mr-1" />
                  Climate
                </button>
                <button
                  onClick={() => setView('reports')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'reports'
                    ? 'bg-white text-cyan-700 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                >
                  📊 Reports
                </button>
                <button
                  onClick={() => setView('community')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'community'
                    ? 'bg-white text-cyan-700 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                >
                  👥 Community
                </button>
                <button
                  onClick={() => setView('alert')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'alert'
                    ? 'bg-white text-cyan-700 shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                >
                  🚨 Alert
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{user.full_name || user.email}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-cyan-700 rounded-lg font-semibold hover:bg-cyan-50 transition-all shadow-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'planner' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-600" />
                Plan Your Ocean Activity
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Activity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {activities.map(activity => (
                      <ActivityCard
                        key={activity}
                        activity={activity}
                        selected={selectedActivity === activity}
                        onClick={() => setSelectedActivity(activity)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <LocationSearch
                    value={location}
                    onChange={handleLocationChange}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Interactive World Map
                    </label>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      Click anywhere to select location
                    </span>
                  </div>

                  <div
                    className="relative w-full bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl overflow-hidden cursor-crosshair border-4 border-cyan-200 shadow-lg hover:shadow-xl transition-shadow"
                    style={{ aspectRatio: '2/1' }}
                    onClick={handleMapClick}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg"
                      alt="World Map"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />

                    {clickPosition && (
                      <div
                        className="absolute w-8 h-8 -ml-4 -mt-8 animate-bounce"
                        style={{
                          left: `${clickPosition.x}%`,
                          top: `${clickPosition.y}%`,
                          filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'
                        }}
                      >
                        <MapPin className="w-8 h-8 text-red-500 fill-red-500" />
                      </div>
                    )}

                    <div className="absolute top-4 left-4 right-4 bg-cyan-600/90 backdrop-blur-sm text-white p-3 rounded-lg text-sm shadow-lg">
                      <p className="font-semibold flex items-center gap-2">
                        <Anchor className="w-4 h-4" />
                        {location}
                      </p>
                      {locationCoords && (
                        <p className="text-xs text-cyan-100 mt-1">
                          {locationCoords.latitude.toFixed(4)}°, {locationCoords.longitude.toFixed(4)}°
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckConditions}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing Conditions...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Check Conditions
                    </>
                  )}
                </button>
              </div>
            </div>

            {result && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-cyan-600" />
                      Conditions Report
                    </h2>

                    {/* Circular Status Indicator */}
                    <div className="relative flex items-center justify-center">
                      <div>
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={result.score >= 70 ? '#10b981' : result.score >= 40 ? '#f97316' : '#ef4444'}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(result.score / 100) * 251.2} 251.2`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-sm font-bold ${result.score >= 70 ? 'text-emerald-600' : result.score >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
                            {result.score >= 70 ? 'Safe' : result.score >= 40 ? 'Moderate' : 'Danger'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => exportToCSV(result)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>

                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-cyan-100 text-sm">Overall Safety Score</p>
                      <h3 className="text-4xl font-bold">{result.score}%</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-cyan-100 mb-1">{result.location}</p>
                      <p className="text-xs text-cyan-200">{result.date}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">{result.overall}</p>
                  <p className="text-cyan-100 text-sm mt-2">{result.details}</p>
                </div>

                {result.weather && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Cloud className="w-5 h-5" />
                      Current Weather
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-blue-700">Temperature</p>
                        <p className="text-lg font-bold text-blue-900">{result.weather.temp.toFixed(1)}°C</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Wind Speed</p>
                        <p className="text-lg font-bold text-blue-900">{result.weather.windSpeed.toFixed(1)} km/h</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Humidity</p>
                        <p className="text-lg font-bold text-blue-900">{result.weather.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700">Conditions</p>
                        <p className="text-lg font-bold text-blue-900 capitalize">{result.weather.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {result.tide && (
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-xl p-6">
                    <h3 className="font-bold text-teal-900 mb-3 flex items-center gap-2">
                      <Waves className="w-5 h-5" />
                      Tide Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-teal-700">Current Tide</p>
                        <p className="text-lg font-bold text-teal-900 capitalize">{result.tide.type} - {result.tide.height}m</p>
                        <p className="text-xs text-teal-600">{result.tide.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-teal-700">Next Tide</p>
                        <p className="text-lg font-bold text-teal-900 capitalize">{result.tide.next.type} - {result.tide.next.height}m</p>
                        <p className="text-xs text-teal-600">{result.tide.next.time}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-800 mb-4">Ocean Variables</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.variables.map(variable => (
                      <OceanVariableCard
                        key={variable.id}
                        variable={variable}
                        onClick={() => setSelectedVariable(variable)}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                  <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <Anchor className="w-5 h-5" />
                    Safety Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {result.safety.map((tip, idx) => (
                      <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : view === 'dashboard' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Waves className="w-6 h-6 text-cyan-600" />
                  Live Ocean Data
                </h2>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {oceanData.map(variable => (
                  <OceanVariableCard
                    key={variable.id}
                    variable={variable}
                    onClick={() => setSelectedVariable(variable)}
                  />
                ))}
              </div>

              {selectedVariable && (
                <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-2">{selectedVariable.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{selectedVariable.recommendation}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {selectedVariable.value} {selectedVariable.unit}
                    </span>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${selectedVariable.status === 'safe' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${selectedVariable.status === 'moderate' ? 'bg-amber-100 text-amber-700' : ''}
                      ${selectedVariable.status === 'warning' ? 'bg-orange-100 text-orange-700' : ''}
                    `}>
                      {selectedVariable.statusText}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <MarineChatbot />

            {probabilities && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Weather Probabilities (NASA Data)</h2>
                <ProbabilityChart probabilities={probabilities} />
              </div>
            )}
          </div>
        ) : view === 'history' ? (
          <ActivityHistory />
        ) : view === 'climate' ? (
          <ClimateProtection />
        ) : view === 'reports' ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Reports & Analytics</h2>
            <p className="text-gray-600">Your custom reports section content goes here!</p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-3">Activity Summary</h3>
                <p className="text-sm text-blue-700">View your activity statistics and trends</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-xl p-6">
                <h3 className="font-bold text-teal-900 mb-3">Safety Reports</h3>
                <p className="text-sm text-teal-700">Download safety analysis reports</p>
              </div>
            </div>
          </div>
        ) : view === 'community' ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Community</h2>
            <CommunitySection />
          </div>
        ) : view === 'alert' ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🚨 Alert</h2>
          </div>
        ) : null}
      </main>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-300 mb-2">
            Built for NASA Space Apps Challenge 2025
          </p>
          <p className="text-xs text-gray-400">
            Ocean data powered by real-time monitoring systems | Stay safe, explore responsibly
          </p>
        </div>
      </footer>

      <ConservationAlerts />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;


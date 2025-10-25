import { Fish, Droplet, Leaf, TrendingDown, TrendingUp, Waves, AlertCircle, CheckCircle, Satellite } from 'lucide-react';

export const ClimateProtection = () => {
  const fishDeclineData = [
    { year: '1970', population: 100 },
    { year: '1980', population: 88 },
    { year: '1990', population: 75 },
    { year: '2000', population: 65 },
    { year: '2010', population: 58 },
    { year: '2020', population: 56 },
    { year: '2025', population: 56 }
  ];

  const temperatureData = [
    { year: '1975', anomaly: -0.1 },
    { year: '1985', anomaly: 0.1 },
    { year: '1995', anomaly: 0.3 },
    { year: '2005', anomaly: 0.5 },
    { year: '2015', anomaly: 0.8 },
    { year: '2025', anomaly: 1.1 }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Leaf className="w-8 h-8" />
          Climate Protection & Marine Conservation
        </h2>
        <p className="text-cyan-100 text-lg">
          Protecting our oceans is critical for the future of marine life and humanity.
          Take action today to preserve ocean ecosystems for generations to come.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-3">
              <Fish className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Fish Revolution</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Climate Threats to Fish Populations
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Ocean Acidification:</strong> 30% more acidic than pre-industrial levels</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Warming Waters:</strong> Disrupting migration and breeding patterns</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>Oxygen Depletion:</strong> Creating dead zones in critical habitats</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Fish Population Decline (1970-2025)
              </h4>
              <div className="relative h-32 flex items-end justify-between gap-1">
                {fishDeclineData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t transition-all"
                      style={{ height: `${data.population}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-1">{data.year}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-red-800 font-semibold text-center mt-3">
                44% decline in global fish populations
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Conservation Actions
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Sustainable Fishing:</strong> Support MSC-certified fisheries</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Marine Protected Areas:</strong> Advocate for ocean sanctuaries</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Plastic Reduction:</strong> Eliminate single-use plastics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg p-3">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Water Revolution</h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Ocean Health Indicators</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-700 mb-1">Ocean pH Levels</p>
                  <p className="text-2xl font-bold text-blue-900">30% more acidic</p>
                  <p className="text-xs text-blue-600 mt-1">Since pre-industrial era</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-xs text-red-700 mb-1">Coral Reef Loss</p>
                  <p className="text-2xl font-bold text-red-900">50% degraded</p>
                  <p className="text-xs text-red-600 mt-1">Critical ecosystem decline</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg p-4">
                  <p className="text-xs text-amber-700 mb-1">Oxygen Levels</p>
                  <p className="text-2xl font-bold text-amber-900">2% decline</p>
                  <p className="text-xs text-amber-600 mt-1">Since 1960</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ocean Temperature Anomaly (1975-2025)
              </h4>
              <div className="relative h-32 flex items-center justify-between gap-1">
                <div className="absolute left-0 right-0 bottom-1/2 border-t-2 border-gray-300 border-dashed" />
                {temperatureData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 relative">
                    <div
                      className={`w-full rounded transition-all ${data.anomaly >= 0 ? 'bg-gradient-to-t from-red-600 to-orange-400' : 'bg-gradient-to-b from-blue-600 to-cyan-400'}`}
                      style={{
                        height: `${Math.abs(data.anomaly) * 40}px`,
                        marginTop: data.anomaly >= 0 ? '0' : `${Math.abs(data.anomaly) * 40}px`
                      }}
                    />
                    <span className="text-xs text-gray-600 mt-1">{data.year}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-800 font-semibold text-center mt-3">
                +1.1°C average ocean warming
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-3">Protection Strategies</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Reduce pollution and plastic waste</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Restore coastal and marine ecosystems</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Transition to clean energy sources</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Monitor and protect marine biodiversity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Take Action Today
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              🍴 Eat Sustainably
            </h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Choose MSC-certified seafood</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Avoid endangered species</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Support local sustainable fisheries</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Reduce seafood consumption</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              ♻️ Reduce Impact
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use reusable bags and bottles</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Participate in beach cleanups</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Reduce carbon footprint</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Properly dispose of waste</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-xl p-6">
            <h4 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
              📢 Advocate
            </h4>
            <ul className="space-y-2 text-sm text-cyan-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Support ocean conservation organizations</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Vote for pro-ocean policies</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Educate others about marine protection</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Contact representatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-3">
            <Satellite className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">NASA Ocean Monitoring</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-cyan-300 mb-3">Active Missions</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>MODIS:</strong> Ocean color and temperature monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>Jason-3:</strong> Sea level and ocean circulation tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>PACE:</strong> Plankton, aerosol, and cloud ecosystems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>Aqua:</strong> Global water cycle observation</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-cyan-300 mb-3">2050 Projections</h4>
            <div className="space-y-3">
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                <p className="text-xs text-red-300 mb-1">Without Action</p>
                <p className="text-lg font-bold text-red-200">+2°C ocean warming</p>
                <p className="text-xs text-red-400">Catastrophic ecosystem collapse</p>
              </div>
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
                <p className="text-xs text-green-300 mb-1">With Action</p>
                <p className="text-lg font-bold text-green-200">+1.5°C limited warming</p>
                <p className="text-xs text-green-400">Recoverable marine ecosystems</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-cyan-900/30 border border-cyan-700 rounded-lg p-4">
          <p className="text-sm text-cyan-200">
            <strong>The choice is ours:</strong> With immediate climate action and ocean protection measures,
            we can preserve marine biodiversity and ensure healthy oceans for future generations.
          </p>
        </div>
      </div>
    </div>
  );
};

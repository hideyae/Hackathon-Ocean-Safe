import { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { searchLocations } from '../services/locationService';
import { LocationCoordinates } from '../types';

interface LocationSearchProps {
  value: string;
  onChange: (location: string, coords?: LocationCoordinates) => void;
}

export const LocationSearch = ({ value, onChange }: LocationSearchProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationCoordinates[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const results = await searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(true);
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (location: LocationCoordinates) => {
    setQuery(location.display_name);
    onChange(location.display_name, location);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <MapPin className="w-4 h-4 inline mr-1" />
        Location
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
          placeholder="Search for a location..."
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((location, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-cyan-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{location.display_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center">
          <p className="text-sm text-gray-600">Searching...</p>
        </div>
      )}
    </div>
  );
};
